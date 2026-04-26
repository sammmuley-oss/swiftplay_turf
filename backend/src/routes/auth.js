import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { User } from '../models/User.js';

const router = express.Router();

import bcrypt from 'bcryptjs';
import { Otp } from '../models/otp.js';
import { generateOTP } from '../utils/otp.js';
import { sendEmail } from '../services/mailer.js';

// Tighter rate limiting specifically for OTP-based login finalization
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const initiate2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * PUBLIC ROUTE
 * Step 1: Send OTP via Email
 * Used for both Login and Registration flow
 */
// PUBLIC ROUTE - Initiate 2FA (Login/Register)
router.post('/initiate-2fa', async (req, res, next) => {
  console.log(`[AUTH] initiate-2fa hit for: ${req.body.email || req.body.phone}`);
  try {
    const { error, value } = initiate2faSchema.validate(req.body);
    if (error) {
      console.warn(`[AUTH] Validation failed: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    const { email } = value;

    let user = await User.findOne({ email });

    if (!user) {
      console.log(`[AUTH] Creating new user for: ${email}`);
      user = await User.create({ email, loyaltyPoints: 0 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000);

    await Otp.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true });

    let sentVia = 'email';
    let message = `OTP sent to your email: ${email}`;

    try {
      await sendEmail({
        to: email,
        subject: 'Your TURFGEAR Verification Code',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; background: #0a0a0c; border-radius: 12px; border: 1px solid #333; text-align: center;">
            <h2 style="color: #00d4ff;">TurfGear Security</h2>
            <p style="color: #ccc;">Your verification code is:</p>
            <h1 style="color: #fff; letter-spacing: 10px; background: #1a1a1c; padding: 20px; text-align: center; border-radius: 8px;">${otp}</h1>
            <p style="color: #777; font-size: 12px;">This code expires in 5 minutes.</p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error(`[AUTH] Email delivery failed: ${mailErr.message}`);
      sentVia = 'fallback';
      message = 'OTP generated but email delivery failed. Check server logs.';
    }

    res.json({ success: true, message, type: sentVia });
  } catch (err) {
    console.error(`[AUTH ERR] initiate-2fa error:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

const verify2faSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

/**
 * PUBLIC ROUTE
 * Step 2: Verify OTP and Issue Token
 */
// PUBLIC ROUTE - Verify 2FA and Login
router.post('/verify-2fa', loginLimiter, async (req, res, next) => {
  try {
    const { error, value } = verify2faSchema.validate(req.body);
    if (error) {
      console.warn(`[AUTH] 2FA Validation failed: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    const { email, otp } = value;

    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc || otpDoc.otp !== otp || otpDoc.expiresAt <= new Date()) {
      console.warn(`[AUTH] Invalid/Expired OTP for: ${email}`);
      return res.status(410).json({ error: 'Invalid or expired OTP' });
    }

    await Otp.deleteOne({ _id: otpDoc._id });

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`[AUTH] User session lost for: ${email}`);
      return res.status(404).json({ error: 'User session lost. Please try again.' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      config.jwtSecret,
      { expiresIn: '5m' },
    );

    // Set cookie for session persistence (if desired)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: config.sessionTimeout,
    });

    console.log(`[AUTH] Login successful for: ${email}`);
    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (err) {
    console.error(`[AUTH ERR] verify-2fa error:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /logout
 * Clear authentication session
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * PUBLIC ROUTE
 * POST /send-otp
 * Dedicated Email OTP generation and delivery
 */
router.post('/send-otp', loginLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes

    // Save/Update OTP in database
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send Email
    try {
      await sendEmail({
        to: email,
        subject: 'TurfGear Verification Code',
        text: `Your verification code is: ${otp}\nThis code expires in 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #00d4ff;">TurfGear Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 5px; background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h1>
            <p>This code expires in 5 minutes.</p>
          </div>
        `
      });
      
      res.json({
        success: true,
        message: 'OTP sent to email'
      });
    } catch (mailErr) {
      // Fallback for development if email service fails
      console.log(`[AUTH] Failed to send email, displaying OTP for dev: ${otp}`);
      res.json({
        success: true,
        message: 'OTP generated (Dev Simulation)',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * POST /verify-otp
 * Dedicated Email OTP verification
 */
router.post('/verify-otp', loginLimiter, async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const otpDoc = await Otp.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    if (otpDoc.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check expiry manually just in case TTL hasn't run yet
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Success - Delete OTP after verification
    await Otp.deleteOne({ _id: otpDoc._id });

    res.json({
      success: true,
      message: 'Email verified'
    });
  } catch (err) {
    next(err);
  }
});

export const authRouter = router;

