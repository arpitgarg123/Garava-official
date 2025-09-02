import ApiError from "../../shared/utils/ApiError.js";
import User from "../user/user.model.js";
import  argon2 from "argon2";

import {
    generateAccessToken,
    generateRefreshToken,
    setAuthCookies,
    verifyRefreshToken,
} from "./token.service.js";

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

  return newUser.toJSON();
};

export const logoutUser = async (userId, refreshToken) => {
  if (!userId || !refreshToken) throw new Error("Missing required fields");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.refreshTokens = user.refreshTokens.filter(
    (t) => t.token !== refreshToken
  );
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
  user.refreshTokens = await Promise.all(
    user.refreshTokens.filter(
      async (t) => !(await argon2.verify(t.token, rawToken))
    )
  );

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshTokens.push({ token: newRefreshToken });
  await user.save();

  // 5. Set cookies
  setAuthCookies(res, newAccessToken, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
