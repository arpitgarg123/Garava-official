
// src/modules/user/user.controller.js
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { changePasswordService } from "./user.service.js";

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.id; // set by your authenticated middleware
  const { oldPassword, newPassword } = req.body;

  await changePasswordService(userId, { oldPassword, newPassword });
  res.json({ success: true, message: "Password changed successfully. Please log in again." });
});
