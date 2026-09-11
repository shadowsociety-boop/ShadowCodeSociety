# Shadow Code Society — Docker & CI/CD Guide

This repository includes a production-grade Docker container architecture and automated GitHub Actions CI/CD pipelines.

---

## 🐳 Docker Architecture Overview

The system runs on a unified 3-tier container network:

| Service | Technology | Internal Port | Exposed Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`client`** | React 19 + Vite + Nginx Alpine | 80 | `80`, `5173` | Production static SPA with gzip compression, security headers, and reverse proxy to `/api` and `/uploads` |
| **`server`** | Node.js 20 + Express + Prisma ORM | 5001 | `5001` | REST API with automated database schema migration & healthchecks |
| **`db`** | PostgreSQL 16 Alpine | 5432 | `5432` | Relational database with persistent volume and `pg_isready` healthcheck |

---

## 🚀 Quickstart with Docker Compose

### 1. Production Mode
Run the full production stack:
```bash
docker compose up --build -d
```

Check status and logs:
```bash
docker compose ps
docker compose logs -f
```

Access the application:
- **Web App**: [http://localhost](http://localhost) (or [http://localhost:5173](http://localhost:5173))
- **API Health**: [http://localhost:5001/api/health](http://localhost:5001/api/health)
- **PostgreSQL**: `localhost:5432` (User: `postgres`, Password: `postgres`, DB: `shadow_code`)

Stop services:
```bash
docker compose down
```
To also remove persistent volumes:
```bash
docker compose down -v
```

---

### 2. Development Mode (Hot-Reloading)
For live code editing inside containers with volume mounting:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

## ⚙️ Environment Variables

Create a `.env` in the root or set these in your hosting environment:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=shadow_code

# Security & JWT
JWT_SECRET=replace_with_a_secure_random_64_character_string
JWT_REFRESH_SECRET=replace_with_another_secure_random_64_character_string

# Client URL (for CORS and redirects)
CLIENT_URL=http://localhost

# Database Seeding
RUN_SEED=true
```

---

## 🔄 CI/CD Pipelines (GitHub Actions)

### 1. Continuous Integration (`.github/workflows/ci.yml`)
Triggers on every `push` and `pull_request` to `main`, `master`, and `develop`:
1. **Typecheck & Compile**:
   - Validates Prisma schema (`prisma validate`).
   - Generates Prisma client.
   - Compiles server TypeScript (`npm run build`).
   - Compiles client React/TypeScript bundle (`npm run build`).
2. **Docker Build Verification**:
   - Validates `docker compose config` syntax.
   - Builds `server/Dockerfile` using Docker Buildx cache.
   - Builds `client/Dockerfile` using Docker Buildx cache.

### 2. Continuous Deployment (`.github/workflows/cd.yml`)
Triggers on `push` to `main` branch or Git release tags (`v*.*.*`):
- Authenticates securely with GitHub Container Registry (`ghcr.io`) using the repository's built-in `GITHUB_TOKEN`.
- Builds and pushes multi-tagged container images:
  - `ghcr.io/<org>/<repo>/server:latest`
  - `ghcr.io/<org>/<repo>/client:latest`
- Supports optional webhook deployment trigger if `DEPLOY_WEBHOOK_URL` secret is configured.
