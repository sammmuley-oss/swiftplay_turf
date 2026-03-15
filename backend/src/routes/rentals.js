import express from 'express';
import Joi from 'joi';
import { requireAuth } from '../middleware/authMiddleware.js';
import { Equipment } from '../models/Equipment.js';
import { RentalSession } from '../models/RentalSession.js';
import { openLocker, closeLocker, verifyRFID, detectWeightChange } from '../services/iotSimulation.js';
import { emitToAdmins, emitToKiosk } from '../services/realtime.js';

const router = express.Router();

const createRentalSchema = Joi.object({
  equipmentId: Joi.string().required(),
  kioskId: Joi.string().required(),
  durationMinutes: Joi.number().integer().min(30).max(8 * 60).required(),
});

router.post('/create', requireAuth, async (req, res, next) => {
  try {
    const { error, value } = createRentalSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { equipmentId, kioskId, durationMinutes } = value;
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment || equipment.status !== 'available') {
      return res.status(400).json({ error: 'Equipment not available' });
    }

    const now = new Date();
    const expectedEnd = new Date(now.getTime() + durationMinutes * 60000);

    const rental = await RentalSession.create({
      userId: req.user._id,
      equipmentId: equipment._id,
      kioskId,
      startTime: now,
      expectedEnd,
      status: 'active',
    });

    equipment.status = 'rented';
    await equipment.save();

    // Open locker immediately since no payment is required
    await openLocker(equipment.lockerId);

    emitToKiosk(kioskId, 'rental:created', { rentalId: rental._id, equipmentId });
    emitToKiosk(kioskId, 'locker:opened', { lockerId: equipment.lockerId });
    emitToAdmins('analytics:update', { type: 'rental_created' });

    res.json({ rentalId: rental._id, success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/active', requireAuth, async (req, res, next) => {
  try {
    const rental = await RentalSession.findOne({
      userId: req.user._id,
      status: 'active',
    }).populate('equipmentId');

    if (!rental) return res.json(null);
    res.json(rental);
  } catch (err) {
    next(err);
  }
});

const returnSchema = Joi.object({
  rentalId: Joi.string().required(),
  rfidTag: Joi.string().required(),
});

router.post('/return', requireAuth, async (req, res, next) => {
  try {
    const { error, value } = returnSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { rentalId, rfidTag } = value;
    const rental = await RentalSession.findById(rentalId).populate('equipmentId');
    if (!rental || rental.status !== 'active') {
      return res.status(400).json({ error: 'Rental not active' });
    }

    await verifyRFID(rental.equipmentId.lockerId, rfidTag);
    await detectWeightChange(rental.equipmentId.lockerId);

    const now = new Date();
    rental.actualEnd = now;
    rental.status = 'completed';
    await rental.save();

    rental.equipmentId.status = 'available';
    await rental.equipmentId.save();

    await closeLocker(rental.equipmentId.lockerId);

    emitToKiosk(rental.kioskId, 'rental:completed', {
      rentalId: rental._id,
    });
    emitToAdmins('analytics:update', { type: 'rental_completed' });

    res.json({
      rentalId: rental._id,
      status: rental.status,
    });
  } catch (err) {
    next(err);
  }
});

export const rentalRouter = router;

