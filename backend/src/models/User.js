import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phoneHash: { type: String, unique: true, sparse: true, index: true },
    email: { 
      type: String, 
      unique: true, 
      sparse: true, 
      index: true,
      lowercase: true,
      trim: true 
    },
    password: { type: String }, // Hashed password
    displayName: { type: String },
    loyaltyPoints: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);

