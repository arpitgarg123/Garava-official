import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectCartState = (state) => state.cart;

// Memoized selectors
export const selectCartItems = createSelector(
  [selectCartState],
  (cart) => cart?.items || []
);

export const selectCartTotal = (state) => state.cart?.totalAmount || 0;
export const selectCartTotalAmount = (state) => state.cart?.totalAmount || 0;
export const selectCartTotalItems = (state) => state.cart?.totalItems || 0;
export const selectCartStatus = (state) => state.cart?.status || 'idle';
export const selectCartError = (state) => state.cart?.error || null;

export const selectIsCartEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);

export const selectIsCartLoading = (state) => state.cart?.status === "loading";

// Additional helpful selectors
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + (item.quantity || 0), 0)
);

export const selectCartItemById = createSelector(
  [selectCartItems, (state, productId) => productId, (state, productId, variantId) => variantId],
  (items, productId, variantId) => 
    items.find(item => 
      item.product === productId && item.variantId === variantId
    )
);