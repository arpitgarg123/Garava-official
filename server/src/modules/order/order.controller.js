// src/modules/order/order.controller.js
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./order.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import { verifyPhonePeCallback, checkPhonePePaymentStatus } from "../payment.adapters/phonepe.adapter.js";
import Order from "./order.model.js";

/**
 * POST /api/orders/checkout
 * Body: { items, addressId, paymentMethod }
 * Header: Idempotency-Key optional
 * Updated for PhonePe integration
 */
export const checkout = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { items, addressId, paymentMethod } = req.body;
  const idempotencyKey = req.headers["idempotency-key"] || req.body.idempotencyKey;
  if (!items || !Array.isArray(items) || items.length === 0) throw new ApiError(400, "No items");
  if (!addressId) throw new ApiError(400, "Address ID is required");

  // First create the order
  const result = await service.createOrderService({ userId, items, addressId, paymentMethod, idempotencyKey });
  
  let gatewayOrder = null;
  
  // If PhonePe payment, initialize payment gateway
  if (paymentMethod === "phonepe") {
    try {
      gatewayOrder = await service.initializePhonePePayment(result.order, req.user?.phone);
    } catch (error) {
      // PhonePe initialization failed, but order is created
      // Return order with error details for better user experience
      return res.status(201).json({ 
        success: true, 
        order: result.order, 
        gatewayOrder: null,
        paymentError: error.message 
      });
    }
  }
  
  res.status(201).json({ success: true, order: result.order, gatewayOrder });
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
 * Payment webhook (PhonePe)
 * - Route: POST /webhooks/payments/phonepe
 */
export const paymentWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-verify"];
  const payload = req.body;

  // Verify PhonePe callback signature
  const isValid = verifyPhonePeCallback(JSON.stringify(payload), signature);
  if (!isValid) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const response = payload.response;
  const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());
  
  const transactionId = decodedResponse.data?.merchantTransactionId;
  const paymentState = decodedResponse.data?.state;
  const amount = decodedResponse.data?.amount;

  if (!transactionId) {
    return res.status(400).json({ success: false, message: "Missing transaction ID" });
  }

  // Find order by gatewayOrderId (which is the transactionId)
  const order = await Order.findOne({ 
    $or: [
      { "payment.gatewayOrderId": transactionId },
      { "payment.gatewayTransactionId": transactionId }
    ]
  });

  if (!order) {
    console.error("Order not found for transaction ID:", transactionId);
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  // Ignore if already processed
  if (order.payment && order.payment.status === "paid" && paymentState === "COMPLETED") {
    return res.json({ success: true, message: "Already processed" });
  }

  // Handle payment completion
  if (paymentState === "COMPLETED") {
    order.payment.gatewayPaymentId = decodedResponse.data?.transactionId || transactionId;
    order.payment.status = "paid";
    order.payment.paidAt = new Date();
    order.payment.gatewayPaymentStatus = paymentState;
    order.payment.providerResponse = decodedResponse;
    order.status = "processing"; // move to processing for fulfillment
    order.history = order.history || [];
    order.history.push({ 
      status: "paid", 
      by: null, 
      note: `Payment completed via PhonePe - ${transactionId}`, 
      at: new Date() 
    });

    await order.save();
    console.log("Payment completed for order:", order.orderNumber);
    return res.json({ success: true, message: "Payment completed" });
  }

  // Handle payment failure
  if (paymentState === "FAILED") {
    order.payment.status = "failed";
    order.payment.providerResponse = decodedResponse;
    order.status = "failed";
    order.history = order.history || [];
    order.history.push({ 
      status: "failed", 
      by: null, 
      note: `Payment failed via PhonePe - ${transactionId}`, 
      at: new Date() 
    });

    await order.save();
    console.log("Payment failed for order:", order.orderNumber);
    return res.json({ success: true, message: "Payment failed" });
  }

  // Handle pending/other states
  console.log("Received PhonePe callback with state:", paymentState);
  return res.json({ success: true, message: "Callback received" });
});

/**
 * Check payment status manually
 * POST /api/orders/:orderId/payment-status
 */
export const checkPaymentStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user owns this order
  if (String(order.user) !== String(userId)) {
    throw new ApiError(403, "Unauthorized to access this order");
  }

  // If payment is already completed, return current status
  if (order.payment.status === "paid" || order.status === "processing") {
    return res.json({ 
      success: true, 
      paymentStatus: "completed",
      order: order 
    });
  } 
 
  // Check with PhonePe if we have a transaction ID
  if (order.payment.gatewayTransactionId) {
    try {
      console.log('🔍 Checking payment status for transaction:', order.payment.gatewayTransactionId);
      const statusResponse = await checkPhonePePaymentStatus(order.payment.gatewayTransactionId);
      console.log('📄 PhonePe status response:', statusResponse);
      
      // Update order if payment status changed - Handle both real PhonePe and simulator responses
      if ((statusResponse.paymentStatus === "COMPLETED" || statusResponse.paymentStatus === "PAYMENT_SUCCESS") && order.payment.status !== "paid") {
        console.log('✅ Updating order to paid status');
        order.payment.status = "paid";
        order.payment.paidAt = new Date();
        order.payment.gatewayPaymentStatus = statusResponse.paymentStatus;
        order.payment.providerResponse = statusResponse.rawResponse;
        order.status = "processing";
        order.history.push({
          status: "paid",
          by: null,
          note: `Payment status updated - ${order.payment.gatewayTransactionId}`,
          at: new Date()
        });
        await order.save();
      }

      return res.json({
        success: true,
        paymentStatus: (statusResponse.paymentStatus === "COMPLETED" || statusResponse.paymentStatus === "PAYMENT_SUCCESS") ? "completed" : "pending",
        order: order
      });

    } catch (error) {
      console.error("Error checking PhonePe payment status:", error.message);
      return res.json({
        success: true,
        paymentStatus: "unknown",
        order: order,
        error: "Unable to verify payment status"
      });
    }
  }

  return res.json({
    success: true,
    paymentStatus: order.payment.status,
    order: order
  });
});
