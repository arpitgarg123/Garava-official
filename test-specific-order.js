// Test the specific order payment status
const http = require('http');

const testSpecificOrder = async () => {
  const orderId = '68d8d52f2cc696f2e5c2af37';
  
  const postData = JSON.stringify({});
  
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: `/api/orders/${orderId}/payment-status`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
      // Note: In production you'll need authorization header
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('\n🔍 Payment Status Test Results:');
          console.log('═══════════════════════════════');
          console.log('Response Status:', res.statusCode);
          console.log('Payment Status:', response.paymentStatus);
          console.log('Order Status:', response.order?.status);
          console.log('Payment Method:', response.order?.payment?.method);
          console.log('Payment Status:', response.order?.payment?.status);
          console.log('Transaction ID:', response.order?.payment?.gatewayTransactionId);
          console.log('Last Updated:', response.order?.updatedAt);
          
          if (response.order?.payment?.gatewayTransactionId?.startsWith('SIM_')) {
            console.log('✅ Simulator transaction detected');
          }
          
          if (response.paymentStatus === 'completed') {
            console.log('✅ Payment status correctly shows as completed');
          } else {
            console.log('❌ Payment status not completed:', response.paymentStatus);
          }
          
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.error('❌ Backend server not running. Start with: cd server && npm run dev');
      } else {
        console.error('❌ Request error:', err.message);
      }
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

console.log('🚀 Starting payment status test...');
testSpecificOrder()
  .then(() => console.log('\n✅ Test completed'))
  .catch(err => console.error('\n❌ Test failed:', err.message));