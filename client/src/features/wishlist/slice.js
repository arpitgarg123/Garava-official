import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as wishlistApi from "./api.js";

// Async thunks for wishlist operations
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('Wishlist slice - Fetching wishlist:', params);
      const response = await wishlistApi.getWishlist(params);
      console.log('Wishlist slice - Fetch wishlist response:', response);
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
        const { productId, action: wishlistAction } = action.payload;
        
        if (wishlistAction === "added") {
          // Add to quick lookup if not already present
          if (!state.productIds.includes(productId)) {
            state.productIds.push(productId);
          }
        } else if (wishlistAction === "removed") {
          // Remove from products array
          state.products = state.products.filter(item => 
            (item.productId || item.product?._id) !== productId
          );
          
          // Remove from quick lookup
          state.productIds = state.productIds.filter(id => id !== productId);
          
          // Update pagination
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearWishlistError, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;