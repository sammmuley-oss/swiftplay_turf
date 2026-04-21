import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { config } from './config.js';
import { registerSocketHandlers } from './services/realtime.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { equipmentRouter } from './routes/equipment.js';
import { rentalRouter } from './routes/rentals.js';
import { adminRouter } from './routes/admin.js';
import { verifyEmailServer } from './services/mailer.js';
import { paymentRouter } from './routes/payments.js';
import { seedEquipments } from './seed/seedEquipments.js';

console.log("Loaded email user:", process.env.EMAIL_USER ? "YES" : "NO");

const app = express();
const server = http.createServer(app);

// Handle server errors (e.g., port already in use)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("❌ Port already in use:", config.port);
    process.exit(1);
  }
});

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: config.corsOrigins.length ? config.corsOrigins : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

registerSocketHandlers(io);

// Security & Utility Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.corsOrigins.length === 0) return callback(null, true);
    if (config.corsOrigins.includes(origin)) return callback(null, true);
    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/rentals', rentalRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentRouter);

// Error Handling
app.use(errorHandler);

// Database Connection and Server Start
async function bootstrap() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');
    
    await verifyEmailServer();
    await seedEquipments();

    const port = config.port;
    server.listen(port, () => {
      console.log(`🚀 SWIFTPLAY backend running on port ${port}`);
      console.log(`🌐 Origins allowed: ${config.corsOrigins.join(', ') || '*'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:');
    console.error(err);
    process.exit(1);
  }
}

bootstrap();

export { io };

