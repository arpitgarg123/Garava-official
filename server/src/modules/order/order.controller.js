// src/modules/order/order.controller.js
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./order.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import { verifyRazorpaySignature } from "../payment.adapters/razorpay.adapter.js";

/**
 * POST /api/orders/checkout
 * Body: { items, shippingAddress, paymentMethod }
 * Header: Idempotency-Key optional
 */
export const checkout = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { items, shippingAddress, paymentMethod } = req.body;
  const idempotencyKey = req.headers["idempotency-key"] || req.body.idempotencyKey;
  if (!items || !Array.isArray(items) || items.length === 0) throw new ApiError(400, "No items");

  const result = await service.createOrderService({ userId, items, shippingAddress, paymentMethod, idempotencyKey });
  // result: { order, gatewayOrder } where gatewayOrder is optional
  res.status(201).json({ success: true, ...result });
});

/**
 * GET /api/user/orders
 */
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const data = await service.getUserOrdersService(userId, page, limit);
  res.json({ success: true, ...data });
});

/**
 * GET /api/user/orders/:orderId
 */
export const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const orderId = req.params.orderId;
  const order = await service.getOrderByIdService(userId, orderId);
  res.json({ success: true, order });
});

/**
 * Payment webhook (Razorpay)
 * - Ensure raw body is available in req.rawBody for signature verification
 * - Route: POST /webhooks/payments/razorpay
 */
export const paymentWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const ok = verifyRazorpaySignature(req.rawBody, sig, secret);
  if (!ok) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const payload = req.body; // parsed JSON; raw in req.rawBody was used for verification
  const event = payload.event;

  // handle payment.captured (common)
  if (event === "payment.captured") {
    const paymentEntity = payload.payload.payment.entity;
    const gatewayOrderId = paymentEntity.order_id;
    const gatewayPaymentId = paymentEntity.id;

    // Find order by gatewayOrderId - idempotent update
    const order = await Order.findOne({ "payment.gatewayOrderId": gatewayOrderId });
    if (!order) {
      // optionally: search by receipt notes if you stored createdOrder._id in notes
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Ignore if already paid
    if (order.payment && order.payment.status === "paid") {
      return res.json({ success: true, message: "Already processed" });
    }

    order.payment.gatewayPaymentId = gatewayPaymentId;
    order.payment.status = "paid";
    order.payment.paidAt = new Date();
    order.payment.gatewayPaymentStatus = paymentEntity.status;
    order.payment.providerResponse = paymentEntity;
    order.status = "processing"; // move to processing for fulfillment
    order.history = order.history || [];
    order.history.push({ status: "paid", by: null, note: `Payment captured ${gatewayPaymentId}`, at: new Date() });

    await order.save();

    // enqueue fulfillment/email job here if needed
    return res.json({ success: true });
  }

  // event: payment.failed
  if (event === "payment.failed") {
    const paymentEntity = payload.payload.payment.entity;
    const gatewayOrderId = paymentEntity.order_id;
    const order = await Order.findOne({ "payment.gatewayOrderId": gatewayOrderId });
    if (!order) return res.json({ success: true });
    order.payment.status = "failed";
    order.payment.providerResponse = paymentEntity;
    order.history.push({ status: "payment_failed", by: null, note: "Payment failed", at: new Date() });
    await order.save();
    return res.json({ success: true });
  }

  // respond OK for other events
  return res.json({ success: true });
});
