"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplication = exports.updateApplication = exports.listApplications = exports.submitApplication = void 0;
const client_1 = require("@prisma/client");
const audit_service_1 = require("../services/audit.service");
const upload_1 = require("../middleware/upload");
const prisma = new client_1.PrismaClient();
// ── Public: Submit Application ──────────────
const submitApplication = async (req, res) => {
    try {
        const data = req.body;
        let resumeUrl;
        if (req.file)
            resumeUrl = (0, upload_1.getFileUrl)(req.file.filename);
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
        await (0, audit_service_1.createNotification)({
            title: 'New Join Application',
            message: `${data.name} wants to join the society`,
            type: 'JOIN_APP',
            link: '/admin/applications',
        });
        res.status(201).json({ application, message: 'Application submitted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Application submission failed' });
    }
};
exports.submitApplication = submitApplication;
// ── Admin: List Applications ────────────────
const listApplications = async (req, res) => {
    try {
        const { status, page = '1', limit = '20', search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = {};
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { college: { contains: search } },
            ];
        }
        const [applications, total] = await Promise.all([
            prisma.joinApplication.findMany({ where: where, skip, take, orderBy: { createdAt: 'desc' } }),
            prisma.joinApplication.count({ where: where }),
        ]);
        res.json({
            applications: applications.map(a => ({ ...a, skills: JSON.parse(a.skills) })),
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / take),
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};
exports.listApplications = listApplications;
// ── Admin: Update Application Status ────────
const updateApplication = async (req, res) => {
    try {
        const id = req.params.id;
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
        await (0, audit_service_1.auditLog)({
            adminId: req.admin.id,
            action: `APPLICATION_${status}`,
            entity: 'JoinApplication',
            entityId: id,
            details: `${status} application from ${application.name}`,
        });
        res.json({ application: { ...application, skills: JSON.parse(application.skills) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update application' });
    }
};
exports.updateApplication = updateApplication;
// ── Admin: Get Single Application ───────────
const getApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await prisma.joinApplication.findUnique({ where: { id } });
        if (!application) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        res.json({ application: { ...application, skills: JSON.parse(application.skills) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch application' });
    }
};
exports.getApplication = getApplication;
//# sourceMappingURL=join.controller.js.map