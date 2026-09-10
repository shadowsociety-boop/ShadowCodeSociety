"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const upload_1 = require("../middleware/upload");
const highlight_controller_1 = require("../controllers/highlight.controller");
const router = (0, express_1.Router)();
router.get('/', highlight_controller_1.listHighlights);
router.post('/', auth_1.requireAuth, (0, rbac_1.requirePermission)('HIGHLIGHT_CREATE'), upload_1.upload.single('image'), highlight_controller_1.createHighlight);
router.patch('/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('HIGHLIGHT_EDIT'), upload_1.upload.single('image'), highlight_controller_1.updateHighlight);
router.delete('/:id', auth_1.requireAuth, (0, rbac_1.requirePermission)('HIGHLIGHT_DELETE'), highlight_controller_1.deleteHighlight);
exports.default = router;
//# sourceMappingURL=highlight.routes.js.map