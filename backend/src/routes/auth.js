import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { User } from '../models/User.js';
import { hashPhone } from '../middleware/authMiddleware.js';

// NOTE: In a real deployment, Firebase Phone Auth should be used on the client.
// This endpoint expects a verified phone number and Firebase user UID/ID token
// to be validated before issuing a backend JWT.

const router = express.Router();

import bcrypt from 'bcryptjs';
import twilio from 'twilio';
import { Otp } from '../models/otp.js';
import { generateOTP } from '../utils/otp.js';
import { sendEmail } from '../services/mailer.js';

const twilioClient = config.twilio.accountSid && config.twilio.authToken
  ? twilio(config.twilio.accountSid, config.twilio.authToken)
  : null;

// In-memory OTP storage for simulation (Phone -> OTP)
const otpStore = new Map();

// Tighter rate limiting specifically for OTP-based login finalization
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const initiate2faSchema = Joi.object({
  phone: Joi.string().min(8).max(20).optional(),
  email: Joi.string().email().optional(),
}).or('phone', 'email');

/**
 * PUBLIC ROUTE
 * Step 1: Send OTP (SMS or Email)
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

    const { phone, email } = value;
    const identifier = email || phone;
    const phoneHash = phone ? hashPhone(phone) : null;

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ phoneHash });
    }

    if (!user) {
      console.log(`[AUTH] Creating new user for: ${identifier}`);
      const userData = {
        loyaltyPoints: 0,
      };
      if (phoneHash) userData.phoneHash = phoneHash;
      if (email) userData.email = email;

      user = await User.create(userData);
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000);

    let sentVia = 'simulation';
    let message = 'Step 1 Complete: OTP generated.';

    if (email) {
      await Otp.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true });
      try {
        await sendEmail({
          to: email,
          subject: 'Your SWIFTPLAY Verification Code',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; background: #0a0a0c; border-radius: 12px; border: 1px solid #333 text-align: center;">
              <h2 style="color: #00d4ff;">SwiftPlay Security</h2>
              <p style="color: #ccc;">Your verification code is:</p>
              <h1 style="color: #fff; letter-spacing: 10px; background: #1a1a1c; padding: 20px; text-align: center; border-radius: 8px;">${otp}</h1>
              <p style="color: #777; font-size: 12px;">This code expires in 5 minutes.</p>
            </div>
          `
        });
        sentVia = 'email';
        message = `OTP sent to your email: ${email}`;
      } catch (mailErr) {
        console.error(`[AUTH] Email delivery failed: ${mailErr.message}`);
      }
    } else if (phone && twilioClient && config.twilio.phoneNumber) {
      otpStore.set(phone, { otp, expires: expiresAt });
      try {
        await twilioClient.messages.create({
          body: `Your SWIFTPLAY verification code is: ${otp}`,
          from: config.twilio.phoneNumber,
          to: phone,
        });
        sentVia = 'sms';
        message = `OTP sent to your phone: ${phone}`;
      } catch (twilioErr) {
        console.error(`[AUTH] Twilio delivery failed: ${twilioErr.message}`);
      }
    } else if (phone) {
      otpStore.set(phone, { otp, expires: expiresAt });
    }

    if (sentVia === 'simulation') {
      console.log(`[AUTH-2FA] (SIMULATED) OTP for ${identifier}: ${otp}`);
      message = `Step 1 Complete: OTP generated (SIMULATED: ${otp})`;
    }

    res.json({ success: true, message, type: sentVia });
  } catch (err) {
    console.error(`[AUTH ERR] initiate-2fa error:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

const verify2faSchema = Joi.object({
  phone: Joi.string().min(8).max(20).optional(),
  email: Joi.string().email().optional(),
  otp: Joi.string().length(6).required(),
}).or('phone', 'email');

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

    const { phone, email, otp } = value;
    const identifier = email || phone;

    let isVerified = false;

    if (email) {
      const otpDoc = await Otp.findOne({ email });
      if (otpDoc && otpDoc.otp === otp && otpDoc.expiresAt > new Date()) {
        isVerified = true;
        await Otp.deleteOne({ _id: otpDoc._id });
      }
    } else {
      const stored = otpStore.get(phone);
      if (stored && stored.otp === otp && stored.expires > Date.now()) {
        isVerified = true;
        otpStore.delete(phone);
      }
    }

    if (!isVerified) {
      console.warn(`[AUTH] Invalid/Expired OTP for: ${identifier}`);
      return res.status(410).json({ error: 'Invalid or expired OTP' });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      const phoneHash = hashPhone(phone);
      user = await User.findOne({ phoneHash });
    }

    if (!user) {
      console.error(`[AUTH] User session lost for: ${identifier}`);
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

    console.log(`[AUTH] Login successful for: ${identifier}`);
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
        subject: 'SwiftPlay Verification Code',
        text: `Your verification code is: ${otp}\nThis code expires in 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #00d4ff;">SwiftPlay Verification</h2>
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

