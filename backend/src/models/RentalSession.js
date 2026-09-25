import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.Mixed, ref: 'User', index: true },
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
    status: {
      type: String,
      enum: ['active', 'completed', 'reserved'],
      default: 'reserved',
      index: true,
    },
    rentalStatus: {
      type: String,
      enum: ['active', 'completed', 'reserved'],
      index: true,
    },
    paymentId: String, // Razorpay payment ID
    orderId: String,   // Razorpay order ID
  },
  { timestamps: true },
);

rentalSchema.pre('save', function syncRentalStatus(next) {
  if (this.status && !this.rentalStatus) {
    this.rentalStatus = this.status;
  }

  if (!this.status && this.rentalStatus) {
    this.status = this.rentalStatus;
  }

  if (this.status && this.rentalStatus && this.status !== this.rentalStatus) {
    this.rentalStatus = this.status;
  }

  next();
});

export const RentalSession = mongoose.model('RentalSession', rentalSchema);
