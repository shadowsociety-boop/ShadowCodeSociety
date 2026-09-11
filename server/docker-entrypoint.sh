#!/bin/sh
set -e

echo "⚡ Starting Shadow Code Society Server..."

# Run Prisma schema push if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Syncing database schema with Prisma..."
  npx prisma db push --skip-generate || {
    echo "⚠️ Warning: Prisma db push failed or database not ready yet. Retrying in 3 seconds..."
    sleep 3
    npx prisma db push --skip-generate
  }

  # Optionally run database seed if RUN_SEED environment variable is "true"
  if [ "$RUN_SEED" = "true" ]; then
    echo "🌱 Seeding database..."
    npx tsx prisma/seed.ts || echo "Seed skipped or already populated."
  fi
fi

echo "🚀 Launching Node.js application..."
exec "$@"
