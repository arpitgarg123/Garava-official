#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Render Build Process..."

# Unset NODE_ENV temporarily to allow devDependencies installation
unset NODE_ENV

echo "📦 Installing server dependencies..."
cd server
npm install
echo "✅ Server dependencies installed"

echo "📦 Installing client dependencies..."
cd ../client

# Clear any cached modules
echo "🧹 Clearing npm cache and old modules..."
npm cache clean --force 2>/dev/null || true
rm -rf node_modules 2>/dev/null || true

# Install with explicit flags to ensure devDependencies are installed
echo "📦 Running npm install (this will include devDependencies)..."
npm install

# Verify critical packages
echo "📋 Verifying critical build packages..."
if [ ! -d "node_modules/@vitejs/plugin-react" ]; then
  echo "❌ @vitejs/plugin-react missing! Installing explicitly..."
  npm install @vitejs/plugin-react@^4.7.0 --save-dev
fi

if [ ! -d "node_modules/vite" ]; then
  echo "❌ vite missing! Installing explicitly..."
  npm install vite@^5.4.8 --save-dev
fi

echo "✅ All dependencies verified"

echo "🏗️ Building client..."
npm run build

echo "✅ Build completed successfully!"
