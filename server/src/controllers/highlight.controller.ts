import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { auditLog } from '../services/audit.service';
import { getFileUrl } from '../middleware/upload';

export const listHighlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const [highlights, total] = await Promise.all([
      prisma.highlight.findMany({ where: where as any, skip, take, orderBy: { date: 'desc' } }),
      prisma.highlight.count({ where: where as any }),
    ]);

    res.json({ highlights, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
};

export const createHighlight = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    if (!req.file) { res.status(400).json({ error: 'Image is required' }); return; }

    const image = getFileUrl(req.file.filename);
    const highlight = await prisma.highlight.create({
      data: {
        title: data.title,
        description: data.description,
        image,
        date: data.date ? new Date(data.date) : new Date(),
        category: data.category || 'Photo',
        featured: data.featured === 'true' || data.featured === true,
      },
    });

    await auditLog({ adminId: req.admin!.id, action: 'CREATE', entity: 'Highlight', entityId: highlight.id, details: `Created highlight: ${highlight.title}` });
    res.status(201).json({ highlight });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create highlight' });
  }
};

export const updateHighlight = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const updateData: Record<string, unknown> = { ...data };
    if (req.file) updateData.image = getFileUrl(req.file.filename);
    if (data.date) updateData.date = new Date(data.date);
    if (typeof data.featured === 'string') updateData.featured = data.featured === 'true';

    const highlight = await prisma.highlight.update({ where: { id }, data: updateData as any });
    await auditLog({ adminId: req.admin!.id, action: 'UPDATE', entity: 'Highlight', entityId: id, details: `Updated highlight: ${highlight.title}` });
    res.json({ highlight });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update highlight' });
  }
};

export const deleteHighlight = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const h = await prisma.highlight.findUnique({ where: { id } });
    if (!h) { res.status(404).json({ error: 'Not found' }); return; }
    await prisma.highlight.delete({ where: { id } });
    await auditLog({ adminId: req.admin!.id, action: 'DELETE', entity: 'Highlight', entityId: id, details: `Deleted highlight: ${h.title}` });
    res.json({ message: 'Highlight deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete highlight' });
  }
};
