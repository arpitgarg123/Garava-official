import crypto from "crypto";
import axios from "axios";
import { simulatePhonePeOrder, simulatePaymentStatus } from "./phonepe.simulator.js";

// PhonePe PG Configuration - Load dynamically to ensure env vars are available
const getPhonePeConfig = () => ({
  merchantId: process.env.PHONEPE_MERCHANT_ID,
  saltKey: process.env.PHONEPE_SALT_KEY,
  saltIndex: process.env.PHONEPE_SALT_INDEX || "1",
  apiUrl: process.env.PHONEPE_API_URL || "https://api.phonepe.com/apis/hermes",
  redirectUrl: process.env.PHONEPE_REDIRECT_URL || "http://localhost:5173/payment/callback",
  callbackUrl: process.env.PHONEPE_CALLBACK_URL || "http://localhost:8080/webhooks/payments/phonepe"
});

/**
 * Generate PhonePe checksum
 * @param {string} payload - Base64 encoded payload
 * @param {string} endpoint - API endpoint path
 * @returns {string} - Checksum
 */
const generateChecksum = (payload, endpoint) => {
  const config = getPhonePeConfig();
  const stringToHash = payload + endpoint + config.saltKey;
  const checksum = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${checksum}###${config.saltIndex}`;
};

/**
 * Create PhonePe payment order
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
    throw new Error("PhonePe payment gateway is not configured. Please set PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY environment variables.");
  }

  try {
    // Generate shorter transaction ID (max 38 chars)
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const shortOrderId = orderId.slice(-10); // Last 10 chars of order ID
    const transactionId = `TXN${shortOrderId}${timestamp}`;
    
    const paymentPayload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amountPaise, // PhonePe expects amount in paise
      redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?orderId=${orderId}`,
      redirectMode: "POST",
      callbackUrl: PHONEPE_CONFIG.callbackUrl,
      mobileNumber: userPhone,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Encode payload to base64
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    
    // Generate checksum
    const endpoint = "/pg/v1/pay";
    const checksum = generateChecksum(base64Payload, endpoint);

    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      'accept': 'application/json'
    };

    const requestBody = {
      request: base64Payload
    };

    const response = await axios.post(
      `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
      requestBody,
      { headers }
    );

    return {
      success: response.data.success,
      transactionId,
      paymentUrl: response.data.data?.instrumentResponse?.redirectInfo?.url,
      gatewayOrderId: transactionId,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('PhonePe order creation failed:', error.response?.data || error.message);
    
    // Only use simulator for placeholder credentials in development
    const isPlaceholderCredentials = PHONEPE_CONFIG.merchantId.includes('your_merchant_id') || 
                                   PHONEPE_CONFIG.merchantId.includes('your_test_merchant_id');
    
    if (error.response?.data?.code === 'KEY_NOT_CONFIGURED' && 
        process.env.NODE_ENV === 'development' && 
        isPlaceholderCredentials) {
      console.log('🔧 Using PhonePe simulator (placeholder credentials detected)');
      console.log('💡 Get real PhonePe test credentials from https://business.phonepe.com/');
      return await simulatePhonePeOrder({ amountPaise, orderId, userId, userPhone });
    }
    
    throw new Error(`PhonePe order creation failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Check PhonePe payment status
 * @param {string} transactionId - Transaction ID
 * @returns {Object} - Payment status
 */
export const checkPhonePePaymentStatus = async (transactionId) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  try {
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${transactionId}`;
    const checksum = generateChecksum("", endpoint);

    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      'accept': 'application/json'
    };

    const response = await axios.get(
      `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
      { headers }
    );

    return {
      success: response.data.success,
      transactionId,
      paymentStatus: response.data.data?.state,
      amount: response.data.data?.amount,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('PhonePe status check failed:', error.response?.data || error.message);
    
    // Only use simulator for placeholder credentials
    const isPlaceholderCredentials = getPhonePeConfig().merchantId.includes('your_merchant_id') || 
                                   getPhonePeConfig().merchantId.includes('your_test_merchant_id');
    
    if ((error.response?.data?.code === 'KEY_NOT_CONFIGURED' || error.message.includes('KEY_NOT_CONFIGURED')) && 
        process.env.NODE_ENV === 'development' && 
        isPlaceholderCredentials) {
      console.log('🔧 Using PhonePe simulator for status check (placeholder credentials)');
      return await simulatePaymentStatus(transactionId);
    }
    
    throw new Error(`PhonePe status check failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Verify PhonePe callback signature
 * @param {string} payload - Raw callback payload
 * @param {string} signature - X-VERIFY header
 * @returns {boolean} - Verification result
 */
export const verifyPhonePeCallback = (payload, signature) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  try {
    // Check if PhonePe is properly configured
    if (!PHONEPE_CONFIG.saltKey) {
      console.error('PhonePe callback verification failed: PHONEPE_SALT_KEY not configured');
      return false;
    }

    if (!payload || !signature) return false;
    
    const [receivedChecksum, saltIndex] = signature.split('###');
    
    if (saltIndex !== PHONEPE_CONFIG.saltIndex) {
      console.error('PhonePe callback verification failed: Invalid salt index');
      return false;
    }

    const stringToHash = payload + PHONEPE_CONFIG.saltKey;
    const expectedChecksum = crypto.createHash('sha256').update(stringToHash).digest('hex');
    
    const isValid = expectedChecksum === receivedChecksum;
    
    if (!isValid) {
      console.error('PhonePe callback verification failed: Checksum mismatch');
    }
    
    return isValid;
     
  } catch (error) {
    console.error('PhonePe callback verification error:', error.message);
    return false;
  }
};

/**
 * Process PhonePe refund
 * @param {Object} params - Refund parameters
 * @param {string} params.originalTransactionId - Original transaction ID
 * @param {number} params.amountPaise - Refund amount in paise
 * @param {string} params.orderId - Order ID for reference
 * @returns {Object} - Refund response
 */
export const createPhonePeRefund = async ({ originalTransactionId, amountPaise, orderId }) => {
  const PHONEPE_CONFIG = getPhonePeConfig();
  
  // Check if PhonePe is properly configured
  if (!PHONEPE_CONFIG.merchantId || !PHONEPE_CONFIG.saltKey) {
    throw new Error("PhonePe refund failed: Payment gateway is not configured. Please set PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY environment variables.");
  }

  try {
    const refundTransactionId = `REFUND_${orderId}_${Date.now()}`;
    
    const refundPayload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: refundTransactionId,
      originalTransactionId,
      amount: amountPaise,
      callbackUrl: PHONEPE_CONFIG.callbackUrl
    };

    const base64Payload = Buffer.from(JSON.stringify(refundPayload)).toString('base64');
    const endpoint = "/pg/v1/refund";
    const checksum = generateChecksum(base64Payload, endpoint);

    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'accept': 'application/json'
    };

    const requestBody = {
      request: base64Payload
    };

    const response = await axios.post(
      `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
      requestBody,
      { headers }
    );

    return {
      success: response.data.success,
      refundTransactionId,
      status: response.data.data?.state,
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