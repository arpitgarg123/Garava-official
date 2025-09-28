/**
 * Test script to verify PhonePe configuration and error handling
 */

import { createPhonePeOrder, verifyPhonePeCallback } from '../modules/payment.adapters/phonepe.adapter.js';

const testPhonePeConfiguration = async () => {
  console.log('Testing PhonePe Configuration...\n');

  // Test 1: Create order without proper configuration
  try {
    const result = await createPhonePeOrder({
      amountPaise: 100000, // Rs. 1000
      orderId: 'TEST_ORDER_123',
      userId: 'test_user_id',
      userPhone: '9876543210'
    });
    console.log('❌ ERROR: PhonePe order creation should have failed without configuration');
  } catch (error) {
    console.log('✅ SUCCESS: PhonePe configuration error handled correctly');
    console.log('   Error:', error.message);
  }

  // Test 2: Verify callback without proper configuration
  try {
    const isValid = verifyPhonePeCallback(
      '{"merchantId":"TEST","amount":100000}',
      'test_signature###1'
    );
    if (!isValid) {
      console.log('✅ SUCCESS: PhonePe callback verification failed as expected without configuration');
    } else {
      console.log('❌ ERROR: PhonePe callback verification should have failed without configuration');
    }
  } catch (error) {
    console.log('✅ SUCCESS: PhonePe callback verification error handled correctly');
    console.log('   Error:', error.message);
  }

  console.log('\nPhonePe Configuration Test Complete!');
  console.log('\nTo enable PhonePe in production, set these environment variables:');
  console.log('- PHONEPE_MERCHANT_ID=your_merchant_id');
  console.log('- PHONEPE_SALT_KEY=your_salt_key');
  console.log('- PHONEPE_SALT_INDEX=1 (or your salt index)');
};

testPhonePeConfiguration().catch(console.error);