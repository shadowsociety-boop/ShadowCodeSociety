#!/usr/bin/env bash
# ==============================================================================
# Shadow Code Society — Cloud Services & Credentials Configurator
# ==============================================================================
set -e

# Terminal Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_ENV="$ROOT_DIR/server/.env"

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}   SHADOW CODE SOCIETY — CLOUD CREDENTIALS SETUP      ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo -e "This script helps you configure your credentials for:"
echo -e "  1. ${GREEN}Supabase${NC}   (Managed PostgreSQL Database)"
echo -e "  2. ${MAGENTA}Cloudinary${NC} (Persistent Image & File Uploads)"
echo -e "  3. ${RED}Redis${NC}      (High-Speed Cache & Rate Limiting)\n"

# Ensure server/.env exists
if [ ! -f "$SERVER_ENV" ]; then
  cp "$ROOT_DIR/server/.env.example" "$SERVER_ENV"
  echo -e "${GREEN}✓ Created server/.env from .env.example${NC}"
fi

# ── 1. SUPABASE DATABASE ─────────────────────────────────────────────────────
echo -e "${BOLD}${GREEN}[1/3] Supabase Database Configuration${NC}"
echo -e "Log in at: ${BLUE}https://supabase.com/dashboard${NC}"
echo -e "Account Email: ${YELLOW}shadow.society@jietjodhpur.ac.in${NC}"
echo -e "Steps:"
echo -e "  1. Open your project (or create one named 'shadowcode')."
echo -e "  2. Go to: ${CYAN}Project Settings -> Database -> Connection String -> URI${NC}"
echo -e "  3. Copy the URI (format: postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true)\n"

read -p "Enter your Supabase Connection URI (leave blank to keep current): " SUPABASE_URI
if [ -n "$SUPABASE_URI" ]; then
  # Remove existing DATABASE_URL line and append new one
  grep -v "^DATABASE_URL=" "$SERVER_ENV" > "$SERVER_ENV.tmp" || true
  echo "DATABASE_URL=\"$SUPABASE_URI\"" >> "$SERVER_ENV.tmp"
  mv "$SERVER_ENV.tmp" "$SERVER_ENV"
  echo -e "${GREEN}✓ Updated DATABASE_URL in server/.env${NC}"
fi

# ── 2. CLOUDINARY MEDIA STORAGE ──────────────────────────────────────────────
echo -e "\n${BOLD}${MAGENTA}[2/3] Cloudinary Media Storage Configuration${NC}"
echo -e "Log in at: ${BLUE}https://cloudinary.com/console${NC}"
echo -e "Account Email: ${YELLOW}shadow.society@jietjodhpur.ac.in${NC}"
echo -e "Steps:"
echo -e "  1. On your Cloudinary Dashboard, find 'Product Environment Credentials'."
echo -e "  2. You will see Cloud Name, API Key, and API Secret.\n"

read -p "Enter Cloud Name (leave blank to skip): " CLOUD_NAME
read -p "Enter API Key (leave blank to skip): " CLOUD_KEY
read -p "Enter API Secret (leave blank to skip): " CLOUD_SECRET

if [ -n "$CLOUD_NAME" ] && [ -n "$CLOUD_KEY" ] && [ -n "$CLOUD_SECRET" ]; then
  grep -v "^CLOUDINARY_" "$SERVER_ENV" > "$SERVER_ENV.tmp" || true
  grep -v "^STORAGE_TYPE=" "$SERVER_ENV.tmp" > "$SERVER_ENV.tmp2" || true
  echo "STORAGE_TYPE=\"cloudinary\"" >> "$SERVER_ENV.tmp2"
  echo "CLOUDINARY_CLOUD_NAME=\"$CLOUD_NAME\"" >> "$SERVER_ENV.tmp2"
  echo "CLOUDINARY_API_KEY=\"$CLOUD_KEY\"" >> "$SERVER_ENV.tmp2"
  echo "CLOUDINARY_API_SECRET=\"$CLOUD_SECRET\"" >> "$SERVER_ENV.tmp2"
  mv "$SERVER_ENV.tmp2" "$SERVER_ENV"
  rm -f "$SERVER_ENV.tmp"
  echo -e "${GREEN}✓ Updated Cloudinary credentials in server/.env (STORAGE_TYPE=cloudinary)${NC}"
fi

# ── 3. REDIS CACHE & RATE LIMITING ───────────────────────────────────────────
echo -e "\n${BOLD}${RED}[3/3] Redis Configuration${NC}"
echo -e "Account Email: ${YELLOW}shadow.society@jietjodhpur.ac.in${NC}"
echo -e "Format: redis://default:<password>@<host>:<port>\n"

read -p "Enter Redis Connection URL (leave blank to skip): " REDIS_CONN_URL
if [ -n "$REDIS_CONN_URL" ]; then
  grep -v "^REDIS_URL=" "$SERVER_ENV" > "$SERVER_ENV.tmp" || true
  echo "REDIS_URL=\"$REDIS_CONN_URL\"" >> "$SERVER_ENV.tmp"
  mv "$SERVER_ENV.tmp" "$SERVER_ENV"
  echo -e "${GREEN}✓ Updated REDIS_URL in server/.env${NC}"
fi

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   ✓ LOCAL CONFIGURATION COMPLETED!                   ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "To apply these on ${CYAN}Render Production${NC}:"
echo -e "  1. Go to ${BLUE}https://dashboard.render.com${NC} -> Click your Web Service -> ${CYAN}Environment${NC}."
echo -e "  2. Add/Update:"
echo -e "     • DATABASE_URL"
echo -e "     • CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
echo -e "     • STORAGE_TYPE = cloudinary"
if [ -n "$REDIS_CONN_URL" ]; then
  echo -e "     • REDIS_URL"
fi
echo -e "  3. Save Changes — Render will automatically redeploy!"
