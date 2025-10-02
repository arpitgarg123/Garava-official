import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartApi from "./api.js";
import { logout, initAuth } from "../auth/slice.js";

// Smart request deduplication with timestamp tracking and caching
let lastFetchTime = 0;
let lastCacheTime = 0;
const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches
const CACHE_TTL = 30000; // 30 seconds cache time-to-live

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (options = {}, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const now = Date.now();
      const { force = false } = options;
      
      // Smart deduplication: prevent requests within cooldown unless forced
      if (!force && cart.status === 'loading') {
        console.log('Cart slice - Already loading, skipping duplicate request');
        return rejectWithValue('Already loading');
      }
      
      // Cache check: if data is fresh and force is not set, skip fetch
      if (!force && cart.items.length > 0 && now - lastCacheTime < CACHE_TTL) {
        console.log('Cart slice - Using cached data, skipping fetch');
        return cart; // Return current cart data
      }
      
      // Cooldown protection for rapid successive calls
      if (!force && now - lastFetchTime < FETCH_COOLDOWN) {
        console.log('Cart slice - Too soon since last fetch, skipping');
        return rejectWithValue('Too soon');
      }
      
      lastFetchTime = now;
      console.log('Cart slice - Fetching cart');
      const response = await cartApi.getCart();
      console.log('Cart slice - Fetch cart response:', response);
      lastCacheTime = now; // Update cache time on successful fetch
      return response.data.cart;
    } catch (error) {
      console.error('Cart slice - Fetch cart error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cart';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, { rejectWithValue }) => {
    try {
      console.log('Cart slice - Adding to cart with payload:', payload);
      
      // Validate payload before making API call
      if (!payload.productId) {
        throw new Error('Product ID is required');
      }
      if (!payload.variantId && !payload.variantSku) {
        throw new Error('Either variant ID or variant SKU is required');
      }
      if (!payload.quantity || payload.quantity <= 0) {
        payload.quantity = 1; // Default to 1 if not provided
      }
      
      const response = await cartApi.addToCart(payload);
      console.log('Cart slice - Add to cart response:', response);
      return response.data.cart;
    } catch (error) {
      console.error('Cart slice - Add to cart error:', error);
      
      let errorMessage = 'Failed to add item to cart';
      
      // Handle specific error types
      if (error.response?.data?.message) {
        const apiMessage = error.response.data.message;
        
        // Handle stock-related errors
        if (apiMessage.includes('Insufficient stock')) {
          errorMessage = apiMessage; // Use the specific stock error message
        } else if (apiMessage.includes('out of stock') || apiMessage.includes('not available')) {
          errorMessage = 'This product is currently out of stock';
        } else if (apiMessage.includes('Product not found')) {
          errorMessage = 'Product not found';
        } else if (apiMessage.includes('Variant not found')) {
          errorMessage = 'Product variant not found';
        } else {
          errorMessage = apiMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem", 
  async (payload, { rejectWithValue }) => {
    try {
      console.log('Cart slice - Updating cart item:', payload);
      const response = await cartApi.updateCartItem(payload);
      console.log('Cart slice - Update cart item response:', response);
      return response.data.cart;
    } catch (error) {
      console.error('Cart slice - Update cart item error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update cart item';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (payload, { rejectWithValue }) => {
    try {
      console.log('Cart slice - Removing from cart:', payload);
      const response = await cartApi.removeCartItem(payload);
      console.log('Cart slice - Remove from cart response:', response);
      return response.data.cart;
    } catch (error) {
      console.error('Cart slice - Remove from cart error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove item from cart';
      return rejectWithValue(errorMessage);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart", 
  async (_, { rejectWithValue }) => {
    try {
      console.log('Cart slice - Clearing cart');
      const response = await cartApi.clearCart();
      console.log('Cart slice - Clear cart response:', response);
      return response.data.cart;
    } catch (error) {
      console.error('Cart slice - Clear cart error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to clear cart';
      return rejectWithValue(errorMessage);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
    // Optimistic updates
    optimisticAddToCart: (state, action) => {
      const { productId, variantId, variantSku, quantity, unitPrice, product } = action.payload;
      const existingItem = state.items.find(item => 
        item.product === productId && (item.variantId === variantId || item.variantSku === variantSku)
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: `temp-${Date.now()}`, // Temporary ID for optimistic update
          product: productId,
          variantId,
          variantSku,
          quantity,
          unitPrice,
          productDetails: product
        });
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    },
    optimisticUpdateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i._id === itemId);
      if (item) {
        item.quantity = quantity;
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
      }
    },
    optimisticRemoveItem: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    },
    // Rollback optimistic updates on failure
    rollbackOptimisticUpdate: (state, action) => {
      // This will be handled by re-fetching the cart on failure
      state.status = 'failed';
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = (action.payload?.items || []).reduce((total, item) => total + item.quantity, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = (action.payload?.items || []).reduce((total, item) => total + item.quantity, 0);
        // Invalidate cache after successful modification
        lastCacheTime = 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = (action.payload?.items || []).reduce((total, item) => total + item.quantity, 0);
        // Invalidate cache after successful modification
        lastCacheTime = 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = (action.payload?.items || []).reduce((total, item) => total + item.quantity, 0);
        // Invalidate cache after successful modification
        lastCacheTime = 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Clear cart data when user logs out or auth fails
    builder
      .addCase(logout, (state) => {
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
        state.status = "idle";
        state.error = null;
        // Reset cache times
        lastFetchTime = 0;
        lastCacheTime = 0;
        console.log('Cart slice - Cleared cart data on logout');
      })
      .addCase(initAuth.rejected, (state, { payload }) => {
        const errorData = payload || {};
        
        // Only clear cart data on actual auth failures, not network errors
        if (errorData.type === 'AUTH_EXPIRED' || errorData.type === 'GENERAL_ERROR') {
          state.items = [];
          state.totalAmount = 0;
          state.totalItems = 0;
          state.status = "idle";
          state.error = null;
          // Reset cache times
          lastFetchTime = 0;
          lastCacheTime = 0;
          console.log('Cart slice - Cleared cart data on auth failure');
        } else if (errorData.type === 'NETWORK_ERROR') {
          // Don't clear cart on network errors, just log
          console.log('Cart slice - Network error during auth init, keeping cart data');
        }
      });
  },
});

export const { 
  clearError, 
  optimisticAddToCart, 
  optimisticUpdateQuantity, 
  optimisticRemoveItem,
  rollbackOptimisticUpdate 
} = cartSlice.actions;
export default cartSlice.reducer;