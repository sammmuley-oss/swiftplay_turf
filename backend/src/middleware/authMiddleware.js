import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config.js';
import { User } from '../models/User.js';

// Hash phone number so we never store it in plaintext
export function hashPhone(phone) {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    // Fallback to cookie if present
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.warn(`[AUTH] Unauthorized access attempt to ${req.originalUrl} - Missing token`);
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication Required',
        message: 'Missing authorization token' 
      });
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(payload.sub);
      
      if (!user) {
        console.warn(`[AUTH] Unauthorized access attempt to ${req.originalUrl} - User not found for ID: ${payload.sub}`);
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      next();
    } catch (verifyErr) {
      console.warn(`[AUTH] Token verification failed for ${req.originalUrl}: ${verifyErr.message}`);
      if (verifyErr.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          error: 'TOKEN_EXPIRED',
          message: 'Session expired. Please login again.' 
        });
      }
      return res.status(401).json({ 
        success: false, 
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token' 
      });
    }
  } catch (err) {
    console.error('[AUTH MIDDLEWARE CRITICAL ERROR]:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
