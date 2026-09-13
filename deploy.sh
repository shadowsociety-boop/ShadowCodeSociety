#!/usr/bin/env bash
# ==============================================================================
# Shadow Code Society — Full-Stack Deployment Manager
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
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_banner() {
  clear 2>/dev/null || true
  echo -e "${CYAN}"
  echo "   _____ _    _          _____   ______          __"
  echo "  / ____| |  | |   /\   |  __ \ / __ \ \        / /"
  echo " | (___ | |__| |  /  \  | |  | | |  | \ \  /\  / / "
  echo "  \___ \|  __  | / /\ \ | |  | | |  | |\ \/  \/ /  "
  echo "  ____) | |  | |/ ____ \| |__| | |__| | \  /\  /   "
  echo " |_____/|_|  |_/_/    \_\_____/ \____/   \/  \/    "
  echo "             C O D E   S O C I E T Y               "
  echo -e "${NC}"
  echo -e "${BOLD}Autonomous Cybersecurity Operations — Deployment Suite${NC}"
  echo -e "Frontend: ${GREEN}Vercel${NC}  |  Backend: ${MAGENTA}Render${NC}\n"
}

run_frontend() {
  echo -e "\n${GREEN}>>> LAUNCHING FRONTEND DEPLOYMENT (VERCEL)...${NC}\n"
  bash "$ROOT_DIR/deploy-frontend.sh" "$@"
}

run_backend() {
  echo -e "\n${MAGENTA}>>> LAUNCHING BACKEND DEPLOYMENT (RENDER)...${NC}\n"
  bash "$ROOT_DIR/deploy-backend.sh" "$@"
}

run_test() {
  echo -e "\n${BLUE}>>> TESTING BOTH PRODUCTION BUILDS LOCALLY...${NC}\n"
  echo -e "${CYAN}[1/2] Building Backend Server...${NC}"
  cd "$ROOT_DIR/server"
  npx prisma generate
  npm run build
  echo -e "${GREEN}✓ Backend build successful!${NC}\n"

  echo -e "${CYAN}[2/2] Building Frontend Client...${NC}"
  cd "$ROOT_DIR/client"
  npm run build
  echo -e "${GREEN}✓ Frontend build successful!${NC}\n"

  echo -e "${GREEN}All production builds verified and ready for deployment!${NC}"
}

# Handle command-line arguments
if [ "$1" == "frontend" ] || [ "$1" == "client" ] || [ "$1" == "vercel" ]; then
  shift
  run_frontend "$@"
  exit 0
elif [ "$1" == "backend" ] || [ "$1" == "server" ] || [ "$1" == "render" ]; then
  shift
  run_backend "$@"
  exit 0
elif [ "$1" == "test" ] || [ "$1" == "build" ]; then
  run_test
  exit 0
elif [ "$1" == "credentials" ] || [ "$1" == "config" ]; then
  bash "$ROOT_DIR/set-credentials.sh"
  exit 0
elif [ "$1" == "all" ]; then
  shift
  run_backend "$@"
  run_frontend "$@"
  exit 0
fi

# Interactive Menu
show_banner
echo -e "Select deployment target:"
echo -e "  ${CYAN}[1]${NC} Deploy Frontend to ${GREEN}Vercel${NC} (client)"
echo -e "  ${CYAN}[2]${NC} Deploy Backend to ${MAGENTA}Render${NC} (server)"
echo -e "  ${CYAN}[3]${NC} Deploy ${BOLD}Both${NC} (Backend on Render -> Frontend on Vercel)"
echo -e "  ${CYAN}[4]${NC} Configure Cloud Credentials (${GREEN}Supabase${NC}, ${MAGENTA}Cloudinary${NC}, ${RED}Redis${NC})"
echo -e "  ${CYAN}[5]${NC} Test Production Builds Locally (tsc & vite build)"
echo -e "  ${CYAN}[6]${NC} Exit"
echo ""

read -p "Enter selection [1-6]: " OPTION

case $OPTION in
  1)
    run_frontend
    ;;
  2)
    run_backend
    ;;
  3)
    run_backend
    run_frontend
    ;;
  4)
    bash "$ROOT_DIR/set-credentials.sh"
    ;;
  5)
    run_test
    ;;
  6)
    echo -e "${YELLOW}Deployment cancelled.${NC}"
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid selection.${NC}"
    exit 1
    ;;
esac
