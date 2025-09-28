import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectWishlistState = (state) => state.wishlist;

// Memoized selectors
export const selectWishlistProducts = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist?.products || []
);

export const selectWishlistProductIds = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist?.productIds || []
);

// Default pagination object to prevent recreating on each selector call
const defaultPagination = { total: 0, page: 1, limit: 50, totalPages: 0 };

export const selectWishlistPagination = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist?.pagination || defaultPagination
);

export const selectWishlistStatus = (state) => state.wishlist?.status || 'idle';
export const selectWishlistError = (state) => state.wishlist?.error || null;

export const selectIsWishlistEmpty = createSelector(
  [selectWishlistProducts],
  (products) => products.length === 0
);

export const selectIsWishlistLoading = (state) => state.wishlist?.status === "loading";

// Helper selector to check if a product is in wishlist
export const selectIsProductInWishlist = (state, productId) => {
  if (!productId) return false;
  return (state.wishlist?.productIds || []).includes(productId);
};

// Selector to get wishlist item count
export const selectWishlistItemCount = (state) => state.wishlist?.products?.length || 0;

// Selector to get total wishlist items from pagination
export const selectWishlistTotalCount = (state) => state.wishlist?.pagination?.total || 0;