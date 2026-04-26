import twilio from 'twilio';
import { config } from '../config.js';

const twilioClient = config.twilio.accountSid && config.twilio.authToken
  ? twilio(config.twilio.accountSid, config.twilio.authToken)
  : null;

/**
 * Send OTP via Fast2SMS (Indian numbers)
 * Uses the built-in OTP route for clean formatting
 * Falls back to Quick Transactional (q) route if OTP route needs activation
 * API Docs: https://docs.fast2sms.com/
 */
async function sendFast2SMS(phone, otp) {
  // Fast2SMS only works with 10-digit Indian numbers (no country code)
  let number = phone.replace(/\D/g, '');
  if (number.startsWith('91') && number.length === 12) {
    number = number.slice(2);
  }
  if (number.length !== 10) {
    throw new Error(`Invalid Indian phone number: ${phone} (resolved to ${number})`);
  }

  // Try the OTP route first (cleaner message format)
  const otpUrl = 'https://www.fast2sms.com/dev/bulkV2';

  // Try OTP route
  console.log(`[SMS] Attempting Fast2SMS OTP route to: ${number}`);
  const otpParams = new URLSearchParams({
    authorization: config.fast2sms.apiKey,
    variables_values: otp,
    route: 'otp',
    numbers: number,
  });

  let response = await fetch(`${otpUrl}?${otpParams.toString()}`);
  let data = await response.json();

  // If OTP route works, great!
  if (response.ok && data.return !== false) {
    console.log(`[SMS] Fast2SMS OTP route success:`, data.message);
    return { success: true, requestId: data.request_id, type: 'sms' };
  }

  // If OTP route failed (needs website verification), try Quick Transactional route
  console.log(`[SMS] OTP route failed (${data.message}), trying Quick Transactional route...`);
  const qParams = new URLSearchParams({
    authorization: config.fast2sms.apiKey,
    message: `Your TURFGEAR verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
    route: 'q',
    numbers: number,
    flash: '0',
  });

  response = await fetch(`${otpUrl}?${qParams.toString()}`);
  data = await response.json();

  if (response.ok && data.return !== false) {
    console.log(`[SMS] Fast2SMS Quick route success:`, data.message);
    return { success: true, requestId: data.request_id, type: 'sms' };
  }

  // Both routes failed
  console.error(`[SMS] Fast2SMS all routes failed:`, data);
  throw new Error(`Fast2SMS: ${data.message || 'All SMS routes failed'}`);
}

/**
 * Send OTP via Twilio (international numbers / fallback)
 */
async function sendTwilioSMS(phone, otp) {
  if (!twilioClient || !config.twilio.phoneNumber) {
    throw new Error('Twilio not configured');
  }
  const message = await twilioClient.messages.create({
    body: `Your TURFGEAR verification code is: ${otp}. Valid for 5 minutes.`,
    from: config.twilio.phoneNumber,
    to: phone,
  });
  console.log(`[SMS] Twilio success: SID=${message.sid}`);
  return { success: true, messageId: message.sid, type: 'sms' };
}

/**
 * Main SMS send function — picks the right provider based on config
 * Priority: Fast2SMS → Twilio → Simulation
 */
export async function sendSMS(to, otp) {
  const mode = config.smsMode;

  // 1. Fast2SMS mode
  if (mode === 'fast2sms' && config.fast2sms.apiKey) {
    try {
      return await sendFast2SMS(to, otp);
    } catch (err) {
      console.error(`[SMS] Fast2SMS failed: ${err.message}`);
      // If Twilio is available, try that as fallback
      if (twilioClient && config.twilio.phoneNumber) {
        console.log(`[SMS] Falling back to Twilio...`);
        return await sendTwilioSMS(to, otp);
      }
      // Otherwise fall through to simulation
      console.warn(`[SMS] No fallback provider available, using simulation`);
    }
  }

  // 2. Twilio mode
  if (mode === 'twilio' && twilioClient && config.twilio.phoneNumber) {
    return await sendTwilioSMS(to, otp);
  }

  // 3. Simulation fallback (for development)
  console.log(`\n╔══════════════════════════════════╗`);
  console.log(`║     📱 SMS SIMULATION MODE       ║`);
  console.log(`╠══════════════════════════════════╣`);
  console.log(`║  To:  ${to.padEnd(25)}║`);
  console.log(`║  OTP: ${otp.padEnd(25)}║`);
  console.log(`╚══════════════════════════════════╝\n`);

  return {
    success: true,
    type: 'simulation',
    otp: otp,
  };
}
