import dotenv from 'dotenv';
dotenv.config();

console.log('\n✅ PhonePe Redirect URL Fix Verification\n');

console.log('📋 Current PhonePe Configuration:');
console.log(`   Merchant ID: ${process.env.PHONEPE_MERCHANT_ID}`);
console.log(`   Redirect URL: ${process.env.PHONEPE_REDIRECT_URL}`);
console.log(`   Callback URL: ${process.env.PHONEPE_CALLBACK_URL}`);
console.log(`   API URL: ${process.env.PHONEPE_API_URL}`);

console.log('\n🎯 Redirect URL Status:');
if (process.env.PHONEPE_REDIRECT_URL?.includes('localhost:5173')) {
  console.log('✅ FIXED: Redirect URL now points to correct client port (5173)');
  console.log('✅ Future PhonePe payments will redirect to the right URL');
} else {
  console.log('❌ Issue: Redirect URL still points to wrong port');
}

console.log('\n📱 Test URLs:');
console.log(`   Payment will redirect to: ${process.env.PHONEPE_REDIRECT_URL}`);
console.log(`   Expected format: http://localhost:5173/payment/callback?orderId=ORDER_ID`);

console.log('\n🔄 Next Steps:');
console.log('1. Restart your server if it\'s running to pick up the new .env changes');
console.log('2. Create a new payment to test the corrected redirect URL');
console.log('3. PhonePe will now redirect to the correct client port (5173)');