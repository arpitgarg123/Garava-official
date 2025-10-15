#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Render Build Process..."

# Unset NODE_ENV to allow devDependencies
unset NODE_ENV

echo "📦 Installing server dependencies..."
cd server
npm install
echo "✅ Server dependencies installed"

echo "📦 Installing client dependencies..."
cd ../client

# Clean everything
echo "🧹 Cleaning old installations..."
rm -rf node_modules
rm -rf package-lock.json
npm cache clean --force

# Install ALL dependencies explicitly
echo "📦 Installing client dependencies..."
npm install

# Force install critical build dependencies
echo "📦 Explicitly installing build tools..."
npm install vite@^5.4.8 --save-dev
npm install @vitejs/plugin-react@^4.7.0 --save-dev
npm install @tailwindcss/vite@^4.1.12 --save-dev

# List what was actually installed
echo "📋 Checking installed packages..."
ls -la node_modules/@vitejs/ || echo "No @vitejs packages found!"
ls -la node_modules/vite/ || echo "No vite package found!"

# Verify again
if [ ! -d "node_modules/@vitejs/plugin-react" ]; then
  echo "❌ CRITICAL ERROR: @vitejs/plugin-react STILL missing after explicit install!"
  echo "Attempting emergency npm install..."
  npm install --legacy-peer-deps
  npm install @vitejs/plugin-react@^4.7.0 --save-dev --legacy-peer-deps
fi

echo "✅ Dependencies installation complete"

echo "🏗️ Building client..."
npm run build

echo "✅ Build completed successfully!"
