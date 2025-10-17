# Hostinger Webmail SMTP Configuration Guide

## 📧 Migration from Resend to Hostinger Webmail

This project has been migrated from **Resend** to **Hostinger Webmail** using **nodemailer** for SMTP email delivery.

---

## 🔧 **What Changed**

### Before (Resend):
- Used Resend API with API key
- Could send emails but couldn't receive replies
- Limited to Resend's sender domains

### After (Hostinger SMTP):
- Uses your own Hostinger email account (e.g., `info@garava.in`)
- **Can both send AND receive emails**
- Full control over your email domain
- Professional business email appearance

---

## 🚀 **Setup Instructions**

### **Step 1: Create Hostinger Email Account**

1. Log in to your **Hostinger control panel**
2. Navigate to **Emails** section
3. Create a new email account or use existing one:
   - Example: `info@garava.in` or `noreply@garava.in`
4. Set a strong password and save it

### **Step 2: Get SMTP Credentials**

Hostinger SMTP settings are:
- **SMTP Server:** `smtp.hostinger.com`
- **Port:** `465` (SSL) or `587` (TLS)
- **Security:** SSL/TLS
- **Username:** Your full email address (e.g., `info@garava.in`)
- **Password:** Your email account password

### **Step 3: Update Environment Variables**

Add these variables to your `.env` file:

```env
# ===== HOSTINGER SMTP EMAIL CONFIGURATION =====
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@garava.in           # Your Hostinger email address
SMTP_PASSWORD=your_email_password   # Your Hostinger email password
EMAIL_FROM=info@garava.in           # Default sender email (same as SMTP_USER)
```

### **Step 4: Remove Old Resend Configuration**

Remove or comment out these old variables:
```env
# Old Resend config (no longer needed)
# RESEND_API_KEY=re_xxxxx
```

---

## 📝 **Environment Variables Explained**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SMTP_HOST` | Yes | Hostinger SMTP server | `smtp.hostinger.com` |
| `SMTP_PORT` | Yes | SMTP port (465 for SSL) | `465` |
| `SMTP_SECURE` | Yes | Use SSL/TLS | `true` |
| `SMTP_USER` | Yes | Your Hostinger email | `info@garava.in` |
| `SMTP_PASSWORD` | Yes | Email account password | `yourStrongPassword123` |
| `EMAIL_FROM` | Yes | Default sender address | `info@garava.in` |

---

## ✅ **Testing Your Setup**

### 1. **Test Email Configuration**
Start your server and check the logs:
```bash
npm run dev
```

Look for:
```
✅ SMTP server is ready to send emails
```

### 2. **Test Sending an Email**
Try any feature that sends emails:
- User signup (verification email)
- Password reset
- Contact form
- Newsletter subscription

### 3. **Check Email Delivery**
- Check your inbox (the recipient's email)
- Check your Hostinger webmail **Sent** folder to confirm delivery
- Check spam/junk folder if email doesn't arrive

---

## 🔐 **Security Best Practices**

1. **Use Strong Password:** Use a complex password for your email account
2. **Enable 2FA:** If Hostinger supports it, enable two-factor authentication
3. **Dedicated Email:** Consider using a dedicated email for app notifications (e.g., `noreply@garava.in`)
4. **Environment Security:** Never commit `.env` file to Git
5. **Production Credentials:** Use different credentials for production vs development

---

## 🎯 **Email Types Sent by Your App**

Your application sends these types of emails:

1. **User Authentication:**
   - Email verification (signup)
   - Password reset
   - Resend verification

2. **Appointments:**
   - Appointment created confirmation
   - Appointment status changed
   - Appointment cancelled

3. **Newsletter:**
   - Welcome email on subscription

4. **Contact Form:**
   - User confirmation email
   - Admin notification email

---

## 🆚 **Port Options**

### Port 465 (SSL - Recommended)
```env
SMTP_PORT=465
SMTP_SECURE=true
```
✅ Most secure, encrypted from start
✅ Works with most firewalls

### Port 587 (TLS)
```env
SMTP_PORT=587
SMTP_SECURE=false
```
⚠️ Uses STARTTLS (upgrades to encryption)
⚠️ May be blocked by some networks

---

## 🐛 **Troubleshooting**

### Problem: "Authentication failed"
**Solution:**
- Double-check `SMTP_USER` is your full email address
- Verify `SMTP_PASSWORD` is correct
- Make sure email account is active in Hostinger

### Problem: "Connection timeout"
**Solution:**
- Check if port 465 is blocked by your firewall
- Try port 587 with `SMTP_SECURE=false`
- Verify Hostinger SMTP is accessible from your network

### Problem: Emails going to spam
**Solution:**
- Set up SPF records in your domain DNS
- Configure DKIM in Hostinger email settings
- Add DMARC policy to your DNS
- Use a professional "From" name and address

### Problem: "self signed certificate"
**Solution:**
- In development, set `rejectUnauthorized: false` (already done in code)
- In production, ensure SSL certificates are valid

---

## 📊 **Monitoring Email Delivery**

### Check Logs:
Your server logs will show:
```
✅ Email sent successfully: <message-id>
```

### Hostinger Webmail:
- Log in to webmail.hostinger.com
- Check **Sent** folder for sent emails
- Check **Inbox** for any bounce-backs

### Email Tracking (Optional):
Consider adding:
- Read receipts (optional in nodemailer)
- Link tracking in email templates
- Bounce handling via webhooks

---

## 🚀 **Production Deployment**

### Render.com / Heroku:
Add environment variables in dashboard:
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@garava.in
SMTP_PASSWORD=your_password
EMAIL_FROM=info@garava.in
```

### Docker:
Add to your `.env` or docker-compose.yml

---

## 📧 **Recommended Email Accounts**

Create separate emails for different purposes:

| Email | Purpose |
|-------|---------|
| `info@garava.in` | General inquiries, contact form |
| `noreply@garava.in` | Automated emails (verification, reset) |
| `support@garava.in` | Customer support emails |
| `admin@garava.in` | Admin notifications |

---

## ✨ **Advantages Over Resend**

1. ✅ **Two-way communication:** Can receive replies
2. ✅ **No monthly limits:** Unlimited emails (based on your plan)
3. ✅ **Professional branding:** Use your domain
4. ✅ **Full control:** Manage email in webmail
5. ✅ **Cost-effective:** Included with Hostinger hosting
6. ✅ **Better deliverability:** From your own domain

---

## 📚 **Additional Resources**

- [Hostinger Email Setup](https://www.hostinger.com/tutorials/how-to-use-hostinger-webmail)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Email Best Practices](https://nodemailer.com/usage/)

---

## ⚠️ **Important Notes**

1. **Sender Email:** Must match `SMTP_USER` for authentication
2. **Daily Limits:** Check your Hostinger plan for email sending limits
3. **SPF/DKIM:** Configure in Hostinger for better deliverability
4. **Testing:** Always test in development before production
5. **Backup:** Keep a backup of your .env configuration

---

**Need Help?** Contact Hostinger support for email-specific issues.
