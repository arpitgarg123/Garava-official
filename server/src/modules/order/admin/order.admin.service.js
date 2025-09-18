
import ApiError from "../../../shared/utils/ApiError.js";
import Order from "../order.model.js";

export const listOrdersAdminService = async ({ page = 1, limit = 20, status, user }) => {
  const filter = {};
  if (status) filter.status = status;
  if (user) filter.user = user;

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

  return {
    orders,
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
  return order;
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