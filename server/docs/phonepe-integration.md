# PhonePe Payment Gateway Configuration (v2 API)

## Required Environment Variables

Add the following environment variables to your `.env` file in the server directory:

```env
# PhonePe v2 API Configuration (OAuth-based)
PHONEPE_CLIENT_ID=your_client_id_here
PHONEPE_CLIENT_SECRET=your_client_secret_here
PHONEPE_CLIENT_VERSION=1.0

# PhonePe v2 API URLs
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox  # For testing
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox  # For testing
# PHONEPE_API_URL=https://api.phonepe.com/apis/pg  # For production
# PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager  # For production

# Callback URLs
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback
PHONEPE_CALLBACK_URL=http://localhost:8080/webhooks/payments/phonepe
```

## PhonePe v2 API Integration Setup

### 1. Get PhonePe Business Account
- Register at [PhonePe Business Portal](https://business.phonepe.com/)
- Complete business verification
- Access Developer Settings → API Keys
- Get your Client ID and Client Secret

### 2. Test vs Production
- Use sandbox API URL for testing: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- Use production API URL for live: `https://api.phonepe.com/apis/pg`
- Auth URLs differ between sandbox and production environments

### 3. OAuth Authentication
- System automatically generates OAuth tokens using Client ID/Secret
- Tokens are cached and auto-refreshed before expiry
- All API calls use Bearer token authentication

### 4. Webhook Configuration
- Set webhook URL in PhonePe dashboard to: `https://yourdomain.com/webhooks/payments/phonepe`
- Ensure webhook endpoint is publicly accessible
- v2 API uses improved webhook payload structure

### 5. Frontend Integration
- Payment flow redirects to new PhonePe checkout page
- Enhanced UI with better mobile support
- User completes payment on PhonePe interface
- Redirects back to your callback URL with status

## Order Flow (v2 API)

1. **Create Order**: POST `/api/orders/checkout` with `paymentMethod: "phonepe"`
2. **OAuth Token**: Backend automatically generates access token using Client ID/Secret
3. **Payment Initiation**: Backend creates PhonePe payment order using v2 API
4. **Redirect**: Frontend redirects user to PhonePe checkout page
5. **Payment**: User completes payment on enhanced PhonePe interface
6. **Callback**: PhonePe sends webhook to `/webhooks/payments/phonepe`
7. **Status Verification**: Backend verifies payment using v2 status API
8. **Status Update**: Order status updated based on verified payment result
9. **Redirect**: User redirected back with payment status

## Testing

### Test Cards (Preprod Environment)
- Use PhonePe's test UPI IDs and card numbers for testing
- All test transactions will be simulated

### Manual Status Check
- Use `/api/orders/:orderId/payment-status` endpoint to manually check payment status
- Useful for handling failed webhooks or delayed notifications

## Security Notes

1. **Client Secret**: Keep your client secret secure and never expose it in frontend code
2. **OAuth Tokens**: Access tokens are automatically managed and refreshed
3. **Webhook Verification**: v2 API uses improved webhook payload validation
4. **HTTPS**: Always use HTTPS in production for secure communication
5. **Environment Separation**: Use different client credentials for test and production
6. **Token Management**: Tokens are cached in memory and auto-refreshed before expiry

## Migration from Razorpay

The following changes have been made:

### Backend Changes
- ✅ Created `phonepe.adapter.js` with PhonePe API integration
- ✅ Updated order service to use PhonePe instead of Razorpay
- ✅ Modified webhook handling for PhonePe format
- ✅ Added payment status checking endpoint
- ✅ Updated order model to support PhonePe fields

### Frontend Changes
- ✅ Created order Redux slice for order management
- ✅ Built checkout page with PhonePe integration
- ✅ Updated orders page to display real order data
- ✅ Added payment flow handling and redirects
- ✅ Implemented automatic cart clearing on successful payment

### UI Preserved
- ✅ All existing UI components remain unchanged
- ✅ Same user experience with different payment gateway
- ✅ Consistent styling and layout maintained

## Troubleshooting

### Common Issues
1. **Invalid Signature**: Check salt key and ensure webhook payload is correct
2. **Payment Not Completing**: Verify callback URLs are accessible
3. **Redirect Issues**: Ensure frontend routes handle payment callbacks
4. **Status Not Updating**: Check webhook endpoint and manual status check API

### Debugging
- Enable detailed logging in PhonePe adapter
- Use manual payment status check for debugging
- Verify webhook signature calculation
- Test with PhonePe's sandbox environment first