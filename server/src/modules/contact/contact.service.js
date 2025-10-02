import { sendEmail } from "../../config/email.js";
import { emailTemplates } from "../../templates/emailTemplates.js";
import ApiError from "../../shared/utils/ApiError.js";

/**
 * Send contact form emails - user confirmation and admin notification
 */
export const sendContactFormEmails = async (contactData) => {
  const { name, email, phone, subject, message } = contactData;

  try {
    // Send confirmation email to user
    const userEmailPromise = sendUserContactConfirmation({ name, email, subject });
    
    // Send notification email to admin
    const adminEmailPromise = sendAdminContactNotification({
      name,
      email,
      phone,
      subject,
      message
    });

    // Send both emails concurrently
    await Promise.all([userEmailPromise, adminEmailPromise]);

    return { success: true, message: "Contact form submitted successfully" };
  } catch (error) {
    console.error("Failed to send contact emails:", error);
    throw new ApiError(500, "Failed to send contact form emails");
  }
};

/**
 * Send confirmation email to user
 */
const sendUserContactConfirmation = async ({ name, email, subject }) => {
  const { subject: emailSubject, html } = emailTemplates.contactConfirmation({
    name,
    subject
  });
  
  return sendEmail({
    to: email,
    subject: emailSubject,
    html
  });
};

/**
 * Send notification email to admin
 */
const sendAdminContactNotification = async ({ name, email, phone, subject, message }) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@garava.in";
  
  const { subject: emailSubject, html } = emailTemplates.contactAdminNotification({
    name,
    email,
    phone,
    subject,
    message,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
  
  return sendEmail({
    to: adminEmail,
    subject: emailSubject,
    html
  });
};