"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../config");
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimit.general.windowMs,
    max: config_1.config.rateLimit.general.max,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimit.auth.windowMs,
    max: config_1.config.rateLimit.auth.max,
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.registrationLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimit.registration.windowMs,
    max: config_1.config.rateLimit.registration.max,
    message: { error: 'Too many registration attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimit.js.map