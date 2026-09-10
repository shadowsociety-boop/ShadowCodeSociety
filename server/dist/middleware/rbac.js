"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.requirePermission = exports.requireRole = void 0;
// ── Permission Matrix ───────────────────────
const PERMISSIONS = {
    MENTOR: [
        'EVENT_CREATE', 'EVENT_EDIT', 'EVENT_DELETE', 'EVENT_PUBLISH',
        'REGISTRATION_VIEW', 'REGISTRATION_EXPORT', 'REGISTRATION_MANAGE',
        'FORM_MANAGE',
        'RESOURCE_CREATE', 'RESOURCE_EDIT', 'RESOURCE_DELETE', 'RESOURCE_APPROVE',
        'MEMBER_CREATE', 'MEMBER_EDIT', 'MEMBER_DELETE', 'MEMBER_PROMOTE', 'MEMBER_ALUMNI',
        'HIGHLIGHT_CREATE', 'HIGHLIGHT_EDIT', 'HIGHLIGHT_DELETE',
        'APPLICATION_VIEW', 'APPLICATION_MANAGE',
        'MENTOR_MANAGE', 'PRESIDENT_MANAGE',
        'AUDIT_VIEW', 'SETTINGS_MANAGE',
        'ANALYTICS_VIEW', 'NOTIFICATION_VIEW',
    ],
    PRESIDENT: [
        'EVENT_CREATE', 'EVENT_EDIT', 'EVENT_DELETE', 'EVENT_PUBLISH',
        'REGISTRATION_VIEW', 'REGISTRATION_EXPORT', 'REGISTRATION_MANAGE',
        'FORM_MANAGE',
        'RESOURCE_CREATE', 'RESOURCE_EDIT', 'RESOURCE_DELETE', 'RESOURCE_APPROVE',
        'MEMBER_CREATE', 'MEMBER_EDIT', 'MEMBER_DELETE', 'MEMBER_PROMOTE', 'MEMBER_ALUMNI',
        'HIGHLIGHT_CREATE', 'HIGHLIGHT_EDIT', 'HIGHLIGHT_DELETE',
        'APPLICATION_VIEW', 'APPLICATION_MANAGE',
        'ANALYTICS_VIEW', 'NOTIFICATION_VIEW',
    ],
};
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (!roles.includes(req.admin.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requirePermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.admin) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const adminPermissions = PERMISSIONS[req.admin.role] || [];
        const hasAllPermissions = permissions.every(p => adminPermissions.includes(p));
        if (!hasAllPermissions) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
const hasPermission = (role, permission) => {
    const perms = PERMISSIONS[role] || [];
    return perms.includes(permission);
};
exports.hasPermission = hasPermission;
//# sourceMappingURL=rbac.js.map