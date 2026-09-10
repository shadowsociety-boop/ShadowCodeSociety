"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectSubmission = exports.approveSubmission = exports.listSubmissions = exports.deleteResource = exports.updateResource = exports.createResource = exports.adminListResources = exports.submitResource = exports.getResourceBySlug = exports.listResources = void 0;
const client_1 = require("@prisma/client");
const slugify_1 = __importDefault(require("slugify"));
const uuid_1 = require("uuid");
const audit_service_1 = require("../services/audit.service");
const upload_1 = require("../middleware/upload");
const prisma = new client_1.PrismaClient();
// ── Public: List Resources ──────────────────
const listResources = async (req, res) => {
    try {
        const { page = '1', limit = '12', category, search, tag } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = { published: true };
        if (category)
            where.category = category;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        if (tag)
            where.tags = { contains: tag };
        const [resources, total] = await Promise.all([
            prisma.resource.findMany({ where: where, skip, take, orderBy: { createdAt: 'desc' } }),
            prisma.resource.count({ where: where }),
        ]);
        const parsed = resources.map(r => ({ ...r, tags: JSON.parse(r.tags) }));
        res.json({ resources: parsed, total, page: parseInt(page), totalPages: Math.ceil(total / take) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
};
exports.listResources = listResources;
// ── Public: Get Resource by Slug ────────────
const getResourceBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const resource = await prisma.resource.findUnique({ where: { slug } });
        if (!resource || !resource.published) {
            res.status(404).json({ error: 'Resource not found' });
            return;
        }
        res.json({ resource: { ...resource, tags: JSON.parse(resource.tags) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
};
exports.getResourceBySlug = getResourceBySlug;
// ── Public: Submit Resource ─────────────────
const submitResource = async (req, res) => {
    try {
        const data = req.body;
        let fileUrl;
        if (req.file) {
            fileUrl = (0, upload_1.getFileUrl)(req.file.filename);
        }
        const submission = await prisma.resourceSubmission.create({
            data: {
                ...data,
                fileUrl,
                tags: JSON.stringify(data.tags || []),
            },
        });
        await (0, audit_service_1.createNotification)({
            title: 'New Resource Submission',
            message: `${data.contributorName} submitted "${data.title}"`,
            type: 'RESOURCE_SUB',
            link: '/admin/resources/approvals',
        });
        res.status(201).json({ submission });
    }
    catch (error) {
        res.status(500).json({ error: 'Submission failed' });
    }
};
exports.submitResource = submitResource;
// ── Admin: CRUD ─────────────────────────────
const adminListResources = async (req, res) => {
    try {
        const { page = '1', limit = '20', category, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = {};
        if (category)
            where.category = category;
        if (search)
            where.title = { contains: search };
        const [resources, total] = await Promise.all([
            prisma.resource.findMany({ where: where, skip, take, orderBy: { createdAt: 'desc' } }),
            prisma.resource.count({ where: where }),
        ]);
        res.json({ resources: resources.map(r => ({ ...r, tags: JSON.parse(r.tags) })), total, page: parseInt(page), totalPages: Math.ceil(total / take) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
};
exports.adminListResources = adminListResources;
const createResource = async (req, res) => {
    try {
        const data = req.body;
        const slug = (0, slugify_1.default)(data.title, { lower: true, strict: true }) + '-' + (0, uuid_1.v4)().slice(0, 6);
        let thumbnail;
        if (req.file) {
            thumbnail = (0, upload_1.getFileUrl)(req.file.filename);
        }
        const resource = await prisma.resource.create({
            data: { ...data, slug, thumbnail, tags: JSON.stringify(data.tags || []) },
        });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'CREATE', entity: 'Resource', entityId: resource.id, details: `Created resource: ${resource.title}` });
        res.status(201).json({ resource: { ...resource, tags: JSON.parse(resource.tags) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create resource' });
    }
};
exports.createResource = createResource;
const updateResource = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (data.tags)
            data.tags = JSON.stringify(data.tags);
        let updateData = { ...data };
        if (req.file) {
            updateData.thumbnail = (0, upload_1.getFileUrl)(req.file.filename);
        }
        const resource = await prisma.resource.update({ where: { id }, data: updateData });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'UPDATE', entity: 'Resource', entityId: resource.id, details: `Updated resource: ${resource.title}` });
        res.json({ resource: { ...resource, tags: JSON.parse(resource.tags) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update resource' });
    }
};
exports.updateResource = updateResource;
const deleteResource = async (req, res) => {
    try {
        const id = req.params.id;
        const resource = await prisma.resource.findUnique({ where: { id } });
        if (!resource) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        await prisma.resource.delete({ where: { id } });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'DELETE', entity: 'Resource', entityId: id, details: `Deleted resource: ${resource.title}` });
        res.json({ message: 'Resource deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete resource' });
    }
};
exports.deleteResource = deleteResource;
// ── Admin: Submissions Approval ─────────────
const listSubmissions = async (req, res) => {
    try {
        const { status = 'PENDING', page = '1', limit = '20' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const [submissions, total] = await Promise.all([
            prisma.resourceSubmission.findMany({ where: { status: status }, skip, take, orderBy: { createdAt: 'desc' } }),
            prisma.resourceSubmission.count({ where: { status: status } }),
        ]);
        res.json({ submissions: submissions.map(s => ({ ...s, tags: JSON.parse(s.tags) })), total, page: parseInt(page), totalPages: Math.ceil(total / take) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};
exports.listSubmissions = listSubmissions;
const approveSubmission = async (req, res) => {
    try {
        const id = req.params.id;
        const submission = await prisma.resourceSubmission.findUnique({ where: { id } });
        if (!submission) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        // Create resource from submission
        const slug = (0, slugify_1.default)(submission.title, { lower: true, strict: true }) + '-' + (0, uuid_1.v4)().slice(0, 6);
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
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'APPROVE', entity: 'ResourceSubmission', entityId: id, details: `Approved resource: ${submission.title}` });
        res.json({ message: 'Resource approved and published' });
    }
    catch (error) {
        res.status(500).json({ error: 'Approval failed' });
    }
};
exports.approveSubmission = approveSubmission;
const rejectSubmission = async (req, res) => {
    try {
        const id = req.params.id;
        const { adminNotes } = req.body;
        await prisma.resourceSubmission.update({ where: { id }, data: { status: 'REJECTED', adminNotes } });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'REJECT', entity: 'ResourceSubmission', entityId: id, details: 'Rejected resource submission' });
        res.json({ message: 'Submission rejected' });
    }
    catch (error) {
        res.status(500).json({ error: 'Rejection failed' });
    }
};
exports.rejectSubmission = rejectSubmission;
//# sourceMappingURL=resource.controller.js.map