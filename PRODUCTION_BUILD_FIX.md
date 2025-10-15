# Production Build Fix for Render Deployment

## Problem
The build was failing on Render with error:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@vitejs/plugin-react'
```

## Root Cause
1. Render was trying to run Vite (which loads `vite.config.js`) BEFORE installing client dependencies
2. The `vite.config.js` imports `@vitejs/plugin-react` which doesn't exist yet
3. The build script wasn't ensuring proper dependency installation order

## Solution Applied

### 1. Created `build.sh` Script
A dedicated bash script that:
- Installs server dependencies first
- Installs client dependencies second (including `@vitejs/plugin-react`)
- Builds the client last (after all deps are available)
- Has error handling for each step

### 2. Updated `render.yaml`
Changed:
- `buildCommand` to use `bash build.sh`
- `startCommand` to explicitly `cd server && npm start`

### 3. Updated `server/package.json`
Modified `render-build` script to:
- Use `npm install --production=false` to install ALL dependencies (including devDependencies)
- Ensure client deps install before build

## Why This Works

**Execution Order:**
1. ✅ Server `npm install` → installs Express, Mongoose, etc.
2. ✅ Client `npm install` → installs React, Vite, @vitejs/plugin-react, etc.
3. ✅ Client `npm run build` → Vite can now find all required packages
4. ✅ Build output goes to `server/public`
5. ✅ Server starts and serves both API + built client

## Files Changed
- ✅ `build.sh` (new) - Main build orchestration script
- ✅ `render.yaml` - Updated buildCommand and startCommand
- ✅ `server/package.json` - Updated render-build script
- ✅ `client/vite.config.js` - Already configured to output to `../server/public`
- ✅ `client/.env.production` (new) - Production API URL

## Deployment Steps
1. Commit all changes:
   ```bash
   git add .
   git commit -m "Fix: Render deployment build process with proper dependency installation order"
   git push
   ```

2. Render will automatically:
   - Detect the push
   - Run `bash build.sh`
   - Install dependencies in correct order
   - Build successfully
   - Start server

## Expected Result
✅ No more missing package errors
✅ Client builds successfully
✅ Server serves API on `/api/*`
✅ Server serves built client for all other routes
✅ Production site works at https://garava-official.onrender.com

## Testing Locally
To test the build process locally:
```bash
bash build.sh
cd server
npm start
```

Then visit http://localhost:10000 (or PORT from .env)
