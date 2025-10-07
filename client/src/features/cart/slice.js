import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartApi from "./api.js";
import { logout, initAuth } from "../auth/slice.js";
import { guestCart } from "../../shared/utils/guestStorage.js";

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
        return rejectWithValue('Already loading');
      }
      
      // Cache check: if data is fresh and force is not set, skip fetch
      if (!force && cart.items.length > 0 && now - lastCacheTime < CACHE_TTL) {
        return cart; // Return current cart data
      }
      
      // Cooldown protection for rapid successive calls
      if (!force && now - lastFetchTime < FETCH_COOLDOWN) {
        return rejectWithValue('Too soon');
      }
      
      lastFetchTime = now;
      const response = await cartApi.getCart();
      lastCacheTime = now; // Update cache time on successful fetch
      return response.data.cart;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cart';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, { rejectWithValue }) => {
    try {
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
      return response.data.cart;
    } catch (error) {
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
      const response = await cartApi.updateCartItem(payload);
      return response.data.cart;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update cart item';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeCartItem(payload);
      return response.data.cart;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove item from cart';
      return rejectWithValue(errorMessage);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      return response.data.cart;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to clear cart';
      return rejectWithValue(errorMessage);
    }
  }
);

// Guest cart actions (for non-authenticated users)
export const addToGuestCart = createAsyncThunk(
  "cart/addToGuestCart",
  async (payload, { rejectWithValue }) => {
    try {
      // Validate payload
      if (!payload.productId) {
        throw new Error('Product ID is required');
      }
      if (!payload.variantId && !payload.variantSku) {
        throw new Error('Either variant ID or variant SKU is required');
      }
      if (!payload.quantity || payload.quantity <= 0) {
        payload.quantity = 1;
      }
      
      const updatedCart = guestCart.add(payload);
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add item to guest cart');
    }
  }
);

export const updateGuestCartItem = createAsyncThunk(
  "cart/updateGuestCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const updatedCart = guestCart.update(itemId, quantity);
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update guest cart item');
    }
  }
);

export const removeFromGuestCart = createAsyncThunk(
  "cart/removeFromGuestCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const updatedCart = guestCart.remove(itemId);
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove item from guest cart');
    }
  }
);

export const clearGuestCart = createAsyncThunk(
  "cart/clearGuestCart",
  async (_, { rejectWithValue }) => {
    try {
      const updatedCart = guestCart.clear();
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear guest cart');
    }
  }
);

export const loadGuestCart = createAsyncThunk(
  "cart/loadGuestCart",
  async (_, { rejectWithValue }) => {
    try {
      const guestCartData = guestCart.get();
      return guestCartData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load guest cart');
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
    isGuest: false, // Track if cart is in guest mode
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

    // Guest cart actions
    builder
      .addCase(loadGuestCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isGuest = true;
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = action.payload?.totalItems || 0;
        state.error = null;
      })
      .addCase(addToGuestCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToGuestCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isGuest = true;
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = action.payload?.totalItems || 0;
        state.error = null;
      })
      .addCase(addToGuestCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(updateGuestCartItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateGuestCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isGuest = true;
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = action.payload?.totalItems || 0;
        state.error = null;
      })
      .addCase(updateGuestCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(removeFromGuestCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeFromGuestCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isGuest = true;
        state.items = action.payload?.items || [];
        state.totalAmount = action.payload?.totalAmount || 0;
        state.totalItems = action.payload?.totalItems || 0;
        state.error = null;
      })
      .addCase(removeFromGuestCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(clearGuestCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isGuest = true;
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
        state.error = null;
      });

    // Clear cart data when user logs out or auth fails
    builder
      .addCase(logout, (state) => {
        // On logout, switch to guest mode and load guest cart
        const guestCartData = guestCart.get();
        state.items = guestCartData.items;
        state.totalAmount = guestCartData.totalAmount;
        state.totalItems = guestCartData.totalItems;
        state.isGuest = true;
        state.status = "idle";
        state.error = null;
        // Reset cache times
        lastFetchTime = 0;
        lastCacheTime = 0;
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
        } else if (errorData.type === 'NETWORK_ERROR') {
          // Don't clear cart on network errors
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