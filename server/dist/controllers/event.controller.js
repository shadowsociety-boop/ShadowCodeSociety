"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEventForm = exports.getEventForm = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.adminListEvents = exports.getEventBySlug = exports.listEvents = void 0;
const client_1 = require("@prisma/client");
const slugify_1 = __importDefault(require("slugify"));
const uuid_1 = require("uuid");
const audit_service_1 = require("../services/audit.service");
const upload_1 = require("../middleware/upload");
const prisma = new client_1.PrismaClient();
// ── Public: List Events ─────────────────────
const listEvents = async (req, res) => {
    try {
        const { page = '1', limit = '12', status, type, search, featured } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = { published: true };
        if (status)
            where.status = status;
        if (type)
            where.eventType = type;
        if (featured === 'true')
            where.featured = true;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where: where,
                skip,
                take,
                orderBy: { date: 'desc' },
                include: { _count: { select: { registrations: true } } },
            }),
            prisma.event.count({ where: where }),
        ]);
        res.json({ events, total, page: parseInt(page), totalPages: Math.ceil(total / take) });
    }
    catch (error) {
        console.error('[EVENT] List error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};
exports.listEvents = listEvents;
// ── Public: Get Event by Slug ───────────────
const getEventBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};
exports.getEventBySlug = getEventBySlug;
// ── Admin: List All Events ──────────────────
const adminListEvents = async (req, res) => {
    try {
        const { page = '1', limit = '20', status, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = {};
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { title: { contains: search } },
            ];
        }
        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where: where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: { select: { registrations: true } },
                    form: { select: { id: true } },
                },
            }),
            prisma.event.count({ where: where }),
        ]);
        res.json({ events, total, page: parseInt(page), totalPages: Math.ceil(total / take) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};
exports.adminListEvents = adminListEvents;
// ── Admin: Create Event ─────────────────────
const createEvent = async (req, res) => {
    try {
        const data = req.body;
        const slug = (0, slugify_1.default)(data.title, { lower: true, strict: true }) + '-' + (0, uuid_1.v4)().slice(0, 6);
        let banner;
        if (req.file) {
            banner = (0, upload_1.getFileUrl)(req.file.filename);
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
        await (0, audit_service_1.auditLog)({
            adminId: req.admin.id,
            action: 'CREATE',
            entity: 'Event',
            entityId: event.id,
            details: `Created event: ${event.title}`,
        });
        await (0, audit_service_1.createNotification)({
            title: 'New Event Created',
            message: `Event "${event.title}" has been created`,
            type: 'EVENT',
            link: `/admin/events/${event.id}`,
        });
        res.status(201).json({ event });
    }
    catch (error) {
        console.error('[EVENT] Create error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};
exports.createEvent = createEvent;
// ── Admin: Update Event ─────────────────────
const updateEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const existing = await prisma.event.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        let banner = existing.banner;
        if (req.file) {
            banner = (0, upload_1.getFileUrl)(req.file.filename);
        }
        const updateData = { ...data, banner };
        if (data.date)
            updateData.date = new Date(data.date);
        if (data.regStart)
            updateData.regStart = new Date(data.regStart);
        if (data.regEnd)
            updateData.regEnd = new Date(data.regEnd);
        if (data.maxParticipants)
            updateData.maxParticipants = parseInt(data.maxParticipants);
        if (typeof data.featured === 'string')
            updateData.featured = data.featured === 'true';
        if (typeof data.published === 'string')
            updateData.published = data.published === 'true';
        const event = await prisma.event.update({ where: { id }, data: updateData });
        await (0, audit_service_1.auditLog)({
            adminId: req.admin.id,
            action: 'UPDATE',
            entity: 'Event',
            entityId: event.id,
            details: `Updated event: ${event.title}`,
        });
        res.json({ event });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
};
exports.updateEvent = updateEvent;
// ── Admin: Delete Event ─────────────────────
const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        await prisma.event.delete({ where: { id } });
        await (0, audit_service_1.auditLog)({
            adminId: req.admin.id,
            action: 'DELETE',
            entity: 'Event',
            entityId: id,
            details: `Deleted event: ${event.title}`,
        });
        res.json({ message: 'Event deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
exports.deleteEvent = deleteEvent;
// ── Admin: Get/Save Event Form ──────────────
const getEventForm = async (req, res) => {
    try {
        const id = req.params.id;
        const form = await prisma.eventForm.findUnique({ where: { eventId: id } });
        if (!form) {
            res.json({ form: { fields: [] } });
            return;
        }
        res.json({ form: { ...form, fields: JSON.parse(form.fields) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch form' });
    }
};
exports.getEventForm = getEventForm;
const saveEventForm = async (req, res) => {
    try {
        const id = req.params.id;
        const { fields } = req.body;
        const form = await prisma.eventForm.upsert({
            where: { eventId: id },
            create: { eventId: id, fields: JSON.stringify(fields) },
            update: { fields: JSON.stringify(fields) },
        });
        await (0, audit_service_1.auditLog)({
            adminId: req.admin.id,
            action: 'UPDATE',
            entity: 'EventForm',
            entityId: form.id,
            details: `Updated registration form for event`,
        });
        res.json({ form: { ...form, fields: JSON.parse(form.fields) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save form' });
    }
};
exports.saveEventForm = saveEventForm;
//# sourceMappingURL=event.controller.js.map