# Shadow Code Society — Deployment Guide

This repository contains automated bash scripts and infrastructure-as-code files to deploy:
- **Frontend (Vite + React)** on **Vercel**
- **Backend (Node.js + Express + Prisma)** on **Render**

---

## Quick Start (Interactive Script)

Run the master deployment manager from the repository root:

```bash
./deploy.sh
```

Or run dedicated targets directly:

```bash
./deploy.sh frontend  # Deploy frontend to Vercel
./deploy.sh backend   # Deploy backend to Render
./deploy.sh test      # Test both production builds locally
./deploy.sh all       # Full stack deployment
```

---

## 1. Deploy Frontend on Vercel

### Option A: Using `./deploy-frontend.sh`
```bash
./deploy-frontend.sh
```
The script will:
1. Validate your client dependencies and test `npm run build`.
2. Configure `VITE_API_URL` pointing to your live Render backend URL.
3. Deploy to Vercel using `npx vercel --prod`.

### Option B: Using Vercel Web Dashboard
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import repository: `shadowsociety-boop/ShadowCodeSociety`
3. Configure settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://shadow-code-society-api.onrender.com` (your Render backend URL)
5. Click **Deploy**.

> Note: [client/vercel.json](file:///Users/nishantrankawat/Downloads/club/client/vercel.json) is pre-configured with SPA route rewrites so direct navigation and refreshes on routes like `/events`, `/members`, and `/alumni` work without 404s.

---

## 2. Deploy Backend on Render

### Option A: Using Render Blueprint ([render.yaml](file:///Users/nishantrankawat/Downloads/club/render.yaml))
1. Push your repository to GitHub (`git push origin main`).
2. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
3. Click **New Blueprint Instance** and connect `shadowsociety-boop/ShadowCodeSociety`.
4. Render will auto-provision:
   - **PostgreSQL Database** (`shadow-code-db`)
   - **Web Service** (`shadow-code-society-api`)
   - Auto-generated `JWT_SECRET` and `JWT_REFRESH_SECRET`

### Option B: Manual Web Service Setup on Render
1. Go to [https://dashboard.render.com](https://dashboard.render.com) -> **New** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure:
   - **Name**: `shadow-code-society-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push && npm start`
4. Add Environment Variables:
   - `DATABASE_URL` = `postgresql://...` (from Render PostgreSQL or external provider)
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `<random_32_char_hex>`
   - `JWT_REFRESH_SECRET` = `<random_32_char_hex>`
   - `CLIENT_URL` = `https://your-frontend.vercel.app`
   - `COOKIE_SAMESITE` = `none`
   - `STORAGE_TYPE` = `local`

### Option C: Instant Redeploy via Deploy Hook
If you already have a Render service created:
1. In Render Web Service settings, copy your **Deploy Hook URL**.
2. Run:
   ```bash
   RENDER_DEPLOY_HOOK_URL="https://api.render.com/deploy/srv-xxxx?key=yyyy" ./deploy-backend.sh
   ```

---

## 3. Database Seeding on Render

Once the Render backend is live and connected to the database, seed the 23 council members, events (including Cyber Hunt II), and 10 real Udemy courses:

### From the Render Web Shell (Dashboard):
```bash
npm run db:seed
```

### From your local machine:
```bash
DATABASE_URL="<RENDER_EXTERNAL_POSTGRES_URL>" npm --prefix server run db:seed
```
