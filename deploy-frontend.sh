#!/usr/bin/env bash
# ==============================================================================
# Shadow Code Society — Frontend Deployment Script (Vercel)
# ==============================================================================
set -e

# Terminal Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$ROOT_DIR/client"

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}   SHADOW CODE SOCIETY — FRONTEND DEPLOYMENT (VERCEL)  ${NC}"
echo -e "${CYAN}======================================================${NC}"

# 1. Pre-flight checks
echo -e "\n${BLUE}[1/5] Checking environment & dependencies...${NC}"
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}Error: Node.js is not installed.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

if [ ! -d "$CLIENT_DIR" ]; then
  echo -e "${RED}Error: client directory not found at $CLIENT_DIR${NC}"
  exit 1
fi

# 2. Configure Backend API URL
echo -e "\n${BLUE}[2/5] Configuring Backend API URL...${NC}"
ENV_FILE="$CLIENT_DIR/.env.production"

# Allow passing VITE_API_URL via environment variable or argument
if [ -z "$VITE_API_URL" ]; then
  if [ -f "$ENV_FILE" ] && grep -q "VITE_API_URL" "$ENV_FILE"; then
    CURRENT_API_URL=$(grep "VITE_API_URL" "$ENV_FILE" | cut -d '=' -f2-)
    echo -e "Current VITE_API_URL in $ENV_FILE: ${YELLOW}$CURRENT_API_URL${NC}"
    read -p "Do you want to change it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      read -p "Enter your Render backend URL (e.g., https://shadow-code-society-api.onrender.com): " NEW_API_URL
      if [ -n "$NEW_API_URL" ]; then
        echo "VITE_API_URL=$NEW_API_URL" > "$ENV_FILE"
        echo -e "${GREEN}✓ Updated $ENV_FILE with VITE_API_URL=$NEW_API_URL${NC}"
      fi
    fi
  else
    echo -e "${YELLOW}Notice: No VITE_API_URL configured yet.${NC}"
    read -p "Enter your Render backend URL (or press Enter to use relative /api proxy): " USER_API_URL
    if [ -n "$USER_API_URL" ]; then
      echo "VITE_API_URL=$USER_API_URL" > "$ENV_FILE"
      echo -e "${GREEN}✓ Created $ENV_FILE with VITE_API_URL=$USER_API_URL${NC}"
    else
      echo -e "${YELLOW}Proceeding without .env.production (VITE_API_URL default will be used)${NC}"
    fi
  fi
else
  echo "VITE_API_URL=$VITE_API_URL" > "$ENV_FILE"
  echo -e "${GREEN}✓ Written VITE_API_URL=$VITE_API_URL to $ENV_FILE${NC}"
fi

# 3. Test Local Production Build
echo -e "\n${BLUE}[3/5] Testing production client build...${NC}"
cd "$CLIENT_DIR"
npm run build

echo -e "${GREEN}✓ Client production build passed successfully!${NC}"

# 4. Check for Vercel CLI
echo -e "\n${BLUE}[4/5] Preparing Vercel CLI...${NC}"
if command -v vercel >/dev/null 2>&1; then
  VERCEL_CMD="vercel"
else
  echo -e "${YELLOW}Vercel CLI not found globally. Using 'npx --yes vercel'...${NC}"
  VERCEL_CMD="npx --yes vercel"
fi

# 5. Deploy to Vercel
echo -e "\n${BLUE}[5/5] Deploying to Vercel...${NC}"
echo -e "Deploying directory: ${CYAN}$CLIENT_DIR${NC}"

# Check for production flag
PROD_FLAG="--prod"
if [ "$1" == "--preview" ]; then
  PROD_FLAG=""
  echo -e "${YELLOW}Deploying as PREVIEW build...${NC}"
else
  echo -e "${GREEN}Deploying directly to PRODUCTION (--prod)...${NC}"
fi

# Run Vercel Deploy from the client directory
cd "$CLIENT_DIR"
$VERCEL_CMD $PROD_FLAG

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   ✓ FRONTEND DEPLOYMENT TO VERCEL COMPLETED!         ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "Remember to set your environment variables in your Vercel Project Dashboard:"
echo -e "  • ${CYAN}VITE_API_URL${NC} = your Render backend URL (e.g., https://shadow-code-society-api.onrender.com)"
