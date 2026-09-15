import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { registrationLimiter } from '../middleware/rateLimit';
import {
  registerForEvent, listRegistrations, updateRegistration,
  exportRegistrations, getRegistrationStats,
} from '../controllers/registration.controller';

const router = Router();

// Public
router.post(['/events/:id/register', '/:id/register'], registrationLimiter, registerForEvent);

// Admin
router.get(['/events/:id/registrations', '/:id/registrations'], requireAuth, requirePermission('REGISTRATION_VIEW'), listRegistrations);
router.get(['/events/:id/stats', '/:id/stats'], requireAuth, requirePermission('REGISTRATION_VIEW'), getRegistrationStats);
router.get(['/events/:id/export', '/:id/export'], requireAuth, requirePermission('REGISTRATION_EXPORT'), exportRegistrations);
router.patch(['/:id', '/registrations/:id'], requireAuth, requirePermission('REGISTRATION_MANAGE'), updateRegistration);

export default router;
