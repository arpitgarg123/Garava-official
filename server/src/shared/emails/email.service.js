import { sendEmail } from "../../config/email.js";
import { emailTemplates } from "../../templates/emailTemplates.js";

// ---- User Emails ----

export const sendVerificationEmail = async (user, token) => {
  const { subject, html } = emailTemplates.verifyEmail(user, token);
  return sendEmail({ to: user.email, subject, html });
};


export const sendPasswordResetEmail = async (user, token) => {
  const { subject, html } = emailTemplates.resetPassword(user, token);
  return sendEmail({ to: user.email, subject, html });
};

// ---- Appointment Emails ----

export const sendAppointmentCreatedEmail = async (appointment) => {
  const { subject, html } = emailTemplates.appointmentCreated(appointment);
  return sendEmail({ to: appointment.email, subject, html });
};

export const sendAppointmentStatusEmail = async (appointment) => {
  const { subject, html } = emailTemplates.appointmentStatusChanged(appointment);
  return sendEmail({ to: appointment.email, subject, html });
};

export const sendAppointmentCancelledEmail = async (appointment) => {
  const { subject, html } = emailTemplates.appointmentCancelled(appointment);
  return sendEmail({ to: appointment.email, subject, html });
};

// ---- newsletter emails ----

export const sendNewsletterWelcomeEmail = async (email) => {
  const { subject, html } = emailTemplates.subscribedToNewsletter(email);
  return sendEmail({ to: email, subject, html });
}

// ---- contact form emails ----

export const sendContactConfirmationEmail = async (contactData) => {
  const { subject, html } = emailTemplates.contactConfirmation(contactData);
  return sendEmail({ to: contactData.email, subject, html });
};

export const sendContactAdminNotificationEmail = async (contactData) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@garava.in";
  const { subject, html } = emailTemplates.contactAdminNotification({
    ...contactData,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
  return sendEmail({ to: adminEmail, subject, html });
};