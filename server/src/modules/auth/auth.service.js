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

  // Normalize email for consistent lookup
  const normalizedEmail = email.toLowerCase().trim();

  // Optimize query - only select password field for verification
  const user = await User.findOne({ email: normalizedEmail })
    .select("+password")
    .lean({ virtuals: false }); // Use lean for better performance
    
  if (!user) {
    console.log(`⚠️ Login attempt failed: No user found with email: ${normalizedEmail}`);
    throw new ApiError(404, "Invalid email or password");
  }

  // Convert back to mongoose document for method access
  const userDoc = await User.findById(user._id).select("+password +refreshTokens");
  
  const isValid = await userDoc.comparePassword(password);
  if (!isValid) {
    console.log(`⚠️ Login attempt failed: Invalid password for email: ${normalizedEmail}`);
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(userDoc);
  const refreshToken = generateRefreshToken(userDoc);

  // Clean up old refresh tokens (keep only last 4 + new one = 5 total)
  if (userDoc.refreshTokens.length >= 5) {
    userDoc.refreshTokens = userDoc.refreshTokens.slice(-4);
  }
  
  userDoc.refreshTokens.push({ 
    token: refreshToken,
    createdAt: new Date()
  });
  await userDoc.save();

  return { accessToken, refreshToken, user: userDoc.toJSON() };
};

export const signupUser = async ({ name, email, password}) => {
  if (!name || !email || !password) throw new ApiError(400, "Missing required fields");

  // Normalize email for consistency
  const normalizedEmail = email.toLowerCase().trim();
  
  // Optimize query - use lean for faster existence check
  const existingUser = await User.findOne({ email: normalizedEmail })
    .select('_id')
    .lean();
    
  if (existingUser) throw new ApiError(409, "User already exists");

  const newUser = await User.create({ 
    name: name.trim(), 
    email: normalizedEmail, 
    password,
    refreshTokens: [] // Initialize empty array
  });

  // 3. Generate verification token
  const token = generateEmailVerificationToken(newUser);
  await checkEmailRateLimit(newUser._id);
  
  // Send verification email with error handling
  try {
    const result = await sendVerificationEmail(newUser, token);
    console.log("✅ Sent verification email:", result);
  } catch (emailError) {
    console.error('⚠️ Verification email failed but continuing signup:', emailError.message);
    // Don't throw - user is created, they can resend verification later
  }
  
  return newUser.toJSON();
}; 

export const logoutUser = async (userId, refreshToken) => {
  if (!userId || !refreshToken) throw new Error("Missing required fields");

  // Optimize query - only select refreshTokens field
  const user = await User.findById(userId).select("+refreshTokens");
  if (!user) throw new Error("User not found");

  // Remove the specific refresh token using argon2.verify
  const filteredTokens = [];
  for (const tokenObj of user.refreshTokens) {
    try {
      const isMatch = await argon2.verify(tokenObj.token, refreshToken);
      if (!isMatch) {
        filteredTokens.push(tokenObj);
      }
    } catch (error) {
      // If verification fails, keep the token (might be valid for other sessions)
      filteredTokens.push(tokenObj);
    }
  }
  
  user.refreshTokens = filteredTokens;
  await user.save();

  console.log('LogoutUser - Removed refresh token. User now has', filteredTokens.length, 'tokens');
  return { message: "Logged out successfully" };
};

export const refreshSessionService = async (rawToken, res) => {
  if (!rawToken || typeof rawToken !== 'string') {
    throw new ApiError(401, "No refresh token provided");
  }

  console.log('RefreshSessionService - Starting with token length:', rawToken.length);

  // 1. Verify JWT validity
  const decoded = verifyRefreshToken(rawToken);
  if (!decoded || !decoded.id) {
    console.log('RefreshSessionService - JWT verification failed');
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  console.log('RefreshSessionService - JWT valid for user:', decoded.id);

  // 2. Find user with better error handling
  const user = await User.findById(decoded.id).select("+refreshTokens");
  if (!user) {
    console.log('RefreshSessionService - User not found:', decoded.id);
    throw new ApiError(404, "User not found");
  }

  console.log('RefreshSessionService - User found, checking tokens. User has', user.refreshTokens?.length || 0, 'refresh tokens');

  // 3. Check against hashed tokens in DB with better debugging
  let tokenFoundInDB = false;
  let matchingTokenIndex = -1;
  
  for (let i = 0; i < user.refreshTokens.length; i++) {
    const tokenObj = user.refreshTokens[i];
    try {
      const isMatch = await argon2.verify(tokenObj.token, rawToken);
      if (isMatch) {
        tokenFoundInDB = true;
        matchingTokenIndex = i;
        break;
      }
    } catch (verifyError) {
      console.log('RefreshSessionService - Error verifying token at index', i, ':', verifyError.message);
    }
  }
  
  if (!tokenFoundInDB) {
    console.log('RefreshSessionService - Token not found in database. User has', user.refreshTokens.length, 'stored tokens');
    throw new ApiError(401, "Refresh token not recognized");
  }

  console.log('RefreshSessionService - Token verified, rotating tokens');

  // 4. Rotate tokens (remove old, add new) - More efficient approach
  // Remove the used refresh token
  user.refreshTokens.splice(matchingTokenIndex, 1);

  // Generate new tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Add new refresh token
  user.refreshTokens.push({ 
    token: newRefreshToken,
    createdAt: new Date()
  });
  
  // Clean up old tokens (keep only last 5)
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }
  
  await user.save();

  console.log('RefreshSessionService - Tokens rotated successfully. User now has', user.refreshTokens.length, 'tokens');

  // 5. Set cookies
  setAuthCookies(res, newAccessToken, newRefreshToken);

  return { 
    accessToken: newAccessToken, 
    refreshToken: newRefreshToken,
    user: user.toJSON()
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
  
  // Send email with proper error handling
  try {
    await sendVerificationEmail(user, token);
    console.log('✅ Verification email sent successfully to:', user.email);
  } catch (emailError) {
    console.error('⚠️ Email sending failed but continuing:', emailError.message);
    // Don't throw - email sent even if there are warnings
  }

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
  
  // Send email with proper error handling
  try {
    await sendPasswordResetEmail(user, token);
    console.log('✅ Password reset email sent successfully to:', user.email);
  } catch (emailError) {
    console.error('⚠️ Email sending failed but continuing:', emailError.message);
    // Don't throw - email sent even if there are warnings
    // The email was sent, just log the error
  }

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