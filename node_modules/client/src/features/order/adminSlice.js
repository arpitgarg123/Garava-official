import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminApi from "./admin.api";

// Async thunks for admin order operations
export const fetchOrdersAdmin = createAsyncThunk(
  "orderAdmin/fetchOrders",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.listOrdersAdmin(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrderByIdAdmin = createAsyncThunk(
  "orderAdmin/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getOrderByIdAdmin(orderId);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOrderStatusAdmin = createAsyncThunk(
  "orderAdmin/updateOrderStatus",
  async ({ orderId, statusData }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.updateOrderStatus(orderId, statusData);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const refundOrderAdmin = createAsyncThunk(
  "orderAdmin/refundOrder",
  async ({ orderId, refundData }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.refundOrder(orderId, refundData);
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  orders: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  filters: {
    q: '',           // Search query
    status: '',      // Order status
    paymentStatus: '', // Payment status
    user: '',        // User filter
    page: 1          // Current page
  },
  selectedOrder: null,
  loading: false,
  error: null,
  operationLoading: false, // For update, refund operations
  operationError: null,
  orderDetailsLoading: false,
};

const orderAdminSlice = createSlice({
  name: "orderAdmin",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { 
        q: '', 
        status: '', 
        paymentStatus: '', 
        user: '', 
        page: 1 
      };
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.operationError = null;
    },
    updateOrderInList: (state, action) => {
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrdersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrdersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch order by ID
      .addCase(fetchOrderByIdAdmin.pending, (state) => {
        state.orderDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdAdmin.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderByIdAdmin.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.error = action.payload;
      })
      
      // Update order status
      .addCase(updateOrderStatusAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        // Update order in list
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update selected order if it's the same
        if (state.selectedOrder && state.selectedOrder._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updateOrderStatusAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      
      // Refund order
      .addCase(refundOrderAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(refundOrderAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        // Update order in list
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update selected order if it's the same
        if (state.selectedOrder && state.selectedOrder._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(refundOrderAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  setSelectedOrder, 
  clearSelectedOrder, 
  clearErrors,
  updateOrderInList 
} = orderAdminSlice.actions;

export default orderAdminSlice.reducer;