/**
 * Quick test for forgot password API
 * This will show you exactly what response the backend returns
 */

import http from '../client/src/shared/api/http.js';

const testForgotPassword = async () => {
  console.log('🧪 Testing Forgot Password API...\n');
  
  const testEmail = 'arpitgarg424@gmail.com';
  
  try {
    console.log(`📧 Sending forgot password request for: ${testEmail}`);
    const response = await http.post('/auth/forgot-password', { email: testEmail });
    
    console.log('\n✅ SUCCESS! Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    console.log('\n🎉 Backend is returning success correctly!');
    console.log('Frontend should show: "If that email exists, a reset link has been sent."');
    
  } catch (error) {
    console.log('\n❌ ERROR! Response:');
    console.log('Status:', error.response?.status);
    console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('Message:', error.message);
    
    console.log('\n🔍 This is the error the frontend is catching!');
  }
};

testForgotPassword();
