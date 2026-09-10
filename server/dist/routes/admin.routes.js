"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.get('/dashboard', auth_1.requireAuth, admin_controller_1.getDashboardStats);
router.get('/analytics', auth_1.requireAuth, (0, rbac_1.requirePermission)('ANALYTICS_VIEW'), admin_controller_1.getAnalytics);
router.get('/audit-logs', auth_1.requireAuth, (0, rbac_1.requireRole)('MENTOR'), admin_controller_1.getAuditLogs);
router.get('/notifications', auth_1.requireAuth, admin_controller_1.getNotifications);
router.patch('/notifications/:id', auth_1.requireAuth, admin_controller_1.markNotificationRead);
router.get('/search', auth_1.requireAuth, admin_controller_1.globalSearch);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map