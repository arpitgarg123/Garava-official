# 🔑 PhonePe Credential Issue - 401 Unauthorized

## Problem:
Your PhonePe authentication is failing with **401 Unauthorized**:
```
PhonePe token generation failed: { code: '401', success: false }
```

## Root Cause:
You're trying to use **sandbox API URLs** with **production credentials**.

Your current setup:
```
Client ID: GRAVAONLINE (production merchant ID)
Client Secret: ae761645-xxxx (production secret)
API URL: https://api-preprod.phonepe.com/apis/pg-sandbox (sandbox URL)
```

**This mismatch causes 401 error!**

---

## ✅ Solution: Choose One Path

### Path 1: Use Sandbox/Test Mode (Recommended for Testing)

If PhonePe gave you test credentials, they should look like:
```
TEST-GRAVAONLINE_XXXXXXX  (notice the TEST- prefix)
```

**Check your PhonePe portal:**
1. Look for "Test Mode" toggle or "Test Credentials" section
2. If available, switch to test mode
3. Get test merchant ID and secret
4. Update VPS .env with test credentials

**Update VPS `.env`:**
```bash
PHONEPE_CLIENT_ID=TEST-GRAVAONLINE_XXXXXXX  # Test merchant ID
PHONEPE_CLIENT_SECRET=your-test-secret-here
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

---

### Path 2: Use Production (Live Payments)

If you only have production credentials and want to test with **REAL MONEY**:

**Update VPS `.env`:**
```bash
PHONEPE_CLIENT_ID=GRAVAONLINE  # Keep as is
PHONEPE_CLIENT_SECRET=ae761645-e457-4cdb-ad97-2fcd238a6e00  # Keep as is  
PHONEPE_API_URL=https://api.phonepe.com/apis/pg  # Change to production URL
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/pg  # Change to production URL
```

⚠️ **Warning**: This will process REAL payments with REAL money!

---

## 🎯 Recommended Action:

1. **Check your PhonePe Business Portal**:
   - Look for "Test Mode" switch/toggle
   - Check if there's a separate "Test Credentials" section
   - Screenshot shows only "Production Credentials" - you may need to activate test mode

2. **Contact PhonePe Support** if no test credentials are visible:
   ```
   Subject: Need Sandbox/Test Credentials for API Testing
   
   Hi PhonePe Team,
   
   I need sandbox credentials to test my payment integration before going live.
   
   Current Account: GRAVAONLINE
   Current Portal: business.phonepe.com
   
   I can only see Production Credentials (generated Nov 14, 2024).
   How do I get Test/Sandbox credentials for testing?
   
   Thank you!
   ```

3. **Or Go Directly to Production** (if you're ready):
   - Use production credentials you already have
   - Change API URLs to production (remove -sandbox)
   - Test with small real payment (₹10-20)
   - Payments will be real!

---

## 📝 Quick Fix Commands

### If You Have Test Credentials:
```bash
ssh garava@168.231.102.18
cd ~/Garava-official/server
nano .env

# Update these lines:
PHONEPE_CLIENT_ID=TEST-GRAVAONLINE_YOUR_TEST_ID
PHONEPE_CLIENT_SECRET=your-test-secret-here

# Save and restart
pm2 restart garava-backend
```

### If Going Production:
```bash
ssh garava@168.231.102.18
cd ~/Garava-official/server  
nano .env

# Update these lines:
PHONEPE_API_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/pg

# Save and restart
pm2 restart garava-backend
```

---

## 🔍 How to Check Your Portal:

Look for these in PhonePe Business Portal:
- [ ] "Test Mode" toggle at top
- [ ] "Sandbox Credentials" section
- [ ] "Test API Keys" tab
- [ ] "Environment" selector (Test/Production)

If you can't find test mode, you likely need to request it from PhonePe support.

---

## 💡 Bottom Line:

**Sandbox URLs require Test Credentials (TEST-prefix)**
**Production URLs require Production Credentials (no TEST-prefix)**

You can't mix them - that's why you get 401!
