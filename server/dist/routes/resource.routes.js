"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const upload_1 = require("../middleware/upload");
const resource_controller_1 = require("../controllers/resource.controller");
const router = (0, express_1.Router)();
// Public
router.get('/', resource_controller_1.listResources);
router.get('/slug/:slug', resource_controller_1.getResourceBySlug);
router.post('/submit', upload_1.upload.single('file'), resource_controller_1.submitResource);
// Admin CRUD
router.get('/admin/all', auth_1.requireAuth, (0, rbac_1.requirePermission)('RESOURCE_CREATE'), resource_controller_1.adminListResources);
router.post('/admin', auth_1.requireAuth, (0, rbac_1.requirePermission)('RESOURCE_CREATE'), upload_1.upload.single('thumbnail'), resource_controller_1.createResource);
router.patch('/admin/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('RESOURCE_EDIT'), upload_1.upload.single('thumbnail'), resource_controller_1.updateResource);
router.delete('/admin/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('RESOURCE_DELETE'), resource_controller_1.deleteResource);
// Submissions
router.get('/admin/submissions', auth_1.requireAuth, (0, rbac_1.requirePermission)('RESOURCE_APPROVE'), resource_controller_1.listSubmissions);
router.post('/admin/submissions/:id/approve', auth_1.requireAuth, (0, rbac_1.requirePermission)('RESOURCE_APPROVE'), resource_controller_1.approveSubmission);
router.post('/admin/submissions/:id/reject', auth_1.requireAuth, (0, rbac_1.requirePermission)('RESOURCE_APPROVE'), resource_controller_1.rejectSubmission);
exports.default = router;
//# sourceMappingURL=resource.routes.js.map