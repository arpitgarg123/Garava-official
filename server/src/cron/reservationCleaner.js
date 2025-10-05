// src/cron/reservationCleaner.js
import mongoose from "mongoose";
import Order from "../modules/order/order.model.js";
import Product from "../modules/product/product.model.js";
import { logger } from "../shared/logger.js";

const TTL_MIN = parseInt(process.env.RESERVATION_TTL_MINUTES || "15", 10);

export const expirePendingOrders = async () => {
  const cutoff = new Date(Date.now() - TTL_MIN * 60 * 1000);
  const orders = await Order.find({ status: "pending_payment", createdAt: { $lt: cutoff } }).lean();

  for (const o of orders) { 
    try {  
      // restore stock atomically per product/variant
      for (const it of o.items) {
        await Product.findOneAndUpdate(
          { _id: it.product, "variants._id": it.variantId },
          { $inc: { "variants.$.stock": it.quantity } }
        );
      }  
      await Order.findByIdAndUpdate(o._id, { status: "expired", history: [...(o.history||[]), { status: "expired", by: null, note: "Reservation TTL expired", at: new Date() }] });
      logger.info("Expired order", { orderId: o._id });
      // optionally notify user by email
    } catch (err) {
      logger.error("Failed to expire order", { orderId: o._id, err: err.message });
    }
  }
};

// simple runner for cron (if you use node-cron or set up a separate worker)
import cron from "node-cron";
export const startReservationCleaner = () => {
  // run every minute
  cron.schedule("* * * * *", async () => {
    try { await expirePendingOrders(); } catch (e) { logger.error("Reservation cleaner failed", e); }
  });
};
