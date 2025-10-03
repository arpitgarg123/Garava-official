#!/bin/bash

echo "Starting robust Render build..."

# Install server dependencies with optional packages
echo "Installing server dependencies..."
npm install --include=optional

# Install Sharp specifically for Linux x64
echo "Installing Sharp for Linux x64..."
npm install --os=linux --cpu=x64 sharp

# Navigate to client
echo "Moving to client directory..."
cd ../client

# Complete cleanup
echo "Cleaning client environment..."
rm -rf node_modules package-lock.json .vite

# Install with specific settings to avoid native dependency issues
echo "Installing client dependencies..."
npm install --legacy-peer-deps

# Install LightningCSS for Linux
echo "Installing LightningCSS..."
npm install lightningcss@1.21.0 --legacy-peer-deps

# Build with specific environment settings
echo "Building application..."
npm run build

echo "Build completed!"
cd ../server