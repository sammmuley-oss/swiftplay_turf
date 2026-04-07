import mongoose from 'mongoose';
import { Equipment } from './src/models/Equipment.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/turf_rental");
  const items = await Equipment.find({});
  console.log(JSON.stringify(items.map(i => ({ name: i.name, image: i.image })), null, 2));
  process.exit(0);
}
check();
