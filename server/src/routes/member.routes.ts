import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requirePermission, requireRole } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import {
  listMembers, createMember, updateMember, deleteMember,
  moveToAlumni, assignPresident, getAdmins,
} from '../controllers/member.controller';

const router = Router();

// Public
router.get('/', listMembers);

// Admin
router.post('/', requireAuth, requirePermission('MEMBER_CREATE'), upload.single('photo'), createMember);
router.patch('/:id', requireAuth, requirePermission('MEMBER_EDIT'), upload.single('photo'), updateMember);
router.delete('/:id', requireAuth, requirePermission('MEMBER_DELETE'), deleteMember);
router.post('/:id/alumni', requireAuth, requirePermission('MEMBER_ALUMNI'), moveToAlumni);
router.patch('/:id/alumni', requireAuth, requirePermission('MEMBER_ALUMNI'), moveToAlumni);

// Mentor only
router.get(['/admins', '/admin/admins'], requireAuth, requireRole('MENTOR'), getAdmins);
router.post(['/assign-president', '/admin/assign-president'], requireAuth, requireRole('MENTOR'), assignPresident);

export default router;
