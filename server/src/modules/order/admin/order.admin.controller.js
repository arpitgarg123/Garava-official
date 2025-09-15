// src/modules/order/order.admin.controller.js

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import * as service from "./order.admin.service.js";

export const listOrdersAdmin = asyncHandler(async (req, res) => {
  const { page, limit, status, user } = req.query;
  const result = await service.listOrdersAdminService({ page, limit, status, user });
  res.json({ success: true, ...result });
});

export const getOrderByIdAdmin = asyncHandler(async (req, res) => {
  const order = await service.getOrderByIdAdminService(req.params.id);
  res.json({ success: true, order });
});

export const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
  const { status, tracking } = req.body;
  const order = await service.updateOrderStatusService(req.params.id, status, tracking);
  res.json({ success: true, order });
});
