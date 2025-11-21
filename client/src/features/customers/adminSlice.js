import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminApi from "./admin.api";

// Async thunks for admin customer operations
export const fetchCustomersAdmin = createAsyncThunk(
  "customerAdmin/fetchCustomers",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.listCustomersAdmin(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCustomerStats = createAsyncThunk(
  "customerAdmin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getCustomerStats();
      return data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCustomerByIdAdmin = createAsyncThunk(
  "customerAdmin/fetchCustomerById",
  async (customerId, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getCustomerByIdAdmin(customerId);
      return data.customer;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  customers: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  filters: {
    q: '',           // Search query
    minOrders: undefined, // Minimum orders
    maxOrders: undefined, // Maximum orders
    newsletter: undefined, // Newsletter subscription filter
    page: 1          // Current page
  },
  stats: {
    totalCustomers: 0,
    newThisMonth: 0,
    activeCustomers: 0,
    newsletterSubscribers: 0,
  },
  selectedCustomer: null,
  loading: false,
  error: null,
  statsLoading: false,
  statsError: null,
  customerDetailsLoading: false,
};

const customerAdminSlice = createSlice({
  name: "customerAdmin",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { 
        q: '', 
        minOrders: undefined,
        maxOrders: undefined,
        newsletter: undefined,
        page: 1 
      };
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch customer stats
      .addCase(fetchCustomerStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })
      
      // Fetch customer by ID
      .addCase(fetchCustomerByIdAdmin.pending, (state) => {
        state.customerDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerByIdAdmin.fulfilled, (state, action) => {
        state.customerDetailsLoading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerByIdAdmin.rejected, (state, action) => {
        state.customerDetailsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  setSelectedCustomer, 
  clearSelectedCustomer, 
  clearErrors
} = customerAdminSlice.actions;

export default customerAdminSlice.reducer;
