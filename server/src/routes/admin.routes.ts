import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole, requirePermission } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import {
  getDashboardStats, getAnalytics, getAuditLogs,
  getNotifications, markNotificationRead, globalSearch,
  getPopupTransmission, updatePopupTransmission,
} from '../controllers/admin.controller';

const router = Router();

router.get('/dashboard', requireAuth, getDashboardStats);
router.get('/analytics', requireAuth, requirePermission('ANALYTICS_VIEW'), getAnalytics);
router.get('/audit-logs', requireAuth, requireRole('MENTOR'), getAuditLogs);
router.get('/notifications', requireAuth, getNotifications);
router.patch(['/notifications/:id', '/notifications/:id/read'], requireAuth, markNotificationRead);
router.get('/search', requireAuth, globalSearch);

// Active transmission popup settings
router.get('/popup-transmission', getPopupTransmission);
router.patch('/popup-transmission', requireAuth, upload.single('banner'), updatePopupTransmission);

export default router;
