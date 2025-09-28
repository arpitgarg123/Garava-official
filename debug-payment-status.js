// Debug payment status for specific order
const axios = require('axios');

const testPaymentStatus = async () => {
  const orderId = '68d8d52f2cc696f2e5c2af37';
  
  try {
    console.log('🔍 Testing payment status for order:', orderId);
    
    // Test the payment status endpoint
    const response = await axios.post(`http://localhost:8080/api/orders/${orderId}/payment-status`, {}, {
      headers: {
        'Content-Type': 'application/json',
        // Note: You'll need to add authorization header in production
        // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      timeout: 10000
    });
    
    console.log('✅ Payment Status Response:');
    console.log('Status:', response.data.paymentStatus);
    console.log('Order Status:', response.data.order?.status);
    console.log('Payment Status:', response.data.order?.payment?.status);
    console.log('Transaction ID:', response.data.order?.payment?.gatewayTransactionId);
    
    // Test if the simulator should return COMPLETED status
    if (response.data.order?.payment?.gatewayTransactionId?.startsWith('SIM_')) {
      console.log('🎭 This is a simulator transaction - should return COMPLETED status');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend server is not running. Please start with: cd server && npm run dev');
    } else if (error.response?.status === 401) {
      console.error('❌ Authentication required. Please add authorization header.');
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
};

testPaymentStatus();