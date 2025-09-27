import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartApi from "./api.js";

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Cart slice - Fetching cart');
      const response = await cartApi.getCart();
      console.log('Cart slice - Fetch cart response:', response);
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add item to cart';
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
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;