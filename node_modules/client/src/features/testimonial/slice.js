import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTestimonialsApi,
  getFeaturedTestimonialsApi,
  getLatestTestimonialsApi,
  getTestimonialByIdApi,
  createTestimonialApi,
  updateTestimonialApi,
  deleteTestimonialApi,
  toggleTestimonialStatusApi,
  toggleFeaturedStatusApi,
  bulkUpdateOrderApi,
  fetchGoogleReviewsApi,
  getTestimonialStatsApi
} from './api.js';

// Async thunks
export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getTestimonialsApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch testimonials');
    }
  }
);

export const fetchFeaturedTestimonials = createAsyncThunk(
  'testimonials/fetchFeatured',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await getFeaturedTestimonialsApi(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured testimonials');
    }
  }
);

export const fetchLatestTestimonials = createAsyncThunk(
  'testimonials/fetchLatest',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await getLatestTestimonialsApi(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch latest testimonials');
    }
  }
);

export const fetchTestimonialById = createAsyncThunk(
  'testimonials/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTestimonialByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch testimonial');
    }
  }
);

export const createTestimonial = createAsyncThunk(
  'testimonials/create',
  async (testimonialData, { rejectWithValue }) => {
    try {
      const response = await createTestimonialApi(testimonialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create testimonial');
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  'testimonials/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateTestimonialApi(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update testimonial');
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  'testimonials/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTestimonialApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete testimonial');
    }
  }
);

export const toggleTestimonialStatus = createAsyncThunk(
  'testimonials/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleTestimonialStatusApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
    }
  }
);

export const toggleFeaturedStatus = createAsyncThunk(
  'testimonials/toggleFeatured',
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleFeaturedStatusApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle featured status');
    }
  }
);

export const bulkUpdateOrder = createAsyncThunk(
  'testimonials/bulkUpdateOrder',
  async (updates, { rejectWithValue }) => {
    try {
      await bulkUpdateOrderApi(updates);
      return updates;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order');
    }
  }
);

export const fetchGoogleReviews = createAsyncThunk(
  'testimonials/fetchGoogleReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchGoogleReviewsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Google reviews');
    }
  }
);

export const fetchTestimonialStats = createAsyncThunk(
  'testimonials/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTestimonialStatsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  testimonials: [],
  featuredTestimonials: [],
  latestTestimonials: [],
  currentTestimonial: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  stats: {
    total: 0,
    active: 0,
    featured: 0,
    manual: 0,
    google: 0,
    ratingDistribution: [],
    averageRating: 0
  },
  loading: false,
  featuredLoading: false,
  latestLoading: false,
  statsLoading: false,
  actionLoading: false,
  googleLoading: false,
  error: null,
  successMessage: null
};

const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCurrentTestimonial: (state) => {
      state.currentTestimonial = null;
    },
    setCurrentTestimonial: (state, action) => {
      state.currentTestimonial = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data || action.payload;
        state.testimonials = responseData.testimonials || responseData;
        state.pagination = responseData.pagination || state.pagination;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch featured testimonials
      .addCase(fetchFeaturedTestimonials.pending, (state) => {
        state.featuredLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedTestimonials.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredTestimonials = action.payload.data || action.payload;
      })
      .addCase(fetchFeaturedTestimonials.rejected, (state, action) => {
        state.featuredLoading = false;
        state.error = action.payload;
      })

      // Fetch latest testimonials
      .addCase(fetchLatestTestimonials.pending, (state) => {
        state.latestLoading = true;
        state.error = null;
      })
      .addCase(fetchLatestTestimonials.fulfilled, (state, action) => {
        state.latestLoading = false;
        state.latestTestimonials = action.payload.data || action.payload;
      })
      .addCase(fetchLatestTestimonials.rejected, (state, action) => {
        state.latestLoading = false;
        state.error = action.payload;
      })

      // Fetch testimonial by ID
      .addCase(fetchTestimonialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonialById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestimonial = action.payload.data || action.payload;
      })
      .addCase(fetchTestimonialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create testimonial
      .addCase(createTestimonial.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (!state.testimonials) state.testimonials = [];
        state.testimonials.unshift(action.payload.data);
        state.successMessage = 'Testimonial created successfully';
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update testimonial
      .addCase(updateTestimonial.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (!state.testimonials) state.testimonials = [];
        const index = state.testimonials.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) {
          state.testimonials[index] = action.payload.data;
        }
        state.currentTestimonial = action.payload.data;
        state.successMessage = 'Testimonial updated successfully';
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (!state.testimonials) state.testimonials = [];
        state.testimonials = state.testimonials.filter(t => t._id !== action.payload);
        state.successMessage = 'Testimonial deleted successfully';
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Toggle status
      .addCase(toggleTestimonialStatus.fulfilled, (state, action) => {
        if (!state.testimonials) state.testimonials = [];
        const index = state.testimonials.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) {
          state.testimonials[index] = action.payload.data;
        }
      })

      // Toggle featured
      .addCase(toggleFeaturedStatus.fulfilled, (state, action) => {
        if (!state.testimonials) state.testimonials = [];
        const index = state.testimonials.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) {
          state.testimonials[index] = action.payload.data;
        }
      })

      // Fetch Google reviews
      .addCase(fetchGoogleReviews.pending, (state) => {
        state.googleLoading = true;
        state.error = null;
      })
      .addCase(fetchGoogleReviews.fulfilled, (state, action) => {
        state.googleLoading = false;
        state.successMessage = `Successfully imported ${action.payload.imported} testimonials from Google`;
      })
      .addCase(fetchGoogleReviews.rejected, (state, action) => {
        state.googleLoading = false;
        state.error = action.payload;
      })

      // Fetch stats
      .addCase(fetchTestimonialStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchTestimonialStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTestimonialStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSuccessMessage, 
  clearCurrentTestimonial, 
  setCurrentTestimonial 
} = testimonialSlice.actions;

export default testimonialSlice.reducer;