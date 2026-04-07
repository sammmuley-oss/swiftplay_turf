import twilio from 'twilio';
import { config } from '../config.js';

const client = config.twilio.accountSid && config.twilio.authToken
  ? twilio(config.twilio.accountSid, config.twilio.authToken)
  : null;

/**
 * Send SMS OTP
 * @param {string} to - Destination phone number
 * @param {string} otp - The OTP code
 * @returns {Promise<Object>} - Twilio response or simulation result
 */
export async function sendSMS(to, otp) {
  if (client && config.twilio.phoneNumber) {
    try {
      const message = await client.messages.create({
        body: `Your SWIFTPLAY verification code is: ${otp}`,
        from: config.twilio.phoneNumber,
        to: to,
      });
      return { success: true, messageId: message.sid, type: 'sms' };
    } catch (error) {
      console.error(`[SMS SERVICE] Twilio delivery failed to ${to}: ${error.code} - ${error.message}`);
      // Re-throw with a clean message
      const err = new Error(`Twilio error: ${error.message}`);
      err.code = error.code;
      throw err;
    }
  } else {
    // Development/Simulation Mode
    console.log(`\n--- SMS SIMULATION ---`);
    console.log(`To: ${to}`);
    console.log(`Message: Your SWIFTPLAY verification code is: ${otp}`);
    console.log(`----------------------\n`);
    
    return { 
      success: true, 
      type: 'simulation', 
      // Return OTP in response only in dev to make testing easier
      otp: process.env.NODE_ENV === 'development' ? otp : undefined 
    };
  }
}

/**
 * Placeholder for Fast2SMS or other free/low-cost Indian SMS providers
 * Example implementation for later:
 * async function sendFast2SMS(to, otp) { ... }
 */
