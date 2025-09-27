// Wishlist selectors
export const selectWishlistProducts = (state) => state.wishlist?.products || [];
export const selectWishlistProductIds = (state) => state.wishlist?.productIds || [];
export const selectWishlistPagination = (state) => state.wishlist?.pagination || { total: 0, page: 1, limit: 50, totalPages: 0 };
export const selectWishlistStatus = (state) => state.wishlist?.status || 'idle';
export const selectWishlistError = (state) => state.wishlist?.error || null;
export const selectIsWishlistEmpty = (state) => (state.wishlist?.products || []).length === 0;
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