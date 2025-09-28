import dotenv from 'dotenv';
dotenv.config();

import { createPhonePeOrder } from '../modules/payment.adapters/phonepe.adapter.js';

console.log('\n🔧 Testing PhonePe Configuration...\n');

// Test the configuration loading
const testConfig = async () => {
  try {
    console.log('📋 PhonePe Configuration Check:');
    console.log('Environment Variables:');
    console.log(`  PHONEPE_MERCHANT_ID: ${process.env.PHONEPE_MERCHANT_ID || 'NOT SET'}`);
    console.log(`  PHONEPE_REDIRECT_URL: ${process.env.PHONEPE_REDIRECT_URL || 'NOT SET'}`);
    console.log(`  PHONEPE_CALLBACK_URL: ${process.env.PHONEPE_CALLBACK_URL || 'NOT SET'}`);
    console.log(`  PHONEPE_API_URL: ${process.env.PHONEPE_API_URL || 'NOT SET'}`);
    
    // Test creating a sample order to see the redirect URL
    const testOrderId = "test_order_12345";
    const testAmount = 100;
    const testUserId = "test_user_123";
    
    console.log('\n💳 Testing PhonePe Order Creation...');
    const result = await createPhonePeOrder(testOrderId, testAmount, testUserId);
    
    if (result.success) {
      console.log('✅ PhonePe order creation test successful');
      console.log(`   Payment URL: ${result.paymentUrl}`);
      console.log(`   Transaction ID: ${result.transactionId}`);
    } else {
      console.log('❌ PhonePe order creation test failed:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message);
  }
};

testConfig();