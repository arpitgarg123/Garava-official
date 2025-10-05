import { authHttp } from "../../shared/api/http";

/**
 * Order Admin API Integration
 * All endpoints require admin authentication
 */

// List all orders with pagination and filters
export const listOrdersAdmin = (params = {}) => {
  const { page = 1, limit = 20, status, user, paymentStatus, q } = params;
  const queryParams = new URLSearchParams();
  
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (status) queryParams.append('status', status);
  if (user) queryParams.append('user', user);
  if (paymentStatus) queryParams.append('paymentStatus', paymentStatus);
  if (q) queryParams.append('q', q);
  
  return authHttp.get(`/admin/order?${queryParams.toString()}`);
};

// Get order by ID for admin
export const getOrderByIdAdmin = (orderId) => {
  return authHttp.get(`/admin/order/${orderId}`);
};

// Update order status
export const updateOrderStatus = (orderId, statusData) => {
  return authHttp.patch(`/admin/order/${orderId}/status`, statusData);
};

// Refund order
export const refundOrder = (orderId, refundData) => {
  return authHttp.post(`/admin/order/${orderId}/refund`, refundData);
};

// Helper function to format order data for display
export const formatOrderForDisplay = (order) => {
  return {
    ...order,
    formattedDate: new Date(order.createdAt).toLocaleDateString(),
    formattedTime: new Date(order.createdAt).toLocaleTimeString(),
    customerName: order.userSnapshot?.name || order.user?.name || 'N/A',
    customerEmail: order.userSnapshot?.email || order.user?.email || 'N/A',
    itemsCount: order.items?.length || 0,
    totalAmount: order.grandTotal || 0,
    paymentMethod: order.payment?.method || 'N/A',
    shippingAddress: order.shippingAddressSnapshot || {},
  };
};

// Helper function to get order status color
export const getOrderStatusColor = (status) => {
  const colors = {
    pending_payment: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200", 
    partially_shipped: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-50 text-gray-800 border-gray-200",
    failed: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-50 text-gray-800 border-gray-200";
};

// Helper function to get payment status color
export const getPaymentStatusColor = (status) => {
  const colors = {
    unpaid: "bg-red-100 text-red-800 border-red-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-50 text-gray-800 border-gray-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return colors[status] || "bg-gray-50 text-gray-800 border-gray-200";
};