import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    equipmentList: [
      {
        equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
        name: String,
        quantity: Number,
        pricePerHour: Number
      }
    ],
    duration: { type: Number, required: true }, // duration in hours (e.g., 0.5, 1, 2)
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'UPI'], required: true },
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Completed', 'Failed'], 
      default: 'Pending' 
    },
    rentalStatus: { 
      type: String, 
      enum: ['Active', 'Completed', 'Reserved'], 
      default: 'Reserved' 
    },
    paymentId: String, // Razorpay payment ID
    orderId: String,   // Razorpay order ID
  },
  { timestamps: true },
);

export const RentalSession = mongoose.model('RentalSession', rentalSchema);
