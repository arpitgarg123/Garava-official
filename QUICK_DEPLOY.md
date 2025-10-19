# Garava VPS Deployment - Quick Start Guide

This is a simplified quick-start guide. For complete details, see `HOSTINGER_VPS_DEPLOYMENT_GUIDE.md`.

## 📋 Prerequisites

1. **Hostinger VPS** - Active and accessible
2. **Domain** - garava.in registered with Hostinger
3. **GitHub Access** - SSH key or Personal Access Token
4. **API Keys Ready**:
   - MongoDB Atlas connection string
   - ImageKit API keys
   - PhonePe merchant credentials
   - Email (SMTP) credentials

## 🚀 Quick Deployment (30 minutes)

### Step 1: SSH into VPS

```bash
ssh root@your-vps-ip
```

### Step 2: Create User (Security)

```bash
adduser garava
usermod -aG sudo garava
su - garava
```

### Step 3: Run Automated Setup

```bash
# Download and run setup script
curl -o- https://raw.githubusercontent.com/arpitgarg123/Garava-official/main/vps-setup.sh | bash

# Or if you prefer to review first:
wget https://raw.githubusercontent.com/arpitgarg123/Garava-official/main/vps-setup.sh
chmod +x vps-setup.sh
./vps-setup.sh
```

This script automatically:
- ✅ Updates system packages
- ✅ Installs Node.js 20
- ✅ Installs PM2, Nginx, Certbot
- ✅ Clones your repository

### Step 4: Configure Environment Variables

```bash
cd ~/Garava-official/server
nano .env
```

**Minimum Required Variables:**

```env
# Server
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://garava.in

# Database
MONGO_URI=mongodb+srv://your-connection-string

# JWT Secrets (generate strong ones!)
JWT_ACCESS_SECRET=your-super-secret-access-key-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters

# ImageKit
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/iwebc6s3s

# Email
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=noreply@garava.in
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@garava.in

# PhonePe
PHONEPE_MERCHANT_ID=your-merchant-id
PHONEPE_SALT_KEY=your-salt-key
PHONEPE_SALT_INDEX=1
PHONEPE_CALLBACK_URL=https://garava.in/api/payment/phonepe/callback

# GitHub Webhook
GITHUB_WEBHOOK_SECRET=your-webhook-secret-key
```

**Generate Strong Secrets:**
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Build and Deploy

```bash
cd ~/Garava-official
chmod +x deploy.sh
bash deploy.sh
```

### Step 6: Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Copy and run the command PM2 outputs
```

**Verify it's running:**
```bash
pm2 status
curl http://localhost:8080/api/health
```

### Step 7: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/garava.in
```

**Paste this configuration:**

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name garava.in www.garava.in;
    
    # For SSL certificate verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name garava.in www.garava.in;

    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/garava.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/garava.in/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # API requests
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # GitHub webhook
    location /webhook {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static files
    location / {
        root /home/garava/Garava-official/server/public;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**Enable and test:**
```bash
sudo ln -s /etc/nginx/sites-available/garava.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Configure DNS (Hostinger Panel)

1. Go to Hostinger control panel
2. Navigate to **Domains** → **garava.in** → **DNS/Nameservers**
3. Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | your-vps-ip | 14400 |
| A | www | your-vps-ip | 14400 |

**Wait 10-30 minutes for DNS propagation.**

Check propagation:
```bash
dig garava.in +short
# Should show your VPS IP
```

### Step 9: Get SSL Certificate

```bash
sudo certbot --nginx -d garava.in -d www.garava.in
```

Follow the prompts:
- Enter email for renewal notifications
- Agree to Terms of Service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

**Verify SSL:**
```bash
curl -I https://garava.in
# Should show "HTTP/2 200" with no SSL errors
```

### Step 10: Setup GitHub Auto-Deploy

1. **Generate Webhook Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Save this secret!
```

2. **Add to Environment:**
```bash
nano ~/Garava-official/server/.env
# Add: GITHUB_WEBHOOK_SECRET=your-generated-secret
```

3. **Restart PM2:**
```bash
pm2 restart all
```

4. **Configure GitHub:**
   - Go to https://github.com/arpitgarg123/Garava-official/settings/hooks
   - Click **Add webhook**
   - Payload URL: `https://garava.in/webhook`
   - Content type: `application/json`
   - Secret: (paste the secret from step 1)
   - Events: Just the push event
   - Active: ✅
   - Click **Add webhook**

5. **Test Auto-Deploy:**
```bash
# Make a small change and push
git commit --allow-empty -m "Test auto-deploy"
git push origin main

# Watch logs
pm2 logs garava-webhook
```

## ✅ Verification Checklist

After deployment, verify:

```bash
# 1. Check PM2 status
pm2 status
# Both apps should show "online"

# 2. Check backend health
curl http://localhost:8080/api/health
# Should return: {"status":"healthy"}

# 3. Check website
curl -I https://garava.in
# Should return: HTTP/2 200

# 4. Check jewelry images
# Open https://garava.in in browser
# Navigate to a jewelry product
# Verify color selector appears
# Click colors - images should change

# 5. Check logs
pm2 logs garava-backend --lines 50
# Should show no errors

# 6. Check Nginx
sudo systemctl status nginx
# Should show "active (running)"
```

## 📊 Monitoring Commands

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs garava-backend
pm2 logs garava-webhook

# Check resources
df -h          # Disk space
free -h        # Memory
pm2 list       # PM2 apps
```

## 🔧 Common Issues

### Issue: 502 Bad Gateway

**Solution:**
```bash
pm2 restart all
pm2 logs
# Check what's causing the crash
```

### Issue: SSL Certificate Failed

**Solution:**
```bash
# Make sure DNS is propagated
dig garava.in +short

# Try manual verification
sudo certbot certonly --webroot -w /var/www/html -d garava.in -d www.garava.in
```

### Issue: Auto-Deploy Not Working

**Solution:**
```bash
# Check webhook logs
pm2 logs garava-webhook

# Test webhook manually
curl -X POST https://garava.in/webhook
# Should return: "Webhook server is running"

# Verify GitHub webhook
# Go to GitHub → Settings → Webhooks → Recent Deliveries
```

## 🎉 Success!

Your site is now live at:
- 🌐 **Main Site**: https://garava.in
- 🔗 **API**: https://garava.in/api
- 🪝 **Webhook**: https://garava.in/webhook

**Next Steps:**
1. Test all functionality (checkout, payments, emails)
2. Monitor logs for first 24 hours
3. Setup daily backups
4. Test auto-deploy with a real commit

---

## 📚 Additional Resources

- **Full Guide**: See `HOSTINGER_VPS_DEPLOYMENT_GUIDE.md` for detailed explanations
- **Troubleshooting**: Check PM2 logs and Nginx error logs
- **Support**: Contact Hostinger support if VPS issues occur

**Need help?** Review the comprehensive guide in `HOSTINGER_VPS_DEPLOYMENT_GUIDE.md`.
