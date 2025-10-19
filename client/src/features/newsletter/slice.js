import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api';

// Async thunks
export const fetchNewsletterSubscribers = createAsyncThunk(
  'newsletter/fetchSubscribers',
  async ({ page = 1, limit = 20, status = '' }, { rejectWithValue }) => {
    try {
      const response = await api.listNewsletterSubscribers({ page, limit, status });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch newsletter subscribers'
      );
    }
  }
);

export const subscribeNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.subscribeToNewsletter(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to subscribe to newsletter'
      );
    }
  }
);

export const unsubscribeNewsletter = createAsyncThunk(
  'newsletter/unsubscribe',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.unsubscribeFromNewsletter(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to unsubscribe from newsletter'
      );
    }
  }
);

const initialState = {
  subscribers: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  },
  filters: {
    status: '',
    search: '',
  },
  loading: false,
  error: null,
  subscribeLoading: false,
  subscribeError: null,
};

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: '', search: '' };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscribers
      .addCase(fetchNewsletterSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsletterSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.subscribers || [];
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 20,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 1,
        };
      })
      .addCase(fetchNewsletterSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Subscribe
      .addCase(subscribeNewsletter.pending, (state) => {
        state.subscribeLoading = true;
        state.subscribeError = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.subscribeLoading = false;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.subscribeLoading = false;
        state.subscribeError = action.payload;
      })
      // Unsubscribe
      .addCase(unsubscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsubscribeNewsletter.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(unsubscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setPage } = newsletterSlice.actions;
export default newsletterSlice.reducer;
