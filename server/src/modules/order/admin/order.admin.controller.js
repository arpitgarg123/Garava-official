import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import * as service from "./order.admin.service.js";

export const listOrdersAdmin = asyncHandler(async (req, res) => {
  const { page, limit, status, user, paymentStatus, q } = req.query;
  const result = await service.listOrdersAdminService({ page, limit, status, user, paymentStatus, q });
  res.json({ success: true, ...result });
});

export const getOrderByIdAdmin = asyncHandler(async (req, res) => {
  const order = await service.getOrderByIdAdminService(req.params.id);
  res.json({ success: true, order });
});

export const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
  console.log('Request body:', req.body); // Debug log
  
  if (!req.body) {
    return res.status(400).json({ 
      success: false, 
      message: 'Request body is required' 
    });
  }
  
  const { status, notes, tracking } = req.body;
  
  if (!status) {
    return res.status(400).json({ 
      success: false, 
      message: 'Status is required' 
    });
  }
  
  // If notes are provided, include them in tracking info
  const trackingData = tracking || {};
  if (notes) {
    trackingData.adminNotes = notes;
  }
  
  const order = await service.updateOrderStatusService(req.params.id, status, trackingData);
  res.json({ success: true, order });
});

export const refundOrder = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const orderId = req.params.orderId;
  const { amountPaise, reason } = req.body; // amountPaise optional => full refund
  const result = await service.refundOrderService(orderId, amountPaise, reason, adminId);
  res.json({ success: true, result });
});
