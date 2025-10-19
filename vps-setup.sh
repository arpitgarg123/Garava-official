#!/bin/bash

# Garava VPS Quick Setup Script
# Run this on your VPS after initial SSH connection

set -e  # Exit on any error

echo "🚀 Garava VPS Setup Script"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${YELLOW}⚠️  Please run as regular user (not root)${NC}"
   exit 1
fi

echo -e "${GREEN}Step 1: Updating system...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential

echo -e "${GREEN}Step 2: Installing Node.js 20...${NC}"
if ! command -v nvm &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi
nvm install 20
nvm use 20
nvm alias default 20

echo -e "${GREEN}Step 3: Installing PM2...${NC}"
npm install -g pm2

echo -e "${GREEN}Step 4: Installing Nginx...${NC}"
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo ufw allow 'Nginx Full'

echo -e "${GREEN}Step 5: Installing Certbot...${NC}"
sudo apt install -y certbot python3-certbot-nginx

echo -e "${GREEN}Step 6: Cloning repository...${NC}"
if [ -d "~/Garava-official" ]; then
    echo "Repository already exists, pulling latest..."
    cd ~/Garava-official
    git pull origin main
else
    git clone https://github.com/arpitgarg123/Garava-official.git ~/Garava-official
fi

echo ""
echo -e "${GREEN}✅ Basic setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure environment variables:"
echo "   cd ~/Garava-official/server"
echo "   nano .env"
echo ""
echo "2. Build and start application:"
echo "   cd ~/Garava-official"
echo "   bash deploy.sh"
echo ""
echo "3. Configure Nginx:"
echo "   sudo nano /etc/nginx/sites-available/garava.in"
echo ""
echo "4. Get SSL certificate (after DNS is configured):"
echo "   sudo certbot --nginx -d garava.in -d www.garava.in"
echo ""
echo "📖 See HOSTINGER_VPS_DEPLOYMENT_GUIDE.md for detailed instructions"
