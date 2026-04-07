import { Equipment } from '../models/Equipment.js';

const defaultEquipments = [
  // Cricket
  {
    name: 'Standard Cricket Bat',
    sport: 'cricket',
    pricePerHour: 50,
    depositAmount: 500,
    stock: 5,
    lockerId: 'L-101',
    status: 'available',
    image: '/images/cricket_bat.png'
  },
  {
    name: 'Professional Cricket Bat',
    sport: 'cricket',
    pricePerHour: 100,
    depositAmount: 1500,
    stock: 2,
    lockerId: 'L-102',
    status: 'available',
    image: '/images/cricket_bat.png'
  },
  {
    name: 'Cricket Ball',
    sport: 'cricket',
    pricePerHour: 20,
    depositAmount: 100,
    stock: 10,
    lockerId: 'L-103',
    status: 'available',
    image: '/images/cricket_ball.png'
  },
  {
    name: 'Wicket Set',
    sport: 'cricket',
    pricePerHour: 15,
    depositAmount: 200,
    stock: 4,
    lockerId: 'L-104',
    status: 'available',
    image: '/images/cricket_bat.png'
  },
  {
    name: 'Batting Gloves',
    sport: 'cricket',
    pricePerHour: 30,
    depositAmount: 300,
    stock: 6,
    lockerId: 'L-105',
    status: 'available',
    image: '/images/cricket_ball.png'
  },
  {
    name: 'Cricket Helmet',
    sport: 'cricket',
    pricePerHour: 40,
    depositAmount: 800,
    stock: 0,
    lockerId: 'L-106',
    status: 'unavailable',
    image: '/images/cricket_ball.png'
  },
  // Football
  {
    name: 'Football',
    sport: 'football',
    pricePerHour: 40,
    depositAmount: 300,
    stock: 8,
    lockerId: 'L-201',
    status: 'available',
    image: '/images/football.png'
  },
  {
    name: 'Training Football',
    sport: 'football',
    pricePerHour: 25,
    depositAmount: 150,
    stock: 5,
    lockerId: 'L-202',
    status: 'available',
    image: '/images/football.png'
  },
  {
    name: 'Goalkeeper Gloves',
    sport: 'football',
    pricePerHour: 35,
    depositAmount: 400,
    stock: 3,
    lockerId: 'L-203',
    status: 'available',
    image: '/images/football.png'
  },
  {
    name: 'Shin Guards',
    sport: 'football',
    pricePerHour: 20,
    depositAmount: 150,
    stock: 10,
    lockerId: 'L-204',
    status: 'available',
    image: '/images/football.png'
  },
  {
    name: 'Training Cones',
    sport: 'football',
    pricePerHour: 10,
    depositAmount: 100,
    stock: 0,
    lockerId: 'L-205',
    status: 'unavailable',
    image: '/images/football.png'
  },
  // Badminton
  {
    name: 'Badminton Racket',
    sport: 'badminton',
    pricePerHour: 30,
    depositAmount: 250,
    stock: 6,
    lockerId: 'L-301',
    status: 'available',
    image: '/images/badminton_racket.png'
  },
  {
    name: 'Professional Racket',
    sport: 'badminton',
    pricePerHour: 80,
    depositAmount: 1200,
    stock: 2,
    lockerId: 'L-302',
    status: 'available',
    image: '/images/badminton_racket.png'
  },
  {
    name: 'Shuttlecock Tube',
    sport: 'badminton',
    pricePerHour: 15,
    depositAmount: 0,
    stock: 12,
    lockerId: 'L-303',
    status: 'available',
    image: '/images/shuttlecock.png'
  },
  {
    name: 'Badminton Net',
    sport: 'badminton',
    pricePerHour: 25,
    depositAmount: 300,
    stock: 4,
    lockerId: 'L-304',
    status: 'available',
    image: '/images/shuttlecock.png'
  },
  // Tennis
  {
    name: 'Tennis Racket',
    sport: 'tennis',
    pricePerHour: 60,
    depositAmount: 500,
    stock: 4,
    lockerId: 'L-401',
    status: 'available',
    image: '/images/tennis_racket.png'
  },
  {
    name: 'Professional Tennis Racket',
    sport: 'tennis',
    pricePerHour: 120,
    depositAmount: 2000,
    stock: 2,
    lockerId: 'L-402',
    status: 'available',
    image: '/images/tennis_racket.png'
  },
  {
    name: 'Tennis Ball Pack',
    sport: 'tennis',
    pricePerHour: 25,
    depositAmount: 50,
    stock: 15,
    lockerId: 'L-403',
    status: 'available',
    image: '/images/tennis_racket.png'
  },
  {
    name: 'Tennis Net',
    sport: 'tennis',
    pricePerHour: 50,
    depositAmount: 500,
    stock: 0,
    lockerId: 'L-404',
    status: 'unavailable',
    image: '/images/tennis_racket.png'
  }
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
