# PhonePe v1 to v2 API Migration Guide

## 🚀 Migration Overview

This guide helps you migrate from PhonePe's legacy v1 API (using Merchant ID and Salt Key) to the new v2 API (using OAuth with Client ID and Client Secret).

## 📋 What Changed

### Authentication Method
| Aspect | v1 API (Old) | v2 API (New) |
|--------|-------------|-------------|
| **Authentication** | Merchant ID + Salt Key | OAuth 2.0 (Client ID + Client Secret) |
| **Request Headers** | `X-VERIFY` (custom checksum) | `Authorization: O-Bearer <token>` |
| **Token Management** | Manual checksum generation | Automatic OAuth token management |

### API Endpoints  
| Operation | v1 API (Old) | v2 API (New) |
|-----------|-------------|-------------|
| **Create Payment** | `POST /pg/v1/pay` | `POST /checkout/v2/pay` |
| **Check Status** | `GET /pg/v1/status/{merchantId}/{txnId}` | `GET /checkout/v2/order/{orderId}/status` |
| **Refund** | `POST /pg/v1/refund` | `POST /payments/v2/refund` |

### Base URLs
| Environment | v1 API (Old) | v2 API (New) |
|-------------|-------------|-------------|
| **Sandbox** | `https://api-preprod.phonepe.com/apis/hermes` | `https://api-preprod.phonepe.com/apis/pg-sandbox` |
| **Production** | `https://api.phonepe.com/apis/hermes` | `https://api.phonepe.com/apis/pg` |

## 🔧 Environment Variables Migration

### Old Environment Variables (Remove these)
```bash
# LEGACY - Remove after migration
PHONEPE_MERCHANT_ID=PGTESTPAYUAT86
PHONEPE_SALT_KEY=96434309-7796-489d-8924-ab56988a6076
PHONEPE_SALT_INDEX=1
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/hermes
```

### New Environment Variables (Add these)
```bash
# PhonePe v2 API Credentials
PHONEPE_CLIENT_ID=your_client_id_from_phonepe_business_dashboard
PHONEPE_CLIENT_SECRET=your_client_secret_from_phonepe_business_dashboard
PHONEPE_CLIENT_VERSION=1.0
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_REDIRECT_URL=http://localhost:5173/payment/callback
PHONEPE_CALLBACK_URL=http://localhost:8080/webhooks/payments/phonepe
```

## 📝 Getting v2 API Credentials

### Step 1: Access PhonePe Business Dashboard
1. Go to [PhonePe Business Portal](https://business.phonepe.com/)
2. Login to your existing account
3. Navigate to **Developer Settings** → **API Keys**

### Step 2: Get Your Credentials
- **Client ID**: Found in Developer Settings
- **Client Secret**: Found in Developer Settings (keep this secure!)
- **Client Version**: Usually `1.0`

## ✅ Migration Checklist

### ✅ Completed (Already Done)
- [x] Updated `phonepe.adapter.js` to use v2 API
- [x] Implemented OAuth 2.0 authentication
- [x] Updated all API endpoints to v2
- [x] Added automatic token management and refresh
- [x] Updated webhook verification for v2 format
- [x] Updated refund functionality for v2 API
- [x] Updated environment variable structure
- [x] Updated documentation and setup guides

### 🔄 Next Steps (Manual)
- [ ] **Get Real Credentials**: Obtain actual Client ID and Secret from PhonePe Business Dashboard
- [ ] **Update .env File**: Replace placeholder values with real credentials
- [ ] **Test Integration**: Verify payment flow works with new API
- [ ] **Update Production**: Configure production environment with production credentials

## 🧪 Testing the Migration

### 1. Update Environment Variables
Replace the placeholder values in your `.env` file:
```bash
PHONEPE_CLIENT_ID=your_actual_client_id
PHONEPE_CLIENT_SECRET=your_actual_client_secret
```

### 2. Restart Your Server
```bash
cd server
npm start
```

### 3. Test Payment Flow
1. Create a test order
2. Select PhonePe as payment method
3. Verify redirect to new PhonePe checkout page
4. Complete test payment
5. Verify webhook handling and order status update

### 4. Verify Token Management
Check server logs for:
- Successful OAuth token generation
- Token caching and refresh
- API calls using Bearer authentication

## 🔒 Security Improvements

### Enhanced Security Features
1. **OAuth 2.0**: Industry standard authentication
2. **Token Expiry**: Automatic token refresh prevents stale credentials
3. **Improved Webhook Verification**: Better payload validation
4. **HTTPS Only**: Enhanced security requirements

### Migration Security Tips
1. Keep Client Secret secure (never expose in frontend)
2. Use different credentials for test vs production
3. Monitor token refresh patterns
4. Verify webhook payload integrity

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Errors
**Problem**: `UNAUTHORIZED` or 401 errors
**Solution**: 
- Verify Client ID and Secret are correct
- Check environment variables are loaded
- Ensure credentials match your PhonePe account

#### 2. Token Issues
**Problem**: Token generation failures
**Solution**:
- Verify Client ID/Secret format
- Check API URLs are correct for your environment
- Ensure network connectivity to PhonePe servers

#### 3. Webhook Issues  
**Problem**: Webhook verification failing
**Solution**:
- Update webhook URL in PhonePe dashboard
- Verify webhook payload structure matches v2 format
- Check webhook endpoint is publicly accessible

#### 4. Payment Flow Issues
**Problem**: Redirect or payment completion issues
**Solution**:
- Verify redirect URLs are configured correctly
- Check order ID format (max 63 chars, alphanumeric + _ -)
- Ensure amount is in paise (multiply by 100)

## 📞 Support

### Need Help?
1. **PhonePe Support**: Contact PhonePe business support for credential issues
2. **API Documentation**: [PhonePe Developer Docs](https://developer.phonepe.com/)
3. **Business Dashboard**: [PhonePe Business Portal](https://business.phonepe.com/)

### Testing Resources
- Use PhonePe's test environment for safe testing
- Test with various payment methods (UPI, Cards, NetBanking)
- Verify webhook delivery and order status updates

## 🎉 Migration Benefits

### Why Migrate to v2 API?
1. **Better Security**: OAuth 2.0 vs custom checksums
2. **Improved UX**: Enhanced checkout page design
3. **Better Error Handling**: More detailed error responses
4. **Future-Proof**: Latest PhonePe API version
5. **Better Support**: Active development and support
6. **Mobile Optimized**: Better mobile payment experience

---

**Migration Status**: ✅ **COMPLETED** - Ready for testing with real credentials!