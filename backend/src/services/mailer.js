import nodemailer from "nodemailer";
import { config } from "../config.js";

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for 587
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

// Verify connection
export async function verifyEmailServer() {
  if (!config.email.user || !config.email.pass) {
    console.error("❌ Email credentials missing in .env file");
    return;
  }
  
  try {
    await transporter.verify();
    console.log("✅ Email server connected");
  } catch (error) {
    console.error("❌ Email server connection failed:", error);
  }
}

// Send email function
export async function sendEmail({ to, subject, text, html }) {
  try {
    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}