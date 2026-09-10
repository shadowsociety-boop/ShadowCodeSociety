"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '5001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-secret-change-me',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax'),
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    storage: {
        type: process.env.STORAGE_TYPE || 'local',
        path: process.env.STORAGE_PATH || './uploads',
        bucket: process.env.STORAGE_BUCKET,
        region: process.env.STORAGE_REGION,
        accessKey: process.env.STORAGE_ACCESS_KEY,
        secretKey: process.env.STORAGE_SECRET_KEY,
        maxFileSize: 10 * 1024 * 1024, // 10 MB
        allowedMimeTypes: [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'text/markdown',
            'application/zip', 'application/x-tar', 'application/gzip',
        ],
    },
    rateLimit: {
        general: { windowMs: 15 * 60 * 1000, max: 200 },
        auth: { windowMs: 15 * 60 * 1000, max: 10 },
        registration: { windowMs: 15 * 60 * 1000, max: 20 },
    },
};
//# sourceMappingURL=index.js.map