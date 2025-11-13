// src/modules/order/order.utils.js
import mongoose from "mongoose";

/**
 * Generate human-friendly order number using an atomic counter per month.
 * Robust to driver option differences and ensures a document is returned.
 *
 * Result: GAR-202509-000123
 */
export const generateOrderNumber = async (prefix = "GAR") => {
  const Counters = mongoose.connection.collection("counters");
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `order_${year}${month}`;

  // Try modern driver option first, then fall back to legacy
  const update = {
    $inc: { seq: 1 },
    $setOnInsert: { createdAt: new Date() },
  };

  let res = null;

  try {
    // modern Node Mongo driver
    res = await Counters.findOneAndUpdate(
      { _id: key },
      update,
      { upsert: true, returnDocument: "after" } // preferred
    );
  } catch (err) {
    // If the option causes an error on older drivers, try legacy option
    try {
      res = await Counters.findOneAndUpdate(
        { _id: key },
        update,
        { upsert: true, returnOriginal: false } // fallback
      );
    } catch (err2) {
      // last-resort: do an upsert then fetch
      await Counters.updateOne({ _id: key }, { $inc: { seq: 1 }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
      res = { value: await Counters.findOne({ _id: key }) };
    }
  }

  // If for any reason res or res.value is falsy, re-query
  if (!res || !res.value) {
    const doc = await Counters.findOne({ _id: key });
    if (!doc) {
      // create initial counter if missing
      await Counters.insertOne({ _id: key, seq: 1, createdAt: new Date() });
      return `${prefix}-${year}${month}-${String(1).padStart(6, "0")}`;
    }
    res = { value: doc };
  }

  const seq = typeof res.value.seq === "number" ? res.value.seq : Number(res.value.seq || 0);
  const seqStr = String(seq).padStart(6, "0");
  return `${prefix}-${year}${month}-${seqStr}`;
};

/**
 * Money helper - Convert rupees to paise for payment gateways
 * Orders store amounts in RUPEES, but PhonePe requires PAISE
 */
export const toPaise = (amount) => {
  if (amount == null) return 0;
  // Always convert rupees to paise (multiply by 100)
  // Orders are stored in rupees as per architecture
  return Math.round(Number(amount) * 100);
};
