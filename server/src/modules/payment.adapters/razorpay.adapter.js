import Razorpay from "razorpay";
import crypto from "crypto";

const client = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order
 * amountPaise: integer
 */
export const createRazorpayOrder = async ({ amountPaise, currency = "INR", receipt, notes = {} }) => {
  const payload = {
    amount: amountPaise,
    currency,
    receipt: String(receipt),
    payment_capture: 1, // auto capture
    notes,
  };
  const order = await client.orders.create(payload);
  return order;
};

export const refundRazorpayPayment = async ({ paymentId, amountPaise, notes = {} }) => {
  const res = await client.payments.refund(paymentId, { amount: amountPaise, notes });
  return res;
};

/**
 * Verify Razorpay webhook signature
 * req.rawBody must be preserved (see express setup)
 */
export const verifyRazorpaySignature = (rawBody, signature, webhookSecret) => {
  if (!rawBody || !signature || !webhookSecret) return false;
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody, "utf8").digest("hex");
  return expected === signature;
};
