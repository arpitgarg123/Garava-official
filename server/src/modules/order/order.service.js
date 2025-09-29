// src/modules/order/order.service.js
import mongoose from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";
import Product from "../product/product.model.js";
import Order from "./order.model.js";
import User from "../user/user.model.js";
import Address from "../address/address.model.js";
import { generateOrderNumber, toPaise } from "./order.utils.js";
import Idempotency from "./idempotency.model.js"; // optional
import { createPhonePeOrder } from "../payment.adapters/phonepe.adapter.js";
import { calculateOrderPricingRupees } from "./order.pricing.js";


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
 * - addressId: ObjectId of user's address
 * - paymentMethod: 'phonepe'|'cod'
 * - idempotencyKey: optional
 *
 * Important: requires Mongo replica set for transactions.
 */
export const createOrderService = async ({ userId, items, addressId, paymentMethod, idempotencyKey }) => {
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

  // Fetch and validate address
  const address = await Address.findOne({ _id: addressId, user: userId }).lean();
  if (!address) throw new ApiError(404, "Address not found or not owned by user");

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

      // use price directly in rupees (no conversion)
      const unitPriceRupees = Number(variant.price);
      const lineTotal = unitPriceRupees * it.quantity;
      subtotal += lineTotal;

      lineItems.push({
        product: product._id,
        productSnapshot: { name: product.name, slug: product.slug, heroImage: product.heroImage, type: product.type },
        variantId: variant._id,
        variantSnapshot: { sku: variant.sku, sizeLabel: variant.sizeLabel, images: variant.images || [] },
        quantity: it.quantity,
        unitPrice: unitPriceRupees,
        mrp: Number(variant.mrp || 0),
        taxAmount: 0,
        discountAmount: 0,
        lineTotal: lineTotal,
      });
    }

    // compute totals using new pricing system (rupees)
    const pricing = calculateOrderPricingRupees(subtotal, paymentMethod);
    
    const shippingTotalRupees = pricing.deliveryCharge;
    const codChargeRupees = pricing.codCharge;
    const taxTotalRupees = pricing.taxTotal;
    const discountTotalRupees = pricing.discountTotal;  
    const grandTotalRupees = pricing.grandTotal;

    const orderNumber = await generateOrderNumber();
    const createdArr = await Order.create([{
      orderNumber,
      user: userId,
      userSnapshot: { name: user.name, email: user.email, phone: user.phone },
      items: lineItems,
      subtotal: subtotal,
      taxTotal: taxTotalRupees,
      shippingTotal: shippingTotalRupees,
      codCharge: codChargeRupees,
      discountTotal: discountTotalRupees,
      grandTotal: grandTotalRupees,
      currency: "INR",
      shippingAddress: address._id,
      shippingAddressSnapshot: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        label: address.label,
      },
      payment: { method: paymentMethod, status: paymentMethod === "cod" ? "unpaid" : "pending" },
      status: paymentMethod === "cod" ? "processing" : "pending_payment",
      idempotencyKey,
      history: [{ status: paymentMethod === "cod" ? "processing" : "pending_payment", by: userId, at: new Date() }],
    }], { session });

    const createdOrder = createdArr[0];

    if (idempotencyKey) {
      await Idempotency.create([{ key: idempotencyKey, orderId: createdOrder._id }], { session });
    }

    // commit transaction BEFORE calling PhonePe
    await session.commitTransaction();
    session.endSession();

    // Return order as-is since everything is already in rupees
    const mapOrderForResponse = (order) => {
      if (!order) return order;
      
      // Convert the Mongoose document to a plain object to avoid circular references
      const plainOrder = order.toObject ? order.toObject() : order;
      
      return plainOrder;
    };
    return { order: mapOrderForResponse(createdOrder), gatewayOrder: null };
    
  } catch (err) {
    // Only abort transaction if it hasn't been committed yet
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    if (session) {
      session.endSession();
    }
    throw err;
  }

  // Handle PhonePe payment creation outside of transaction (to avoid transaction conflicts)
  // This is now moved outside the try-catch block that handles the transaction
  // We'll handle PhonePe integration separately after order creation
}

// Helper function to handle PhonePe order creation
export const initializePhonePePayment = async (order, userPhone) => {
  try {
    // Convert order amounts from rupees to paise for PhonePe (since order is now stored in rupees)
    const amountPaise = toPaise(order.grandTotal);
      
    const phonepeOrder = await createPhonePeOrder({
      amountPaise: amountPaise,
      orderId: order._id.toString(),
      userId: order.user.toString(),
      userPhone: userPhone || "9999999999"
    });
    
    // Update the order in database with gateway details (convert order._id back to ObjectId if needed)
    await Order.findByIdAndUpdate(order._id, {
      'payment.gatewayOrderId': phonepeOrder.gatewayOrderId,
      'payment.gatewayTransactionId': phonepeOrder.transactionId
    });
    
    return {
      id: phonepeOrder.gatewayOrderId,
      transactionId: phonepeOrder.transactionId,
      paymentUrl: phonepeOrder.paymentUrl,
      success: phonepeOrder.success
    };
  } catch (phonepeError) {
    console.error("PhonePe order creation failed:", phonepeError);
    
    // Check if it's a configuration issue
    const isConfigError = phonepeError.message.includes('Key not found') || 
                         phonepeError.message.includes('not configured') ||
                         phonepeError.message.includes('KEY_NOT_CONFIGURED');
    
    // Mark payment as failed
    await Order.findByIdAndUpdate(order._id, {
      'payment.status': "failed",
      'status': "failed"
    });
    
    if (isConfigError) {
      throw new ApiError(500, "PhonePe payment gateway is not properly configured. Please contact support or use Cash on Delivery.");
    } else {
      throw new ApiError(500, "Payment gateway initialization failed. Please try again or use Cash on Delivery.");
    }
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

  // Return orders as-is since everything is already in rupees
  return {
    orders: orders,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

export const getOrderByIdService = async (userId, orderId) => {
  const order = await Order.findById(orderId).lean();
  if (!order) throw new ApiError(404, "Order not found");
  if (String(order.user) !== String(userId)) throw new ApiError(403, "Forbidden");
  // Return order as-is since everything is already in rupees
  return order;
};
