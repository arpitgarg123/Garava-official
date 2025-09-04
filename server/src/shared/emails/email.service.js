import { sendEmail } from "../../config/email.js";
import { emailTemplates } from "../../templates/emailTemplates.js";


export const sendVerificationEmail = async (user, token) => {
  const { subject, html } = emailTemplates.verifyEmail(user, token);
  return sendEmail({ to: user.email, subject, html });
};


export const sendPasswordResetEmail = async (user, token) => {
  const { subject, html } = emailTemplates.resetPassword(user, token);
  return sendEmail({ to: user.email, subject, html });
};

