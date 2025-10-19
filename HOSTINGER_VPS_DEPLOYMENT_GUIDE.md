# 🚀 Complete Guide: Deploy Garava to Hostinger VPS with GitHub Auto-Deploy

**Domain:** garava.in  
**Stack:** React (Vite) + Node.js + MongoDB  
**Server:** Hostinger VPS  
**Auto-Deploy:** GitHub Actions

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [VPS Initial Setup](#vps-initial-setup)
3. [Install Required Software](#install-required-software)
4. [Setup MongoDB](#setup-mongodb)
5. [Setup Project](#setup-project)
6. [Configure Environment Variables](#configure-environment-variables)
7. [Setup PM2 for Process Management](#setup-pm2-for-process-management)
8. [Setup Nginx as Reverse Proxy](#setup-nginx-as-reverse-proxy)
9. [Configure Domain (garava.in)](#configure-domain-garavain)
10. [Setup SSL Certificate (HTTPS)](#setup-ssl-certificate-https)
11. [Setup GitHub Auto-Deploy](#setup-github-auto-deploy)
12. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before starting, you need:
- ✅ Hostinger VPS access (SSH credentials)
- ✅ Domain garava.in registered
- ✅ GitHub repository access
- ✅ MongoDB connection (Atlas or local)
- ✅ All API keys (ImageKit, PhonePe, Email, etc.)

---

## 1. VPS Initial Setup

### Step 1.1: Connect to Your VPS

**Windows (using PowerShell):**
```powershell
# Replace with your VPS IP
ssh root@your-vps-ip
# Enter password when prompted
```

**Or use PuTTY:**
1. Download PuTTY from https://www.putty.org/
2. Enter your VPS IP in "Host Name"
3. Click "Open"
4. Login with username: `root` and your password

### Step 1.2: Update System

```bash
# Update package list
apt update

# Upgrade all packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

### Step 1.3: Create a Non-Root User (Security Best Practice)

```bash
# Create new user
adduser garava

# Add user to sudo group
usermod -aG sudo garava

# Switch to new user
su - garava
```

**From now on, use this user instead of root.**

---

## 2. Install Required Software

### Step 2.1: Install Node.js 20.x

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js 20
nvm install 20

# Set as default
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 2.2: Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

### Step 2.3: Install Nginx (Web Server)

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
```

---

## 3. Setup MongoDB

You have two options:

### Option A: Use MongoDB Atlas (Recommended)
You're already using this. Just keep your current connection string.

### Option B: Install MongoDB on VPS (If needed)

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod

# Get connection string (for local MongoDB)
# mongodb://localhost:27017/garava
```

---

## 4. Setup Project

### Step 4.1: Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/arpitgarg123/Garava-official.git

# Navigate to project
cd Garava-official

# Check branch
git branch -a
```

### Step 4.2: Setup SSH Key for GitHub (Optional but recommended)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter for default location
# Press Enter for no passphrase (or set one)

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add this key to GitHub:
# 1. Go to GitHub.com → Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Paste the key and save
```

---

## 5. Configure Environment Variables

### Step 5.1: Server Environment Variables

```bash
# Create .env file for server
cd ~/Garava-official/server
nano .env
```

**Paste this content (replace with your actual values):**

```env
# Server Configuration
NODE_ENV=production
PORT=8080

# MongoDB
MONGO_URI=mongodb+srv://admin_db_user:YOUR_PASSWORD@garavaofficialdb.grj3ngh.mongodb.net/production

# JWT Secrets
JWT_ACCESS_SECRET=your-strong-access-secret-here-min-32-chars
JWT_REFRESH_SECRET=your-strong-refresh-secret-here-min-32-chars

# Cookie Secret
COOKIE_SECRET=your-strong-cookie-secret-here

# Frontend URL
FRONTEND_URL=https://garava.in

# Email Configuration (Hostinger Email)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=info@garava.in
EMAIL_PASSWORD=your-email-password

# ImageKit
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/iwebc6s3s

# PhonePe
PHONEPE_MERCHANT_ID=your-merchant-id
PHONEPE_SALT_KEY=your-salt-key
PHONEPE_SALT_INDEX=1
PHONEPE_HOST_URL=https://api.phonepe.com/apis/hermes
PHONEPE_REDIRECT_URL=https://garava.in/payment/callback
PHONEPE_CALLBACK_URL=https://garava.in/api/payment/phonepe/callback

# Razorpay (if using)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://garava.in/api/auth/google/callback

# Redis (if using)
REDIS_URL=redis://localhost:6379
```

**Save file:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 5.2: Client Environment Variables

```bash
# Create .env file for client
cd ~/Garava-official/client
nano .env
```

**Paste this content:**

```env
VITE_API_URL=https://garava.in/api
```

**Save file:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## 6. Setup PM2 for Process Management

### Step 6.1: Install Dependencies

```bash
# Install server dependencies
cd ~/Garava-official/server
npm install --production

# Build client
cd ~/Garava-official/client
npm install
npm run build
```

### Step 6.2: Create PM2 Ecosystem File

```bash
cd ~/Garava-official
nano ecosystem.config.js
```

**Paste this content:**

```javascript
module.exports = {
  apps: [{
    name: 'garava-backend',
    script: './server/src/app.js',
    cwd: '/home/garava/Garava-official',
    instances: 2, // Run 2 instances for load balancing
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
};
```

**Save file:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 6.3: Start Application with PM2

```bash
# Create logs directory
mkdir -p ~/Garava-official/logs

# Start application
cd ~/Garava-official
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Copy and run the command it outputs (will look like):
# sudo env PATH=$PATH:/home/garava/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u garava --hp /home/garava

# Check status
pm2 status
pm2 logs garava-backend
```

---

## 7. Setup Nginx as Reverse Proxy

### Step 7.1: Create Nginx Configuration

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

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS - Main Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name garava.in www.garava.in;

    # SSL Certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/garava.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/garava.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;

    # Client Body Size (for image uploads)
    client_max_body_size 50M;

    # Root directory for client build
    root /home/garava/Garava-official/server/public;
    index index.html;

    # API requests to backend
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Serve React app for all other routes
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Access and Error Logs
    access_log /var/log/nginx/garava.in.access.log;
    error_log /var/log/nginx/garava.in.error.log;
}
```

**Save file:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 7.2: Enable Site and Test Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/garava.in /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test is successful, reload Nginx
sudo systemctl reload nginx
```

---

## 8. Configure Domain (garava.in)

### Step 8.1: Update DNS Settings in Hostinger

1. **Login to Hostinger Dashboard**
2. **Go to Domains → garava.in → DNS Zone**
3. **Add/Update these records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP | 14400 |
| A | www | YOUR_VPS_IP | 14400 |
| CNAME | www | garava.in | 14400 |

4. **Save Changes**

**Note:** DNS propagation can take 24-48 hours, but usually completes in 1-2 hours.

### Step 8.2: Verify DNS Propagation

```bash
# Check if domain points to your VPS
dig garava.in +short

# Should show your VPS IP address
```

**Online tools:**
- https://dnschecker.org/
- https://www.whatsmydns.net/

---

## 9. Setup SSL Certificate (HTTPS)

### Step 9.1: Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

### Step 9.2: Obtain SSL Certificate

**Wait until DNS is propagated, then run:**

```bash
# Get certificate for both garava.in and www.garava.in
sudo certbot --nginx -d garava.in -d www.garava.in

# Follow prompts:
# 1. Enter email address
# 2. Agree to terms of service (Y)
# 3. Share email with EFF (optional - Y or N)
# 4. Choose redirect option: 2 (Redirect HTTP to HTTPS)
```

### Step 9.3: Test SSL Certificate

```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Certificate will auto-renew every 90 days
```

### Step 9.4: Setup Auto-Renewal

```bash
# Certbot auto-renewal is already configured
# Verify cron job exists
sudo systemctl status certbot.timer

# Manual renewal if needed
sudo certbot renew
```

---

## 10. Setup GitHub Auto-Deploy

### Step 10.1: Create Deploy Script

```bash
cd ~/Garava-official
nano deploy.sh
```

**Paste this script:**

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/garava/Garava-official

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install --production

# Build client
echo "🏗️  Building client..."
cd ../client
npm install
npm run build

# Copy build to server public directory
echo "📂 Copying build files..."
rm -rf ../server/public/*
cp -r dist/* ../server/public/

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart garava-backend

echo "✅ Deployment complete!"

# Show PM2 status
pm2 status
```

**Save file:** Press `Ctrl+X`, then `Y`, then `Enter`

```bash
# Make script executable
chmod +x deploy.sh
```

### Step 10.2: Create GitHub Webhook Receiver

```bash
cd ~/Garava-official
mkdir -p webhook
cd webhook
npm init -y
npm install express
```

**Create webhook server:**

```bash
nano webhook-server.js
```

**Paste this content:**

```javascript
const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = 9000;
const SECRET = 'your-webhook-secret-here'; // Change this!

app.use(express.json());

// Verify GitHub signature
function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;
  
  const hash = 'sha256=' + crypto
    .createHmac('sha256', SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hash));
}

app.post('/webhook', (req, res) => {
  // Verify signature
  if (!verifySignature(req)) {
    console.log('❌ Invalid signature');
    return res.status(401).send('Invalid signature');
  }

  const event = req.headers['x-github-event'];
  
  if (event === 'push') {
    console.log('🔔 Push event received');
    console.log('📝 Commit:', req.body.head_commit?.message);
    
    // Run deployment script
    exec('bash /home/garava/Garava-official/deploy.sh', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Deployment error:', error);
        return;
      }
      console.log('✅ Deployment output:', stdout);
      if (stderr) console.error('⚠️  Deployment warnings:', stderr);
    });
    
    res.status(200).send('Deployment triggered');
  } else {
    res.status(200).send('Event received');
  }
});

app.listen(PORT, () => {
  console.log(`🎣 Webhook server running on port ${PORT}`);
});
```

**Save file:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 10.3: Setup Webhook with PM2

```bash
cd ~/Garava-official
nano ecosystem.config.js
```

**Add webhook app to the file:**

```javascript
module.exports = {
  apps: [
    {
      name: 'garava-backend',
      script: './server/src/app.js',
      cwd: '/home/garava/Garava-official',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G'
    },
    {
      name: 'garava-webhook',
      script: './webhook/webhook-server.js',
      cwd: '/home/garava/Garava-official',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/webhook-err.log',
      out_file: './logs/webhook-out.log',
      autorestart: true
    }
  ]
};
```

**Save and restart PM2:**

```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### Step 10.4: Configure Nginx for Webhook

```bash
sudo nano /etc/nginx/sites-available/garava.in
```

**Add this location block before the main `location /` block:**

```nginx
    # Webhook endpoint
    location /webhook {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

**Reload Nginx:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 10.5: Configure GitHub Webhook

1. **Go to your GitHub repository:** https://github.com/arpitgarg123/Garava-official
2. **Click Settings → Webhooks → Add webhook**
3. **Configure:**
   - **Payload URL:** `https://garava.in/webhook`
   - **Content type:** `application/json`
   - **Secret:** `your-webhook-secret-here` (same as in webhook-server.js)
   - **Which events:** Just the `push` event
   - **Active:** ✅ Checked
4. **Click "Add webhook"**

### Step 10.6: Test Auto-Deploy

```bash
# Make a small change to your repo
echo "# Test auto-deploy" >> ~/Garava-official/README.md

# Commit and push
cd ~/Garava-official
git add .
git commit -m "Test auto-deploy"
git push origin main

# Watch webhook logs
pm2 logs garava-webhook
```

---

## 11. Monitoring & Maintenance

### Daily Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs garava-backend --lines 100

# View webhook logs
pm2 logs garava-webhook --lines 50

# Monitor in real-time
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/garava.in.access.log
sudo tail -f /var/log/nginx/garava.in.error.log

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
top
```

### Restart Services

```bash
# Restart application
pm2 restart garava-backend

# Restart all PM2 apps
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (without downtime)
sudo systemctl reload nginx
```

### Update Node Modules

```bash
cd ~/Garava-official/server
npm update

cd ~/Garava-official/client
npm update
```

### Backup Database (if using local MongoDB)

```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/garava" --out=/home/garava/backups/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/garava" /home/garava/backups/20250119
```

---

## 🔥 Quick Reference Commands

### Application Management
```bash
pm2 start ecosystem.config.js    # Start apps
pm2 stop all                      # Stop all apps
pm2 restart all                   # Restart all apps
pm2 delete all                    # Remove all apps
pm2 save                          # Save process list
pm2 logs                          # View logs
pm2 monit                         # Monitor resources
```

### Manual Deployment
```bash
cd ~/Garava-official
bash deploy.sh
```

### SSL Certificate
```bash
sudo certbot renew               # Renew certificate
sudo certbot certificates        # List certificates
```

### Nginx
```bash
sudo nginx -t                    # Test configuration
sudo systemctl reload nginx      # Reload configuration
sudo systemctl restart nginx     # Restart Nginx
```

---

## 🐛 Troubleshooting

### Problem: Site not accessible

**Check:**
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check if Node app is running
pm2 status

# Check Nginx error logs
sudo tail -50 /var/log/nginx/garava.in.error.log

# Check application logs
pm2 logs garava-backend --lines 50
```

### Problem: "502 Bad Gateway"

**Solutions:**
```bash
# Application crashed - restart it
pm2 restart garava-backend

# Check if port 8080 is in use
sudo lsof -i :8080

# Check firewall
sudo ufw status
```

### Problem: SSL certificate issues

**Solutions:**
```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate status
sudo certbot certificates

# Test SSL
curl -I https://garava.in
```

### Problem: Auto-deploy not working

**Check:**
```bash
# Check webhook server
pm2 logs garava-webhook

# Test webhook manually
curl -X POST https://garava.in/webhook

# Check GitHub webhook deliveries
# Go to GitHub → Settings → Webhooks → Recent Deliveries
```

### Problem: Out of disk space

**Solutions:**
```bash
# Check disk usage
df -h

# Clean PM2 logs
pm2 flush

# Clean old logs
sudo find /var/log -name "*.log" -type f -mtime +30 -delete

# Clean npm cache
npm cache clean --force
```

---

## 🎉 Deployment Checklist

Before going live, verify:

- [ ] DNS points to VPS IP
- [ ] SSL certificate installed (HTTPS working)
- [ ] Application starts with PM2
- [ ] Nginx properly configured
- [ ] All environment variables set
- [ ] Database connection working
- [ ] Email sending working
- [ ] Payment gateway configured
- [ ] ImageKit working
- [ ] GitHub auto-deploy working
- [ ] Error logs are clean
- [ ] Website loads at https://garava.in
- [ ] API endpoints responding
- [ ] Color variants displaying correctly for jewelry
- [ ] Cart and checkout working
- [ ] Orders being created successfully

---

## 📞 Support

If you encounter issues:

1. Check logs: `pm2 logs garava-backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/garava.in.error.log`
3. Review this guide step-by-step
4. Check your environment variables
5. Verify all services are running: `pm2 status`

---

## 🚀 You're All Set!

Your Garava website is now:
- ✅ Deployed on Hostinger VPS
- ✅ Running in production mode
- ✅ Secured with SSL (HTTPS)
- ✅ Connected to garava.in domain
- ✅ Auto-deploying from GitHub
- ✅ Monitored by PM2
- ✅ Load balanced with 2 instances
- ✅ Ready to serve customers!

**Access your website:** https://garava.in

Happy selling! 🎊
