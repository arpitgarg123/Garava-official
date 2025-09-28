# PhonePe Payment Gateway Setup Guide (v2 API)

## 🏪 Getting PhonePe v2 API Credentials

### Step 1: Register with PhonePe Business
1. Go to [PhonePe Business Portal](https://business.phonepe.com/)
2. Sign up for a business account
3. Complete business verification process
4. Request API access for testing

### Step 2: Get v2 API Credentials from Business Dashboard
Once approved, access your PhonePe Business Dashboard:
- **Client ID** (from Developer Settings → API Keys)
- **Client Secret** (from Developer Settings → API Keys)
- **Client Version** (usually `1.0`)
- **Sandbox API URL**: `https://api-preprod.phonepe.com/apis/pg-sandbox`

### Step 3: Update Your .env File
Replace the current values with your real PhonePe v2 credentials:

```bash
# PhonePe v2 API Credentials (OAuth-based authentication)
PHONEPE_CLIENT_ID=your_client_id_from_phonepe_business_dashboard
PHONEPE_CLIENT_SECRET=your_client_secret_from_phonepe_business_dashboard
PHONEPE_CLIENT_VERSION=1.0
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback
PHONEPE_CALLBACK_URL=http://localhost:8080/webhooks/payments/phonepe
```

## 🔧 Test vs Production Mode

### Test Mode (Sandbox) - v2 API
- API URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- Auth URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- Test Client ID and Secret from PhonePe dashboard
- No real money transactions
- Full payment flow testing with OAuth authentication

### Production Mode - v2 API
- API URL: `https://api.phonepe.com/apis/pg`
- Auth URL: `https://api.phonepe.com/apis/identity-manager`
- Production Client ID and Secret from PhonePe dashboard
- Real money transactions
- Live customer payments

## 📞 Getting Help from PhonePe

If you need test credentials:
1. **Email**: Contact PhonePe business support
2. **Request**: "Need sandbox/test API credentials for integration testing"
3. **Provide**: Your business registration details
4. **Timeline**: Usually 2-3 business days

## 🚀 Once You Have Real v2 API Credentials

1. Replace the placeholder values in `.env` with your actual Client ID and Secret
2. Restart your server
3. PhonePe v2 API will work with OAuth authentication
4. Test full payment flows with the new checkout experience
5. When ready for production, change API URLs and use production credentials

## 🔄 Migration from v1 to v2 API

### Key Changes:
- **Authentication**: OAuth 2.0 with Client ID/Secret instead of Merchant ID/Salt Key
- **API Endpoints**: New v2 endpoints (`/checkout/v2/pay`, `/checkout/v2/order/{id}/status`)
- **Request Format**: JSON payloads instead of base64 encoded payloads
- **Authorization**: Bearer tokens instead of custom checksum headers
- **Webhook Verification**: Simplified payload validation

### Benefits of v2 API:
- Better security with OAuth 2.0
- Improved checkout experience
- More reliable webhook handling
- Better error responses
- Token-based authentication with automatic refresh

Your current setup will automatically detect real credentials and disable the simulator!