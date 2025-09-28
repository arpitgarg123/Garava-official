# PhonePe Payment Gateway Configuration

## Required Environment Variables

Add the following environment variables to your `.env` file in the server directory:

```env
# PhonePe Payment Gateway Configuration
PHONEPE_MERCHANT_ID=your_merchant_id_here
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1

# PhonePe API URLs
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/hermes  # For testing
# PHONEPE_API_URL=https://api.phonepe.com/apis/hermes  # For production

# Callback URLs
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback
PHONEPE_CALLBACK_URL=http://localhost:8080/webhooks/payments/phonepe
```

## PhonePe Integration Setup

### 1. Get PhonePe Merchant Account
- Register at PhonePe Developer Portal
- Get your Merchant ID and Salt Key
- Configure webhook URLs

### 2. Test vs Production
- Use preprod API URL for testing: `https://api-preprod.phonepe.com/apis/hermes`
- Use production API URL for live: `https://api.phonepe.com/apis/hermes`

### 3. Webhook Configuration
- Set webhook URL in PhonePe dashboard to: `https://yourdomain.com/webhooks/payments/phonepe`
- Ensure webhook endpoint is publicly accessible

### 4. Frontend Integration
- Payment flow automatically redirects to PhonePe payment page
- User completes payment on PhonePe interface
- Redirects back to your callback URL with status

## Order Flow

1. **Create Order**: POST `/api/orders/checkout` with `paymentMethod: "phonepe"`
2. **Payment Initiation**: Backend creates PhonePe payment order
3. **Redirect**: Frontend redirects user to PhonePe payment URL
4. **Payment**: User completes payment on PhonePe
5. **Callback**: PhonePe sends webhook to `/webhooks/payments/phonepe`
6. **Status Update**: Order status updated based on payment result
7. **Redirect**: User redirected back with payment status

## Testing

### Test Cards (Preprod Environment)
- Use PhonePe's test UPI IDs and card numbers for testing
- All test transactions will be simulated

### Manual Status Check
- Use `/api/orders/:orderId/payment-status` endpoint to manually check payment status
- Useful for handling failed webhooks or delayed notifications

## Security Notes

1. **Salt Key**: Keep your salt key secure and never expose it in frontend code
2. **Webhook Verification**: All webhooks are verified using HMAC-SHA256
3. **HTTPS**: Always use HTTPS in production for secure communication
4. **Environment Separation**: Use different merchant accounts for test and production

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