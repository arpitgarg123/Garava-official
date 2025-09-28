// Backend Server Health Check
// This script helps diagnose why the server is timing out

console.log('🏥 Backend Server Health Diagnostic\n');

// Check what the frontend is trying to connect to
console.log('📊 Frontend Configuration:');
console.log('Base URL: http://localhost:8080/api');
console.log('Expected endpoints:');
console.log('  - GET /cart → http://localhost:8080/api/cart');
console.log('  - POST /auth/refresh → http://localhost:8080/api/auth/refresh');
console.log('  - GET /wishlist → http://localhost:8080/api/wishlist');
console.log('');

console.log('🔍 Timeout Analysis:');
console.log('❌ Error: timeout of 12000ms exceeded');
console.log('❌ Error Code: ECONNABORTED');
console.log('❌ XHR failed loading on auth/refresh');
console.log('');

console.log('📋 Possible Causes:');
console.log('1. 🚫 Backend server not running');
console.log('2. 💥 Backend server crashed after starting');
console.log('3. 🐛 Server started but MongoDB connection issues');
console.log('4. 🔄 Server restarting in infinite loop');
console.log('5. 🔐 Firewall blocking connections');
console.log('6. 📡 Route/middleware blocking requests');
console.log('');

console.log('🔧 Quick Fixes to Try:');
console.log('1. Check server terminal - is it showing errors?');
console.log('2. Restart backend: cd server && npm run dev');
console.log('3. Check MongoDB connection in server logs');
console.log('4. Verify server is listening on port 8080');
console.log('5. Test direct API call: curl http://localhost:8080/api/cart');
console.log('');

console.log('✅ Success Indicators to Look For:');
console.log('  - "Server running on http://localhost:8080"');
console.log('  - "✅ MongoDB Connected"');  
console.log('  - No error loops in terminal');
console.log('  - Port 8080 listening (netstat -an | findstr 8080)');
console.log('');

console.log('🎯 After Fix - Expected Result:');
console.log('  - No more timeout errors');
console.log('  - Cart and wishlist load properly'); 
console.log('  - Authentication works');
console.log('  - All API endpoints respond < 1 second');