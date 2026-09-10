"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const upload_1 = require("../middleware/upload");
const member_controller_1 = require("../controllers/member.controller");
const router = (0, express_1.Router)();
// Public
router.get('/', member_controller_1.listMembers);
// Admin
router.post('/', auth_1.requireAuth, (0, rbac_1.requirePermission)('MEMBER_CREATE'), upload_1.upload.single('photo'), member_controller_1.createMember);
router.patch('/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('MEMBER_EDIT'), upload_1.upload.single('photo'), member_controller_1.updateMember);
router.delete('/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('MEMBER_DELETE'), member_controller_1.deleteMember);
router.post('/:id/alumni', auth_1.requireAuth, (0, rbac_1.requirePermission)('MEMBER_ALUMNI'), member_controller_1.moveToAlumni);
// Mentor only
router.get('/admins', auth_1.requireAuth, (0, rbac_1.requireRole)('MENTOR'), member_controller_1.getAdmins);
router.post('/assign-president', auth_1.requireAuth, (0, rbac_1.requireRole)('MENTOR'), member_controller_1.assignPresident);
exports.default = router;
//# sourceMappingURL=member.routes.js.map