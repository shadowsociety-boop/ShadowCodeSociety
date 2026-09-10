"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const validPassword = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!validPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
        res.cookie('token', token, {
            ...config_1.config.cookie,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                avatar: admin.avatar,
            },
        });
    }
    catch (error) {
        console.error('[AUTH] Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
const logout = async (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: config_1.config.cookie.secure,
        sameSite: config_1.config.cookie.sameSite,
    });
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const me = async (req, res) => {
    if (!req.admin) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    res.json({ admin: req.admin });
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map