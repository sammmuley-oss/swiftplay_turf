import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // Add TTL index - MongoDB will automatically delete documents after this time
    expires: 0, 
  },
}, { timestamps: true });

// Ensure the expiresAt field has the actual expiry time
// The 'expires: 0' above tells MongoDB to delete the doc once the current time > expiresAt

export const Otp = mongoose.model('Otp', otpSchema);
