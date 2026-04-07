// Vercel Serverless Function: GET /api/equipment
// Returns sample sports equipment data

const equipment = [
  {
    _id: 'eq001',
    name: 'Standard Cricket Bat',
    sport: 'Cricket',
    pricePerHour: 50,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop',
    stock: 5,
    status: 'available',
    depositAmount: 200,
    lockerId: 'L-01'
  },
  {
    _id: 'eq002',
    name: 'Leather Cricket Ball',
    sport: 'Cricket',
    pricePerHour: 20,
    image: 'https://images.unsplash.com/photo-1593341646631-fbc865a78211?w=400&h=400&fit=crop',
    stock: 10,
    status: 'available',
    depositAmount: 50,
    lockerId: 'L-02'
  },
  {
    _id: 'eq003',
    name: 'FIFA Official Football',
    sport: 'Football',
    pricePerHour: 40,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
    stock: 8,
    status: 'available',
    depositAmount: 150,
    lockerId: 'L-03'
  },
  {
    _id: 'eq004',
    name: 'Pro Badminton Racket',
    sport: 'Badminton',
    pricePerHour: 30,
    image: 'https://images.unsplash.com/photo-1626225967045-2c70ba934ec7?w=400&h=400&fit=crop',
    stock: 6,
    status: 'available',
    depositAmount: 100,
    lockerId: 'L-04'
  },
  {
    _id: 'eq005',
    name: 'YONEX Shuttlecocks (6pk)',
    sport: 'Badminton',
    pricePerHour: 15,
    image: 'https://images.unsplash.com/photo-1626225967004-98ae0327f27a?w=400&h=400&fit=crop',
    stock: 12,
    status: 'available',
    depositAmount: 30,
    lockerId: 'L-05'
  },
  {
    _id: 'eq006',
    name: 'Roger Federer Signature Racket',
    sport: 'Tennis',
    pricePerHour: 60,
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?w=400&h=400&fit=crop',
    stock: 4,
    status: 'available',
    depositAmount: 300,
    lockerId: 'L-06'
  },
  {
    _id: 'eq007',
    name: 'Cricket Batting Pads',
    sport: 'Cricket',
    pricePerHour: 25,
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400&h=400&fit=crop',
    stock: 4,
    status: 'available',
    depositAmount: 100,
    lockerId: 'L-07'
  },
  {
    _id: 'eq008',
    name: 'Tennis Balls (3pk)',
    sport: 'Tennis',
    pricePerHour: 10,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop',
    stock: 15,
    status: 'available',
    depositAmount: 20,
    lockerId: 'L-08'
  }
];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json(equipment);
}
