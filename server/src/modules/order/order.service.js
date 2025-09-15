// src/modules/order/order.service.js
import mongoose from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";
import Product from "../product/product.model.js";
import Order from "./order.model.js";
import User from "../user/user.model.js";
import { generateOrderNumber, toPaise } from "./order.utils.js";
import Idempotency from "./idempotency.model.js"; // optional
import { createRazorpayOrder } from "../payment.adapters/razorpay.adapter.js";


/**
 * Helper: normalize amount: assume incoming variant.price is paise already.
 * If your variant.price is stored as rupees, convert here.
 */
const ensurePaise = (value) => {
  // if value >= 1e5 (e.g., 120000) treat as paise; if fractional or small treat as rupees
  if (Number.isInteger(value)) return value;
  return toPaise(value);
};


/**
 * Create Order Service (transactional)
 * - items: [{ variantId OR sku, quantity }]
 * - shippingAddress: object
 * - paymentMethod: 'razorpay'|'cod'
 * - idempotencyKey: optional
 *
 * Important: requires Mongo replica set for transactions.
 */
export const createOrderService = async ({ userId, items, shippingAddress, paymentMethod, idempotencyKey }) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, "No items provided");

  // simple idempotency pre-check (non-transactional quick path)
  if (idempotencyKey) {
    const mapped = await Idempotency.findOne({ key: idempotencyKey }).lean();
    if (mapped && mapped.orderId) {
      const existing = await Order.findById(mapped.orderId).lean();
      if (existing) return { order: existing, gatewayOrder: null, reused: true };
    }
  }

  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(404, "User not found");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lineItems = [];
    let subtotalPaise = 0;

    // Reserve stock (atomic decrement) and build snapshots
    for (const it of items) {
      // resolve product + variant
      let product;
      let variant;
      if (it.variantId) {
        product = await Product.findOne({ "variants._id": it.variantId }).session(session);
        if (!product) throw new ApiError(404, "Product not found");
        variant = product.variants.id(it.variantId);
      } else if (it.sku) {
        product = await Product.findOne({ "variants.sku": it.sku }).session(session);
        if (!product) throw new ApiError(404, "Product not found");
        variant = product.variants.find(v => v.sku === it.sku);
      } else {
        throw new ApiError(400, "variantId or sku required");
      }

      if (!variant) throw new ApiError(404, "Variant not found");

      // stock check + decrement atomically using session
      const upd = await Product.findOneAndUpdate(
        { _id: product._id, "variants._id": variant._id, "variants.stock": { $gte: it.quantity } },
        { $inc: { "variants.$.stock": -it.quantity } },
        { new: true, session }
      );
      if (!upd) throw new ApiError(400, `Insufficient stock for ${variant.sku}`);

      // determine unit price in paise; assume variant.price already stored in paise.
      const unitPricePaise = ensurePaise(variant.price);
      const mrpPaise = variant.mrp ? ensurePaise(variant.mrp) : 0;
      const lineTotal = unitPricePaise * Number(it.quantity);

      subtotalPaise += lineTotal;

      lineItems.push({
        product: product._id,
        productSnapshot: {
          name: product.name,
          slug: product.slug,
          heroImage: product.heroImage?.url || product.heroImage || null,
          type: product.type || null
        },
        variantId: variant._id,
        variantSnapshot: { sku: variant.sku, sizeLabel: variant.sizeLabel, images: variant.images || [] },
        quantity: Number(it.quantity),
        unitPrice: unitPricePaise,
        mrp: mrpPaise,
        taxAmount: 0,
        discountAmount: 0,
        lineTotal
      });
    } // end items loop

    // compute shipping, tax, discounts (paise)
    const shippingTotal = 0; // implement later
    const taxTotal = 0;
    const discountTotal = 0;
    const grandTotalPaise = subtotalPaise + shippingTotal + taxTotal - discountTotal;

    // create order doc inside transaction
    const orderNumber = await generateOrderNumber();
    const [created] = await Order.create([{
      orderNumber,
      user: userId,
      userSnapshot: { name: user.name, email: user.email, phone: user.phone },
      items: lineItems,
      subtotal: subtotalPaise,
      taxTotal,
      shippingTotal,
      discountTotal,
      grandTotal: grandTotalPaise,
      currency: "INR",
      shippingAddress,
      payment: { method: paymentMethod, status: paymentMethod === "cod" ? "unpaid" : "pending" },
      status: paymentMethod === "cod" ? "processing" : "pending_payment",
      idempotencyKey,
      history: [{ status: paymentMethod === "cod" ? "processing" : "pending_payment", by: userId, at: new Date() }]
    }], { session });

    // record idempotency mapping (unique index on key recommended)
    if (idempotencyKey) {
      await Idempotency.create([{ key: idempotencyKey, orderId: created._id }], { session });
    }

    // commit transaction BEFORE creating external gateway order (best practice)
    await session.commitTransaction();
    session.endSession();

    // If online payment, create gateway order AFTER commit (so external system references persistent order)
    let gatewayOrder = null;
    if (paymentMethod === "razorpay") {
      // grandTotalPaise is already paise
      gatewayOrder = await createRazorpayOrder({
        amountPaise: grandTotalPaise,
        currency: "INR",
        receipt: String(created._id),
        notes: { orderId: String(created._id) }
      });

      // attach gatewayOrderId to order (non-transactional update permitted)
      await Order.findByIdAndUpdate(created._id, { $set: { "payment.gatewayOrderId": gatewayOrder.id } });
    }

    // return fresh order
    const order = await Order.findById(created._id).lean();
    return { order, gatewayOrder };
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    session.endSession();
    throw err;
  }
};
/**
 * Extend your existing getUserOrdersService to use the new Order model
 */
export const getUserOrdersService = async (userId, page = 1, limit = 10) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments({ user: userId })
  ]);

  // mask sensitive fields if any
  return {
    orders,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

export const getOrderByIdService = async (userId, orderId) => {
  const order = await Order.findById(orderId).lean();
  if (!order) throw new ApiError(404, "Order not found");
  if (String(order.user) !== String(userId)) throw new ApiError(403, "Forbidden");
  return order;
};
