import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import {
  listEvents, getEventBySlug, adminListEvents,
  createEvent, updateEvent, deleteEvent,
  getEventForm, saveEventForm,
} from '../controllers/event.controller';

const router = Router();

// Public routes
router.get('/', listEvents);
router.get('/slug/:slug', getEventBySlug);

// Admin routes
router.get('/admin/all', requireAuth, requirePermission('EVENT_CREATE'), adminListEvents);
router.post('/', requireAuth, requirePermission('EVENT_CREATE'), upload.single('banner'), createEvent);
router.patch('/:id', requireAuth, requirePermission('EVENT_EDIT'), upload.single('banner'), updateEvent);
router.delete('/:id', requireAuth, requirePermission('EVENT_DELETE'), deleteEvent);

// Form builder routes
router.get('/:id/form', getEventForm);
router.post('/:id/form', requireAuth, requirePermission('FORM_MANAGE'), saveEventForm);

export default router;
