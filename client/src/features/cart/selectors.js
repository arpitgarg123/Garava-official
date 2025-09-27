// Cart selectors
export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartTotal = (state) => state.cart?.totalAmount || 0;
export const selectCartTotalAmount = (state) => state.cart?.totalAmount || 0;
export const selectCartTotalItems = (state) => state.cart?.totalItems || 0;
export const selectCartStatus = (state) => state.cart?.status || 'idle';
export const selectCartError = (state) => state.cart?.error || null;
export const selectIsCartEmpty = (state) => (state.cart?.items || []).length === 0;
export const selectIsCartLoading = (state) => state.cart?.status === "loading";

// Additional helpful selectors
export const selectCartItemCount = (state) => (state.cart?.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
export const selectCartItemById = (state, productId, variantId) => 
  (state.cart?.items || []).find(item => 
    item.product === productId && item.variantId === variantId
  );