// src/modules/order/idempotency.model.js
import mongoose from "mongoose";

const IdempotencySchema = new mongoose.Schema({
  key: { type: String, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  createdAt: { type: Date, default: Date.now, index: { expires: '7d' } }, // auto-expire
});

export default mongoose.model("Idempotency", IdempotencySchema);
