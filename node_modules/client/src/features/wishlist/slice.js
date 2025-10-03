import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as wishlistApi from "./api.js";
import { logout, initAuth } from "../auth/slice.js";

// Smart request deduplication with timestamp tracking and caching
let lastWishlistFetchTime = 0;
let lastWishlistCacheTime = 0;
const WISHLIST_FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches
const WISHLIST_CACHE_TTL = 30000; // 30 seconds cache time-to-live

// Async thunks for wishlist operations
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (options = {}, { rejectWithValue, getState }) => {
    try {
      const { wishlist } = getState();
      const now = Date.now();
      const { force = false, ...params } = options;
      
      // Smart deduplication: prevent requests within cooldown unless forced
      if (!force && wishlist.status === 'loading') {
        console.log('Wishlist slice - Already loading, skipping duplicate request');
        return rejectWithValue('Already loading');
      }
      
      // Cache check: if data is fresh and force is not set, skip fetch
      if (!force && wishlist.products.length > 0 && now - lastWishlistCacheTime < WISHLIST_CACHE_TTL) {
        console.log('Wishlist slice - Using cached data, skipping fetch');
        // Return the current wishlist structure that matches the API response
        return {
          products: wishlist.products,
          productIds: wishlist.productIds,
          pagination: wishlist.pagination,
          _cached: true
        };
      }
      
      // Cooldown protection for rapid successive calls
      if (!force && now - lastWishlistFetchTime < WISHLIST_FETCH_COOLDOWN) {
        console.log('Wishlist slice - Too soon since last fetch, skipping');
        return rejectWithValue('Too soon');
      }
      
      lastWishlistFetchTime = now;
      console.log('Wishlist slice - Fetching wishlist:', params);
      const response = await wishlistApi.getWishlist(params);
      console.log('Wishlist slice - Fetch wishlist response:', response);
      lastWishlistCacheTime = now; // Update cache time on successful fetch
      return response.data;
    } catch (error) {
      console.error('Wishlist slice - Fetch wishlist error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch wishlist';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      console.log('Wishlist slice - Adding to wishlist:', productId);
      const response = await wishlistApi.addToWishlist(productId);
      console.log('Wishlist slice - Add to wishlist response:', response);
      return { productId, wishlist: response.data.wishlist };
    } catch (error) {
      console.error('Wishlist slice - Add to wishlist error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to wishlist';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      console.log('Wishlist slice - Removing from wishlist:', productId);
      const response = await wishlistApi.removeFromWishlist(productId);
      console.log('Wishlist slice - Remove from wishlist response:', response);
      return { productId, ...response.data };
    } catch (error) {
      console.error('Wishlist slice - Remove from wishlist error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove from wishlist';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggleWishlistItem",
  async (productId, { rejectWithValue, getState }) => {
    try {
      console.log('Wishlist slice - Toggling wishlist item:', productId);
      const response = await wishlistApi.toggleWishlist(productId);
      console.log('Wishlist slice - Toggle wishlist response:', response);
      return { productId, ...response.data };
    } catch (error) {
      console.error('Wishlist slice - Toggle wishlist error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to toggle wishlist';
      return rejectWithValue(errorMessage);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    products: [],
    productIds: [], // Quick lookup array for checking if product is in wishlist
    pagination: {
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0
    },
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.products = [];
      state.productIds = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload?.products || [];
        state.pagination = action.payload?.pagination || state.pagination;
        // Update productIds for quick lookup
        state.productIds = state.products.map(item => 
          item.productId || item.product?._id
        ).filter(Boolean);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId } = action.payload;
        
        // Add productId to quick lookup if not already present
        if (!state.productIds.includes(productId)) {
          state.productIds.push(productId);
        }
        
        // Invalidate cache after successful modification
        lastWishlistCacheTime = 0;
        
        // Refresh wishlist data - in a real app you might want to just add the item
        // but for consistency with backend, let's trigger a refetch
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId } = action.payload;
        
        // Remove from products array
        state.products = state.products.filter(item => 
          (item.productId || item.product?._id) !== productId
        );
        
        // Remove from quick lookup
        state.productIds = state.productIds.filter(id => id !== productId);
        
        // Invalidate cache after successful modification
        lastWishlistCacheTime = 0;
        
        // Update pagination
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Toggle wishlist item
    builder
      .addCase(toggleWishlistItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId, action: wishlistAction, wishlist } = action.payload;
        
        if (wishlistAction === "added") {
          // Add to quick lookup if not already present
          if (!state.productIds.includes(productId)) {
            state.productIds.push(productId);
          }
          
          // If we have the full wishlist data from the API response, update everything
          if (wishlist) {
            state.products = wishlist.products || state.products;
            state.productIds = wishlist.productIds || state.productIds;
            state.pagination = wishlist.pagination || state.pagination;
          }
          
          // Invalidate cache to ensure fresh data on next fetch
          lastWishlistCacheTime = 0;
          
        } else if (wishlistAction === "removed") {
          // Remove from products array
          state.products = state.products.filter(item => 
            (item.productId || item.product?._id) !== productId
          );
          
          // Remove from quick lookup
          state.productIds = state.productIds.filter(id => id !== productId);
          
          // Update pagination
          state.pagination.total = Math.max(0, state.pagination.total - 1);
          
          // Invalidate cache after successful modification
          lastWishlistCacheTime = 0;
        }
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Clear wishlist data when user logs out or auth fails
    builder
      .addCase(logout, (state) => {
        state.products = [];
        state.productIds = [];
        state.pagination = { total: 0, page: 1, limit: 50, totalPages: 0 };
        state.status = "idle";
        state.error = null;
        // Reset cache times
        lastWishlistFetchTime = 0;
        lastWishlistCacheTime = 0;
        console.log('Wishlist slice - Cleared wishlist data on logout');
      })
      .addCase(initAuth.rejected, (state, { payload }) => {
        const errorData = payload || {};
        
        // Only clear wishlist data on actual auth failures, not network errors
        if (errorData.type === 'AUTH_EXPIRED' || errorData.type === 'GENERAL_ERROR') {
          state.products = [];
          state.productIds = [];
          state.pagination = { total: 0, page: 1, limit: 50, totalPages: 0 };
          state.status = "idle";
          state.error = null;
          // Reset cache times
          lastWishlistFetchTime = 0;
          lastWishlistCacheTime = 0;
          console.log('Wishlist slice - Cleared wishlist data on auth failure');
        } else if (errorData.type === 'NETWORK_ERROR') {
          // Don't clear wishlist on network errors, just log
          console.log('Wishlist slice - Network error during auth init, keeping wishlist data');
        }
      });
  },
});

export const { clearWishlistError, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;