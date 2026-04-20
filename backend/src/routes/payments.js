import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config.js';
import { Equipment } from '../models/Equipment.js';
import { RentalSession } from '../models/RentalSession.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

/**
 * POST /api/payments/create-order
 */
router.post('/create-order', async (req, res, next) => {
  try {
    const { equipmentList, duration, paymentMethod } = req.body;

    if (!equipmentList || equipmentList.length === 0) {
      return res.status(400).json({ error: 'Equipment list is empty' });
    }

    // Recalculate total on backend for security
    let totalAmount = 0;
    const itemsWithDetails = [];

    for (const item of equipmentList) {
      const equipment = await Equipment.findById(item.equipmentId);
      if (!equipment || equipment.stock < item.quantity) {
        return res.status(400).json({ error: `Equipment ${equipment?.name || item.name} is not available in requested quantity` });
      }
      const itemTotal = (equipment.pricePerHour * duration) + (equipment.depositAmount || 0);
      totalAmount += (itemTotal * item.quantity);
      itemsWithDetails.push({
        equipmentId: equipment._id,
        name: equipment.name,
        quantity: item.quantity,
        pricePerHour: equipment.pricePerHour,
        depositAmount: equipment.depositAmount
      });
    }

    if (paymentMethod === 'Cash') {
      const rental = await RentalSession.create({
        userId: req.body.userId || 'kiosk-guest',
        equipmentList: itemsWithDetails,
        duration,
        totalAmount,
        paymentMethod: 'Cash',
        paymentStatus: 'Pending',
        rentalStatus: 'Reserved'
      });

      // Update availability
      for (const item of itemsWithDetails) {
        await Equipment.findByIdAndUpdate(item.equipmentId, {
          $inc: { stock: -item.quantity }
        });
      }

      return res.json({ 
        success: true, 
        message: 'Booking reserved. Please pay cash at the kiosk.',
        rentalId: rental._id 
      });
    }

    // Razorpay Order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      equipmentList: itemsWithDetails,
      duration,
      totalAmount
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/payments/verify
 */
router.post('/verify', async (req, res, next) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      equipmentList,
      duration,
      totalAmount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Create final rental record
      const rental = await RentalSession.create({
        userId: req.body.userId || 'kiosk-guest',
        equipmentList,
        duration,
        totalAmount,
        paymentMethod: 'UPI',
        paymentStatus: 'Completed',
        rentalStatus: 'Active',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });

      // Update availability
      for (const item of equipmentList) {
        await Equipment.findByIdAndUpdate(item.equipmentId, {
          $inc: { stock: -item.quantity }
        });
      }

      return res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        rentalId: rental._id 
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    next(err);
  }
});

export const paymentRouter = router;
