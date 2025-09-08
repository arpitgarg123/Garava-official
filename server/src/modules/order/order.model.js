// src/modules/order/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // for faster queries
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // snapshot of product price
      },
    ],
    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentInfo: {
      method: { type: String }, // "razorpay", "stripe"
      transactionId: { type: String }, // safe to show (non-sensitive)
      status: { type: String, default: "unpaid" },
      // ⚠️ Do NOT store card details or CVV
    },
  },
  { timestamps: true }
);

// Compound index for user + createdAt (query speedup)
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
