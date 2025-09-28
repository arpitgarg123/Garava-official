// src/modules/order/order.routes.js
import { Router } from "express";
import { authenticated } from "../../middlewares/authentication.js";
import { checkout, getUserOrders, getOrder, paymentWebhook, checkPaymentStatus } from "./order.controller.js";

const router = Router();

// user endpoints
router.post("/checkout", authenticated, checkout);
router.get("/", authenticated, getUserOrders);
router.get("/:orderId", authenticated, getOrder);
router.post("/:orderId/payment-status", authenticated, checkPaymentStatus);

// webhook (public) - updated for PhonePe
router.post("/webhooks/payments/phonepe", paymentWebhook);

export default router; 
  