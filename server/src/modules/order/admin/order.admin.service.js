
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
