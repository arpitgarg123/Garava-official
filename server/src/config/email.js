import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html, from }) => {
  const sender = from || process.env.EMAIL_FROM || "onboarding@resend.dev";

  try {
    const data = await resend.emails.send({
      from: sender,
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};   