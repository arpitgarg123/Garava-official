// Simple health check for backend server
const http = require('http');

const checkServerHealth = () => {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/healthz',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server Status: ${res.statusCode}`);
    console.log(`✅ Server is running on http://localhost:8080`);
    process.exit(0);
  });

  req.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running');
      console.log('💡 Please start the server with: cd server && npm run dev');
    } else if (err.code === 'ETIMEDOUT') {
      console.log('⏰ Server connection timeout - server may be overloaded');
    } else {
      console.log(`❌ Server error: ${err.message}`);
    }
    process.exit(1);
  });

  req.on('timeout', () => {
    req.destroy();
    console.log('⏰ Server connection timeout - server may be unresponsive');
    process.exit(1);
  });

  req.end();
};

console.log('🔍 Checking backend server health...');
checkServerHealth();