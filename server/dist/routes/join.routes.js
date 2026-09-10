"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const upload_1 = require("../middleware/upload");
const join_controller_1 = require("../controllers/join.controller");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Public
router.post('/', rateLimit_1.registrationLimiter, upload_1.upload.single('resume'), join_controller_1.submitApplication);
// Admin
router.get('/admin/applications', auth_1.requireAuth, (0, rbac_1.requirePermission)('APPLICATION_VIEW'), join_controller_1.listApplications);
router.get('/admin/applications/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('APPLICATION_VIEW'), join_controller_1.getApplication);
router.patch('/admin/applications/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('APPLICATION_MANAGE'), join_controller_1.updateApplication);
exports.default = router;
//# sourceMappingURL=join.routes.js.map