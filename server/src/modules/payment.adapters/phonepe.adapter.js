import axios from "axios";
import crypto from "crypto";
import { simulatePhonePeOrder, simulatePaymentStatus } from "./phonepe.simulator.js";

// PhonePe PG Configuration - Load dynamically to ensure env vars are available
const getPhonePeConfig = () => ({
  merchantId: process.env.PHONEPE_CLIENT_ID, // Merchant ID (e.g., GRAVAONLINE)
  saltKey: process.env.PHONEPE_CLIENT_SECRET, // Salt Key from API Keys section
  saltIndex: process.env.PHONEPE_KEY_INDEX || "1", // Key Index from API Keys section
  apiUrl: process.env.PHONEPE_API_URL || "https://api.phonepe.com/apis/hermes",
  redirectUrl: process.env.PHONEPE_REDIRECT_URL || "http://localhost:5173/payment/callback",
  callbackUrl: process.env.PHONEPE_CALLBACK_URL || "http://localhost:8080/webhooks/payments/phonepe"
});

/**
 * Generate X-VERIFY checksum for PhonePe v1 API
 * @param {string} base64Payload - Base64 encoded payload
 * @param {string} endpoint - API endpoint path
 * @returns {string} - Checksum
 */
const generateChecksum = (base64Payload, endpoint) => {
  const config = getPhonePeConfig();
  const stringToHash = base64Payload + endpoint + config.saltKey;
  const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256Hash}###${config.saltIndex}`;
};


/**
 * Create PhonePe payment order using v1 API (Standard Checkout)
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
  if (!PHONEPE_CONFIG.merchantId || !PHONEPE_CONFIG.saltKey) {
    throw new Error("PhonePe payment gateway is not configured. Please set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET environment variables.");
  }

  try {
    // Generate merchant transaction ID (max 34 chars for v1 API)
    const timestamp = Date.now().toString().slice(-8);
    const shortOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(-10);
    const merchantTransactionId = `MT${shortOrderId}${timestamp}`;
    
    // Create payment request payload for v1 API (Standard Checkout)
    const paymentPayload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 36), // Max 36 chars
      amount: amountPaise, // Amount in paisa
      redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?orderId=${orderId}`,
      redirectMode: "REDIRECT",
      callbackUrl: PHONEPE_CONFIG.callbackUrl,
      mobileNumber: userPhone,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Encode payload to base64
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    
    // Generate X-VERIFY checksum
    const endpoint = '/pg/v1/pay';
    const checksum = generateChecksum(base64Payload, endpoint);

    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'Accept': 'application/json'
    };

    console.log('🔐 PhonePe v1 API Request:', {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId,
      amount: amountPaise,
      endpoint: `${PHONEPE_CONFIG.apiUrl}${endpoint}`
    });

    const response = await axios.post(
      `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
      { request: base64Payload },
      { headers }
    );

    console.log('✅ PhonePe Order Created:', response.data);

    return {
      success: response.data.success,
      transactionId: merchantTransactionId,
      paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
      gatewayOrderId: merchantTransactionId,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('PhonePe order creation failed:', error.response?.data || error.message);
    
    // Only use simulator for placeholder credentials in development
    const isPlaceholderCredentials = PHONEPE_CONFIG.merchantId.includes('your_client_id') || 
                                   PHONEPE_CONFIG.merchantId.includes('CLIENT_ID');
    
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
 * Check PhonePe payment status using v1 API
 * @param {string} merchantTransactionId - Merchant Transaction ID
 * @returns {Object} - Payment status
 */
export const checkPhonePePaymentStatus = async (merchantTransactionId) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  // Check if this is a simulator transaction - handle directly
  const isSimulatorTransaction = merchantTransactionId.startsWith('SIM_');
  if (isSimulatorTransaction) {
    console.log('🎭 Simulator transaction detected, using simulator directly:', merchantTransactionId);
    const simulatorResponse = await simulatePaymentStatus(merchantTransactionId);
    console.log('📄 Simulator response:', simulatorResponse);
    return simulatorResponse;
  }
  
  try {
    // Generate X-VERIFY checksum for status check
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`;
    const checksum = generateChecksum('', endpoint);

    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'Accept': 'application/json'
    };

    console.log('🔍 Checking PhonePe status:', {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId,
      endpoint: `${PHONEPE_CONFIG.apiUrl}${endpoint}`
    });

    const response = await axios.get(
      `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
      { headers }
    );

    console.log('📊 PhonePe Status Response:', response.data);

    const paymentData = response.data.data;
    const isSuccess = response.data.success && paymentData.state === 'COMPLETED';

    return {
      success: isSuccess,
      transactionId: merchantTransactionId,
      paymentStatus: paymentData.state,
      amount: paymentData.amount,
      gatewayOrderId: merchantTransactionId,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('PhonePe status check failed:', error.response?.data || error.message);
    
    // Handle rate limiting (429) by providing a fallback response
    if (error.response?.status === 429) {
      console.warn('PhonePe API rate limit reached, returning pending status');
      return {
        success: false,
        transactionId: merchantTransactionId,
        paymentStatus: 'PENDING', // Indicate payment is still pending
        amount: null,
        gatewayOrderId: null,
        rawResponse: { error: 'Rate limit exceeded', retryAfter: error.response?.headers?.['retry-after'] || 60 }
      };
    }
    
    // Use simulator for development or if transaction ID indicates simulator was used
    const isPlaceholderCredentials = getPhonePeConfig().merchantId.includes('your_client_id') || 
                                   getPhonePeConfig().merchantId.includes('CLIENT_ID');
    const isSimulatorTransaction = merchantTransactionId.startsWith('SIM_');
    
    if (((error.response?.data?.code === 'UNAUTHORIZED' || error.response?.status === 401) && 
        process.env.NODE_ENV === 'development' && 
        isPlaceholderCredentials) || isSimulatorTransaction) {
      console.log('🔧 Using PhonePe simulator for status check:', merchantTransactionId);
      const simulatorResponse = await simulatePaymentStatus(merchantTransactionId);
      console.log('📄 Simulator response:', simulatorResponse);
      return simulatorResponse;
    }
    
    throw new Error(`PhonePe status check failed: ${error.response?.data?.message || error.message}`);
  }
};


/**
 * Verify PhonePe webhook callback (v1 API)
 * @param {Object} payload - Webhook payload (base64 encoded in request body)
 * @param {Object} headers - Request headers containing X-VERIFY
 * @returns {boolean} - Verification result
 */
export const verifyPhonePeCallback = (base64Payload, xVerifyHeader) => {
  try {
    const config = getPhonePeConfig();
    
    if (!base64Payload || !xVerifyHeader) {
      console.error('PhonePe callback verification failed: Missing payload or X-VERIFY header');
      return false;
    }

    // Extract checksum from X-VERIFY header (format: checksum###keyIndex)
    const [receivedChecksum, keyIndex] = xVerifyHeader.split('###');
    
    if (keyIndex !== config.saltIndex) {
      console.error('PhonePe callback verification failed: Invalid key index');
      return false;
    }

    // Generate expected checksum
    const endpoint = '/pg/v1/pay';
    const expectedChecksum = generateChecksum(base64Payload, endpoint).split('###')[0];
    
    if (receivedChecksum !== expectedChecksum) {
      console.error('PhonePe callback verification failed: Checksum mismatch');
      return false;
    }

    // Decode and validate payload
    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const payload = JSON.parse(payloadStr);
    
    if (!payload || !payload.merchantTransactionId) {
      console.error('PhonePe callback verification failed: Invalid payload structure');
      return false;
    }

    console.log('✅ PhonePe webhook verified for transaction:', payload.merchantTransactionId);
    
    return true;
     
  } catch (error) {
    console.error('PhonePe callback verification error:', error.message);
    return false;
  }
};


/**
 * Process PhonePe refund using v1 API
 * @param {Object} params - Refund parameters
 * @param {string} params.originalTransactionId - Original merchant transaction ID
 * @param {number} params.amountPaise - Refund amount in paise
 * @param {string} params.orderId - Order ID for reference
 * @returns {Object} - Refund response
 */
export const createPhonePeRefund = async ({ originalTransactionId, amountPaise, orderId }) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  // Check if PhonePe is properly configured
  if (!PHONEPE_CONFIG.merchantId || !PHONEPE_CONFIG.saltKey) {
    throw new Error("PhonePe refund failed: Payment gateway is not configured. Please set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET environment variables.");
  }

  try {
    // Generate refund ID (max 34 chars)
    const timestamp = Date.now().toString().slice(-8);
    const merchantRefundId = `RF${orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(-10)}${timestamp}`;
    
    const refundPayload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantUserId: `USER_${orderId.slice(-10)}`,
      originalTransactionId: originalTransactionId,
      merchantTransactionId: merchantRefundId,
      amount: amountPaise,
      callbackUrl: PHONEPE_CONFIG.callbackUrl
    };

    // Encode payload to base64
    const base64Payload = Buffer.from(JSON.stringify(refundPayload)).toString('base64');
    
    // Generate X-VERIFY checksum
    const endpoint = '/pg/v1/refund';
    const checksum = generateChecksum(base64Payload, endpoint);

    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'Accept': 'application/json'
    };

    console.log('🔁 PhonePe Refund Request:', {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantRefundId,
      amount: amountPaise,
      originalTransactionId
    });

    const response = await axios.post(
      `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
      { request: base64Payload },
      { headers }
    );

    console.log('✅ PhonePe Refund Initiated:', response.data);

    return {
      success: response.data.success,
      refundTransactionId: merchantRefundId,
      status: response.data.data?.state || 'PENDING',
      refundId: merchantRefundId,
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