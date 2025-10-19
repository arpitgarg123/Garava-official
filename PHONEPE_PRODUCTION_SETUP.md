# 🚀 PhonePe Production Deployment Guide

> **⚠️ IMPORTANT**: PhonePe v2 API does **NOT use webhooks**. Payment status is checked via API calls when users return to your callback URL. No webhook configuration needed in PhonePe portal!

## 📋 Prerequisites

Before moving PhonePe to production, ensure you have:

1. ✅ **Completed PhonePe Business Verification**
   - Business documents submitted and approved
   - Bank account linked and verified
   - GST details provided (if applicable)

2. ✅ **Production Merchant Credentials**
   - Production Merchant ID
   - Production Salt Key
   - Production Salt Index

3. ✅ **Domain with HTTPS**
   - Your live domain: `https://garava.in`
   - Valid SSL certificate

---

## 🔑 Step 1: Get Production Credentials

### From PhonePe Business Portal:

1. Login to [PhonePe Business Portal](https://business.phonepe.com/)
2. Go to **Developer Settings** → **API Keys** (as shown in your screenshot)
3. Click on **Production Credentials** section
4. Click **"Show Key"** to reveal your API key
5. Note down:
   ```
   Production Merchant ID: Your merchant ID (visible in portal)
   Production API Key/Salt Key: Click "Show Key" to reveal
   Production Salt Index: 1 (usually, check with PhonePe if unsure)
   ```

### What You See in Portal:
- **Status**: Generated
- **Generated on**: Date when credentials were created  
- **Key Index**: Usually 1 for first key
- **API Key**: Hidden by default, click "Show Key" to view

### ⚠️ Important Notes:
- Production credentials shown in your screenshot are already generated (Nov 14, 2024)
- You just need to click "Show Key" to reveal the actual key value
- Save these credentials securely - you'll paste them into your VPS .env file
- **No webhook setup required** in PhonePe portal for v2 API

---

## 🌐 Step 2: Understanding PhonePe v2 Payment Flow

### ⚠️ Important: PhonePe v2 API Does NOT Use Webhooks!

Unlike v1, **PhonePe v2 API uses a different approach**:

1. **Payment Status Check**: Your backend actively checks payment status
2. **Callback URL**: User is redirected back to your site after payment
3. **Status Verification**: You query PhonePe API to verify payment status
4. **No Webhook Setup Needed**: Nothing to configure in PhonePe portal

### How It Works:

```
User completes payment → PhonePe redirects to your callback URL → 
Your backend calls PhonePe status API → Order updated based on verified status
```

**Your webhook endpoint is still there but won't receive automatic notifications. Instead, status is checked when:**
- User returns to your callback URL
- Manual status check is triggered
- Periodic status polling (if implemented)

---

## ⚙️ Step 3: Update VPS Environment Variables

### SSH into your VPS:
```bash
ssh garava@168.231.102.18
cd ~/Garava-official/server
```

### Edit .env file:
```bash
nano .env
```

### Update PhonePe Configuration:

**Current (Sandbox):**
```env
# PhonePe v2 API Credentials (SANDBOX - FOR TESTING)
PHONEPE_CLIENT_ID=TEST-GRAVAONLINE_2509281
PHONEPE_CLIENT_SECRET=NzVjMzRlMWMtYjY5Yi00ZDRjLWExNzYtMDMwMGIzNTRjYWFm
PHONEPE_CLIENT_VERSION=1.0
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_REDIRECT_URL=https://garava.in/payment/callback
PHONEPE_CALLBACK_URL=https://garava.in/api/webhooks/payments/phonepe
```

**Replace with Production:**
```env
# PhonePe v2 API Credentials (PRODUCTION)
PHONEPE_CLIENT_ID=PROD-GRAVAONLINE_XXXXXXX    # Your production merchant ID
PHONEPE_CLIENT_SECRET=your-production-secret-key-here
PHONEPE_CLIENT_VERSION=1.0
PHONEPE_API_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager
PHONEPE_REDIRECT_URL=https://garava.in/payment/callback
PHONEPE_CALLBACK_URL=https://garava.in/api/webhooks/payments/phonepe
```

### Save the file:
- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

---

## 🔄 Step 4: Restart Backend on VPS

```bash
pm2 restart garava-backend
```

### Verify it's running:
```bash
pm2 status
pm2 logs garava-backend --lines 50
```

---

## 🧪 Step 5: Test Production Payment Flow

### Test on Live Site:

1. **Go to your site**: https://garava.in
2. **Add items to cart** (minimum ₹500 for free delivery)
3. **Proceed to checkout**
4. **Fill address details**
5. **Select PhonePe payment**
6. **Complete test payment** using:
   - Real UPI ID (you can use your own)
   - Real debit/credit card
   - PhonePe wallet

### What Should Happen:

1. ✅ **Redirects to PhonePe** payment page
2. ✅ **Shows correct amount** with charges
3. ✅ **Payment succeeds** (for real payment)
4. ✅ **User redirected back** to callback URL with transaction ID
5. ✅ **Backend checks status** via PhonePe API
6. ✅ **Order status updated** to "confirmed"
7. ✅ **Success page shown** to user
8. ✅ **Email sent** (if configured)

**Note**: Unlike webhook-based systems, status is checked when user returns, not via automatic notification.

---

## 📊 Step 6: Monitor Logs During Test

### On VPS, keep logs open:
```bash
pm2 logs garava-backend --lines 0
```

### Look for these log messages:
```
PhonePe payment initiated for order: ORD-XXXXXX
PhonePe redirect URL: https://...
Payment callback received with transaction ID: T12345678
Checking payment status from PhonePe...
Payment verified successfully
Order confirmed: ORD-XXXXXX
```

### Check for errors:
```bash
pm2 logs garava-backend --err --lines 50
```

---

## 🚨 Troubleshooting

### Issue 1: "KEY_NOT_CONFIGURED" Error
**Cause:** Production credentials not activated
**Solution:** 
- Contact PhonePe support
- Verify merchant ID is correct
- Ensure API access is enabled for your account

### Issue 2: Payment Status Not Updated
**Cause:** Callback URL not processing correctly
**Solution:**
```bash
# Test callback endpoint from VPS
curl https://garava.in/payment/callback?transactionId=TEST123&status=SUCCESS

# Check logs for callback processing
pm2 logs garava-backend | grep callback
```

### Issue 3: SSL Certificate Errors
**Cause:** HTTPS not properly configured
**Solution:**
- Verify SSL certificate is valid
- Check nginx configuration
- Ensure certificate auto-renewal is working

### Issue 4: CORS Errors
**Cause:** PhonePe redirect blocked by CORS
**Solution:** Already configured in your backend, but verify:
```bash
cd ~/Garava-official/server
grep -n "cors" src/app.js
```

---

## 🔒 Security Checklist

- [x] ✅ Production credentials stored in `.env` (not committed to Git)
- [x] ✅ HTTPS enabled on domain
- [x] ✅ Callback URL secured and validated
- [x] ✅ Salt key never exposed in frontend
- [x] ✅ Payment amounts verified server-side
- [x] ✅ Order tampering prevented
- [x] ✅ Transaction ID validation implemented
- [x] ✅ Status checked from PhonePe API (not client data)

---

## 💰 Transaction Charges

### PhonePe Charges (Check with PhonePe):
- **UPI**: ~1.5% - 2%
- **Cards**: ~2% - 2.5%
- **Wallet**: Varies

### Your Store Charges:
- **COD Fee**: ₹40
- **Delivery**: ₹70 (free above ₹500)

Make sure these are configured in your pricing logic.

---

## 📈 Production Checklist

Before going live:

### Technical:
- [ ] Production credentials configured in VPS `.env`
- [ ] Backend restarted with new config
- [ ] Test payment completed successfully
- [ ] Webhook received and processed
- [ ] Order status updated correctly
- [ ] User redirected properly
- [ ] Logs showing no errors

### Business:
- [ ] PhonePe merchant account active
- [ ] Bank account linked
- [ ] Settlement configured
- [ ] Refund process understood
- [ ] Support contact saved

### Legal/Compliance:
- [ ] Terms & Conditions updated
- [ ] Privacy Policy updated
- [ ] Refund Policy defined
- [ ] GST configuration (if applicable)

---

## 🆘 Support Contacts

### PhonePe Support:
- **Portal**: https://business.phonepe.com/support
- **Email**: Via business portal
- **Response Time**: 1-2 business days

### Your Backend Logs:
```bash
# Real-time logs
pm2 logs garava-backend

# Last 100 lines
pm2 logs garava-backend --lines 100

# Error logs only
pm2 logs garava-backend --err
```

---

## 🎯 Quick Production Deployment Commands

```bash
# 1. SSH into VPS
ssh garava@168.231.102.18

# 2. Navigate to project
cd ~/Garava-official/server

# 3. Backup current .env
cp .env .env.backup

# 4. Edit .env with production credentials
nano .env

# 5. Restart backend
pm2 restart garava-backend

# 6. Check status
pm2 status

# 7. Monitor logs
pm2 logs garava-backend --lines 50
```

---

## 🎉 Go Live!

Once all tests pass:
1. ✅ Remove any test mode banners
2. ✅ Update website to show PhonePe as payment option
3. ✅ Monitor first few orders closely
4. ✅ Keep logs accessible for debugging
5. ✅ Have PhonePe support contact ready

---

## 📝 Notes

- **Test payments first!** Don't skip testing in production
- **Monitor logs** for first few orders
- **PhonePe settlement** usually takes 1-3 business days
- **Keep sandbox config** in comments for future reference
- **Document any custom changes** you make

---

## 🚀 You're Ready!

Your PhonePe integration is **production-ready**. Once you get production credentials from PhonePe:
1. Update the 3 environment variables
2. Restart backend
3. Test payment
4. Go live! 🎊

---

## 📋 Quick Reference Card

### What PhonePe Portal Shows:
```
Developer Settings → API Keys
├── Production Credentials
│   ├── Status: Generated
│   ├── Generated on: Nov 14, 2024
│   ├── Key Index: 1
│   └── API Key: ••••••••• (Click "Show Key")
└── Test Credentials (if available)
```

### What You Need to Copy:
1. **Merchant ID**: Visible in portal or account settings
2. **API Key/Salt Key**: Click "Show Key" button
3. **Key Index**: Usually 1 (shown in "Key Index" column)

### What You DON'T Need:
- ❌ Webhook configuration (not used in v2 API)
- ❌ Webhook URL setup (no such setting in portal)
- ❌ Webhook secrets (v2 uses API status checks instead)

### Environment Variables to Update:
```bash
# On VPS: ~/Garava-official/server/.env
PHONEPE_CLIENT_ID=GRAVAONLINE        # Your merchant ID
PHONEPE_CLIENT_SECRET=your-api-key    # From "Show Key" button
PHONEPE_API_URL=https://api.phonepe.com/apis/pg  # Production URL
```

### After Update:
```bash
pm2 restart garava-backend
pm2 logs garava-backend --lines 50
```

### Test Payment:
1. Add items to cart on https://garava.in
2. Complete checkout with PhonePe
3. Pay using real UPI/card
4. Verify order status updates correctly
5. Check logs for any errors

---

## 🆘 Still Have Questions?

### About Credentials:
- **Where's my Merchant ID?** Check account settings or visible in "grava GRAVAONLINE" section
- **Can't see API Key?** Click the "Show Key" button in Production Credentials row
- **Multiple keys?** Use the most recent one (check "Generated on" date)

### About Integration:
- **No webhook section?** That's correct - v2 API doesn't use webhooks
- **How does status update?** Via API calls when user returns to callback URL
- **Test in production?** Yes, use small amount first (₹10) to verify

### Need Help?
- PhonePe Support: Through business portal
- Your logs: `pm2 logs garava-backend`
- This guide: Re-read Step 4-6 for testing

---

**You're all set! Just 3 values to update and you're live! 🚀**
