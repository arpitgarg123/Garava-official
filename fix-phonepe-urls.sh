#!/bin/bash
# PhonePe V2 Sandbox Configuration Fix
# This fixes the "Api Mapping Not Found" error

cd ~/Garava-official/server

# Update PhonePe URLs to correct v2 sandbox endpoints
sed -i 's|PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg|PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox|g' .env
sed -i 's|PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg|PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox|g' .env

echo "✅ PhonePe URLs updated to sandbox endpoints"
echo ""
echo "Updated configuration:"
grep "PHONEPE_" .env
