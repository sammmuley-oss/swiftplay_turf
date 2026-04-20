import { Equipment } from '../models/Equipment.js';

const defaultEquipments = [
  // ── Cricket ──
  {
    name: 'Cricket Bat',
    sport: 'cricket',
    pricePerHour: 50,
    depositAmount: 100,
    image: '/images/cricket_bat.png',
    stock: 5,
    status: 'available',
    lockerId: 'L-01',
  },
  {
    name: 'Cricket Tennis Ball',
    sport: 'cricket',
    pricePerHour: 10,
    depositAmount: 20,
    image: '/images/cricket_tennis_ball.png',
    stock: 10,
    status: 'available',
    lockerId: 'L-02',
  },
  {
    name: 'Cricket Wickets Set (2 Sets)',
    sport: 'cricket',
    pricePerHour: 40,
    depositAmount: 80,
    image: '/images/cricket_wickets.png',
    stock: 4,
    status: 'available',
    lockerId: 'L-03',
  },

  // ── Football ──
  {
    name: 'Football',
    sport: 'football',
    pricePerHour: 40,
    depositAmount: 100,
    image: '/images/football.png',
    stock: 6,
    status: 'available',
    lockerId: 'L-04',
  },
  {
    name: 'Football Keeping Gloves',
    sport: 'football',
    pricePerHour: 30,
    depositAmount: 60,
    image: '/images/football_gloves.png',
    stock: 4,
    status: 'available',
    lockerId: 'L-05',
  },

  // ── Badminton ──
  {
    name: 'Badminton Racket',
    sport: 'badminton',
    pricePerHour: 30,
    depositAmount: 50,
    image: '/images/badminton_racket.png',
    stock: 6,
    status: 'available',
    lockerId: 'L-06',
  },
  {
    name: 'Badminton Shuttle Cock',
    sport: 'badminton',
    pricePerHour: 10,
    depositAmount: 10,
    image: '/images/shuttlecock.png',
    stock: 12,
    status: 'available',
    lockerId: 'L-07',
  },
];


export async function seedEquipments() {
  try {
    await Equipment.deleteMany({});
    console.log('🗑️ Cleared existing equipment');
    
    console.log('🌱 Seeding new extended default equipment...');
    await Equipment.insertMany(defaultEquipments);
    console.log('✅ Extended default equipment seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding equipment:', err.message);
  }
}
