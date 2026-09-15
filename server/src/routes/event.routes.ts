import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import {
  listEvents, getEventBySlug, getEventById, adminListEvents,
  createEvent, updateEvent, deleteEvent,
  getEventForm, saveEventForm,
} from '../controllers/event.controller';
import { getPopupTransmission } from '../controllers/admin.controller';

const router = Router();

// Admin routes
router.get(['/admin/all', '/admin/list'], requireAuth, requirePermission('EVENT_CREATE'), adminListEvents);
router.get(['/admin/:id', '/admin/event/:id'], requireAuth, requirePermission('EVENT_EDIT'), getEventById);
router.post('/', requireAuth, requirePermission('EVENT_CREATE'), upload.single('banner'), createEvent);
router.patch(['/:id', '/admin/:id'], requireAuth, requirePermission('EVENT_EDIT'), upload.single('banner'), updateEvent);
router.delete(['/:id', '/admin/:id'], requireAuth, requirePermission('EVENT_DELETE'), deleteEvent);

// Form builder routes
router.get('/:id/form', getEventForm);
router.post('/:id/form', requireAuth, requirePermission('FORM_MANAGE'), saveEventForm);

// Public routes
router.get('/popup-transmission', getPopupTransmission);
router.get('/', listEvents);
router.get(['/slug/:slug', '/:slug'], getEventBySlug);

export default router;
