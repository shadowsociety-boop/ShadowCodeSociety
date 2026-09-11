# ============================================
# Shadow Code Society — Server (Backend) Dockerfile
# Multi-stage production build with Prisma & Node.js
# ============================================

# Stage 1: Build TypeScript and Prisma client
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma engine binary
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Default build-time database URL for Prisma validation/generation
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shadow_code?schema=public"

# Install dependencies including devDependencies for build
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

# Install OpenSSL (required for Prisma runtime) and curl (for healthcheck)
RUN apk add --no-cache openssl curl

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shadow_code?schema=public"

# Copy package manifests and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only + tsx for seeding if needed
RUN npm install --omit=dev && npm install tsx@^4.19.4

# Generate Prisma Client for runner platform
RUN npx prisma generate

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

# Expose API server port
EXPOSE 5001

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5001/api/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
