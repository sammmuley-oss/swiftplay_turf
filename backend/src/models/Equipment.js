import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sport: { 
      type: String, 
      enum: ['cricket', 'football', 'badminton'], 
      required: true,
      index: true
    },
    pricePerHour: { type: Number, required: true },
    depositAmount: { type: Number, required: true, default: 0 },
    image: { type: String },
    stock: { type: Number, required: true, default: 0 },
    // Reserved for kiosk integration
    lockerId: { type: String },
    status: {
      type: String,
      enum: ['available', 'unavailable', 'maintenance'],
      default: 'available',
    },
  },
  { timestamps: true },
);

export const Equipment = mongoose.model('Equipment', equipmentSchema);
