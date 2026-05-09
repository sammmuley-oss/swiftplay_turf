/**
 * Email Service — Console Simulation
 * Logs OTP emails to the console instead of using an external service.
 * Replace this with a real email provider when ready for production.
 */

// Verify connection (no-op in simulation mode)
export async function verifyEmailServer() {
  console.log("📧 Email service running in SIMULATION mode (no external provider)");
}

// Simulated email send — logs to console
export async function sendEmail({ to, subject, text, html }) {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║        📧 EMAIL SIMULATION MODE          ║`);
  console.log(`╠══════════════════════════════════════════╣`);
  console.log(`║  To:      ${to.padEnd(30)}║`);
  console.log(`║  Subject: ${subject.padEnd(30)}║`);
  if (text) {
    console.log(`║  Body:    ${text.slice(0, 30).padEnd(30)}║`);
  }
  console.log(`╚══════════════════════════════════════════╝\n`);

  return { messageId: `sim-${Date.now()}`, simulated: true };
}