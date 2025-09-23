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