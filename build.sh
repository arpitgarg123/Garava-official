#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Render Build Process..."

echo "🧹 Cleaning old builds and node_modules..."
rm -rf client/node_modules/.vite
rm -rf client/node_modules/.cache
echo "✅ Cache cleared"

echo "📦 Installing server dependencies..."
cd server
npm install --include=dev
echo "✅ Server dependencies installed"

echo "📦 Installing client dependencies (including devDependencies)..."
cd ../client
rm -rf node_modules/@vitejs 2>/dev/null || true
npm install --include=dev
echo "✅ Client dependencies installed"

echo "📋 Verifying @vitejs/plugin-react is installed..."
if [ -d "node_modules/@vitejs/plugin-react" ]; then
  echo "✅ @vitejs/plugin-react found"
else
  echo "❌ @vitejs/plugin-react NOT found, retrying installation..."
  npm install @vitejs/plugin-react --save-dev
fi

echo "🏗️ Building client with Vite..."
NODE_ENV=production npm run build
echo "✅ Client build completed"

echo "✅ Full build completed successfully!"
