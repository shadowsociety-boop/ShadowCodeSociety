import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// ── Permission Matrix ───────────────────────
const PERMISSIONS: Record<string, string[]> = {
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

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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

export const requirePermission = (...permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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

export const hasPermission = (role: string, permission: string): boolean => {
  const perms = PERMISSIONS[role] || [];
  return perms.includes(permission);
};
