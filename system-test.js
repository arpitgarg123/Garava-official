// Comprehensive system test
const http = require('http');

const tests = [
  {
    name: 'Backend Health Check',
    test: () => {
      return new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 8080,
          path: '/api/health',
          method: 'GET',
          timeout: 3000
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const response = JSON.parse(data);
            resolve({
              status: 'PASS',
              data: response,
              message: `Server running, uptime: ${response.uptime}s`
            });
          });
        });
        
        req.on('error', (err) => {
          resolve({
            status: 'FAIL',
            error: err.code,
            message: err.code === 'ECONNREFUSED' ? 'Server not running' : err.message
          });
        });
        
        req.on('timeout', () => {
          req.destroy();
          resolve({
            status: 'FAIL',
            error: 'TIMEOUT',
            message: 'Server not responding'
          });
        });
        
        req.end();
      });
    }
  },
  {
    name: 'Payment Status Check',
    test: () => {
      return new Promise((resolve, reject) => {
        const orderId = '68d8d52f2cc696f2e5c2af37';
        const postData = JSON.stringify({});
        
        const req = http.request({
          hostname: 'localhost',
          port: 8080,
          path: `/api/orders/${orderId}/payment-status`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: 5000
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              const isSimulator = response.order?.payment?.gatewayTransactionId?.startsWith('SIM_');
              const shouldBeCompleted = isSimulator;
              const actuallyCompleted = response.paymentStatus === 'completed';
              
              resolve({
                status: actuallyCompleted === shouldBeCompleted ? 'PASS' : 'FAIL',
                data: {
                  paymentStatus: response.paymentStatus,
                  orderStatus: response.order?.status,
                  paymentMethod: response.order?.payment?.status,
                  isSimulator,
                  transactionId: response.order?.payment?.gatewayTransactionId
                },
                message: actuallyCompleted ? 'Payment status correct' : `Expected: completed, Got: ${response.paymentStatus}`
              });
            } catch (e) {
              resolve({
                status: 'FAIL',
                error: 'PARSE_ERROR',
                message: 'Invalid JSON response'
              });
            }
          });
        });
        
        req.on('error', (err) => {
          resolve({
            status: 'FAIL',
            error: err.code,
            message: err.message
          });
        });
        
        req.on('timeout', () => {
          req.destroy();
          resolve({
            status: 'FAIL', 
            error: 'TIMEOUT',
            message: 'Request timeout'
          });
        });
        
        req.write(postData);
        req.end();
      });
    }
  }
];

const runTests = async () => {
  console.log('🧪 Running Comprehensive System Tests');
  console.log('═══════════════════════════════════════');
  
  for (const testCase of tests) {
    console.log(`\n🔍 ${testCase.name}:`);
    try {
      const result = await testCase.test();
      
      if (result.status === 'PASS') {
        console.log(`✅ PASS: ${result.message}`);
        if (result.data) {
          console.log('   Data:', JSON.stringify(result.data, null, 2));
        }
      } else {
        console.log(`❌ FAIL: ${result.message}`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
        if (result.data) {
          console.log('   Data:', JSON.stringify(result.data, null, 2));
        }
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n🏁 Test Suite Complete');
};

runTests();