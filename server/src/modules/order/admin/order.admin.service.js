
import ApiError from "../../../shared/utils/ApiError.js";
import Order from "../order.model.js";
import { toRupees } from "../order.pricing.js";

/**
 * Convert order pricing from paise to rupees for frontend display
 */
const convertOrderPricing = (order) => {
  if (!order) return order;
  
  const converted = { ...order };
  
  // Convert order-level pricing
  if (converted.subtotal !== undefined) converted.subtotal = toRupees(converted.subtotal);
  if (converted.taxTotal !== undefined) converted.taxTotal = toRupees(converted.taxTotal);
  if (converted.shippingTotal !== undefined) converted.shippingTotal = toRupees(converted.shippingTotal);
  if (converted.codCharge !== undefined) converted.codCharge = toRupees(converted.codCharge);
  if (converted.discountTotal !== undefined) converted.discountTotal = toRupees(converted.discountTotal);
  if (converted.grandTotal !== undefined) converted.grandTotal = toRupees(converted.grandTotal);
  
  // Convert item-level pricing
  if (converted.items && Array.isArray(converted.items)) {
    converted.items = converted.items.map(item => ({
      ...item,
      unitPrice: item.unitPrice !== undefined ? toRupees(item.unitPrice) : item.unitPrice,
      mrp: item.mrp !== undefined ? toRupees(item.mrp) : item.mrp,
      taxAmount: item.taxAmount !== undefined ? toRupees(item.taxAmount) : item.taxAmount,
      discountAmount: item.discountAmount !== undefined ? toRupees(item.discountAmount) : item.discountAmount,
      lineTotal: item.lineTotal !== undefined ? toRupees(item.lineTotal) : item.lineTotal,
      priceAtTime: item.unitPrice !== undefined ? toRupees(item.unitPrice) : (item.priceAtTime !== undefined ? toRupees(item.priceAtTime) : item.priceAtTime)
    }));
  }
  
  return converted;
};

export const listOrdersAdminService = async ({ page = 1, limit = 20, status, user, paymentStatus, q }) => {
  const filter = {};
  
  // Status filter
  if (status) filter.status = status;
  
  // User filter
  if (user) filter.user = user;
  
  // Payment status filter
  if (paymentStatus) filter['payment.status'] = paymentStatus;
  
  // Search filter - search in order ID, customer name, email
  if (q) {
    const searchRegex = new RegExp(q, 'i');
    filter.$or = [
      { orderId: searchRegex },
      { 'customer.name': searchRegex },
      { 'customer.email': searchRegex }
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name slug heroImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  // Convert pricing from paise to rupees for frontend
  const convertedOrders = orders.map(convertOrderPricing);

  return {
    orders: convertedOrders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrderByIdAdminService = async (id) => {
  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate("items.product", "name slug heroImage")
    .lean();

  if (!order) throw new ApiError(404, "Order not found");
  
  // Convert pricing from paise to rupees for frontend
  return convertOrderPricing(order);
};

export const updateOrderStatusService = async (id, status, tracking) => {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status || order.status;
  if (tracking) {
    order.tracking = { ...order.tracking, ...tracking };
  }

  await order.save();
  return order;
};


export const refundOrderService = async (orderId, amountPaise, reason, adminId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (!order.payment || !order.payment.gatewayPaymentId) throw new ApiError(400, "No gateway payment to refund");

  // default full refund
  const refundAmount = amountPaise || order.grandTotalPaise;

  const refundRes = await refundRazorpayPayment({
    paymentId: order.payment.gatewayPaymentId,
    amountPaise: refundAmount,
    notes: { orderId: String(orderId), reason: reason || "refund" }
  });

  order.payment.refunds = order.payment.refunds || [];
  order.payment.refunds.push({
    id: refundRes.id || refundRes.entity?.id,
    amount: refundAmount,
    status: refundRes.status || "initiated",
    createdAt: new Date(),
    providerResponse: refundRes
  });

  // if full refund, mark order refunded
  if (!amountPaise || refundAmount >= order.grandTotalPaise) {
    order.payment.status = "refunded";
    order.status = "refunded";
  }
  order.history.push({ status: "refunded", by: adminId, note: reason || "", at: new Date() });
  await order.save();
  return order;
};