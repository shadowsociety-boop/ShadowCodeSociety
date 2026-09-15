import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole, requirePermission } from '../middleware/rbac';
import {
  getDashboardStats, getAnalytics, getAuditLogs,
  getNotifications, markNotificationRead, globalSearch,
} from '../controllers/admin.controller';

const router = Router();

router.get('/dashboard', requireAuth, getDashboardStats);
router.get('/analytics', requireAuth, requirePermission('ANALYTICS_VIEW'), getAnalytics);
router.get('/audit-logs', requireAuth, requireRole('MENTOR'), getAuditLogs);
router.get('/notifications', requireAuth, getNotifications);
router.patch(['/notifications/:id', '/notifications/:id/read'], requireAuth, markNotificationRead);
router.get('/search', requireAuth, globalSearch);

export default router;
