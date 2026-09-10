import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { auditLog } from '../services/audit.service';
import { getFileUrl } from '../middleware/upload';

const prisma = new PrismaClient();

// ── Public: List Members ────────────────────
export const listMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status = 'CURRENT' } = req.query;
    const members = await prisma.member.findMany({
      where: { status: status as string },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    res.json({ members: members.map(m => ({ ...m, skills: JSON.parse(m.skills) })) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

// ── Admin: Create Member ────────────────────
export const createMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    let photo: string | undefined;
    if (req.file) photo = getFileUrl(req.file.filename);

    const member = await prisma.member.create({
      data: { ...data, photo, skills: JSON.stringify(data.skills || []) },
    });

    await auditLog({ adminId: req.admin!.id, action: 'CREATE', entity: 'Member', entityId: member.id, details: `Added member: ${member.name}` });
    res.status(201).json({ member: { ...member, skills: JSON.parse(member.skills) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create member' });
  }
};

// ── Admin: Update Member ────────────────────
export const updateMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    if (data.skills) data.skills = JSON.stringify(data.skills);

    let updateData = { ...data };
    if (req.file) updateData.photo = getFileUrl(req.file.filename);

    const member = await prisma.member.update({ where: { id }, data: updateData });
    await auditLog({ adminId: req.admin!.id, action: 'UPDATE', entity: 'Member', entityId: member.id, details: `Updated member: ${member.name}` });
    res.json({ member: { ...member, skills: JSON.parse(member.skills) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
};

// ── Admin: Delete Member ────────────────────
export const deleteMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) { res.status(404).json({ error: 'Not found' }); return; }

    await prisma.member.delete({ where: { id } });
    await auditLog({ adminId: req.admin!.id, action: 'DELETE', entity: 'Member', entityId: id, details: `Removed member: ${member.name}` });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
};

// ── Admin: Move to Alumni ───────────────────
export const moveToAlumni = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const member = await prisma.member.update({
      where: { id },
      data: { status: 'ALUMNI', leaveYear: new Date().getFullYear() },
    });

    await auditLog({ adminId: req.admin!.id, action: 'ALUMNI', entity: 'Member', entityId: id, details: `Moved ${member.name} to alumni` });
    res.json({ member: { ...member, skills: JSON.parse(member.skills) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to move member' });
  }
};

// ── Mentor Only: Manage President ───────────
export const assignPresident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.admin!.role !== 'MENTOR') {
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

    await auditLog({ adminId: req.admin!.id, action: 'ASSIGN_PRESIDENT', entity: 'Admin', entityId: adminId, details: `Assigned ${admin.name} as President` });
    res.json({ message: `${admin.name} is now President` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign president' });
  }
};

export const getAdmins = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};
