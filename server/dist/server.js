"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const rateLimit_1 = require("./middleware/rateLimit");
// Route imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const registration_routes_1 = __importDefault(require("./routes/registration.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const member_routes_1 = __importDefault(require("./routes/member.routes"));
const highlight_routes_1 = __importDefault(require("./routes/highlight.routes"));
const join_routes_1 = __importDefault(require("./routes/join.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
// ── Security Middleware ─────────────────────
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: config_1.config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ── Core Middleware ─────────────────────────
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, morgan_1.default)(config_1.config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit_1.generalLimiter);
// ── Static Files ────────────────────────────
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// ── API Routes ──────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/events', event_routes_1.default);
app.use('/api/registrations', registration_routes_1.default);
app.use('/api/resources', resource_routes_1.default);
app.use('/api/members', member_routes_1.default);
app.use('/api/highlights', highlight_routes_1.default);
app.use('/api/join', join_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// ── Health Check ────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OPERATIONAL', timestamp: new Date().toISOString(), service: 'Shadow Code Society API' });
});
// ── 404 Handler ─────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
// ── Global Error Handler ────────────────────
app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    if (config_1.config.nodeEnv === 'development') {
        console.error(err.stack);
    }
    res.status(500).json({
        error: config_1.config.nodeEnv === 'production' ? 'Internal server error' : err.message,
    });
});
// ── Start Server ────────────────────────────
app.listen(config_1.config.port, () => {
    console.log(`\n⚡ Shadow Code Society API`);
    console.log(`  → Environment: ${config_1.config.nodeEnv}`);
    console.log(`  → Port: ${config_1.config.port}`);
    console.log(`  → Client: ${config_1.config.clientUrl}\n`);
});
exports.default = app;
//# sourceMappingURL=server.js.map