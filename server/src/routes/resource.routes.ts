import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { submitResourceSchema } from '../validators/resource.validator';
import {
  listResources, getResourceBySlug, submitResource,
  adminListResources, createResource, updateResource, deleteResource,
  listSubmissions, approveSubmission, rejectSubmission,
} from '../controllers/resource.controller';

const router = Router();

// Public
router.get('/', listResources);
router.get('/slug/:slug', getResourceBySlug);
router.post('/submit', upload.single('file'), submitResource);

// Admin CRUD
router.get('/admin/all', requireAuth, requirePermission('RESOURCE_CREATE'), adminListResources);
router.post('/admin', requireAuth, requirePermission('RESOURCE_CREATE'), upload.single('thumbnail'), createResource);
router.patch('/admin/:id', requireAuth, requirePermission('RESOURCE_EDIT'), upload.single('thumbnail'), updateResource);
router.delete('/admin/:id', requireAuth, requirePermission('RESOURCE_DELETE'), deleteResource);

// Submissions
router.get('/admin/submissions', requireAuth, requirePermission('RESOURCE_APPROVE'), listSubmissions);
router.post('/admin/submissions/:id/approve', requireAuth, requirePermission('RESOURCE_APPROVE'), approveSubmission);
router.post('/admin/submissions/:id/reject', requireAuth, requirePermission('RESOURCE_APPROVE'), rejectSubmission);

export default router;
