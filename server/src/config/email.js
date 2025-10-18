import nodemailer from "nodemailer";

/**
 * Create SMTP transporter for Hostinger webmail
 * Uses nodemailer with Hostinger SMTP settings
 */
const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT) || 465;
  const isSecure = port === 465; // Use secure for 465, false for 587

  console.log('📧 SMTP Configuration:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', port);
  console.log('  Secure:', isSecure);
  console.log('  User:', process.env.SMTP_USER);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER, // Your Hostinger email address
      pass: process.env.SMTP_PASSWORD, // Your Hostinger email password
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    logger: process.env.NODE_ENV === 'development', // Enable logging in dev
    debug: process.env.NODE_ENV === 'development', // Enable debug in dev
  });
};

/**
 * Send email via Hostinger SMTP
 * Maintains the same interface as Resend for backward compatibility
 */
export const sendEmail = async ({ to, subject, html, from }) => {
  const sender = from || process.env.EMAIL_FROM || process.env.SMTP_USER;

  try {
    const transporter = createTransporter();

    // Skip verification - just send the email directly
    // Verification can cause unnecessary errors even when email sends successfully
    
    const info = await transporter.sendMail({
      from: sender, // Sender address (must be your Hostinger email)
      to: Array.isArray(to) ? to.join(", ") : to, // List of receivers
      subject, // Subject line
      html, // HTML body
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return { id: info.messageId, success: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    // Re-throw so auth service can catch it
    throw error;
  }
};   