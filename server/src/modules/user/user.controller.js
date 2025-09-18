
// src/modules/user/user.controller.js
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { changePasswordService, getProfileService, updateProfileService } from "./user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const user = await getProfileService(userId);

  res.json({
    success: true,
    user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const updates = req.body;

  const updatedUser = await updateProfileService(userId, updates);

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.id; // set by your authenticated middleware
  const { oldPassword, newPassword } = req.body;

  await changePasswordService(userId, { oldPassword, newPassword });
  res.json({ success: true, message: "Password changed successfully. Please log in again." });
});
