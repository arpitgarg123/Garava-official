#!/bin/bash

# Robust build script for Render deployment
echo "Starting Render build process..."

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Navigate to client directory
echo "Navigating to client directory..."
cd ../client

# Clean existing installations (this fixes the Rollup issue)
echo "Cleaning client dependencies..."
rm -rf node_modules package-lock.json

# Install client dependencies with clean cache
echo "Installing client dependencies with clean cache..."
npm install --no-optional --legacy-peer-deps

# Try to install rollup native dependencies explicitly
echo "Installing rollup native dependencies..."
npm install @rollup/rollup-linux-x64-gnu --save-dev --no-optional || echo "Rollup native dependency install failed, continuing..."

# Build the client
echo "Building client application..."
npm run build

# Navigate back to server
echo "Returning to server directory..."
cd ../server

echo "Build process completed!"