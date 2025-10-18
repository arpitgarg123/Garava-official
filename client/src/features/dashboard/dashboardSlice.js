import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats } from '../order/admin.api';

// Async thunk to fetch dashboard statistics
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardStats();
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      revenue: { total: 0, today: 0, currency: 'INR' },
      orders: { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, needsAttention: 0 },
      products: { total: 0, active: 0, draft: 0, outOfStock: 0, lowStock: 0, needsAttention: 0 },
      reviews: { total: 0, approved: 0, pending: 0, avgRating: 0, needsAttention: 0 },
      appointments: { total: 0, pending: 0, confirmed: 0, upcoming: 0, needsAttention: 0 },
      customers: { total: 0, new: 0 }
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
