#!/usr/bin/env bash
# ==============================================================================
# Shadow Code Society — Render Deployment Build Script
# ==============================================================================
set -e

echo ">>> [Render Build] Starting build process..."

# Navigate into server directory if we are at root
if [ -d "server" ]; then
  echo ">>> Navigating into /server directory..."
  cd server
fi

echo ">>> Installing server dependencies..."
npm install

echo ">>> Generating Prisma client..."
npx prisma generate

echo ">>> Compiling TypeScript code..."
npm run build

echo ">>> [Render Build] Build completed successfully!"
