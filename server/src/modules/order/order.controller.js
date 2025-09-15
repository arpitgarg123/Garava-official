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
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const header = req.headers["x-razorpay-signature"];
  // verify signature (make sure your express setup preserved raw body)
  const ok = verifyRazorpaySignature(req.rawBody, header, secret);
  
  if (!ok) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const payload = req.body;
  // handle event types: payment.captured / payment.failed / order.paid etc.
  // Keep it simple: on payment.captured find order by payload.payload.payment.entity.order_id or payload.payload.payment.entity.notes.receipt
  const event = payload.event;

  if (event === "payment.captured") {
    const paymentEntity = payload.payload.payment.entity;
    // gatewayOrderId is order_id
    const gatewayOrderId = paymentEntity.order_id;
    const gatewayPaymentId = paymentEntity.id;
    // find order by gatewayOrderId
    const order = await Order.findOne({ "payment.gatewayOrderId": gatewayOrderId });
    if (!order) {
      // optionally search by receipt mapping - depends on how you set receipt
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.payment.gatewayPaymentId = gatewayPaymentId;
    order.payment.status = "paid";
    order.payment.paidAt = new Date();
    order.payment.providerResponse = paymentEntity;
    order.status = "paid";
    order.history.push({ status: "paid", by: null, note: `Payment captured ${gatewayPaymentId}`, at: new Date() });
    await order.save();

    // enqueue email notification/job here (not implemented)
    return res.json({ success: true });
  }

  // other events...
  return res.json({ success: true });
});
