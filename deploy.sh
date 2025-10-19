#!/bin/bash
set -e  # Exit immediately on any error

echo "🚀 Starting Garava Deployment..."

# Base directories
SERVER_DIR="$HOME/Garava-official/server"
CLIENT_DIR="$HOME/Garava-official/client"

# Ensure Node.js 20 (your app requires it)
echo "📦 Ensuring Node.js 20 is active..."
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20 || echo "⚠️ Node 20 not found. Install with: nvm install 20"

# Step 1: Pull latest code
echo "📥 Pulling latest code from GitHub..."
cd "$HOME/Garava-official"
git fetch origin main
git reset --hard origin/main

# Step 2: Install server dependencies
echo "📦 Installing server dependencies..."
cd "$SERVER_DIR"
npm install --omit=dev

# Step 3: Build client
echo "🏗️ Building client..."
cd "$CLIENT_DIR"
rm -rf node_modules dist package-lock.json
npm cache clean --force
npm install
npm run build

# Step 4: Restart the backend
echo "♻️ Restarting PM2 app..."
mkdir -p "$SERVER_DIR/logs"
pm2 restart all || pm2 start "$HOME/Garava-official/ecosystem.config.js"
pm2 save

echo "✅ Deployment complete! 🚀"
