import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { RentalSession } from '../models/RentalSession.js';
import { Equipment } from '../models/Equipment.js';
import os from 'os';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/analytics', async (req, res, next) => {
  try {
    const [activeCount, completedCount] = await Promise.all([
      RentalSession.countDocuments({ status: 'active' }),
      RentalSession.countDocuments({ status: 'completed' }),
    ]);

    res.json({
      activeSessions: activeCount,
      completedSessions: completedCount,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/inventory', async (req, res, next) => {
  try {
    const equipment = await Equipment.find({}).sort({ kioskId: 1, lockerId: 1 });
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

router.get('/sessions', async (req, res, next) => {
  try {
    const sessions = await RentalSession.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('equipmentId userId');
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

router.get('/machine-health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuLoad = os.loadavg?.()[0] || 0;

  res.json({
    cpuLoad,
    memory: {
      rss: memoryUsage.rss,
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.post('/emergency-lock', async (req, res, next) => {
  try {
    // In a real system, this would broadcast to IoT devices to lock all lockers.
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export const adminRouter = router;

