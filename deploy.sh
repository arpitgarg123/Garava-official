#!/bin/bash

# Garava Deployment Script
# Handles git pull, build, and PM2 restart with zero downtime

set -e  # Exit on any error

echo "🚀 Starting Garava deployment..."
cd /home/garava/Garava-official

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm ci --production

# Build client
echo "🏗️  Building client..."
cd ../client
npm ci
npm run build

# Copy build to server public folder
echo "📁 Copying build to server..."
rm -rf ../server/public/*
cp -r dist/* ../server/public/

# Restart PM2
echo "♻️  Restarting PM2..."
cd ..
pm2 restart ecosystem.config.js --update-env

# Health check
echo "🏥 Performing health check..."
sleep 3
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    pm2 status
else
    echo "❌ Health check failed!"
    pm2 logs garava-backend --lines 50
    exit 1
fi

echo "🎉 Deployment complete!"
