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
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop'
  },
  {
    name: 'Professional Cricket Bat',
    sport: 'cricket',
    pricePerHour: 100,
    depositAmount: 1500,
    stock: 2,
    lockerId: 'L-102',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1589808945638-54c37eeb5575?w=400&h=400&fit=crop'
  },
  {
    name: 'Cricket Ball',
    sport: 'cricket',
    pricePerHour: 20,
    depositAmount: 100,
    stock: 10,
    lockerId: 'L-103',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1593341646631-fbc865a78211?w=400&h=400&fit=crop'
  },
  {
    name: 'Wicket Set',
    sport: 'cricket',
    pricePerHour: 15,
    depositAmount: 200,
    stock: 4,
    lockerId: 'L-104',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1629285483773-6b5c360814f8?w=400&h=400&fit=crop'
  },
  {
    name: 'Batting Gloves',
    sport: 'cricket',
    pricePerHour: 30,
    depositAmount: 300,
    stock: 6,
    lockerId: 'L-105',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1555029377-5b72945d8b67?w=400&h=400&fit=crop'
  },
  {
    name: 'Cricket Helmet',
    sport: 'cricket',
    pricePerHour: 40,
    depositAmount: 800,
    stock: 0,
    lockerId: 'L-106',
    status: 'unavailable',
    image: 'https://plus.unsplash.com/premium_photo-1679933595562-b91176b1cc8c?w=400&h=400&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop'
  },
  {
    name: 'Training Football',
    sport: 'football',
    pricePerHour: 25,
    depositAmount: 150,
    stock: 5,
    lockerId: 'L-202',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400&h=400&fit=crop'
  },
  {
    name: 'Goalkeeper Gloves',
    sport: 'football',
    pricePerHour: 35,
    depositAmount: 400,
    stock: 3,
    lockerId: 'L-203',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1510566337590-2fc1f2110023?w=400&h=400&fit=crop'
  },
  {
    name: 'Shin Guards',
    sport: 'football',
    pricePerHour: 20,
    depositAmount: 150,
    stock: 10,
    lockerId: 'L-204',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1628863673413-5aae166f2cce?w=400&h=400&fit=crop'
  },
  {
    name: 'Training Cones',
    sport: 'football',
    pricePerHour: 10,
    depositAmount: 100,
    stock: 0,
    lockerId: 'L-205',
    status: 'unavailable',
    image: 'https://images.unsplash.com/photo-1558230230-67c87c0e5a6b?w=400&h=400&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1626225967045-2c70ba934ec7?w=400&h=400&fit=crop'
  },
  {
    name: 'Professional Racket',
    sport: 'badminton',
    pricePerHour: 80,
    depositAmount: 1200,
    stock: 2,
    lockerId: 'L-302',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1626225967073-4f9eaebd7580?w=400&h=400&fit=crop'
  },
  {
    name: 'Shuttlecock Tube',
    sport: 'badminton',
    pricePerHour: 15,
    depositAmount: 0,
    stock: 12,
    lockerId: 'L-303',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1626225967004-98ae0327f27a?w=400&h=400&fit=crop'
  },
  {
    name: 'Badminton Net',
    sport: 'badminton',
    pricePerHour: 25,
    depositAmount: 300,
    stock: 4,
    lockerId: 'L-304',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1549419163-4da0ca757134?w=400&h=400&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?w=400&h=400&fit=crop'
  },
  {
    name: 'Professional Tennis Racket',
    sport: 'tennis',
    pricePerHour: 120,
    depositAmount: 2000,
    stock: 2,
    lockerId: 'L-402',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1542129296-33923eb41a54?w=400&h=400&fit=crop'
  },
  {
    name: 'Tennis Ball Pack',
    sport: 'tennis',
    pricePerHour: 25,
    depositAmount: 50,
    stock: 15,
    lockerId: 'L-403',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1617083277666-63e94db92949?w=400&h=400&fit=crop'
  },
  {
    name: 'Tennis Net',
    sport: 'tennis',
    pricePerHour: 50,
    depositAmount: 500,
    stock: 0,
    lockerId: 'L-404',
    status: 'unavailable',
    image: 'https://images.unsplash.com/photo-1579338559194-a162f4e0c4fa?w=400&h=400&fit=crop'
  }
];

export async function seedEquipments() {
  try {
    console.log('🗑️ Dropping existing equipment catalog to clear old indexes...');
    try {
      await Equipment.collection.drop();
    } catch (e) {
      if (e.code !== 26) {
        console.log('Collection might not exist yet, continuing...');
      }
    }
    
    console.log('🌱 Seeding new extended default equipment...');
    await Equipment.insertMany(defaultEquipments);
    console.log('✅ Extended default equipment seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding equipment:', err.message);
  }
}
