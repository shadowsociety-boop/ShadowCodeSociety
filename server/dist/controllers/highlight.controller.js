"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHighlight = exports.updateHighlight = exports.createHighlight = exports.listHighlights = void 0;
const client_1 = require("@prisma/client");
const audit_service_1 = require("../services/audit.service");
const upload_1 = require("../middleware/upload");
const prisma = new client_1.PrismaClient();
const listHighlights = async (req, res) => {
    try {
        const { category, featured, page = '1', limit = '20' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = {};
        if (category)
            where.category = category;
        if (featured === 'true')
            where.featured = true;
        const [highlights, total] = await Promise.all([
            prisma.highlight.findMany({ where: where, skip, take, orderBy: { date: 'desc' } }),
            prisma.highlight.count({ where: where }),
        ]);
        res.json({ highlights, total, page: parseInt(page), totalPages: Math.ceil(total / take) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch highlights' });
    }
};
exports.listHighlights = listHighlights;
const createHighlight = async (req, res) => {
    try {
        const data = req.body;
        if (!req.file) {
            res.status(400).json({ error: 'Image is required' });
            return;
        }
        const image = (0, upload_1.getFileUrl)(req.file.filename);
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
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'CREATE', entity: 'Highlight', entityId: highlight.id, details: `Created highlight: ${highlight.title}` });
        res.status(201).json({ highlight });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create highlight' });
    }
};
exports.createHighlight = createHighlight;
const updateHighlight = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updateData = { ...data };
        if (req.file)
            updateData.image = (0, upload_1.getFileUrl)(req.file.filename);
        if (data.date)
            updateData.date = new Date(data.date);
        if (typeof data.featured === 'string')
            updateData.featured = data.featured === 'true';
        const highlight = await prisma.highlight.update({ where: { id }, data: updateData });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'UPDATE', entity: 'Highlight', entityId: id, details: `Updated highlight: ${highlight.title}` });
        res.json({ highlight });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update highlight' });
    }
};
exports.updateHighlight = updateHighlight;
const deleteHighlight = async (req, res) => {
    try {
        const id = req.params.id;
        const h = await prisma.highlight.findUnique({ where: { id } });
        if (!h) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        await prisma.highlight.delete({ where: { id } });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'DELETE', entity: 'Highlight', entityId: id, details: `Deleted highlight: ${h.title}` });
        res.json({ message: 'Highlight deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete highlight' });
    }
};
exports.deleteHighlight = deleteHighlight;
//# sourceMappingURL=highlight.controller.js.map