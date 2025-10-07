/**
 * Guest mode initialization utilities
 * Handles loading guest data when app starts for non-authenticated users
 */

import { loadGuestCart } from '../../features/cart/slice.js';
import { loadGuestWishlist } from '../../features/wishlist/slice.js';
import { guestStorageUtils } from './guestStorage.js';

// Initialize guest mode - load guest data from localStorage
export const initializeGuestMode = async (dispatch, getState) => {
  try {
    const { auth } = getState();
    
    // Only initialize guest mode for non-authenticated users
    if (auth.accessToken || auth.user) {
      return { success: false, reason: 'User is authenticated' };
    }
 
    // Check if there's guest data to load
    const guestDataSummary = guestStorageUtils.getGuestDataSummary();
    
    const results = {
      cart: { success: false, loaded: false },
      wishlist: { success: false, loaded: false },
      overall: false
    };

    // Load guest cart if available
    if (guestDataSummary.cartItems > 0) {
      try {
        await dispatch(loadGuestCart()).unwrap();
        results.cart = { success: true, loaded: true };
      } catch (error) {
        console.warn('Failed to load guest cart:', error);
        results.cart = { success: false, loaded: false, error: error.message };
      }
    } else {
      results.cart = { success: true, loaded: false, reason: 'No guest cart data' };
    }

    // Load guest wishlist if available
    if (guestDataSummary.wishlistItems > 0) {
      try {
        await dispatch(loadGuestWishlist()).unwrap();
        results.wishlist = { success: true, loaded: true };
      } catch (error) {
        console.warn('Failed to load guest wishlist:', error);
        results.wishlist = { success: false, loaded: false, error: error.message };
      }
    } else {
      results.wishlist = { success: true, loaded: false, reason: 'No guest wishlist data' };
    }

    results.overall = results.cart.success && results.wishlist.success;

    // Log initialization summary
    console.log('Guest mode initialized:', {
      cart: guestDataSummary.cartItems > 0 ? `${guestDataSummary.cartItems} items loaded` : 'No cart data',
      wishlist: guestDataSummary.wishlistItems > 0 ? `${guestDataSummary.wishlistItems} items loaded` : 'No wishlist data'
    });

    return {
      success: results.overall,
      results,
      summary: guestDataSummary
    };
  } catch (error) {
    console.error('Guest mode initialization failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper to determine if app should run in guest mode
export const shouldInitializeGuestMode = (authState) => {
  // Initialize guest mode if:
  // 1. User is not authenticated
  // 2. Auth initialization failed (but not due to network errors)
  // 3. There's guest data available
  
  const isAuthenticated = authState.accessToken && authState.user;
  const hasGuestData = guestStorageUtils.hasGuestCart() || guestStorageUtils.hasGuestWishlist();
  
  return !isAuthenticated && hasGuestData;
};

export default {
  initializeGuestMode,
  shouldInitializeGuestMode
};