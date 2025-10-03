// Admin review slice for review management functionality
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewAdminAPI } from "./api.js";

// Async thunks
export const fetchReviewsAdmin = createAsyncThunk(
  "reviewAdmin/fetchReviews",
  async (params, { rejectWithValue }) => {
    try {
      const response = await reviewAdminAPI.getReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const moderateReviewAdmin = createAsyncThunk(
  "reviewAdmin/moderateReview",
  async ({ reviewId, moderationData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await reviewAdminAPI.moderateReview(reviewId, moderationData);
      // Refresh the review list after moderation
      dispatch(fetchReviewsAdmin({ page: 1 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteReviewAdmin = createAsyncThunk(
  "reviewAdmin/deleteReview",
  async (reviewId, { rejectWithValue, dispatch }) => {
    try {
      const response = await reviewAdminAPI.deleteReview(reviewId);
      // Refresh the review list after deletion
      dispatch(fetchReviewsAdmin({ page: 1 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  reviews: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    product: '',
    flagged: '',
    isApproved: '',
    search: '',
  },
  loading: false,
  actionLoading: false,
  error: null,
};

const reviewAdminSlice = createSlice({
  name: "reviewAdmin",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviewsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchReviewsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Moderate review
      .addCase(moderateReviewAdmin.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(moderateReviewAdmin.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(moderateReviewAdmin.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Delete review
      .addCase(deleteReviewAdmin.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteReviewAdmin.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteReviewAdmin.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const { 
  setFilters, 
  setCurrentPage, 
  clearError 
} = reviewAdminSlice.actions;

// Selectors
export const selectReviewAdminReviews = (state) => state.reviewAdmin.reviews;
export const selectReviewAdminLoading = (state) => state.reviewAdmin.loading;
export const selectReviewAdminActionLoading = (state) => state.reviewAdmin.actionLoading;
export const selectReviewAdminError = (state) => state.reviewAdmin.error;
export const selectReviewAdminPagination = (state) => state.reviewAdmin.pagination;
export const selectReviewAdminFilters = (state) => state.reviewAdmin.filters;

// Computed selectors
export const selectReviewsByStatus = (state) => {
  const reviews = state.reviewAdmin.reviews;
  return {
    total: reviews.length,
    approved: reviews.filter(review => review.isApproved).length,
    pending: reviews.filter(review => !review.isApproved && !review.flagged).length,
    flagged: reviews.filter(review => review.flagged).length,
  };
};

export default reviewAdminSlice.reducer;