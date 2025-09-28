/**
 * Test COD order creation to ensure the system works when PhonePe is not available
 */

import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const testCODOrder = async () => {
  console.log('Testing COD Order Creation...\n');

  const testOrder = {
    items: [
      {
        productId: "66f4b5b67b57b7bcae3c7e71", // Use a real product ID from your database
        variantId: "66f4b5b67b57b7bcae3c7e72", // Use a real variant ID
        quantity: 1
      }
    ],
    addressId: "68d27f9f6974fa464789d182", // Use a real address ID
    paymentMethod: "cod"
  };

  try {
    const response = await axios.post('http://localhost:8080/api/user/checkout', testOrder, {
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add a valid auth token here for testing
        // 'Cookie': 'token=your_test_token_here'
      }
    });

    console.log('✅ SUCCESS: COD order created successfully');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ ERROR: COD order creation failed');
    console.log('Error:', error.response?.data || error.message);
  }
};

const testPhonePeOrder = async () => {
  console.log('Testing PhonePe Order Creation...\n');

  const testOrder = {
    items: [
      {
        productId: "66f4b5b67b57b7bcae3c7e71",
        variantId: "66f4b5b67b57b7bcae3c7e72",
        quantity: 1
      }
    ],
    addressId: "68d27f9f6974fa464789d182",
    paymentMethod: "phonepe"
  };

  try {
    const response = await axios.post('http://localhost:8080/api/user/checkout', testOrder, {
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add a valid auth token here for testing
        // 'Cookie': 'token=your_test_token_here'
      }
    });

    console.log('PhonePe Order Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('PhonePe order error (expected):', error.response?.data || error.message);
  }
};

console.log('🚀 Testing Order System...\n');
console.log('Note: You need to update the productId, variantId, and addressId with real values from your database');
console.log('Note: You need to add authentication cookies for these tests to work\n');

// Uncomment these when you have real data and auth tokens:
// testCODOrder();
// testPhonePeOrder();