import { createSelector } from '@reduxjs/toolkit';

// Base selector
const selectOrderState = (state) => state.order;

// Current order selectors
export const selectCurrentOrder = createSelector(
  [selectOrderState],
  (order) => order.currentOrder
);

export const selectIsCreatingOrder = createSelector(
  [selectOrderState],
  (order) => order.creating
);

export const selectCreateOrderError = createSelector(
  [selectOrderState],
  (order) => order.createError
);

// Payment selectors
export const selectIsPaymentProcessing = createSelector(
  [selectOrderState],
  (order) => order.paymentProcessing
);

export const selectPaymentError = createSelector(
  [selectOrderState],
  (order) => order.paymentError
);

export const selectPaymentUrl = createSelector(
  [selectOrderState],
  (order) => order.paymentUrl
);

// Orders list selectors
export const selectOrders = createSelector(
  [selectOrderState],
  (order) => order.orders
);

export const selectIsOrdersLoading = createSelector(
  [selectOrderState],
  (order) => order.ordersLoading
);

export const selectOrdersError = createSelector(
  [selectOrderState],
  (order) => order.ordersError
);

export const selectOrdersPagination = createSelector(
  [selectOrderState],
  (order) => order.pagination
);

// Order details selectors
export const selectOrderDetails = createSelector(
  [selectOrderState],
  (order) => order.orderDetails
);

export const selectIsOrderDetailsLoading = createSelector(
  [selectOrderState],
  (order) => order.orderDetailsLoading
);

export const selectOrderDetailsError = createSelector(
  [selectOrderState],
  (order) => order.orderDetailsError
);

// Payment status selectors
export const selectIsStatusChecking = createSelector(
  [selectOrderState],
  (order) => order.statusChecking
);

export const selectStatusError = createSelector(
  [selectOrderState],
  (order) => order.statusError
);

// Computed selectors
export const selectHasPendingPayment = createSelector(
  [selectCurrentOrder],
  (currentOrder) => {
    if (!currentOrder) return false;
    return currentOrder.payment?.status === 'pending' || 
           currentOrder.payment?.status === 'unpaid';
  }
);

export const selectOrdersByStatus = createSelector(
  [selectOrders],
  (orders) => {
    return orders.reduce((acc, order) => {
      const status = order.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(order);
      return acc;
    }, {});
  }
);

export const selectRecentOrders = createSelector(
  [selectOrders],
  (orders) => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }
);

export const selectOrdersCount = createSelector(
  [selectOrders],
  (orders) => orders.length
);

export const selectTotalOrderValue = createSelector(
  [selectOrders],
  (orders) => {
    return orders.reduce((total, order) => {
      return total + (order.grandTotalPaise || 0);
    }, 0);
  }
);

// Alias for backward compatibility
export const selectUserOrders = selectOrders;