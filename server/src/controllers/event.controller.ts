import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { auditLog, createNotification } from '../services/audit.service';
import { getFileUrl } from '../middleware/upload';

const prisma = new PrismaClient();

// ── Public: List Events ─────────────────────
export const listEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '12', status, type, search, featured } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = { published: true };
    if (status) where.status = status;
    if (type) where.eventType = type;
    if (featured === 'true') where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: where as any,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: { _count: { select: { registrations: true } } },
      }),
      prisma.event.count({ where: where as any }),
    ]);

    res.json({ events, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    console.error('[EVENT] List error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// ── Public: Get Event by Slug ───────────────
export const getEventBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        form: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!event || !event.published) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// ── Admin: List All Events ──────────────────
export const adminListEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', status, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: where as any,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { registrations: true } },
          form: { select: { id: true } },
        },
      }),
      prisma.event.count({ where: where as any }),
    ]);

    res.json({ events, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// ── Admin: Create Event ─────────────────────
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const slug = slugify(data.title, { lower: true, strict: true }) + '-' + uuidv4().slice(0, 6);

    let banner: string | undefined;
    if (req.file) {
      banner = getFileUrl(req.file.filename);
    }

    const event = await prisma.event.create({
      data: {
        ...data,
        slug,
        banner,
        date: new Date(data.date),
        regStart: data.regStart ? new Date(data.regStart) : null,
        regEnd: data.regEnd ? new Date(data.regEnd) : null,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
        featured: data.featured === 'true' || data.featured === true,
        published: data.published === 'true' || data.published === true,
      },
    });

    await auditLog({
      adminId: req.admin!.id,
      action: 'CREATE',
      entity: 'Event',
      entityId: event.id,
      details: `Created event: ${event.title}`,
    });

    await createNotification({
      title: 'New Event Created',
      message: `Event "${event.title}" has been created`,
      type: 'EVENT',
      link: `/admin/events/${event.id}`,
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error('[EVENT] Create error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// ── Admin: Update Event ─────────────────────
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    let banner = existing.banner;
    if (req.file) {
      banner = getFileUrl(req.file.filename);
    }

    const updateData: Record<string, unknown> = { ...data, banner };
    if (data.date) updateData.date = new Date(data.date);
    if (data.regStart) updateData.regStart = new Date(data.regStart);
    if (data.regEnd) updateData.regEnd = new Date(data.regEnd);
    if (data.maxParticipants) updateData.maxParticipants = parseInt(data.maxParticipants);
    if (typeof data.featured === 'string') updateData.featured = data.featured === 'true';
    if (typeof data.published === 'string') updateData.published = data.published === 'true';

    const event = await prisma.event.update({ where: { id }, data: updateData as any });

    await auditLog({
      adminId: req.admin!.id,
      action: 'UPDATE',
      entity: 'Event',
      entityId: event.id,
      details: `Updated event: ${event.title}`,
    });

    res.json({ event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// ── Admin: Delete Event ─────────────────────
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    await prisma.event.delete({ where: { id } });

    await auditLog({
      adminId: req.admin!.id,
      action: 'DELETE',
      entity: 'Event',
      entityId: id,
      details: `Deleted event: ${event.title}`,
    });

    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// ── Admin: Get/Save Event Form ──────────────
export const getEventForm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const form = await prisma.eventForm.findUnique({ where: { eventId: id } });
    if (!form) {
      res.json({ form: { fields: [] } });
      return;
    }
    res.json({ form: { ...form, fields: JSON.parse(form.fields) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

export const saveEventForm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { fields } = req.body;

    const form = await prisma.eventForm.upsert({
      where: { eventId: id },
      create: { eventId: id, fields: JSON.stringify(fields) },
      update: { fields: JSON.stringify(fields) },
    });

    await auditLog({
      adminId: req.admin!.id,
      action: 'UPDATE',
      entity: 'EventForm',
      entityId: form.id,
      details: `Updated registration form for event`,
    });

    res.json({ form: { ...form, fields: JSON.parse(form.fields) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save form' });
  }
};
