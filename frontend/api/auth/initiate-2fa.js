// Vercel Serverless Function: POST /api/auth/initiate-2fa
// Generates a real OTP and sends it via email (stateless - no database needed)

import nodemailer from 'nodemailer';
import crypto from 'crypto';

// --- OTP Generator ---
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- Create signed verification token (HMAC-based, stateless) ---
function createVerificationToken(identifier, otp, expiresAt) {
  const secret = process.env.JWT_SECRET || 'dev-secret-key';
  const data = `${identifier}:${otp}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
  // Encode as base64 for transport
  return Buffer.from(JSON.stringify({ data, hmac })).toString('base64');
}

// --- Email Transporter ---
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: (process.env.EMAIL_PORT || '587') === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// --- Handler ---
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, email } = req.body || {};
  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone or email is required' });
  }

  try {
    const identifier = email || phone;
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Create a signed token that encodes the OTP for stateless verification
    const verificationToken = createVerificationToken(identifier, otp, expiresAt);

    let sentVia = 'simulation';
    let message = 'OTP generated.';

    if (email) {
      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('[AUTH] EMAIL_USER or EMAIL_PASS not configured');
        return res.status(500).json({
          success: false,
          error: 'Email service not configured. Contact support.',
        });
      }

      try {
        const transporter = createTransporter();
        const fromAddr = process.env.EMAIL_FROM || `SWIFTPLAY <${process.env.EMAIL_USER}>`;

        await transporter.sendMail({
          from: fromAddr,
          to: email,
          subject: 'Your SWIFTPLAY Verification Code',
          text: `Your verification code is: ${otp}\nThis code expires in 5 minutes.`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0c; border-radius: 16px; border: 1px solid #222;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #00d4ff; font-size: 24px; margin: 0;">⚡ SwiftPlay</h2>
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Security Verification</p>
              </div>
              <div style="text-align: center; margin: 24px 0;">
                <p style="color: #ccc; font-size: 14px; margin-bottom: 16px;">Your verification code is:</p>
                <div style="background: #1a1a1c; border: 1px solid #333; border-radius: 12px; padding: 20px; display: inline-block;">
                  <span style="color: #00d4ff; font-size: 36px; font-weight: bold; letter-spacing: 12px; font-family: monospace;">${otp}</span>
                </div>
              </div>
              <p style="color: #555; font-size: 12px; text-align: center; margin-top: 24px;">This code expires in 5 minutes. Do not share it with anyone.</p>
            </div>
          `,
        });

        sentVia = 'email';
        message = `OTP sent to your email: ${email}`;
        console.log(`[AUTH] Email OTP sent successfully to ${email}`);
      } catch (mailErr) {
        console.error(`[AUTH] Email delivery failed:`, mailErr.message, mailErr.stack);
        console.error(`[AUTH] Debug - EMAIL_USER set: ${!!process.env.EMAIL_USER}, EMAIL_PASS set: ${!!process.env.EMAIL_PASS}, EMAIL_HOST: ${process.env.EMAIL_HOST}`);
        return res.status(500).json({
          success: false,
          error: 'Email delivery failed: ' + mailErr.message,
        });
      }
    } else if (phone) {
      // Phone/SMS - simulation only for now
      sentVia = 'simulation';
      message = `OTP generated for phone (simulation mode)`;
      console.log(`[AUTH] [SIMULATION] OTP for ${phone}: ${otp}`);
    }

    return res.status(200).json({
      success: true,
      message,
      type: sentVia,
      // Send the verification token back - frontend stores this and sends it during verify
      verificationToken,
    });
  } catch (err) {
    console.error('[AUTH] initiate-2fa error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
