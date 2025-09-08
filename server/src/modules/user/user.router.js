// src/modules/user/user.routes.js
import {Router} from "express";
import { authenticated } from "../../middlewares/authentication.js";
import { changePassword, getProfile, updateProfile } from "./user.controller.js";

const router = Router();

router.get("/profile", authenticated, getProfile);
router.put("/profile/update", authenticated, updateProfile);
router.post("/change-password", authenticated, changePassword);

export default router;
