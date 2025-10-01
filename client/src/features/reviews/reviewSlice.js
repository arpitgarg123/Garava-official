import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewAPI } from './api';

// Fetch product reviews with pagination & sorting
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, page = 1, limit = 5, sort = 'recent' }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getReviews({ productId, page, limit, sort });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Add new review
export const addProductReview = createAsyncThunk(
  'reviews/addProductReview',
  async ({ productId, rating, title, body, photos = [] }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.createReview(productId, { 
        rating, title, body, photos 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Update existing review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, rating, title, body, photos = [] }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, {
        rating, title, body, photos
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Vote on a review (helpful/unhelpful)
export const voteOnReview = createAsyncThunk(
  'reviews/voteOnReview',
  async ({ reviewId, type }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.voteOnReview(reviewId, type);
      return { ...response.data, reviewId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  reviews: [],
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0
  },
  status: 'idle',
  error: null
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews(state) {
      state.reviews = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload.reviews || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      
      // Add review
      .addCase(addProductReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.review) {
          state.reviews.unshift(action.payload.review);
        }
        state.error = null;
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add review';
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.review) {
          const index = state.reviews.findIndex(r => r._id === action.payload.review._id);
          if (index !== -1) {
            state.reviews[index] = action.payload.review;
          }
        }
        state.error = null;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update review';
      })
      
      // Vote on review
      .addCase(voteOnReview.fulfilled, (state, action) => {
        const { reviewId, helpfulCount, unhelpfulCount } = action.payload;
        const review = state.reviews.find(r => r._id === reviewId);
        if (review) {
          review.helpfulCount = helpfulCount;
          review.unhelpfulCount = unhelpfulCount;
        }
      });
  }
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;