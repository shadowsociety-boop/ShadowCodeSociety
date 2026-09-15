import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { auditLog, createNotification } from '../services/audit.service';
import { getFileUrl } from '../middleware/upload';

// ── Public: Submit Application ──────────────
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    let resumeUrl: string | undefined;
    if (req.file) resumeUrl = getFileUrl(req.file.filename);

    // Check if already applied
    const existing = await prisma.joinApplication.findFirst({ where: { email: data.email, status: { in: ['PENDING', 'UNDER_REVIEW'] } } });
    if (existing) {
      res.status(409).json({ error: 'You already have a pending application' });
      return;
    }

    const application = await prisma.joinApplication.create({
      data: {
        ...data,
        resumeUrl,
        skills: JSON.stringify(data.skills || []),
      },
    });

    await createNotification({
      title: 'New Join Application',
      message: `${data.name} wants to join the society`,
      type: 'JOIN_APP',
      link: '/admin/applications',
    });

    res.status(201).json({ application, message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Application submission failed' });
  }
};

// ── Admin: List Applications ────────────────
export const listApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20', search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { college: { contains: search as string } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.joinApplication.findMany({ where: where as any, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.joinApplication.count({ where: where as any }),
    ]);

    res.json({
      applications: applications.map(a => ({ ...a, skills: JSON.parse(a.skills) })),
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// ── Admin: Update Application Status ────────
export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, adminNotes } = req.body;

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const application = await prisma.joinApplication.update({
      where: { id },
      data: { status, adminNotes },
    });

    await auditLog({
      adminId: req.admin!.id,
      action: `APPLICATION_${status}`,
      entity: 'JoinApplication',
      entityId: id,
      details: `${status} application from ${application.name}`,
    });

    res.json({ application: { ...application, skills: JSON.parse(application.skills) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
};

// ── Admin: Get Single Application ───────────
export const getApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const application = await prisma.joinApplication.findUnique({ where: { id } });
    if (!application) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ application: { ...application, skills: JSON.parse(application.skills) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};
