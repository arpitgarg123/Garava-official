// src/modules/order/order.routes.js
import { Router } from "express";
import { authenticated } from "../../middlewares/authentication.js";
import { checkout, getUserOrders, getOrder, paymentWebhook } from "./order.controller.js";

const router = Router();

// user endpoints
router.post("/checkout", authenticated, checkout);
router.get("/", authenticated, getUserOrders);
router.get("/:orderId", authenticated, getOrder);

// webhook (public)
router.post("/webhooks/payments/razorpay", paymentWebhook);

export default router; 
  