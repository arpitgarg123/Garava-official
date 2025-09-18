// src/modules/user/user.service.js
import ApiError from "../../shared/utils/ApiError.js";
import User from "./user.model.js";

/**
 * Fetch current user profile by id.
 * - Returns a sanitized user object (no password / tokens).
 * - Throws ApiError(404) if user not found.
 *
 * @param {string} userId
 * @returns {Promise<Object>} sanitized user object
 */
export const getProfileService = async (userId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");

  // Use lean() for a plain object, or use model.toJSON() if you rely on schema methods.
  const user = await User.findById(userId).lean().select("-password -refreshTokens");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Optionally normalize/transform fields for client (e.g., expose id as 'id' instead of _id)
  // Convert _id to id
  user.id = user._id?.toString();
  delete user._id;
  delete user.__v;

  return user;
};
/**
 * Update profile info (name, phone).
 * @param {string} userId - Authenticated user's ID
 * @param {object} updates - Fields to update (allowed: name, phone)
 */
export const updateProfileService = async (userId, updates) => {
  if (!userId) throw new ApiError(401, "Unauthorized");

  const allowedUpdates = ["name", "phone"];
  const updateData = {};

  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) {
      updateData[key] = updates[key].trim ? updates[key].trim() : updates[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true, // return updated doc
    runValidators: true,
  }).select("-password -refreshTokens");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.toJSON ? user.toJSON() : user;
};


export const changePasswordService = async (userId, { oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both oldPassword and newPassword are required");
  }
  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters");
  }

  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const ok = await user.comparePassword(oldPassword);
  if (!ok) throw new ApiError(401, "Old password is incorrect");

  user.password = newPassword;     
  await user.invalidateAllSessions(); 

  return { changed: true };
};