"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auth_validator_1 = require("../validators/auth.validator");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
router.post('/login', rateLimit_1.authLimiter, (0, validate_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.get('/me', auth_1.requireAuth, auth_controller_1.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map