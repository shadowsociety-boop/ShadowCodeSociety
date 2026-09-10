"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!admin) {
            res.status(401).json({ error: 'Admin account not found' });
            return;
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired' });
            return;
        }
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map