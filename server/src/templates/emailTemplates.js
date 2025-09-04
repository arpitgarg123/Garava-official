// src/templates/emailTemplates.js

export const emailTemplates = {
  verifyEmail: (user, token) => {
    const url = `${process.env.CLIENT_URL}/auth/verify-email?token=${encodeURIComponent(token)}`;
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
    const url = `${process.env.CLIENT_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;
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
};
