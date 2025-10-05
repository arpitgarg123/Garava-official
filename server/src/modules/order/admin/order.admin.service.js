
import ApiError from "../../../shared/utils/ApiError.js";
import Order from "../order.model.js";

/**
 * Prepare order data for frontend display
 * Database already stores values in rupees, so no conversion needed
 */
const convertOrderPricing = (order) => {
  if (!order) return order;
  
  // Database stores values in rupees format, so we just return as-is
  // No conversion needed since:
  // - Order creation uses calculateOrderPricingRupees() 
  // - Database stores: grandTotal: 13018 (meaning ₹13,018)
  // - Frontend expects: 13018 to display as ₹13,018
  return { ...order };
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