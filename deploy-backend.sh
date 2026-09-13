#!/usr/bin/env bash
# ==============================================================================
# Shadow Code Society — Backend Deployment Script (Render)
# ==============================================================================
set -e

# Terminal Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}    SHADOW CODE SOCIETY — BACKEND DEPLOYMENT (RENDER)  ${NC}"
echo -e "${CYAN}======================================================${NC}"

# 1. Pre-flight checks
echo -e "\n${BLUE}[1/4] Checking environment & server structure...${NC}"
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}Error: Node.js is not installed.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

if [ ! -d "$SERVER_DIR" ]; then
  echo -e "${RED}Error: server directory not found at $SERVER_DIR${NC}"
  exit 1
fi

# 2. Test Local Production Build & Prisma Generation
echo -e "\n${BLUE}[2/4] Testing Prisma Client generation & TypeScript build...${NC}"
cd "$SERVER_DIR"
npx prisma generate
npm run build

echo -e "${GREEN}✓ Backend TypeScript build passed successfully!${NC}"

# 3. Check Deployment Mode
echo -e "\n${BLUE}[3/4] Choose Render Deployment Method:${NC}"
echo -e "  ${CYAN}1)${NC} Trigger existing Render Service via ${YELLOW}Deploy Hook URL${NC} (Instant zero-downtime deploy)"
echo -e "  ${CYAN}2)${NC} Deploy via ${YELLOW}Render Blueprint (render.yaml)${NC} / Git Push"
echo -e "  ${CYAN}3)${NC} Show Render Manual Setup Guide (Build/Start commands & Env Vars)"

# If RENDER_DEPLOY_HOOK is already set in env, auto-trigger
if [ -n "$RENDER_DEPLOY_HOOK_URL" ]; then
  CHOICE=1
  DEPLOY_HOOK="$RENDER_DEPLOY_HOOK_URL"
else
  read -p "Select method [1-3] (Default: 1): " CHOICE
  CHOICE=${CHOICE:-1}
fi

if [ "$CHOICE" == "1" ]; then
  echo -e "\n${BLUE}Deploying via Render Webhook Hook...${NC}"
  if [ -z "$DEPLOY_HOOK" ]; then
    read -p "Enter your Render Deploy Hook URL (e.g. https://api.render.com/deploy/srv-xxx?key=yyy): " DEPLOY_HOOK
  fi

  if [ -z "$DEPLOY_HOOK" ]; then
    echo -e "${RED}No deploy hook provided. Falling back to Git push instructions.${NC}"
    CHOICE=2
  else
    echo -e "Sending trigger to Render API..."
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$DEPLOY_HOOK")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
      echo -e "${GREEN}✓ Render build triggered successfully! (HTTP $HTTP_CODE)${NC}"
      echo -e "Response: $BODY"
      echo -e "Check your live build status in your Render dashboard: https://dashboard.render.com"
    else
      echo -e "${RED}Deploy hook returned HTTP $HTTP_CODE: $BODY${NC}"
    fi
  fi
fi

if [ "$CHOICE" == "2" ]; then
  echo -e "\n${BLUE}Render Blueprint Deployment (render.yaml):${NC}"
  echo -e "A ${CYAN}render.yaml${NC} file is created at the repository root."
  echo -e "Steps to deploy via Render Blueprint:"
  echo -e "  1. Ensure your latest changes are pushed to GitHub:"
  echo -e "     ${YELLOW}git add render.yaml server/ && git commit -m 'chore: render config' && git push origin main${NC}"
  echo -e "  2. Open Render Dashboard: ${CYAN}https://dashboard.render.com/blueprints${NC}"
  echo -e "  3. Click ${GREEN}'New Blueprint Instance'${NC} and connect this repository: ${YELLOW}shadowsociety-boop/ShadowCodeSociety${NC}"
  echo -e "  4. Render will automatically provision both:"
  echo -e "     • ${MAGENTA}shadow-code-db${NC} (PostgreSQL Database)"
  echo -e "     • ${MAGENTA}shadow-code-society-api${NC} (Node Web Service)"

  read -p "Do you want to push current git changes to GitHub now? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$ROOT_DIR"
    git add render.yaml server/ client/vercel.json
    if git status --porcelain | grep -q .; then
      git commit -m "chore: add deployment configurations for Render and Vercel"
      git push origin main
      echo -e "${GREEN}✓ Pushed to GitHub main branch! Render will trigger auto-deploy if connected.${NC}"
    else
      echo -e "${YELLOW}Working tree clean, pushing existing commits...${NC}"
      git push origin main
    fi
  fi
fi

if [ "$CHOICE" == "3" ]; then
  echo -e "\n${CYAN}======================================================${NC}"
  echo -e "${CYAN}       RENDER MANUAL WEB SERVICE CONFIGURATION         ${NC}"
  echo -e "${CYAN}======================================================${NC}"
  echo -e "In your Render Dashboard (${BLUE}https://dashboard.render.com${NC}):"
  echo -e "  • ${YELLOW}Name:${NC} shadow-code-society-api"
  echo -e "  • ${YELLOW}Root Directory:${NC} server"
  echo -e "  • ${YELLOW}Runtime:${NC} Node"
  echo -e "  • ${YELLOW}Build Command:${NC} npm install && npx prisma generate && npm run build"
  echo -e "  • ${YELLOW}Start Command:${NC} npx prisma db push && npm start"
  echo -e "\n${YELLOW}Required Environment Variables:${NC}"
  echo -e "  • ${CYAN}DATABASE_URL${NC}        = <Your PostgreSQL connection string>"
  echo -e "  • ${CYAN}NODE_ENV${NC}            = production"
  echo -e "  • ${CYAN}JWT_SECRET${NC}          = $(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  echo -e "  • ${CYAN}JWT_REFRESH_SECRET${NC}  = $(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  echo -e "  • ${CYAN}CLIENT_URL${NC}          = <Your Vercel URL, e.g. https://shadowcodesociety.vercel.app>"
  echo -e "  • ${CYAN}COOKIE_SAMESITE${NC}     = none"
  echo -e "  • ${CYAN}STORAGE_TYPE${NC}        = local"
fi

# 4. Post-deploy Seed Instructions
echo -e "\n${BLUE}[4/4] Database Seeding Reminder:${NC}"
echo -e "To seed the Render PostgreSQL database with all members, events, and 10 Udemy courses:"
echo -e "  Option A (Render Web Shell):"
echo -e "    ${YELLOW}npm run db:seed${NC}"
echo -e "  Option B (From local machine pointing to Render DB):"
echo -e "    ${YELLOW}DATABASE_URL=\"<RENDER_EXTERNAL_DB_URL>\" npm --prefix server run db:seed${NC}"

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   ✓ BACKEND DEPLOYMENT PREPARATION COMPLETED!        ${NC}"
echo -e "${GREEN}======================================================${NC}"
