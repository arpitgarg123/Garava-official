# 🚀 Render Deployment Guide for Garava-Official

## Prerequisites
- Git repository (GitHub, GitLab, or Bitbucket)
- MongoDB Atlas account (for database)
- ImageKit account (for image hosting)
- PhonePe merchant account (for payments)
- Email service (Gmail, Outlook, or SMTP)

## Step 1: Prepare Your Repository

1. **Commit and Push Changes**
```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

2. **Verify Repository Structure**
```
garava_official/
├── client/
├── server/
├── package.json
├── render.yaml
└── README.md
```

## Step 2: Set Up External Services

### MongoDB Atlas Setup
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create database user with read/write permissions
4. Configure Network Access:
   - Add IP: `0.0.0.0/0` (allow all - for Render)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
   ```

### ImageKit Setup
1. Go to [imagekit.io](https://imagekit.io)
2. Get your credentials:
   - Public Key
   - Private Key
   - URL Endpoint

### Email Service Setup
1. **Gmail App Password**:
   - Enable 2FA on your Gmail account
   - Generate App Password in Google Account settings
   - Use the generated password (not your regular password)

## Step 3: Deploy on Render

### Create New Web Service
1. Go to [render.com](https://render.com)
2. Sign up/Login with your Git provider
3. Click "New +" → "Web Service"
4. Connect your repository
5. Select `garava_official` repository

### Configure Deployment Settings
```
Name: garava-official
Region: Singapore (or closest to your users)
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: cd server && npm run render-build
Start Command: cd server && npm start
Plan: Free (or upgrade as needed)
```

### Add Environment Variables
In the Environment section, add these variables:

**Required Variables:**
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/garava?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
SESSION_SECRET=your-super-secure-session-secret-key-here
```

**ImageKit Variables:**
```bash
IMAGEKIT_PUBLIC_KEY=public_xyz123
IMAGEKIT_PRIVATE_KEY=private_xyz123
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

**Email Variables:**
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

**PhonePe Variables (Optional):**
```bash
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
```

**Additional Variables:**
```bash
CLIENT_URL=https://your-app-name.onrender.com
REDIS_URL=redis://localhost:6379
```

## Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your React frontend
   - Start your Node.js server

## Step 5: Verify Deployment

### Check Build Logs
Monitor the deployment in Render dashboard:
- Look for successful frontend build
- Verify server starts without errors
- Check for any missing environment variables

### Test Your Application
1. **Frontend**: Visit your Render URL (e.g., `https://garava-official.onrender.com`)
2. **API Health**: Test `https://garava-official.onrender.com/healthz`
3. **Database**: Verify data loads correctly
4. **Images**: Check ImageKit images load
5. **Authentication**: Test login/signup functionality

## Step 6: Custom Domain (Optional)

1. **In Render Dashboard**:
   - Go to Settings → Custom Domains
   - Add your domain name

2. **Update DNS**:
   - Add CNAME record: `www` → `your-app.onrender.com`
   - Add A record: `@` → Render IP addresses

## Step 7: Environment-Specific Configuration

### Update Client URL
After deployment, update your environment variable:
```bash
CLIENT_URL=https://your-actual-render-url.onrender.com
```

### CORS Configuration
The app is already configured to handle multiple origins including:
- `http://localhost:5173` (development)
- `https://garava-official.onrender.com` (production)
- Your custom domain

## Troubleshooting

### Common Issues

1. **Build Fails**
```bash
# Test locally first
cd server && npm run render-build
```

2. **Database Connection Issues**
- Verify MongoDB Atlas network access allows `0.0.0.0/0`
- Check connection string format
- Ensure database user has correct permissions

3. **Environment Variables**
- Double-check all variable names (case-sensitive)
- Ensure no extra spaces or special characters
- Verify all required variables are set

4. **Images Not Loading**
- Check ImageKit credentials
- Verify CSP settings allow ImageKit domain
- Test ImageKit URL directly

5. **CORS Errors**
- Update CLIENT_URL to match your Render domain
- Check CORS configuration in app.js

### Performance Optimization

1. **Upgrade Plan**: Consider paid plans for better performance
2. **Database Indexing**: Ensure MongoDB indexes are optimized
3. **Image Optimization**: Use ImageKit transformations
4. **Caching**: Implement Redis for sessions (optional)

## Monitoring

### Render Dashboard
- Monitor CPU and memory usage
- Check response times
- Review error logs

### Application Health
- Set up uptime monitoring (UptimeRobot, etc.)
- Monitor database performance
- Track error rates

## Automatic Deployments

Render automatically deploys when you push to your main branch. To deploy:

```bash
git add .
git commit -m "Update application"
git push origin main
```

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] MongoDB Atlas network properly configured
- [ ] HTTPS enforced (Render provides this automatically)
- [ ] CSP headers configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled

## Support

If you encounter issues:
1. Check Render build and runtime logs
2. Test the application locally with production environment variables
3. Verify all external services (MongoDB, ImageKit) are accessible
4. Review CORS and CSP configurations

Your Garava-Official application should now be successfully deployed on Render! 🎉