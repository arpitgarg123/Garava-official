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

# Step 1: Pull latest code (preserve .env files)
echo "📥 Pulling latest code from GitHub..."
cd "$HOME/Garava-official"

# Backup .env files before git reset
echo "💾 Backing up .env files..."
if [ -f "server/.env" ]; then
  cp server/.env /tmp/server.env.backup
  echo "✓ Backed up server/.env"
fi
if [ -f "client/.env" ]; then
  cp client/.env /tmp/client.env.backup
  echo "✓ Backed up client/.env"
fi

git fetch origin main
git reset --hard origin/main

# Restore .env files after git reset
echo "♻️ Restoring .env files..."
if [ -f "/tmp/server.env.backup" ]; then
  cp /tmp/server.env.backup server/.env
  echo "✓ Restored server/.env"
fi
if [ -f "/tmp/client.env.backup" ]; then
  cp /tmp/client.env.backup client/.env
  echo "✓ Restored client/.env"
fi

# Step 2: Install server dependencies
echo "📦 Installing server dependencies..."
cd "$SERVER_DIR"
npm install --omit=dev

# Step 3: Build client
echo "🏗️ Building client..."
cd "$CLIENT_DIR"

# Always do a clean install to ensure platform-specific dependencies
echo "🧹 Cleaning client directory..."
rm -rf node_modules dist package-lock.json .vite

# Install with platform-specific optional dependencies
echo "📦 Installing client dependencies (this may take a minute)..."
npm install --include=optional 2>&1 | tee /tmp/npm-install.log

# Check if npm install succeeded
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "❌ npm install failed! Log:"
  cat /tmp/npm-install.log
  exit 1
fi

# Verify critical dependencies exist
echo "🔍 Verifying critical dependencies..."
MISSING_DEPS=()
if [ ! -d "node_modules/@vitejs/plugin-react" ]; then
  MISSING_DEPS+=("@vitejs/plugin-react")
fi
if [ ! -d "node_modules/vite" ]; then
  MISSING_DEPS+=("vite")
fi
if [ ! -d "node_modules/react" ]; then
  MISSING_DEPS+=("react")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
  echo "❌ Missing dependencies: ${MISSING_DEPS[*]}"
  echo "📦 Package count in node_modules:"
  ls -1 node_modules | wc -l
  exit 1
fi

echo "✅ All critical dependencies verified"

echo "🔨 Running Vite build..."
npm run build

# Step 4: Restart the backend only (not webhook!)
echo "♻️ Restarting backend..."
mkdir -p "$SERVER_DIR/logs"
pm2 restart garava-backend || pm2 start "$HOME/Garava-official/ecosystem.config.js" --only garava-backend
pm2 save

echo "✅ Deployment complete! 🚀"
