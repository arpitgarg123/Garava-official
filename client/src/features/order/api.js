import http, { retryRequest } from "../../shared/api/http.js";

// Order API functions
export const createOrder = async (orderData, cancelToken) => {
  try {
    const response = await retryRequest(() => 
      http.post("/orders/checkout", orderData, { cancelToken })
    );
    return response;
  } catch (error) {
    console.error('Order API - Create order error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserOrders = async (params = {}, cancelToken) => {
  try {
    const response = await retryRequest(() => 
      http.get("/orders", { params, cancelToken })
    );
    return response;
  } catch (error) {
    console.error('Order API - Get orders error:', error.response?.data || error.message);
    throw error;
  }
};

export const getOrderById = async (orderId, cancelToken) => {
  try {
    const response = await retryRequest(() => 
      http.get(`/orders/${orderId}`, { cancelToken })
    );
    return response;
  } catch (error) {
    console.error('Order API - Get order error:', error.response?.data || error.message);
    throw error;
  }
};

export const checkPaymentStatus = async (orderId, cancelToken) => {
  try {
    const response = await retryRequest(() => 
      http.post(`/orders/${orderId}/payment-status`, {}, { cancelToken })
    );
    // Return the data directly to match expected format
    return response.data;
  } catch (error) {
    console.error('Payment status check failed:', error.response?.data || error.message);
    throw error;
  }
};

// Process payment with PhonePe
export const initiatePhonePePayment = async (orderData, cancelToken) => {
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
    console.error('PhonePe payment initiation failed:', error.response?.data || error.message);
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