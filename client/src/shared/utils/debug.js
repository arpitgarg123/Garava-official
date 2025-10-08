// Debug utility to check guest functionality
export const debugGuestFunctionality = () => {
  console.log('🔍 Guest Functionality Debug:');
  
  // Check localStorage
  const guestCartData = localStorage.getItem('garava_guest_cart');
  const guestWishlistData = localStorage.getItem('garava_guest_wishlist');
  
  console.log('📦 Guest Cart in localStorage:', guestCartData ? JSON.parse(guestCartData) : 'None');
  console.log('💖 Guest Wishlist in localStorage:', guestWishlistData ? JSON.parse(guestWishlistData) : 'None');
  
  // Try importing guest storage functions
  import('./guestStorage.js').then(({ guestCart, guestWishlist }) => {
    console.log('📦 Guest Cart functions:', {
      get: typeof guestCart.get,
      add: typeof guestCart.add,
      remove: typeof guestCart.remove
    });
    
    console.log('💖 Guest Wishlist functions:', {
      get: typeof guestWishlist.get,
      add: typeof guestWishlist.add,
      remove: typeof guestWishlist.remove
    });
    
    // Test basic functionality
    try {
      const cart = guestCart.get();
      console.log('📦 Current guest cart:', cart);
      
      const wishlist = guestWishlist.get();
      console.log('💖 Current guest wishlist:', wishlist);
    } catch (error) {
      console.error('❌ Error accessing guest storage:', error);
    }
  }).catch(error => {
    console.error('❌ Error importing guest storage:', error);
  });
};

// Test Redux store connection
export const debugReduxState = (store) => {
  if (!store) {
    console.error('❌ Redux store not available');
    return;
  }
  
  const state = store.getState();
  console.log('🏪 Redux State Debug:');
  console.log('👤 Auth:', {
    isAuthenticated: !!state.auth?.accessToken,
    user: state.auth?.user?.email || 'No user',
    status: state.auth?.status
  });
  console.log('📦 Cart:', {
    items: state.cart?.items?.length || 0,
    isGuest: state.cart?.isGuest,
    status: state.cart?.status
  });
  console.log('💖 Wishlist:', {
    products: state.wishlist?.products?.length || 0,
    isGuest: state.wishlist?.isGuest,
    status: state.wishlist?.status
  });
};

export default {
  debugGuestFunctionality,
  debugReduxState
};