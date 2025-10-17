# 🚨 HOSTINGER SMTP AUTHENTICATION FAILED - SOLUTION GUIDE

## ❌ Error: `535 5.7.8 Error: authentication failed`

This error means your email credentials are being rejected by Hostinger's SMTP server.

---

## ✅ **SOLUTION: Follow These Steps in Order**

### **Step 1: Verify Email Account Exists in Hostinger** ⭐ MOST IMPORTANT

1. Log in to your **Hostinger Control Panel** (hpanel.hostinger.com)
2. Navigate to: **Emails** → **Email Accounts**
3. **Check if `info@garava.in` exists:**
   - ✅ If YES → Proceed to Step 2
   - ❌ If NO → **CREATE IT NOW**:
     - Click "Create Email Account"
     - Email: `info@garava.in`
     - Password: Set a **strong password** (save it!)
     - Click Create

### **Step 2: Test Webmail Login** ⭐ CRITICAL TEST

This verifies your credentials work:

1. Go to: **https://webmail.hostinger.com**
2. Enter:
   - **Email:** `info@garava.in`
   - **Password:** Your password
3. Click **Sign In**

**Result:**
- ✅ **Login successful** → Your credentials are correct! Go to Step 3
- ❌ **Login failed** → **PASSWORD IS WRONG!** Reset it in Hostinger:
  - Go to Hostinger → Emails → Email Accounts
  - Click the **3 dots** next to info@garava.in
  - Select **Change Password**
  - Set a new password (save it!)
  - Update `.env` file with new password
  - Try webmail login again

### **Step 3: Check Hostinger Email Settings**

In Hostinger Control Panel:

1. Go to **Emails** → **Email Accounts**
2. Click on **info@garava.in**
3. Look for these settings:
   - **Status:** Should be **Active** (not suspended/disabled)
   - **Quota:** Should have available space
   - **Forwarders:** Make sure it's not just forwarding (needs to be a real mailbox)

### **Step 4: Get Correct SMTP Settings from Hostinger**

Sometimes Hostinger uses different SMTP hosts for different accounts:

1. In Hostinger Control Panel → **Emails**
2. Look for **"Email Configuration"** or **"SMTP Settings"**
3. Check what SMTP host they provide:
   - Common options:
     - `smtp.hostinger.com` (most common)
     - `smtp.titan.email` (if using Titan email)
     - `mail.garava.in` (your domain)
     - `smtp.garava.in` (your domain)

### **Step 5: Update .env with Correct Settings**

Based on what you found in Step 4, update your `.env`:

```env
# Try these different combinations:

# Option 1: Standard Hostinger (most common)
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="info@garava.in"
SMTP_PASSWORD="your_actual_password"  # From Step 2
EMAIL_FROM="info@garava.in"

# Option 2: If you have Titan Email
SMTP_HOST="smtp.titan.email"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="info@garava.in"
SMTP_PASSWORD="your_actual_password"
EMAIL_FROM="info@garava.in"

# Option 3: Using your domain
SMTP_HOST="mail.garava.in"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="info@garava.in"
SMTP_PASSWORD="your_actual_password"
EMAIL_FROM="info@garava.in"
```

### **Step 6: Re-run Diagnostic**

After updating .env:

```bash
cd server
node diagnose-smtp.js
```

Look for: `✅ CONNECTION SUCCESSFUL!`

---

## 🔍 **Common Issues & Solutions**

### Issue 1: "Email account doesn't exist"
**Solution:** Create it in Hostinger → Emails → Email Accounts

### Issue 2: "Password is wrong"
**Solution:** 
1. Reset password in Hostinger
2. Test login at webmail.hostinger.com
3. Update .env with correct password

### Issue 3: "Using Titan Email (not Hostinger email)"
**Solution:** Change SMTP_HOST to `smtp.titan.email`

### Issue 4: "Email quota full"
**Solution:** 
1. Log in to webmail
2. Delete old emails
3. Empty trash

### Issue 5: "Account suspended"
**Solution:** Contact Hostinger support to reactivate

---

## 📧 **Alternative: Create a Different Email**

If `info@garava.in` continues to have issues:

1. Create a new email in Hostinger:
   - Example: `noreply@garava.in` or `hello@garava.in`
2. Update .env:
   ```env
   SMTP_USER="noreply@garava.in"
   SMTP_PASSWORD="new_password"
   EMAIL_FROM="noreply@garava.in"
   ```
3. Test again with `node diagnose-smtp.js`

---

## 🆘 **Still Not Working? Try Gmail SMTP (Temporary)**

As a quick test, use Gmail to verify the code works:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="your.gmail@gmail.com"
SMTP_PASSWORD="your_app_password"  # Generate in Gmail settings
EMAIL_FROM="your.gmail@gmail.com"
```

**Note:** Gmail requires an "App Password" not your regular password:
1. Go to: https://myaccount.google.com/apppasswords
2. Generate an app password
3. Use that in SMTP_PASSWORD

If Gmail works, you know the code is fine and it's specifically a Hostinger issue.

---

## 📞 **Contact Hostinger Support**

If nothing works, contact Hostinger with this info:

> "I'm trying to set up SMTP for my email info@garava.in. I'm getting authentication error 535 5.7.8. I've verified my password works in webmail. What are the correct SMTP settings? Do I need to enable external app access?"

Ask them for:
- Correct SMTP host
- Correct port
- Any special settings needed
- Whether "less secure apps" needs enabling

---

## ✅ **Checklist Before Contacting Support**

- [ ] Email account exists in Hostinger
- [ ] Can log in to webmail.hostinger.com successfully
- [ ] Email account is active (not suspended)
- [ ] Password is correct and recently tested
- [ ] Tried both port 587 and 465
- [ ] Checked Hostinger docs for SMTP settings
- [ ] Quota not full

---

## 🎯 **Most Likely Solution**

Based on the error, **99% chance it's one of these:**

1. **Wrong password** → Reset it and test webmail login
2. **Email doesn't exist** → Create it in Hostinger
3. **Wrong SMTP host** → Check Hostinger docs for correct host
4. **Account not activated** → Contact Hostinger

**Start with webmail login test - if that fails, you know the password is wrong!**
