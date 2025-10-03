#!/bin/bash

echo "Starting robust Render build..."

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Navigate to client
echo "Moving to client directory..."
cd ../client

# Complete cleanup
echo "Cleaning client environment..."
rm -rf node_modules package-lock.json .vite

# Install with specific settings to avoid Rollup native issues
echo "Installing client dependencies..."
npm install --no-optional --legacy-peer-deps --force

# Try to install only the Linux Rollup binary we need
echo "Installing required Rollup binary..."
npm install @rollup/rollup-linux-x64-gnu@latest --save-dev --no-optional || echo "Rollup binary install failed, continuing..."

# Build with specific environment settings
echo "Building application..."
VITE_ROLLUP_NATIVE=false npm run build

echo "Build completed!"
cd ../server