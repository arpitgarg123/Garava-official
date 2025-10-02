import axios from "axios";
import { simulatePhonePeOrder, simulatePaymentStatus } from "./phonepe.simulator.js";

// PhonePe PG Configuration - Load dynamically to ensure env vars are available
const getPhonePeConfig = () => ({
  clientId: process.env.PHONEPE_CLIENT_ID,
  clientSecret: process.env.PHONEPE_CLIENT_SECRET,
  clientVersion: process.env.PHONEPE_CLIENT_VERSION || "1.0",
  apiUrl: process.env.PHONEPE_API_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox",
  authUrl: process.env.PHONEPE_AUTH_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox",
  redirectUrl: process.env.PHONEPE_REDIRECT_URL || "http://localhost:5173/payment/callback",
  callbackUrl: process.env.PHONEPE_CALLBACK_URL || "http://localhost:8080/webhooks/payments/phonepe"
});

// Token cache to avoid frequent token generation
let tokenCache = {
  token: null,
  expiresAt: 0
}; 
 
/**
 * Generate PhonePe OAuth access token
 * @returns {string} - Access token
 */
const getAccessToken = async () => {
  const config = getPhonePeConfig();
  
  // Check if cached token is still valid (with 5 minutes buffer)
  if (tokenCache.token && Date.now() < (tokenCache.expiresAt - 5 * 60 * 1000)) {
    return tokenCache.token;
  }

  try {
    const authResponse = await axios.post(
      `${config.authUrl}/v1/oauth/token`,
      new URLSearchParams({
        client_id: config.clientId,
        client_version: config.clientVersion,
        client_secret: config.clientSecret,
        grant_type: 'client_credentials'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, expires_at } = authResponse.data;
    
    // Cache the token
    tokenCache.token = access_token;
    tokenCache.expiresAt = expires_at * 1000; // Convert to milliseconds

    return access_token;
  } catch (error) {
    console.error('PhonePe token generation failed:', error.response?.data || error.message);
    throw new Error(`PhonePe authentication failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Create PhonePe payment order using v2 API
 * @param {Object} params - Order parameters
 * @param {number} params.amountPaise - Amount in paise
 * @param {string} params.orderId - Unique order ID
 * @param {string} params.userId - User ID
 * @param {string} params.userPhone - User phone number
 * @returns {Object} - PhonePe order response
 */
export const createPhonePeOrder = async ({ amountPaise, orderId, userId, userPhone }) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  // Check if PhonePe is properly configured
  if (!PHONEPE_CONFIG.clientId || !PHONEPE_CONFIG.clientSecret) {
    throw new Error("PhonePe payment gateway is not configured. Please set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET environment variables.");
  }

  try {
    // Get access token
    const accessToken = await getAccessToken();
    
    // Generate merchant order ID (max 63 chars, no special chars except _ and -)
    const timestamp = Date.now().toString().slice(-8);
    const shortOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(-10);
    const merchantOrderId = `TXN_${shortOrderId}_${timestamp}`;
    
    // Create payment request payload for v2 API
    const paymentPayload = {
      merchantOrderId: merchantOrderId,
      amount: amountPaise, // Amount in paisa
      expireAfter: 1200, // 20 minutes expiry
      metaInfo: {
        udf1: orderId,
        udf2: userId,
        udf3: userPhone
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment for your order",
        merchantUrls: {
          redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?orderId=${orderId}`
        }
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${accessToken}`,
      'Accept': 'application/json'
    };

    const response = await axios.post(
      `${PHONEPE_CONFIG.apiUrl}/checkout/v2/pay`,
      paymentPayload,
      { headers }
    );

    return {
      success: true,
      transactionId: merchantOrderId,
      paymentUrl: response.data.redirectUrl,
      gatewayOrderId: response.data.orderId,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('PhonePe order creation failed:', error.response?.data || error.message);
    
    // Only use simulator for placeholder credentials in development
    const isPlaceholderCredentials = PHONEPE_CONFIG.clientId.includes('your_client_id') || 
                                   PHONEPE_CONFIG.clientId.includes('CLIENT_ID');
    
    if ((error.response?.data?.code === 'UNAUTHORIZED' || error.response?.status === 401) && 
        process.env.NODE_ENV === 'development' && 
        isPlaceholderCredentials) {
      console.log('🔧 Using PhonePe simulator (placeholder credentials detected)');
      console.log('💡 Get real PhonePe credentials from https://business.phonepe.com/');
      return await simulatePhonePeOrder({ amountPaise, orderId, userId, userPhone });
    }
    
    throw new Error(`PhonePe order creation failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Check PhonePe payment status using v2 API
 * @param {string} merchantOrderId - Merchant Order ID
 * @returns {Object} - Payment status
 */
export const checkPhonePePaymentStatus = async (merchantOrderId) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  // Check if this is a simulator transaction - handle directly
  const isSimulatorTransaction = merchantOrderId.startsWith('SIM_');
  if (isSimulatorTransaction) {
    console.log('🎭 Simulator transaction detected, using simulator directly:', merchantOrderId);
    const simulatorResponse = await simulatePaymentStatus(merchantOrderId);
    console.log('📄 Simulator response:', simulatorResponse);
    return simulatorResponse;
  }
  
  try {
    // Get access token
    const accessToken = await getAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${accessToken}`,
      'Accept': 'application/json'
    };

    const response = await axios.get(
      `${PHONEPE_CONFIG.apiUrl}/checkout/v2/order/${merchantOrderId}/status`,
      { headers }
    );

    return {
      success: response.data.state === 'COMPLETED',
      transactionId: merchantOrderId,
      paymentStatus: response.data.state,
      amount: response.data.amount,
      gatewayOrderId: response.data.orderId,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('PhonePe status check failed:', error.response?.data || error.message);
    
    // Handle rate limiting (429) by providing a fallback response
    if (error.response?.status === 429) {
      console.warn('PhonePe API rate limit reached, returning pending status');
      return {
        success: false,
        transactionId: merchantOrderId,
        paymentStatus: 'PENDING', // Indicate payment is still pending
        amount: null,
        gatewayOrderId: null,
        rawResponse: { error: 'Rate limit exceeded', retryAfter: error.response?.headers?.['retry-after'] || 60 }
      };
    }
    
    // Use simulator for development or if transaction ID indicates simulator was used
    const isPlaceholderCredentials = getPhonePeConfig().clientId.includes('your_client_id') || 
                                   getPhonePeConfig().clientId.includes('CLIENT_ID');
    const isSimulatorTransaction = merchantOrderId.startsWith('SIM_');
    
    if (((error.response?.data?.code === 'UNAUTHORIZED' || error.response?.status === 401) && 
        process.env.NODE_ENV === 'development' && 
        isPlaceholderCredentials) || isSimulatorTransaction) {
      console.log('🔧 Using PhonePe simulator for status check:', merchantOrderId);
      const simulatorResponse = await simulatePaymentStatus(merchantOrderId);
      console.log('📄 Simulator response:', simulatorResponse);
      return simulatorResponse;
    }
    
    throw new Error(`PhonePe status check failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Verify PhonePe webhook callback (v2 API uses different verification)
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Request headers
 * @returns {boolean} - Verification result
 */
export const verifyPhonePeCallback = (payload, headers) => {
  try {
    // For v2 API, PhonePe webhook verification is different
    // The webhook payload contains order details that can be verified
    // by checking the order status via API
    
    if (!payload || !payload.merchantOrderId) {
      console.error('PhonePe callback verification failed: Invalid payload');
      return false;
    }

    // Basic payload validation
    const requiredFields = ['merchantOrderId', 'orderId', 'state'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        console.error(`PhonePe callback verification failed: Missing ${field}`);
        return false;
      }
    }

    // For additional security, you should verify the webhook by calling
    // the order status API to confirm the payment status
    console.log('PhonePe webhook received for order:', payload.merchantOrderId);
    
    return true;
     
  } catch (error) {
    console.error('PhonePe callback verification error:', error.message);
    return false;
  }
};

/**
 * Process PhonePe refund using v2 API
 * @param {Object} params - Refund parameters
 * @param {string} params.originalTransactionId - Original merchant order ID
 * @param {number} params.amountPaise - Refund amount in paise
 * @param {string} params.orderId - Order ID for reference
 * @returns {Object} - Refund response
 */
export const createPhonePeRefund = async ({ originalTransactionId, amountPaise, orderId }) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  // Check if PhonePe is properly configured
  if (!PHONEPE_CONFIG.clientId || !PHONEPE_CONFIG.clientSecret) {
    throw new Error("PhonePe refund failed: Payment gateway is not configured. Please set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET environment variables.");
  }

  try {
    // Get access token
    const accessToken = await getAccessToken();
    
    // Generate refund ID
    const timestamp = Date.now().toString().slice(-8);
    const merchantRefundId = `REFUND_${orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(-10)}_${timestamp}`;
    
    const refundPayload = {
      merchantRefundId: merchantRefundId,
      originalMerchantOrderId: originalTransactionId,
      amount: amountPaise,
      reason: "Customer requested refund"
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${accessToken}`,
      'Accept': 'application/json'
    };

    const response = await axios.post(
      `${PHONEPE_CONFIG.apiUrl}/payments/v2/refund`,
      refundPayload,
      { headers }
    );

    return {
      success: true,
      refundTransactionId: merchantRefundId,
      status: response.data.state,
      refundId: response.data.refundId,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('PhonePe refund failed:', error.response?.data || error.message);
    throw new Error(`PhonePe refund failed: ${error.response?.data?.message || error.message}`);
  }
};

export default {
  createPhonePeOrder,
  checkPhonePePaymentStatus,
  verifyPhonePeCallback,
  createPhonePeRefund
};