// src/templates/emailTemplates.js

export const emailTemplates = {
  verifyEmail: (user, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
    return {
      subject: "Verify your email - Garava",
      html: `
        <h1>Welcome to Garava, ${user.name}!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${url}">${url}</a>
      `,
    };
  },
  resetPassword: (user, token) => {
    // 👉 Link to FRONTEND page so user can type a new password there:
    const url = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
    return {
      subject: "Reset your password - Garava",
      html: `
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password (valid for 30 minutes):</p>
        <a href="${url}">${url}</a>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    };
  },
    /* ---- Appointments ---- */
  appointmentCreated: (appointment) => {
    return {
      subject: "Your appointment request has been received",
      html: `
        <p>Hi ${appointment.name},</p>
        <p>We received your appointment request for <strong>${appointment.serviceType}</strong> 
        at <strong>${new Date(appointment.appointmentAt).toLocaleString()}</strong>.</p>
        <p>We’ll confirm shortly. Thank you for choosing Garava.</p>
      `,
    };
  },

  appointmentStatusChanged: (appointment) => {
    return {
      subject: `Your appointment is now ${appointment.status}`,
      html: `
        <p>Hi ${appointment.name},</p>
        <p>Your appointment status has been updated to <strong>${appointment.status}</strong>.</p>
        <p>Scheduled time: <strong>${new Date(appointment.appointmentAt).toLocaleString()}</strong></p>
        <p>${appointment.adminNotes ? `<em>Note from admin: ${appointment.adminNotes}</em>` : ""}</p>
      `,
    };
  },

  appointmentCancelled: (appointment) => {
    return {
      subject: "Your appointment has been cancelled",
      html: `
        <p>Hi ${appointment.name},</p>
        <p>Your appointment on <strong>${new Date(appointment.appointmentAt).toLocaleString()}</strong> has been cancelled.</p>
        <p>If this was a mistake, please rebook via our website.</p>
      `,
    };
  },
  // ---- newsletter emails ----
  subscribedToNewsletter: (email) => {
    return {
      subject: "Welcome to Garava Newsletter",
      html: `
        <h2>Thanks for subscribing to Garava!</h2>
        <p>You’ll now receive updates about new fragrances, jewellery, and offers.</p>
        <p>If this wasn’t you, you can <a href="${process.env.CLIENT_URL}/unsubscribe?email=${encodeURIComponent(email)}">unsubscribe here</a>.</p>
      `
    }; 
  }
};
