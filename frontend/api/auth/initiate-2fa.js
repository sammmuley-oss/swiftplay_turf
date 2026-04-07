// Vercel Serverless Function: POST /api/auth/initiate-2fa
// Simulates OTP initiation for demo purposes

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

  const { phone, email } = req.body || {};

  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone or email is required' });
  }

  // Generate a mock OTP for demo
  const otp = '123456';

  return res.status(200).json({
    message: 'Verification code sent successfully!',
    otp, // Included for demo — remove in production
  });
}
