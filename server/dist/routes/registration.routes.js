"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const rateLimit_1 = require("../middleware/rateLimit");
const registration_controller_1 = require("../controllers/registration.controller");
const router = (0, express_1.Router)();
// Public
router.post('/events/:id/register', rateLimit_1.registrationLimiter, registration_controller_1.registerForEvent);
// Admin
router.get('/events/:id/registrations', auth_1.requireAuth, (0, rbac_1.requirePermission)('REGISTRATION_VIEW'), registration_controller_1.listRegistrations);
router.get('/events/:id/stats', auth_1.requireAuth, (0, rbac_1.requirePermission)('REGISTRATION_VIEW'), registration_controller_1.getRegistrationStats);
router.get('/events/:id/export', auth_1.requireAuth, (0, rbac_1.requirePermission)('REGISTRATION_EXPORT'), registration_controller_1.exportRegistrations);
router.patch('/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('REGISTRATION_MANAGE'), registration_controller_1.updateRegistration);
exports.default = router;
//# sourceMappingURL=registration.routes.js.map