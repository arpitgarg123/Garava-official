
import ApiError from "../../../shared/utils/ApiError.js";
import Order from "../order.model.js";
import { sendOrderStatusUpdateEmail, sendOrderCancelledEmail } from "../../../shared/emails/email.service.js";

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
  
  // Map payment status for frontend compatibility
  const paymentStatus = order.payment?.status || 'pending';
  
  // Use shippingAddressSnapshot if shippingAddress is not populated (just ObjectId)
  const shippingAddress = (order.shippingAddress && typeof order.shippingAddress === 'object' && order.shippingAddress.fullName) 
    ? order.shippingAddress 
    : order.shippingAddressSnapshot;
  
  return { 
    ...order,
    paymentStatus,
    shippingAddress
  };
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
      .populate("shippingAddress")
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
    .populate("shippingAddress")
    .lean();

  if (!order) throw new ApiError(404, "Order not found");
  
  // Convert pricing from paise to rupees for frontend
  return convertOrderPricing(order);
};

export const updateOrderStatusService = async (id, status, tracking) => {
  const order = await Order.findById(id).populate('user');
  if (!order) throw new ApiError(404, "Order not found");

  const previousStatus = order.status;
  order.status = status || order.status;
  if (tracking) {
    order.tracking = { ...order.tracking, ...tracking };
  }

  await order.save();

  // Send status update email (don't block the update if email fails)
  try {
    const orderLean = order.toObject ? order.toObject() : order;
    
    // Send specific email based on status
    if (status === 'cancelled') {
      await sendOrderCancelledEmail(orderLean);
    } else if (['processing', 'shipped', 'out_for_delivery', 'delivered', 'failed'].includes(status)) {
      await sendOrderStatusUpdateEmail(orderLean, previousStatus);
    }
  } catch (emailError) {
    console.error('Failed to send order status update email:', emailError);
    // Continue - don't fail status update due to email issues
  }

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

/**
 * Get dashboard statistics
 * Returns aggregated stats from all orders/products/reviews
 */
export const getDashboardStatsService = async () => {
  // Dynamic imports to avoid circular dependencies
  const Product = (await import('../../product/product.model.js')).default;
  const Review = (await import('../../review/review.model.js')).default;
  const Appointment = (await import('../../appointment/appointment.model.js')).default;
  const User = (await import('../../user/user.model.js')).default;
  
  // Get current date boundaries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);
  
  // Get all orders for accurate stats
  const allOrders = await Order.find({}).select('grandTotal status createdAt').lean();
  
  // Calculate total revenue (sum of all completed orders)
  const totalRevenue = allOrders
    .filter(order => order.status !== 'cancelled' && order.status !== 'failed')
    .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  
  // Calculate today's revenue
  const todayRevenue = allOrders
    .filter(order => 
      order.createdAt >= today && 
      order.createdAt < tomorrow &&
      order.status !== 'cancelled' && 
      order.status !== 'failed'
    )
    .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  
  // Count orders by status
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(order => order.status === 'pending' || order.status === 'pending_payment').length;
  const processingOrders = allOrders.filter(order => order.status === 'processing').length;
  const shippedOrders = allOrders.filter(order => order.status === 'shipped' || order.status === 'out_for_delivery').length;
  const deliveredOrders = allOrders.filter(order => order.status === 'delivered').length;
  const cancelledOrders = allOrders.filter(order => order.status === 'cancelled').length;
  
  // Get product stats
  const totalProducts = await Product.countDocuments({});
  const activeProducts = await Product.countDocuments({ status: 'published', isActive: true });
  const draftProducts = await Product.countDocuments({ status: 'draft' });
  const outOfStockProducts = await Product.countDocuments({ stockQuantity: 0 });
  const lowStockProducts = await Product.countDocuments({ 
    stockQuantity: { $gt: 0, $lte: 10 }, 
    status: 'published' 
  });
  
  // Get review stats
  const allReviews = await Review.find({}).select('rating isApproved createdAt').lean();
  const totalReviews = allReviews.length;
  const approvedReviews = allReviews.filter(r => r.isApproved).length;
  const pendingReviews = allReviews.filter(r => !r.isApproved).length;
  
  // Calculate average rating
  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length
    : 0;
  
  // Get appointment stats
  const totalAppointments = await Appointment.countDocuments({});
  const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
  const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
  const upcomingAppointments = await Appointment.countDocuments({ 
    appointmentAt: { $gte: new Date() },
    status: { $in: ['pending', 'confirmed'] }
  });
  
  // Get customer stats
  const totalCustomers = await User.countDocuments({ role: 'user' });
  const newCustomers = await User.countDocuments({ 
    role: 'user',
    createdAt: { $gte: last30Days }
  });
  
  return {
    revenue: {
      total: totalRevenue,
      today: todayRevenue,
      currency: 'INR'
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
      needsAttention: pendingOrders // Orders requiring immediate attention
    },
    products: {
      total: totalProducts,
      active: activeProducts,
      draft: draftProducts,
      outOfStock: outOfStockProducts,
      lowStock: lowStockProducts,
      needsAttention: outOfStockProducts + lowStockProducts
    },
    reviews: {
      total: totalReviews,
      approved: approvedReviews,
      pending: pendingReviews,
      avgRating: parseFloat(avgRating.toFixed(1)),
      needsAttention: pendingReviews
    },
    appointments: {
      total: totalAppointments,
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      upcoming: upcomingAppointments,
      needsAttention: pendingAppointments
    },
    customers: {
      total: totalCustomers,
      new: newCustomers // Last 30 days
    }
  };
};
