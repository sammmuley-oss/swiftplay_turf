// Vercel Serverless Function: POST /api/payments/create-order
// Simulates Razorpay order creation for demo purposes

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

  const { equipmentList, duration, paymentMethod } = req.body || {};

  if (!equipmentList || !Array.isArray(equipmentList) || equipmentList.length === 0) {
    return res.status(400).json({ error: 'Equipment list is required' });
  }

  // Calculate total
  let rentalTotal = 0;
  let depositTotal = 0;
  for (const item of equipmentList) {
    rentalTotal += (item.pricePerHour || 0) * (item.quantity || 1) * (duration || 1);
    depositTotal += (item.depositAmount || 0) * (item.quantity || 1);
  }
  const totalAmount = rentalTotal + depositTotal;

  const rentalId = 'RNT-' + Date.now().toString(36).toUpperCase();

  if (paymentMethod === 'Cash') {
    return res.status(200).json({
      rentalId,
      totalAmount,
      message: 'Cash order created. Pay at kiosk.',
    });
  }

  // For UPI/Razorpay — return mock order data
  // In production, you would create a real Razorpay order here
  return res.status(200).json({
    orderId: 'order_demo_' + Date.now(),
    amount: totalAmount * 100, // Razorpay expects paise
    currency: 'INR',
    rentalId,
    totalAmount,
    equipmentList,
    duration,
  });
}
