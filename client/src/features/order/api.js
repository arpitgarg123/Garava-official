import http, { retryRequest } from "../../shared/api/http.js";

// Order API functions
export const createOrder = async (orderData, cancelToken) => {
  console.log('Order API - Creating order:', orderData);
  try {
    const response = await retryRequest(() => 
      http.post("/api/orders/checkout", orderData, { cancelToken })
    );
    console.log('Order API - Create order success:', response.data);
    return response;
  } catch (error) {
    console.error('Order API - Create order error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserOrders = async (params = {}, cancelToken) => {
  console.log('Order API - Getting user orders:', params);
  try {
    const response = await retryRequest(() => 
      http.get("/api/orders", { params, cancelToken })
    );
    console.log('Order API - Get orders success:', response.data);
    return response;
  } catch (error) {
    console.error('Order API - Get orders error:', error.response?.data || error.message);
    throw error;
  }
};

export const getOrderById = async (orderId, cancelToken) => {
  console.log('Order API - Getting order by ID:', orderId);
  try {
    const response = await retryRequest(() => 
      http.get(`/api/orders/${orderId}`, { cancelToken })
    );
    console.log('Order API - Get order success:', response.data);
    return response;
  } catch (error) {
    console.error('Order API - Get order error:', error.response?.data || error.message);
    throw error;
  }
};

export const checkPaymentStatus = async (orderId, cancelToken) => {
  console.log('Order API - Checking payment status for order:', orderId);
  try {
    const response = await retryRequest(() => 
      http.post(`/api/orders/${orderId}/payment-status`, {}, { cancelToken })
    );
    console.log('Order API - Payment status check success:', response.data);
    return response;
  } catch (error) {
    console.error('Order API - Payment status check error:', error.response?.data || error.message);
    throw error;
  }
};

// Process payment with PhonePe
export const initiatePhonePePayment = async (orderData, cancelToken) => {
  console.log('Order API - Initiating PhonePe payment:', orderData);
  try {
    // First create the order
    const orderResponse = await createOrder(orderData, cancelToken);
    
    // If payment method is phonepe and we have a payment URL, redirect
    if (orderResponse.data.gatewayOrder?.paymentUrl) {
      return {
        success: true,
        order: orderResponse.data.order,
        paymentUrl: orderResponse.data.gatewayOrder.paymentUrl,
        gatewayOrder: orderResponse.data.gatewayOrder
      };
    }
    
    // For COD or other payment methods
    return {
      success: true,
      order: orderResponse.data.order,
      paymentUrl: null,
      gatewayOrder: orderResponse.data.gatewayOrder
    };
    
  } catch (error) {
    console.error('Order API - PhonePe payment initiation error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  checkPaymentStatus,
  initiatePhonePePayment
};