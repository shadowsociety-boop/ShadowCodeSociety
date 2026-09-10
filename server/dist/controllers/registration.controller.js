"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationStats = exports.exportRegistrations = exports.updateRegistration = exports.listRegistrations = exports.registerForEvent = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const excel_1 = require("../utils/excel");
const audit_service_1 = require("../services/audit.service");
const prisma = new client_1.PrismaClient();
// ── Build dynamic Zod schema from form fields ──
const buildDynamicSchema = (fields) => {
    const shape = {};
    for (const field of fields) {
        let validator;
        switch (field.type) {
            case 'email':
                validator = zod_1.z.string().email();
                break;
            case 'phone':
                validator = zod_1.z.string();
                break;
            case 'number':
                validator = zod_1.z.union([zod_1.z.number(), zod_1.z.string()]);
                break;
            case 'checkbox':
                validator = zod_1.z.boolean().or(zod_1.z.string());
                break;
            case 'multiselect':
                validator = zod_1.z.array(zod_1.z.string());
                break;
            case 'dropdown':
            case 'radio':
                validator = zod_1.z.string();
                break;
            case 'file':
                validator = zod_1.z.string();
                break;
            default:
                validator = zod_1.z.string();
        }
        if (!field.required) {
            validator = validator.optional().or(zod_1.z.literal(''));
        }
        shape[field.id] = validator;
    }
    return zod_1.z.object(shape).passthrough();
};
// ── Public: Register for Event ──────────────
const registerForEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await prisma.event.findUnique({
            where: { id },
            include: { form: true, _count: { select: { registrations: true } } },
        });
        if (!event || !event.published) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        if (event.status === 'COMPLETED' || event.status === 'CANCELLED') {
            res.status(400).json({ error: 'Registration is closed for this event' });
            return;
        }
        // Check registration window
        const now = new Date();
        if (event.regStart && now < new Date(event.regStart)) {
            res.status(400).json({ error: 'Registration has not started yet' });
            return;
        }
        if (event.regEnd && now > new Date(event.regEnd)) {
            res.status(400).json({ error: 'Registration has ended' });
            return;
        }
        const { name, email, responses } = req.body;
        if (!name || !email) {
            res.status(400).json({ error: 'Name and email are required' });
            return;
        }
        // Check duplicate registration
        const existing = await prisma.registration.findUnique({
            where: { eventId_email: { eventId: id, email } },
        });
        if (existing) {
            res.status(409).json({ error: 'You have already registered for this event' });
            return;
        }
        // Validate dynamic form responses
        if (event.form) {
            const fields = JSON.parse(event.form.fields);
            const schema = buildDynamicSchema(fields);
            try {
                schema.parse(responses || {});
            }
            catch (validationError) {
                if (validationError instanceof zod_1.z.ZodError) {
                    res.status(400).json({
                        error: 'Validation failed',
                        details: validationError.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
                    });
                    return;
                }
            }
        }
        // Determine status based on capacity
        const currentCount = event._count.registrations;
        let status = 'REGISTERED';
        if (event.maxParticipants && currentCount >= event.maxParticipants) {
            status = 'WAITLISTED';
        }
        // Get next registration number
        const lastReg = await prisma.registration.findFirst({
            where: { eventId: id },
            orderBy: { registrationNumber: 'desc' },
        });
        const regNumber = (lastReg?.registrationNumber || 0) + 1;
        const registration = await prisma.registration.create({
            data: {
                eventId: id,
                registrationNumber: regNumber,
                name,
                email,
                responses: JSON.stringify(responses || {}),
                status,
            },
        });
        await (0, audit_service_1.createNotification)({
            title: 'New Registration',
            message: `${name} registered for "${event.title}"`,
            type: 'REGISTRATION',
            link: `/admin/events/${id}/registrations`,
        });
        res.status(201).json({ registration, status });
    }
    catch (error) {
        console.error('[REGISTRATION] Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
exports.registerForEvent = registerForEvent;
// ── Admin: List Registrations ───────────────
const listRegistrations = async (req, res) => {
    try {
        const id = req.params.id;
        const { page = '1', limit = '50', status, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = { eventId: id };
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
            ];
        }
        const [registrations, total] = await Promise.all([
            prisma.registration.findMany({
                where: where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.registration.count({ where: where }),
        ]);
        const parsed = registrations.map(r => ({
            ...r,
            responses: JSON.parse(r.responses),
        }));
        res.json({ registrations: parsed, total, page: parseInt(page), totalPages: Math.ceil(total / take) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
};
exports.listRegistrations = listRegistrations;
// ── Admin: Update Registration Status ───────
const updateRegistration = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const validStatuses = ['REGISTERED', 'WAITLISTED', 'CANCELLED', 'ATTENDED', 'NO_SHOW'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }
        const registration = await prisma.registration.update({
            where: { id },
            data: { status },
        });
        res.json({ registration });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update registration' });
    }
};
exports.updateRegistration = updateRegistration;
// ── Admin: Export Registrations ──────────────
const exportRegistrations = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await prisma.event.findUnique({
            where: { id },
            include: { form: true },
        });
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        const registrations = await prisma.registration.findMany({
            where: { eventId: id },
            orderBy: { registrationNumber: 'asc' },
        });
        const fields = event.form ? JSON.parse(event.form.fields) : [];
        const buffer = (0, excel_1.generateExcel)(event.title, fields, registrations);
        const filename = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(buffer);
    }
    catch (error) {
        console.error('[EXPORT] Error:', error);
        res.status(500).json({ error: 'Export failed' });
    }
};
exports.exportRegistrations = exportRegistrations;
// ── Admin: Get Registration Stats ───────────
const getRegistrationStats = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        const stats = await prisma.registration.groupBy({
            by: ['status'],
            where: { eventId: id },
            _count: { status: true },
        });
        const total = stats.reduce((sum, s) => sum + (s._count?.status ?? 0), 0);
        const statusMap = {};
        stats.forEach((s) => { statusMap[s.status] = s._count?.status ?? 0; });
        res.json({
            total,
            registered: statusMap['REGISTERED'] || 0,
            waitlisted: statusMap['WAITLISTED'] || 0,
            attended: statusMap['ATTENDED'] || 0,
            cancelled: statusMap['CANCELLED'] || 0,
            noShow: statusMap['NO_SHOW'] || 0,
            available: event.maxParticipants ? Math.max(0, event.maxParticipants - total) : null,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
exports.getRegistrationStats = getRegistrationStats;
//# sourceMappingURL=registration.controller.js.map