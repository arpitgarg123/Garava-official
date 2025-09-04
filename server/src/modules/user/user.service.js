// src/modules/user/user.service.js
import ApiError from "../../shared/utils/ApiError.js";
import User from "./user.model.js";

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