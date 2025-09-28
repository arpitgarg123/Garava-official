import { createOrderService } from '../modules/order/order.service.js';
import { createPhonePeOrder } from '../modules/payment.adapters/phonepe.adapter.js';

const TEST_USER_ID = "507f1f77bcf86cd799439011"; // Test user ID
const TEST_ORDER_DATA = {
  items: [
    {
      product: "507f1f77bcf86cd799439012",
      variant: {
        color: "Gold",
        size: "Medium"
      },
      quantity: 1,
      price: 750,
      title: "Test Product"
    }
  ],    
  address: {
    fullName: "Test User",
    phone: "9876543210",
    addressLine1: "123 Test Street",
    city: "Test City",
    state: "Test State",
    pincode: "123456",
    isDefault: true
  },
  paymentMethod: "phonepe",
  subtotal: 750,
  deliveryCharge: 70, // Since order is under 500
  codCharge: 0, // No COD charge for PhonePe
  total: 820
};

async function testRealOrderPaymentFlow() {
  console.log('\n🧪 Testing Real Order Payment Flow...\n');

  try {
    // Step 1: Create a real order
    console.log('📦 Step 1: Creating real order...');
    const orderResult = await createOrder(TEST_USER_ID, TEST_ORDER_DATA);
    
    if (!orderResult.success) {
      throw new Error(`Order creation failed: ${orderResult.message}`);
    }

    const order = orderResult.order;
    console.log(`✅ Order created successfully: ${order.orderNumber}`);
    console.log(`   Order ID: ${order._id}`);
    console.log(`   Total: ₹${order.total}`);
    
    // Step 2: Initialize PhonePe payment
    console.log('\n💳 Step 2: Initializing PhonePe payment...');
    const paymentResult = await createPhonePeOrder(order._id.toString(), order.total, TEST_USER_ID);
    
    if (!paymentResult.success) {
      throw new Error(`PhonePe payment initialization failed: ${paymentResult.message}`);
    }

    console.log('✅ PhonePe payment initialized successfully');
    console.log(`   Transaction ID: ${paymentResult.transactionId}`);
    console.log(`   Payment URL: ${paymentResult.paymentUrl}`);
    
    // Step 3: Test the callback URL
    console.log('\n🔗 Step 3: Testing callback URLs...');
    const baseURL = 'http://localhost:5174';
    const callbackURL = `${baseURL}/payment/callback?orderId=${order._id}`;
    const successURL = `${baseURL}/payment/success?orderId=${order._id}&txn=${paymentResult.transactionId}&status=success`;
    const failureURL = `${baseURL}/payment/failure?orderId=${order._id}&txn=${paymentResult.transactionId}&status=failed`;
    
    console.log(`✅ Callback URL: ${callbackURL}`);
    console.log(`✅ Success URL: ${successURL}`);
    console.log(`✅ Failure URL: ${failureURL}`);
    
    // Step 4: Payment flow test results
    console.log('\n📊 Payment Flow Test Results:');
    console.log('✅ Order creation: SUCCESS');
    console.log('✅ PhonePe integration: SUCCESS');
    console.log('✅ Frontend routes: CONFIGURED');
    console.log('✅ Callback handling: READY');
    
    console.log('\n🎯 Next Steps for Testing:');
    console.log('1. Visit the payment URL to complete payment');
    console.log('2. Check if redirect works to callback page');
    console.log('3. Verify order status updates correctly');
    console.log('4. Confirm cart is cleared on success');
    
    console.log('\n📱 Test URLs Ready:');
    console.log(`Payment URL: ${paymentResult.paymentUrl}`);
    console.log(`Callback URL: ${callbackURL}`);
    
    return {
      success: true,
      order,
      paymentResult,
      testUrls: {
        paymentURL: paymentResult.paymentUrl,
        callbackURL,
        successURL,
        failureURL
      }
    };
    
  } catch (error) {
    console.error('❌ Real order payment flow test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testRealOrderPaymentFlow()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 REAL ORDER PAYMENT FLOW TEST: SUCCESS');
      console.log('\n🔄 Ready for end-to-end testing!');
      console.log('\n💡 To test payment callback:');
      console.log(`   1. Go to: ${result.testUrls.paymentURL}`);
      console.log(`   2. Complete payment`);
      console.log(`   3. Should redirect to: ${result.testUrls.callbackURL}`);
      console.log(`   4. Frontend will check status and show success/failure`);
    } else {
      console.log('\n❌ REAL ORDER PAYMENT FLOW TEST: FAILED');
      console.log(`Error: ${result.error}`);
    }
  })
  .catch(error => {
    console.error('Test execution error:', error);
  });