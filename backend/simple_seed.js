import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const equipmentSchema = new mongoose.Schema({
    name: String,
    sport: String,
    pricePerHour: Number,
    image: String,
    availableQuantity: Number,
    status: String
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);

const equipments = [
  {
    name: 'Standard Cricket Bat',
    sport: 'Cricket',
    pricePerHour: 50,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop',
    availableQuantity: 5,
    status: 'available'
  },
  {
    name: 'Leather Cricket Ball',
    sport: 'Cricket',
    pricePerHour: 20,
    image: 'https://images.unsplash.com/photo-1593341646631-fbc865a78211?w=400&h=400&fit=crop',
    availableQuantity: 10,
    status: 'available'
  },
  {
    name: 'FIFA Official Football',
    sport: 'Football',
    pricePerHour: 40,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
    availableQuantity: 8,
    status: 'available'
  },
  {
    name: 'Pro Badminton Racket',
    sport: 'Badminton',
    pricePerHour: 30,
    image: 'https://images.unsplash.com/photo-1626225967045-2c70ba934ec7?w=400&h=400&fit=crop',
    availableQuantity: 6,
    status: 'available'
  },
  {
    name: 'YONEX Shuttlecocks (6pk)',
    sport: 'Badminton',
    pricePerHour: 15,
    image: 'https://images.unsplash.com/photo-1626225967004-98ae0327f27a?w=400&h=400&fit=crop',
    availableQuantity: 12,
    status: 'available'
  },
  {
    name: 'Roger Federer Signature Racket',
    sport: 'Tennis',
    pricePerHour: 60,
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?w=400&h=400&fit=crop',
    availableQuantity: 4,
    status: 'available'
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/turf_rental";
    console.log('Connecting to', mongoUri);
    await mongoose.connect(mongoUri);
    
    // Clear existing
    await mongoose.connection.db.collection('equipments').deleteMany({});
    console.log('Cleared collection');

    await mongoose.connection.db.collection('equipments').insertMany(equipments);
    console.log('Inserted', equipments.length, 'items');

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
