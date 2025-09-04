// src/modules/user/user.routes.js
import {Router} from "express";
import { authenticated } from "../../middlewares/authentication";
import { changePassword } from "./user.controller";

const router = Router();

router.post("/change-password", authenticated, changePassword);

export default router;
