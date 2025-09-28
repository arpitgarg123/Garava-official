// Test payment status update fix
const http = require('http');

const testPaymentStatus = async (orderId) => {
  const postData = JSON.stringify({});
  
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: `/api/orders/${orderId}/payment-status`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      // You'll need to add authorization header with valid JWT token
      // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('Payment Status Response:', response);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// Test with your order ID
const orderId = '68d8d5252cc696f2e5c2af20'; // Replace with actual order ID

console.log('🔍 Testing payment status update...');
console.log('📝 Note: You may need to add authorization header if auth is required');

testPaymentStatus(orderId)
  .then(() => console.log('✅ Test completed'))
  .catch(err => console.error('❌ Test failed:', err.message));