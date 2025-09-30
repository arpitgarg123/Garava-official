import ApiError from "../../shared/utils/ApiError.js";
import User from "../user/user.model.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import {
    generateAccessToken,
    generateEmailVerificationToken,
    generatePasswordResetToken,
    generateRefreshToken,
    setAuthCookies,
    verifyRefreshToken,
} from "./token.service.js";
import { sendPasswordResetEmail,sendVerificationEmail } from "../../shared/emails/email.service.js";
import { checkEmailRateLimit } from "../../shared/emails/emailRateLimiter.js";

export const loginUser = async (email, password) => {
  if (!email || !password) throw new ApiError(400, "Missing required fields");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return { accessToken, refreshToken, user: user.toJSON() };
};

export const signupUser = async ({ name, email, password}) => {
  if (!name || !email || !password) throw new ApiError(400, "Missing required fields");

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

  const newUser = await User.create({ name, email, password });

    // 3. Generate verification token
  const token = generateEmailVerificationToken(newUser);
  await checkEmailRateLimit(newUser._id);
  const result =  await sendVerificationEmail(newUser, token);
  console.log("Sent verification email:", result);
  return newUser.toJSON();
}; 

export const logoutUser = async (userId, refreshToken) => {
  if (!userId || !refreshToken) throw new Error("Missing required fields");

  const user = await User.findById(userId).select("+refreshTokens");
  if (!user) throw new Error("User not found");

  // Remove the specific refresh token using argon2.verify
  const filteredTokens = [];
  for (const tokenObj of user.refreshTokens) {
    const isMatch = await argon2.verify(tokenObj.token, refreshToken);
    if (!isMatch) {
      filteredTokens.push(tokenObj);
    }
  }
  user.refreshTokens = filteredTokens;
  await user.save();

  return { message: "Logged out successfully" };
};

export const refreshSessionService = async (rawToken, res) => {
  if (!rawToken) throw new ApiError(401, "No refresh token provided");

  // 1. Verify JWT validity
  const decoded = verifyRefreshToken(rawToken);
  if (!decoded) throw new ApiError(401, "Invalid or expired refresh token");

  // 2. Find user
  const user = await User.findById(decoded.id).select("+refreshTokens");
  if (!user) throw new ApiError(404, "User not found");

  // 3. Check against hashed tokens in DB
  const isValid = await user.verifyRefreshToken(rawToken);
  if (!isValid) throw new ApiError(401, "Refresh token not recognized");

  // 4. Rotate tokens (remove old, add new)
  // Remove the used refresh token using argon2.verify
  const filteredTokens = [];
  for (const tokenObj of user.refreshTokens) {
    const isMatch = await argon2.verify(tokenObj.token, rawToken);
    if (!isMatch) {
      filteredTokens.push(tokenObj);
    }
  }
  user.refreshTokens = filteredTokens;

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshTokens.push({ token: newRefreshToken });
  await user.save();

  // 5. Set cookies
  setAuthCookies(res, newAccessToken, newRefreshToken);

  return { 
    accessToken: newAccessToken, 
    refreshToken: newRefreshToken,
    user: user.toJSON() // Include user data for frontend state initialization
  };
};

// Verify email service
export const verifyEmailService = async (token) => {
  if (!token) throw new ApiError(400, "Verification token is missing");

  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new ApiError(404, "User not found");

    if (user.isVerified) {
      return { alreadyVerified: true };
    }

    user.isVerified = true;
    await user.save();

    return { alreadyVerified: false };
  } catch (err) {
    throw new ApiError(400, "Invalid or expired verification token");
  }
};

export const resendVerificationService = async (email) => {
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    return { alreadyVerified: true };
  }

  await checkEmailRateLimit(user._id);

  const token = generateEmailVerificationToken(user);
  await sendVerificationEmail(user, token);

  return { alreadyVerified: false };
};

// Password reset service

// 1) Forgot Password (send reset link)
export const forgotPasswordService = async (email) => {
  if (!email) throw new ApiError(400, "Email is required");

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  // Security: don't reveal if user exists. But for dev, we can throw.
  if (!user) {
    // In production you may prefer: return { sent: true };
    throw new ApiError(404, "User not found");
  }

  // Rate limit per user
  await checkEmailRateLimit(user._id);

  const token = generatePasswordResetToken(user);
  await sendPasswordResetEmail(user, token);

  return { sent: true };
};

// 2) Reset Password (uses token from email + new password)
export const resetPasswordService = async ({ token, newPassword }) => {
  if (!token) throw new ApiError(400, "Reset token is required");
  if (!newPassword || newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
  } catch (err) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const user = await User.findById(decoded.id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  // Set new password (your pre-save hook will hash it)
  user.password = newPassword;

  // Invalidate all sessions (log out everywhere)
  await user.invalidateAllSessions();

  return { reset: true };
};

// Google OAuth login/signup service
export const googleAuthService = async (user) => {
  console.log('Google Auth Service - Processing user:', user._id);
  
  // Ensure we have a proper Mongoose document with refreshTokens field
  let userDoc = user;
  if (!user.refreshTokens) {
    console.log('Google Auth Service - Refetching user with refreshTokens field');
    userDoc = await User.findById(user._id).select("+refreshTokens");
    if (!userDoc) {
      throw new ApiError(404, "User not found");
    }
  }
  
  const accessToken = generateAccessToken(userDoc);
  const refreshToken = generateRefreshToken(userDoc);

  // Add refresh token to user
  userDoc.refreshTokens.push({ token: refreshToken });
  await userDoc.save();

  console.log('Google Auth Service - Tokens generated for user:', userDoc._id);
  
  return { 
    accessToken, 
    refreshToken, 
    user: userDoc.toJSON(),
    isNewUser: userDoc.createdAt && (Date.now() - userDoc.createdAt.getTime()) < 5000 // Created within last 5 seconds
  };
};