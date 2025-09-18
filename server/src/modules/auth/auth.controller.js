import {asyncHandler} from '../../shared/utils/asyncHandler.js';
import { forgotPasswordService, loginUser, logoutUser, refreshSessionService, resendVerificationService, resetPasswordService, signupUser, verifyEmailService } from './auth.service.js';
import { clearAuthCookies, setAuthCookies } from './token.service.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, user } = await loginUser(email, password);

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ accessToken, refreshToken, user });
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await signupUser({ name, email, password });

  res.status(201).json({
    message: 'User created successfully',
    user: newUser,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const userId = req.user?.id;

  const result = await logoutUser(userId, refreshToken);
  clearAuthCookies(res);
  res.json(result);
});
  
export const refreshSession = asyncHandler(async (req, res) => {
  const rawToken = req.cookies.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken } = await refreshSessionService(
    rawToken,
    res
  );

  res.json({
    success: true,
    accessToken,
    refreshToken,
  });
});

// Verify email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const result = await verifyEmailService(token);

  if (result.alreadyVerified) {
    return res.json({ message: "Email already verified" });
  }

  res.json({ success: true, message: "Email verified successfully" });
});


// Resend verification
export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await resendVerificationService(email);

  if (result.alreadyVerified) {
    return res.json({ message: "User already verified" });
  }

  res.json({ success: true, message: "Verification email resent" });
});

// Password reset request

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordService(email);
  // Generic response (avoid enumeration)
  res.json({ success: true, message: "If an account exists, a reset link has been sent." });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  await resetPasswordService({ token, newPassword });
  res.json({ success: true, message: "Password has been reset. Please log in again." });
});