"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const upload_1 = require("../middleware/upload");
const event_controller_1 = require("../controllers/event.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/', event_controller_1.listEvents);
router.get('/slug/:slug', event_controller_1.getEventBySlug);
// Admin routes
router.get('/admin/all', auth_1.requireAuth, (0, rbac_1.requirePermission)('EVENT_CREATE'), event_controller_1.adminListEvents);
router.post('/', auth_1.requireAuth, (0, rbac_1.requirePermission)('EVENT_CREATE'), upload_1.upload.single('banner'), event_controller_1.createEvent);
router.patch('/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('EVENT_EDIT'), upload_1.upload.single('banner'), event_controller_1.updateEvent);
router.delete('/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('EVENT_DELETE'), event_controller_1.deleteEvent);
// Form builder routes
router.get('/:id/form', event_controller_1.getEventForm);
router.post('/:id/form', auth_1.requireAuth, (0, rbac_1.requirePermission)('FORM_MANAGE'), event_controller_1.saveEventForm);
exports.default = router;
//# sourceMappingURL=event.routes.js.map