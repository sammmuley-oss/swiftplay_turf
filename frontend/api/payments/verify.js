// Vercel Serverless Function: POST /api/payments/verify
// Simulates Razorpay payment verification for demo purposes

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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  // In production: verify signature with Razorpay secret
  // For demo, accept all payments as verified
  const rentalId = 'RNT-' + Date.now().toString(36).toUpperCase();

  return res.status(200).json({
    rentalId,
    verified: true,
    message: 'Payment verified successfully',
  });
}
