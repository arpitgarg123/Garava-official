import dotenv from 'dotenv';
import { createPhonePeOrder } from '../modules/payment.adapters/phonepe.adapter.js';

// Load environment variables
dotenv.config();

const testPhonePeOrder = async () => {
  console.log('Testing PhonePe Order Creation...\n');
  
  console.log('Environment Variables:');
  console.log('PHONEPE_MERCHANT_ID:', process.env.PHONEPE_MERCHANT_ID ? 'SET' : 'NOT SET');
  console.log('PHONEPE_SALT_KEY:', process.env.PHONEPE_SALT_KEY ? 'SET' : 'NOT SET');
  console.log('PHONEPE_SALT_INDEX:', process.env.PHONEPE_SALT_INDEX);
  console.log('PHONEPE_API_URL:', process.env.PHONEPE_API_URL);
  console.log('PHONEPE_CALLBACK_URL:', process.env.PHONEPE_CALLBACK_URL);
  console.log('PHONEPE_REDIRECT_URL:', process.env.PHONEPE_REDIRECT_URL);
  console.log('\n');

  try {
    const result = await createPhonePeOrder({
      amountPaise: 99900, // Rs. 999
      orderId: 'TEST_ORDER_' + Date.now(),
      userId: 'test_user_id',
      userPhone: '9876543210'
    });
    
    console.log('✅ SUCCESS: PhonePe order created successfully');
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR: PhonePe order creation failed');
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    
    // Check if it's an axios error with response details
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
      console.log('Response Headers:', JSON.stringify(error.response.headers, null, 2));
    }
  }
};

testPhonePeOrder().catch(console.error);