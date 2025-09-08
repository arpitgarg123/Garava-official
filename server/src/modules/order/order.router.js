// src/modules/order/order.routes.js
import { Router } from "express";
import { getUserOrders } from "./order.controller.js";
import { authenticated } from "../../middlewares/authentication.js";

const router = Router();

// GET /api/user/orders
router.get("/user/orders", authenticated, getUserOrders);

export default router;
