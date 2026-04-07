// Vercel Serverless Function: POST /api/auth/verify-2fa
// Simulates OTP verification for demo purposes

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { otp, phone, email } = req.body || {};

  if (!otp) {
    return res.status(400).json({ error: 'OTP is required' });
  }

  // Accept any 6-digit OTP for demo (in production, validate against stored OTP)
  if (otp.length !== 6) {
    return res.status(400).json({ error: 'Invalid OTP format' });
  }

  // Accept the demo OTP '123456' or any 6-digit code for flexibility
  const identifier = phone || email || 'demo@swiftplay.com';

  return res.status(200).json({
    token: 'demo_jwt_token_' + Date.now(),
    user: {
      id: 'user_001',
      phone: phone || null,
      email: email || null,
      name: identifier,
    },
    message: 'Login successful',
  });
}
