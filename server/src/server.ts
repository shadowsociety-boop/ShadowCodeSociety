import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimit';

// Route imports
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import registrationRoutes from './routes/registration.routes';
import resourceRoutes from './routes/resource.routes';
import memberRoutes from './routes/member.routes';
import highlightRoutes from './routes/highlight.routes';
import joinRoutes from './routes/join.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Trust reverse proxy (Cloudflare / Render) for correct IP & secure cookies
app.set('trust proxy', 1);

// ── Security Middleware ─────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const envOrigins = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim().replace(/\/$/, ''));
    const defaultOrigins = [
      config.clientUrl.replace(/\/$/, ''),
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    const isAllowed =
      defaultOrigins.includes(origin) ||
      envOrigins.includes(origin) ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev/prod with credentials
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Core Middleware ─────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(generalLimiter);

// ── Static Files ────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── API Routes ──────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/highlights', highlightRoutes);
app.use('/api/join', joinRoutes);
app.use('/api/admin', adminRoutes);

// ── Health Check ────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OPERATIONAL', timestamp: new Date().toISOString(), service: 'Shadow Code Society API' });
});

// ── 404 Handler ─────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Global Error Handler ────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  if (config.nodeEnv === 'development') {
    console.error(err.stack);
  }
  res.status(500).json({
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start Server ────────────────────────────
app.listen(config.port, () => {
  console.log(`\n⚡ Shadow Code Society API`);
  console.log(`  → Environment: ${config.nodeEnv}`);
  console.log(`  → Port: ${config.port}`);
  console.log(`  → Client: ${config.clientUrl}\n`);
});

export default app;
