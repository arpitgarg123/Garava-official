/**
 * PhonePe Development Simulator
 * This simulates PhonePe responses for testing when merchant credentials are not yet activated
 * Remove this file once you get proper PhonePe credentials
 */

/**
 * Simulate PhonePe order creation for development
 * @param {Object} params - Order parameters
 * @returns {Object} - Simulated PhonePe response 
 */
export const simulatePhonePeOrder = async ({ amountPaise, orderId, userId, userPhone }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const transactionId = `SIM_TXN_${orderId}_${Date.now()}`;
  const gatewayOrderId = `SIM_${orderId}_${Date.now()}`;
  
  // Simulate successful response
  return {
    success: true,
    transactionId,
    gatewayOrderId,
    paymentUrl: `http://localhost:3000/simulate-payment?txn=${transactionId}&amount=${amountPaise}&orderId=${orderId}`,
    rawResponse: {
      success: true,
      code: 'PAYMENT_INITIATED',
      message: 'Payment initiated successfully (SIMULATED)',
      data: {
        merchantId: 'SIMULATOR',
        merchantTransactionId: transactionId,
        instrumentResponse: {
          type: 'PAY_PAGE',
          redirectInfo: {
            url: `http://localhost:3000/simulate-payment?txn=${transactionId}&amount=${amountPaise}&orderId=${orderId}`,
            method: 'GET'
          }
        }
      }
    }
  };
};

/**
 * Simulate payment status check
 * @param {string} transactionId - Transaction ID
 * @returns {Object} - Simulated status response
 */
export const simulatePaymentStatus = async (transactionId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate successful payment (you can modify this to test different scenarios)
  return {
    success: true,
    transactionId,
    paymentStatus: 'PAYMENT_SUCCESS',
    amount: 100000, // This would be the actual amount
    rawResponse: {
      success: true,
      code: 'PAYMENT_SUCCESS',
      message: 'Payment completed successfully (SIMULATED)',
      data: {
        merchantId: 'SIMULATOR',
        merchantTransactionId: transactionId,
        transactionId: transactionId,
        amount: 100000,
        state: 'COMPLETED',
        responseCode: 'SUCCESS',
        paymentInstrument: {
          type: 'UPI',
          utr: `SIM${Date.now()}`
        }
      }
    }
  };
};

export default {
  simulatePhonePeOrder,
  simulatePaymentStatus
};