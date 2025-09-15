// src/modules/payment.adapters/razorpay.adapter.js
import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Verify razorpay signature for incoming webhook
 * @param {string} rawBody - exact raw string sent by gateway (req.rawBody)
 * @param {string} headerSignature - req.headers['x-razorpay-signature']
 * @param {string} secret - your webhook secret
 * @returns {boolean}
 */


const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create razorpay order for the given amount (in paise)
 */
export const createRazorpayOrder = async ({ amountPaise, currency = "INR", receipt }) => {
  const payload = {
    amount: amountPaise,
    currency,
    receipt,
    payment_capture: 1 // auto-capture
  };
  const order = await razor.orders.create(payload);
  return order; // order.id, amount, currency, etc
};

/**
 * Verify webhook signature
 */
export const verifyRazorpaySignature = (rawBody, headerSignature, secret) => {
  if (!rawBody || !headerSignature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  return expected === headerSignature;
};

/**
 * Verify payment signature on client callback (if using client-side)
 */
export const verifyPaymentSignature = ({ order_id, payment_id, signature }, keySecret) => {
  const hmac = crypto.createHmac("sha256", keySecret).update(order_id + "|" + payment_id).digest("hex");
  return hmac === signature;
};

/**
 * Refund stub (implement as needed)
 */
export const refundPayment = async ({ paymentId, amountPaise }) => {
  // e.g., razor.payments.refund(paymentId, { amount: amountPaise })
  return await razor.payments.refund(paymentId, { amount: amountPaise });
};

export default razor;
