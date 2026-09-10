import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import { listHighlights, createHighlight, updateHighlight, deleteHighlight } from '../controllers/highlight.controller';

const router = Router();

router.get('/', listHighlights);
router.post('/', requireAuth, requirePermission('HIGHLIGHT_CREATE'), upload.single('image'), createHighlight);
router.patch('/:id', requireAuth, requirePermission('HIGHLIGHT_EDIT'), upload.single('image'), updateHighlight);
router.delete('/:id', requireAuth, requirePermission('HIGHLIGHT_DELETE'), deleteHighlight);

export default router;
