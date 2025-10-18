# 🚀 Quick Start: Hostinger Email Setup

## ⚡ 3-Minute Setup Guide

### Step 1: Get Your Hostinger Email (2 minutes)

1. Log in to **Hostinger Control Panel**
2. Go to **Emails** → **Email Accounts**  
3. Create or use existing email:
   - Email: `info@garava.in` (or your choice)
   - Password: Create a strong password
   - Click **Create**

### Step 2: Update .env File (30 seconds)

Open `server/.env` and update these lines:

```env
SMTP_USER=info@garava.in              # Your Hostinger email
SMTP_PASSWORD=your_actual_password     # Your email password  
EMAIL_FROM=info@garava.in              # Same as SMTP_USER
```

### Step 3: Test It! (30 seconds)

```bash
cd server
node test-email.js
```

Look for: `✅ SUCCESS! Email sent successfully`

---

## ✅ Done!

Your email system is now working with Hostinger! 

### What's Different?

**Before:** Emails sent via Resend (couldn't receive)  
**Now:** Emails sent via YOUR Hostinger email (can send AND receive!)

---

## 🎯 Common Hostinger Email Addresses

| Email | Port | Security |
|-------|------|----------|
| `smtp.hostinger.com` | 465 | SSL (recommended) |
| `smtp.hostinger.com` | 587 | TLS |

**Default Setup (already configured):**
- Host: `smtp.hostinger.com`
- Port: `465`
- Security: SSL/TLS

---

## 📧 Where to Check Emails?

1. **Webmail:** https://webmail.hostinger.com
2. **Mobile:** Configure in Gmail/Outlook app
3. **Desktop:** Use Outlook, Thunderbird, etc.

---

## 🐛 Not Working?

### "Authentication failed"
→ Check email/password is correct in .env

### "Connection timeout"  
→ Try port 587 instead:
```env
SMTP_PORT=587
SMTP_SECURE=false
```

### Emails go to spam
→ Set up SPF/DKIM in Hostinger (under Email settings)

---

## 📚 Need More Help?

- Full Guide: `server/docs/HOSTINGER_EMAIL_SETUP.md`
- Migration Details: `EMAIL_MIGRATION_SUMMARY.md`
- Hostinger Support: https://www.hostinger.com/contact

---

**That's it! You're all set! 🎉**
