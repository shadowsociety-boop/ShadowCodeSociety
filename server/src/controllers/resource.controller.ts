import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { auditLog, createNotification } from '../services/audit.service';
import { getFileUrl } from '../middleware/upload';

// ── Public: List Resources ──────────────────
export const listResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '12', category, search, tag } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = { published: true };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }
    if (tag) where.tags = { contains: tag as string };

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({ where: where as any, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.resource.count({ where: where as any }),
    ]);

    const parsed = resources.map(r => ({ ...r, tags: JSON.parse(r.tags) }));
    res.json({ resources: parsed, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

// ── Public: Get Resource by Slug ────────────
export const getResourceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const resource = await prisma.resource.findUnique({ where: { slug } });
    if (!resource || !resource.published) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json({ resource: { ...resource, tags: JSON.parse(resource.tags) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
};

// ── Public: Submit Resource ─────────────────
export const submitResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    let fileUrl: string | undefined;
    if (req.file) {
      fileUrl = getFileUrl(req.file.filename);
    }

    const submission = await prisma.resourceSubmission.create({
      data: {
        ...data,
        fileUrl,
        tags: JSON.stringify(data.tags || []),
      },
    });

    await createNotification({
      title: 'New Resource Submission',
      message: `${data.contributorName} submitted "${data.title}"`,
      type: 'RESOURCE_SUB',
      link: '/admin/resources/approvals',
    });

    res.status(201).json({ submission });
  } catch (error) {
    res.status(500).json({ error: 'Submission failed' });
  }
};

// ── Admin: CRUD ─────────────────────────────
export const adminListResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', category, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) where.title = { contains: search as string };

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({ where: where as any, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.resource.count({ where: where as any }),
    ]);

    res.json({ resources: resources.map(r => ({ ...r, tags: JSON.parse(r.tags) })), total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

export const createResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const slug = slugify(data.title, { lower: true, strict: true }) + '-' + uuidv4().slice(0, 6);

    let thumbnail: string | undefined;
    if (req.file) {
      thumbnail = getFileUrl(req.file.filename);
    }

    const resource = await prisma.resource.create({
      data: { ...data, slug, thumbnail, tags: JSON.stringify(data.tags || []) },
    });

    await auditLog({ adminId: req.admin!.id, action: 'CREATE', entity: 'Resource', entityId: resource.id, details: `Created resource: ${resource.title}` });
    res.status(201).json({ resource: { ...resource, tags: JSON.parse(resource.tags) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

export const updateResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    if (data.tags) data.tags = JSON.stringify(data.tags);

    let updateData = { ...data };
    if (req.file) {
      updateData.thumbnail = getFileUrl(req.file.filename);
    }

    const resource = await prisma.resource.update({ where: { id }, data: updateData });
    await auditLog({ adminId: req.admin!.id, action: 'UPDATE', entity: 'Resource', entityId: resource.id, details: `Updated resource: ${resource.title}` });
    res.json({ resource: { ...resource, tags: JSON.parse(resource.tags) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) { res.status(404).json({ error: 'Not found' }); return; }
    await prisma.resource.delete({ where: { id } });
    await auditLog({ adminId: req.admin!.id, action: 'DELETE', entity: 'Resource', entityId: id, details: `Deleted resource: ${resource.title}` });
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};

// ── Admin: Submissions Approval ─────────────
export const listSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status = 'PENDING', page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [submissions, total] = await Promise.all([
      prisma.resourceSubmission.findMany({ where: { status: status as string }, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.resourceSubmission.count({ where: { status: status as string } }),
    ]);

    res.json({ submissions: submissions.map(s => ({ ...s, tags: JSON.parse(s.tags) })), total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const approveSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const submission = await prisma.resourceSubmission.findUnique({ where: { id } });
    if (!submission) { res.status(404).json({ error: 'Not found' }); return; }

    // Create resource from submission
    const slug = slugify(submission.title, { lower: true, strict: true }) + '-' + uuidv4().slice(0, 6);
    await prisma.resource.create({
      data: {
        title: submission.title,
        slug,
        description: submission.description,
        author: submission.contributorName,
        category: submission.category,
        tags: submission.tags,
        fileUrl: submission.fileUrl,
        externalUrl: submission.externalUrl,
      },
    });

    await prisma.resourceSubmission.update({ where: { id }, data: { status: 'APPROVED' } });
    await auditLog({ adminId: req.admin!.id, action: 'APPROVE', entity: 'ResourceSubmission', entityId: id, details: `Approved resource: ${submission.title}` });
    res.json({ message: 'Resource approved and published' });
  } catch (error) {
    res.status(500).json({ error: 'Approval failed' });
  }
};

export const rejectSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { adminNotes } = req.body;
    await prisma.resourceSubmission.update({ where: { id }, data: { status: 'REJECTED', adminNotes } });
    await auditLog({ adminId: req.admin!.id, action: 'REJECT', entity: 'ResourceSubmission', entityId: id, details: 'Rejected resource submission' });
    res.json({ message: 'Submission rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Rejection failed' });
  }
};
