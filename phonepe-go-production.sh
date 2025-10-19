#!/bin/bash
# PhonePe Production Mode Activation
# This switches from sandbox to production for real payments

cd ~/Garava-official/server

echo "🔄 Switching PhonePe to PRODUCTION mode..."
echo ""

# Backup current config
cp .env .env.backup-before-production

# Replace sandbox URLs with production URLs
sed -i 's|https://api-preprod.phonepe.com/apis/pg-sandbox|https://api.phonepe.com/apis/pg|g' .env

echo "✅ PhonePe switched to PRODUCTION mode"
echo ""
echo "📋 Current PhonePe Configuration:"
grep "PHONEPE_" .env
echo ""
echo "⚠️  IMPORTANT: This will now process REAL payments with REAL money!"
echo "✅ Ready to restart backend with production PhonePe"
