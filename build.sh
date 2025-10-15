#!/bin/bash

echo "🚀 Starting Render Build Process..."

echo "📦 Installing server dependencies..."
cd server
npm install --production=false
if [ $? -ne 0 ]; then
  echo "❌ Server dependency installation failed"
  exit 1
fi

echo "📦 Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
  echo "❌ Client dependency installation failed"
  exit 1
fi

echo "🏗️ Building client..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Client build failed"
  exit 1
fi

echo "✅ Build completed successfully!"
