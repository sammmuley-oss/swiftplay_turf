import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Equipment } from './src/models/Equipment.js';

dotenv.config();

const equipments = [
  {
    name: 'Standard Cricket Bat',
    sport: 'cricket',
    pricePerHour: 50,
    image: '/images/cricket_bat.png',
    stock: 5,
    status: 'available',
    depositAmount: 100,
    lockerId: 'C1'
  },
  {
    name: 'Leather Cricket Ball',
    sport: 'cricket',
    pricePerHour: 20,
    image: '/images/cricket_ball.png',
    stock: 10,
    status: 'available',
    depositAmount: 50,
    lockerId: 'C2'
  },
  {
    name: 'FIFA Official Football',
    sport: 'football',
    pricePerHour: 40,
    image: '/images/football.png',
    stock: 8,
    status: 'available',
    depositAmount: 150,
    lockerId: 'F1'
  },
  {
    name: 'Pro Badminton Racket',
    sport: 'badminton',
    pricePerHour: 30,
    image: '/images/badminton_racket.png',
    stock: 6,
    status: 'available',
    depositAmount: 80,
    lockerId: 'B1'
  },
  {
    name: 'YONEX Shuttlecocks (6pk)',
    sport: 'badminton',
    pricePerHour: 15,
    image: '/images/shuttlecock.png',
    stock: 12,
    status: 'available',
    depositAmount: 30,
    lockerId: 'B2'
  },
  {
    name: 'Roger Federer Signature Racket',
    sport: 'tennis',
    pricePerHour: 60,
    image: '/images/tennis_racket.png',
    stock: 4,
    status: 'available',
    depositAmount: 200,
    lockerId: 'T1'
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/turf_rental";
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    await Equipment.deleteMany({});
    console.log('🗑️ Cleared existing equipment');

    await Equipment.insertMany(equipments);
    console.log('✨ Seeded equipment data');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
