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

  // idempotency quick return
  if (idempotencyKey) {
    const idem = await Idempotency.findOne({ key: idempotencyKey }).lean();
    if (idem && idem.orderId) {
      const existing = await Order.findById(idem.orderId);
      if (existing) return { order: existing };
    }
  }

  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(404, "User not found");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lineItems = [];
    let subtotal = 0; // paise

    for (const it of items) {
      let product, variant;
      if (it.variantId) {
        product = await Product.findOne({ "variants._id": it.variantId }).session(session);
        variant = product?.variants.id(it.variantId);
      } else if (it.sku) {
        product = await Product.findOne({ "variants.sku": it.sku }).session(session);
        variant = product?.variants.find(v => v.sku === it.sku);
      } else {
        throw new ApiError(400, "variantId or sku required");
      }
      if (!product || !variant) throw new ApiError(404, "Variant not found");

      // Stock check & reserve (atomic)
      const dec = await Product.findOneAndUpdate(
        { _id: product._id, "variants._id": variant._id, "variants.stock": { $gte: it.quantity } },
        { $inc: { "variants.$.stock": -it.quantity } },
        { session, new: true }
      );
      if (!dec) throw new ApiError(400, `Insufficient stock for ${variant.sku}`);

      // convert price to paise
      const unitPricePaise = toPaise(variant.price);
      const lineTotal = unitPricePaise * it.quantity;
      subtotal += lineTotal;

      lineItems.push({
        product: product._id,
        productSnapshot: { name: product.name, slug: product.slug, heroImage: product.heroImage, type: product.type },
        variantId: variant._id,
        variantSnapshot: { sku: variant.sku, sizeLabel: variant.sizeLabel, images: variant.images || [] },
        quantity: it.quantity,
        unitPricePaise,
        mrpPaise: toPaise(variant.mrp || 0),
        taxAmountPaise: 0,
        discountAmountPaise: 0,
        lineTotalPaise: lineTotal,
      });
    }

    // compute totals (all paise)
    const shippingTotalPaise = 0;
    const taxTotalPaise = 0;
    const discountTotalPaise = 0;
    const grandTotalPaise = subtotal + shippingTotalPaise + taxTotalPaise - discountTotalPaise;

    const orderNumber = await generateOrderNumber();
    const createdArr = await Order.create([{
      orderNumber,
      user: userId,
      userSnapshot: { name: user.name, email: user.email, phone: user.phone },
      items: lineItems,
      subtotalPaise: subtotal,
      taxTotalPaise,
      shippingTotalPaise,
      discountTotalPaise,
      grandTotalPaise,
      currency: "INR",
      shippingAddress,
      payment: { method: paymentMethod, status: paymentMethod === "cod" ? "unpaid" : "pending" },
      status: paymentMethod === "cod" ? "processing" : "pending_payment",
      idempotencyKey,
      history: [{ status: paymentMethod === "cod" ? "processing" : "pending_payment", by: userId, at: new Date() }],
    }], { session });

    const createdOrder = createdArr[0];

    if (idempotencyKey) {
      await Idempotency.create([{ key: idempotencyKey, orderId: createdOrder._id }], { session });
    }

    // commit transaction BEFORE calling Razorpay
    await session.commitTransaction();
    session.endSession();

    // If online payment, create Razorpay order AFTER commit
    let gatewayOrder = null;
    if (paymentMethod === "razorpay") {
      const rpOrder = await createRazorpayOrder({
        amountPaise: createdOrder.grandTotalPaise,
        currency: "INR",
        receipt: createdOrder._id,
        notes: { orderNumber }
      });
      // Save gateway order id on order
      createdOrder.payment.gatewayOrderId = rpOrder.id;
      await createdOrder.save();
      gatewayOrder = rpOrder;
    }

    return { order: createdOrder, gatewayOrder };
  } catch (err) {
    await session.abortTransaction();
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
