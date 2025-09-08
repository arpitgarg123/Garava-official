// src/modules/order/order.controller.js
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { getUserOrdersService } from "./order.service.js";

export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  // Read pagination from query params (?page=1&limit=10)
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const { orders, pagination } = await getUserOrdersService(userId, page, limit);

  res.json({
    success: true,
    count: orders.length,
    pagination,
    orders,
  });
});
