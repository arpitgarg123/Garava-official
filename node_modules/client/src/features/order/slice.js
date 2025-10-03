import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderAPI from './api';

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Order slice - Creating order:', orderData);
      const response = await orderAPI.createOrder(orderData);
      return response.data;
    } catch (error) {
      console.error('Order slice - Create order error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const initiatePayment = createAsyncThunk(
  'order/initiatePayment',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Order slice - Initiating payment:', orderData);
      const response = await orderAPI.initiatePhonePePayment(orderData);
      return response;
    } catch (error) {
      console.error('Order slice - Payment initiation error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('Order slice - Fetching user orders:', params);
      const response = await orderAPI.getUserOrders(params);
      return response.data;
    } catch (error) {
      console.error('Order slice - Fetch orders error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('Order slice - Fetching order by ID:', orderId);
      const response = await orderAPI.getOrderById(orderId);
      return response.data;
    } catch (error) {
      console.error('Order slice - Fetch order error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  'order/checkPaymentStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('Order slice - Checking payment status:', orderId);
      const response = await orderAPI.checkPaymentStatus(orderId);
      return response.data;
    } catch (error) {
      console.error('Order slice - Payment status check error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  // Current order being processed
  currentOrder: null,
  
  // Orders list
  orders: [],
  ordersLoading: false,
  ordersError: null,
  
  // Order creation
  creating: false,
  createError: null,
  
  // Payment processing
  paymentProcessing: false,
  paymentError: null,
  paymentUrl: null,
  
  // Single order details
  orderDetails: null,
  orderDetailsLoading: false,
  orderDetailsError: null,
  
  // Payment status checking
  statusChecking: false,
  statusError: null,
  
  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.paymentUrl = null;
    },
    
    // Clear errors
    clearCreateError: (state) => {
      state.createError = null;
    },
    
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    
    clearOrdersError: (state) => {
      state.ordersError = null;
    },
    
    // Set payment URL for redirect
    setPaymentUrl: (state, action) => {
      state.paymentUrl = action.payload;
    },
    
    // Update order status (for real-time updates)
    updateOrderStatus: (state, action) => {
      const { orderId, status, paymentStatus } = action.payload;
      
      // Update current order if it matches
      if (state.currentOrder?._id === orderId) {
        state.currentOrder.status = status;
        if (paymentStatus) {
          state.currentOrder.payment.status = paymentStatus;
        }
      }
      
      // Update in orders list
      const orderIndex = state.orders.findIndex(order => order._id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
        if (paymentStatus) {
          state.orders[orderIndex].payment.status = paymentStatus;
        }
      }
      
      // Update order details if it matches
      if (state.orderDetails?._id === orderId) {
        state.orderDetails.status = status;
        if (paymentStatus) {
          state.orderDetails.payment.status = paymentStatus;
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.currentOrder = action.payload.order;
        state.createError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload?.message || 'Failed to create order';
      });

    // Initiate Payment
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.paymentProcessing = true;
        state.paymentError = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.paymentProcessing = false;
        state.currentOrder = action.payload.order;
        state.paymentUrl = action.payload.paymentUrl;
        state.paymentError = null;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.paymentProcessing = false;
        state.paymentError = action.payload?.message || 'Failed to initiate payment';
      });

    // Fetch User Orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.orders || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload?.message || 'Failed to fetch orders';
      });

    // Fetch Order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.orderDetailsLoading = true;
        state.orderDetailsError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetails = action.payload.order;
        state.orderDetailsError = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetailsError = action.payload?.message || 'Failed to fetch order details';
      });

    // Check Payment Status
    builder
      .addCase(checkPaymentStatus.pending, (state) => {
        state.statusChecking = true;
        state.statusError = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.statusChecking = false;
        
        // Update current order if payment status changed
        if (state.currentOrder && action.payload.order) {
          state.currentOrder = action.payload.order;
        }
        
        // Update order details if payment status changed
        if (state.orderDetails && action.payload.order) {
          state.orderDetails = action.payload.order;
        }
        
        state.statusError = null;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.statusChecking = false;
        state.statusError = action.payload?.message || 'Failed to check payment status';
      });
  }
});

export const {
  clearCurrentOrder,
  clearCreateError,
  clearPaymentError,
  clearOrdersError,
  setPaymentUrl,
  updateOrderStatus
} = orderSlice.actions;

export default orderSlice.reducer;