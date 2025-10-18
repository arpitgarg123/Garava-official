/**
 * Sync utilities for merging guest data with authenticated user data
 * Handles the transition from guest mode to authenticated mode
 */

import { guestCart, guestWishlist } from './guestStorage.js';
import * as cartApi from '../../features/cart/api.js';
import * as wishlistApi from '../../features/wishlist/api.js';

// Sync guest cart with backend
export const syncGuestCartWithBackend = async (dispatch, getState) => {
  try {
    const guestCartData = guestCart.getAllForSync();
    if (guestCartData.length === 0) {
      return { success: true, synced: 0, errors: [] };
    }

    const syncResults = {
      success: true,
      synced: 0, 
      errors: []
    };

    // Add each guest cart item to backend
    for (const item of guestCartData) {
      try {
        await cartApi.addToCart(item);
        syncResults.synced++;
      } catch (error) {
        console.warn('Failed to sync cart item:', item, error);
        syncResults.errors.push({
          item,
          error: error.response?.data?.message || error.message
        });
      }
    }

    // Clear guest cart after successful sync
    if (syncResults.synced > 0) {
      guestCart.clear();
    }

    // If we had errors but synced some items, still consider it a partial success
    if (syncResults.errors.length > 0 && syncResults.synced === 0) {
      syncResults.success = false;
    }

    return syncResults;
  } catch (error) {
    console.error('Cart sync failed:', error);
    return {
      success: false,
      synced: 0,
      errors: [{ error: error.message }]
    };
  }
};

// Sync guest wishlist with backend
export const syncGuestWishlistWithBackend = async (dispatch, getState) => {
  try {
    const guestWishlistData = guestWishlist.getAllForSync();
    if (guestWishlistData.length === 0) {
      return { success: true, synced: 0, errors: [] };
    }

    const syncResults = {
      success: true,
      synced: 0,
      errors: []
    };

    // Add each guest wishlist item to backend
    for (const productId of guestWishlistData) {
      try {
        await wishlistApi.addToWishlist(productId);
        syncResults.synced++;
      } catch (error) {
        console.warn('Failed to sync wishlist item:', productId, error);
        syncResults.errors.push({
          productId,
          error: error.response?.data?.message || error.message
        });
      }
    }

    // Clear guest wishlist after successful sync
    if (syncResults.synced > 0) {
      guestWishlist.clear();
    }

    // If we had errors but synced some items, still consider it a partial success
    if (syncResults.errors.length > 0 && syncResults.synced === 0) {
      syncResults.success = false;
    }

    return syncResults;
  } catch (error) {
    console.error('Wishlist sync failed:', error);
    return {
      success: false,
      synced: 0,
      errors: [{ error: error.message }]
    };
  }
};

// Main sync function to be called after login
export const syncGuestDataWithBackend = async (dispatch, getState) => {
  const results = {
    cart: { success: false, synced: 0, errors: [] },
    wishlist: { success: false, synced: 0, errors: [] },
    overall: false
  };

  try {
    // Sync cart and wishlist in parallel for better performance
    const [cartResults, wishlistResults] = await Promise.all([
      syncGuestCartWithBackend(dispatch, getState),
      syncGuestWishlistWithBackend(dispatch, getState)
    ]);

    results.cart = cartResults;
    results.wishlist = wishlistResults;
    results.overall = cartResults.success && wishlistResults.success;

    return results;
  } catch (error) {
    console.error('Guest data sync failed:', error);
    results.overall = false;
    return results;
  }
};

// Check if user has guest data that needs syncing
export const hasGuestDataToSync = () => {
  const cartData = guestCart.get();
  const wishlistData = guestWishlist.get();
  
  return {
    hasCartData: cartData.items.length > 0,
    hasWishlistData: wishlistData.products.length > 0,
    hasAnyData: cartData.items.length > 0 || wishlistData.products.length > 0,
    summary: {
      cartItems: cartData.totalItems,
      wishlistItems: wishlistData.products.length
    }
  };
};

// Async thunk for syncing guest data (can be dispatched)
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCart } from '../../features/cart/slice.js';
import { fetchWishlist } from '../../features/wishlist/slice.js';

export const syncGuestData = createAsyncThunk(
  'sync/guestData',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      // Check if there's data to sync
      const guestDataCheck = hasGuestDataToSync();
      if (!guestDataCheck.hasAnyData) {
        return { success: true, message: 'No guest data to sync' };
      }

      // Perform the sync
      const results = await syncGuestDataWithBackend(dispatch, getState);
      
      // After syncing, refresh the backend data
      if (results.cart.synced > 0) {
        dispatch(fetchCart({ force: true }));
      }
      if (results.wishlist.synced > 0) {
        dispatch(fetchWishlist({ force: true }));
      }

      return {
        success: results.overall,
        results,
        message: `Synced ${results.cart.synced} cart items and ${results.wishlist.synced} wishlist items`
      };
    } catch (error) {
      console.error('Guest data sync thunk failed:', error);
      return rejectWithValue(error.message || 'Failed to sync guest data');
    }
  }
);

export default {
  syncGuestCartWithBackend,
  syncGuestWishlistWithBackend,
  syncGuestDataWithBackend,
  hasGuestDataToSync,
  syncGuestData
};