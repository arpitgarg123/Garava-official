// src/modules/order/order.service.js
import ApiError from "../../shared/utils/ApiError.js";
import Order from "./order.model.js";

/**
 * Fetch paginated orders for a given user
 * @param {string} userId
 * @param {number} page
 * @param {number} limit
 */

export const getUserOrdersService = async (userId, page = 1, limit = 10) => {
  if (!userId) throw new ApiError(401, "Unauthorized");

  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: userId })
    .populate("items.product", "name price images")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Mask paymentInfo (only allow safe fields)
  const sanitizedOrders = orders.map((order) => {
    if (order.paymentInfo) {
      order.paymentInfo = {
        method: order.paymentInfo.method,
        transactionId: order.paymentInfo.transactionId,
        status: order.paymentInfo.status,
      };
    }
    return order;
  });

  const totalOrders = await Order.countDocuments({ user: userId });

  return {
    orders: sanitizedOrders,
    pagination: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    },
  };
};
