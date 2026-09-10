import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { joinApplicationSchema, updateApplicationSchema } from '../validators/join.validator';
import { submitApplication, listApplications, updateApplication, getApplication } from '../controllers/join.controller';
import { registrationLimiter } from '../middleware/rateLimit';

const router = Router();

// Public
router.post('/', registrationLimiter, upload.single('resume'), submitApplication);

// Admin
router.get('/admin/applications', requireAuth, requirePermission('APPLICATION_VIEW'), listApplications);
router.get('/admin/applications/:id', requireAuth, requirePermission('APPLICATION_VIEW'), getApplication);
router.patch('/admin/applications/:id', requireAuth, requirePermission('APPLICATION_MANAGE'), updateApplication);

export default router;
