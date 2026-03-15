import express from 'express';
import Joi from 'joi';
import { Equipment } from '../models/Equipment.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { sport } = req.query;
    const filter = {};
    if (sport) filter.sport = sport.toLowerCase();
    
    filter.status = { $in: ['available', 'maintenance'] };

    const equipment = await Equipment.find(filter).sort({ name: 1 });
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

const createSchema = Joi.object({
  name: Joi.string().required(),
  sport: Joi.string().valid('cricket', 'football', 'badminton', 'tennis').required(),
  pricePerHour: Joi.number().required(),
  image: Joi.string().uri().optional(),
  stock: Joi.number().min(0).default(0),
  lockerId: Joi.string().optional(),
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const created = await Equipment.create(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export const equipmentRouter = router;
