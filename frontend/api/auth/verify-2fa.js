// Vercel Serverless Function: POST /api/auth/verify-2fa
// Verifies OTP using HMAC-signed verification token (stateless - no database needed)

import crypto from 'crypto';

// --- Verify the signed verification token ---
function verifyOTP(identifier, otp, verificationToken) {
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret-key';
    const decoded = JSON.parse(Buffer.from(verificationToken, 'base64').toString('utf-8'));
    const { data, hmac } = decoded;

    // Verify HMAC
    const expectedHmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
    if (hmac !== expectedHmac) {
      return { valid: false, reason: 'Invalid verification token' };
    }

    // Parse the data
    const [storedIdentifier, storedOtp, expiresAtStr] = data.split(':');
    const expiresAt = parseInt(expiresAtStr, 10);

    // Check expiry
    if (Date.now() > expiresAt) {
      return { valid: false, reason: 'OTP has expired' };
    }

    // Check identifier match
    if (storedIdentifier !== identifier) {
      return { valid: false, reason: 'Identifier mismatch' };
    }

    // Check OTP match
    if (storedOtp !== otp) {
      return { valid: false, reason: 'Invalid OTP' };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, reason: 'Invalid verification token format' };
  }
}

// --- Generate JWT token ---
function generateToken(payload, secret, expiresInMs = 60 * 60 * 1000) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payloadWithExp = {
    ...payload,
    iat: now,
    exp: now + Math.floor(expiresInMs / 1000),
  };
  const body = Buffer.from(JSON.stringify(payloadWithExp)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

// --- Handler ---
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { otp, phone, email, verificationToken } = req.body || {};

  if (!otp) {
    return res.status(400).json({ error: 'OTP is required' });
  }
  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone or email is required' });
  }
  if (otp.length !== 6) {
    return res.status(400).json({ error: 'Invalid OTP format' });
  }
  if (!verificationToken) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  try {
    const identifier = email || phone;

    // Verify OTP using the signed token
    const result = verifyOTP(identifier, otp, verificationToken);

    if (!result.valid) {
      console.warn(`[AUTH] OTP verification failed for ${identifier}: ${result.reason}`);
      return res.status(410).json({ error: result.reason || 'Invalid or expired OTP' });
    }

    // Generate JWT for the session
    const jwtSecret = process.env.JWT_SECRET || 'dev-secret-key';
    const userId = 'user_' + crypto.createHash('md5').update(identifier).digest('hex').slice(0, 12);

    const token = generateToken(
      { sub: userId, role: 'user', identifier },
      jwtSecret,
      60 * 60 * 1000 // 1 hour
    );

    console.log(`[AUTH] Login successful for: ${identifier}`);

    return res.status(200).json({
      token,
      user: {
        id: userId,
        role: 'user',
        email: email || null,
        phone: phone || null,
        loyaltyPoints: 0,
      },
      message: 'Login successful',
    });
  } catch (err) {
    console.error('[AUTH] verify-2fa error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
