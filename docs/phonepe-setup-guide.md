# PhonePe Payment Gateway Setup Guide

## 🏪 Getting PhonePe Test Credentials

### Step 1: Register with PhonePe Business
1. Go to [PhonePe Business Portal](https://business.phonepe.com/)
2. Sign up for a business account
3. Complete business verification process
4. Request API access for testing

### Step 2: Get Test/Sandbox Credentials
Once approved, you'll receive:
- **Test Merchant ID** (format: `MERCHANTUAT` or similar)
- **Test Salt Key** (32-character string)
- **Salt Index** (usually `1`)
- **Sandbox API URL**: `https://api-preprod.phonepe.com/apis/hermes`

### Step 3: Update Your .env File
Replace the current test values with your real PhonePe test credentials:

```bash
# PhonePe Test Environment Credentials
PHONEPE_MERCHANT_ID=your_actual_test_merchant_id_from_phonepe
PHONEPE_SALT_KEY=your_actual_test_salt_key_from_phonepe
PHONEPE_SALT_INDEX=1
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/hermes
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback
PHONEPE_CALLBACK_URL=http://localhost:8080/webhooks/payments/phonepe
```

## 🔧 Test vs Production Mode

### Test Mode (Sandbox)
- Use `https://api-preprod.phonepe.com/apis/hermes`
- Test merchant ID from PhonePe dashboard
- No real money transactions
- Full payment flow testing

### Production Mode
- Use `https://api.phonepe.com/apis/hermes`
- Production merchant ID from PhonePe dashboard
- Real money transactions
- Live customer payments

## 📞 Getting Help from PhonePe

If you need test credentials:
1. **Email**: Contact PhonePe business support
2. **Request**: "Need sandbox/test API credentials for integration testing"
3. **Provide**: Your business registration details
4. **Timeline**: Usually 2-3 business days

## 🚀 Once You Have Real Test Credentials

1. Replace the placeholder values in `.env`
2. Restart your server
3. PhonePe will work without the simulator
4. Test full payment flows with test cards
5. When ready for production, just change the API URL and use production credentials

Your current setup will automatically detect real credentials and disable the simulator!