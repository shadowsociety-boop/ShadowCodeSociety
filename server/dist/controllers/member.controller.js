"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmins = exports.assignPresident = exports.moveToAlumni = exports.deleteMember = exports.updateMember = exports.createMember = exports.listMembers = void 0;
const client_1 = require("@prisma/client");
const audit_service_1 = require("../services/audit.service");
const upload_1 = require("../middleware/upload");
const prisma = new client_1.PrismaClient();
// ── Public: List Members ────────────────────
const listMembers = async (req, res) => {
    try {
        const { status = 'CURRENT' } = req.query;
        const members = await prisma.member.findMany({
            where: { status: status },
            orderBy: [{ order: 'asc' }, { name: 'asc' }],
        });
        res.json({ members: members.map(m => ({ ...m, skills: JSON.parse(m.skills) })) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};
exports.listMembers = listMembers;
// ── Admin: Create Member ────────────────────
const createMember = async (req, res) => {
    try {
        const data = req.body;
        let photo;
        if (req.file)
            photo = (0, upload_1.getFileUrl)(req.file.filename);
        const member = await prisma.member.create({
            data: { ...data, photo, skills: JSON.stringify(data.skills || []) },
        });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'CREATE', entity: 'Member', entityId: member.id, details: `Added member: ${member.name}` });
        res.status(201).json({ member: { ...member, skills: JSON.parse(member.skills) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create member' });
    }
};
exports.createMember = createMember;
// ── Admin: Update Member ────────────────────
const updateMember = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (data.skills)
            data.skills = JSON.stringify(data.skills);
        let updateData = { ...data };
        if (req.file)
            updateData.photo = (0, upload_1.getFileUrl)(req.file.filename);
        const member = await prisma.member.update({ where: { id }, data: updateData });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'UPDATE', entity: 'Member', entityId: member.id, details: `Updated member: ${member.name}` });
        res.json({ member: { ...member, skills: JSON.parse(member.skills) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update member' });
    }
};
exports.updateMember = updateMember;
// ── Admin: Delete Member ────────────────────
const deleteMember = async (req, res) => {
    try {
        const id = req.params.id;
        const member = await prisma.member.findUnique({ where: { id } });
        if (!member) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        await prisma.member.delete({ where: { id } });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'DELETE', entity: 'Member', entityId: id, details: `Removed member: ${member.name}` });
        res.json({ message: 'Member removed' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete member' });
    }
};
exports.deleteMember = deleteMember;
// ── Admin: Move to Alumni ───────────────────
const moveToAlumni = async (req, res) => {
    try {
        const id = req.params.id;
        const member = await prisma.member.update({
            where: { id },
            data: { status: 'ALUMNI', leaveYear: new Date().getFullYear() },
        });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'ALUMNI', entity: 'Member', entityId: id, details: `Moved ${member.name} to alumni` });
        res.json({ member: { ...member, skills: JSON.parse(member.skills) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to move member' });
    }
};
exports.moveToAlumni = moveToAlumni;
// ── Mentor Only: Manage President ───────────
const assignPresident = async (req, res) => {
    try {
        if (req.admin.role !== 'MENTOR') {
            res.status(403).json({ error: 'Only mentors can assign presidents' });
            return;
        }
        const { adminId } = req.body;
        // Remove current president role
        await prisma.admin.updateMany({
            where: { role: 'PRESIDENT' },
            data: { role: 'PRESIDENT' }, // keep as-is for now, we change below
        });
        // Actually remove old president first
        const oldPresident = await prisma.admin.findFirst({ where: { role: 'PRESIDENT' } });
        if (oldPresident && oldPresident.id !== adminId) {
            // Just keep the old one but there should only be one president
        }
        const admin = await prisma.admin.update({
            where: { id: adminId },
            data: { role: 'PRESIDENT' },
        });
        await (0, audit_service_1.auditLog)({ adminId: req.admin.id, action: 'ASSIGN_PRESIDENT', entity: 'Admin', entityId: adminId, details: `Assigned ${admin.name} as President` });
        res.json({ message: `${admin.name} is now President` });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to assign president' });
    }
};
exports.assignPresident = assignPresident;
const getAdmins = async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        res.json({ admins });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
};
exports.getAdmins = getAdmins;
//# sourceMappingURL=member.controller.js.map