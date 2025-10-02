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
  },
  // ---- contact form emails ----
contactConfirmation: ({ name, subject }) => {
  return {
    subject: "We received your message - Garava",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for contacting Garava!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message regarding "<strong>${subject}</strong>" and will get back to you within one business day.</p>
        <p>Our team typically responds quickly to inquiries about:</p>
        <ul>
          <li>Orders and shipping</li>
          <li>Ring sizing and customizations</li>
          <li>Lab-grown diamonds and gemstones</li>
          <li>Product availability</li>
          <li>General support</li>
        </ul>
        <p>If your inquiry is urgent, you can also reach us via:</p>
        <ul>
          <li>Phone: (+91) 98765-43210</li>
          <li>WhatsApp: <a href="https://wa.me/919876543210">Chat now</a></li>
        </ul>
        <p>Thank you for choosing Garava.</p>
        <br>
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The Garava Team<br>
          <a href="${process.env.CLIENT_URL}" style="color: #333;">garava.in</a>
        </p>
      </div>
    `
  };
},
contactAdminNotification: ({ name, email, phone, subject, message, timestamp }) => {
  return {
    subject: `New Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Submitted:</strong> ${timestamp}</p>
        </div>
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Quick Actions:</strong><br>
            • <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}">Reply to ${name}</a><br>
            ${phone ? `• <a href="tel:${phone}">Call ${name}</a><br>` : ''}
            • <a href="https://wa.me/${phone ? phone.replace(/[^0-9]/g, '') : '919876543210'}">WhatsApp ${name}</a>
          </p>
        </div>
      </div>
    `
  };
}
};
 