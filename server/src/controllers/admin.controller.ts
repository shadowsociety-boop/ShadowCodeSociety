import { Response, Request } from 'express';
import path from 'path';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// ── Dashboard Stats ─────────────────────────
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalMembers, currentMembers, alumni,
      totalEvents, upcomingEvents,
      totalRegistrations,
      pendingResources, pendingApplications,
      recentNotifications,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'CURRENT' } }),
      prisma.member.count({ where: { status: 'ALUMNI' } }),
      prisma.event.count(),
      prisma.event.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
      prisma.registration.count(),
      prisma.resourceSubmission.count({ where: { status: 'PENDING' } }),
      prisma.joinApplication.count({ where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } } }),
      prisma.notification.findMany({
        where: req.admin?.id ? { adminId: req.admin.id } : {},
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Recent activity from audit logs
    const recentActivity = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { admin: { select: { name: true, role: true } } },
    });

    res.json({
      stats: {
        totalMembers, currentMembers, alumni,
        totalEvents, upcomingEvents,
        totalRegistrations,
        pendingResources, pendingApplications,
      },
      recentActivity,
      notifications: recentNotifications,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// ── Analytics ───────────────────────────────
export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Registrations per event
    const events = await prisma.event.findMany({
      select: { id: true, title: true, _count: { select: { registrations: true } } },
      orderBy: { date: 'desc' },
      take: 10,
    });

    // Monthly registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrations = await prisma.registration.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const monthlyRegs: Record<string, number> = {};
    registrations.forEach(r => {
      const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
      monthlyRegs[key] = (monthlyRegs[key] || 0) + 1;
    });

    // Applications stats
    const applicationStats = await prisma.joinApplication.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Resource categories
    const resourceCategories = await prisma.resource.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    res.json({
      registrationsPerEvent: events.map(e => ({ name: e.title, count: e._count.registrations })),
      monthlyRegistrations: Object.entries(monthlyRegs).map(([month, count]) => ({ month, count })),
      applicationStats: applicationStats.reduce((acc, s) => ({ ...acc, [s.status]: s._count.status }), {}),
      resourceCategories: resourceCategories.map(r => ({ category: r.category, count: r._count.category })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// ── Audit Logs ──────────────────────────────
export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', entity, action } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = {};
    if (entity) where.entity = entity;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as any,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { name: true, role: true } } },
      }),
      prisma.auditLog.count({ where: where as any }),
    ]);

    res.json({ logs, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

// ── Notifications ───────────────────────────
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { adminId: req.admin!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unread = notifications.filter(n => !n.read).length;
    res.json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (id === 'all') {
      await prisma.notification.updateMany({ where: { adminId: req.admin!.id }, data: { read: true } });
    } else {
      await prisma.notification.update({ where: { id }, data: { read: true } });
    }
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// ── Global Search ───────────────────────────
export const globalSearch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') { res.json({ results: [] }); return; }

    const [events, resources, members, applications] = await Promise.all([
      prisma.event.findMany({ where: { title: { contains: q } }, take: 5, select: { id: true, title: true, slug: true } }),
      prisma.resource.findMany({ where: { title: { contains: q } }, take: 5, select: { id: true, title: true, slug: true } }),
      prisma.member.findMany({ where: { name: { contains: q } }, take: 5, select: { id: true, name: true, role: true } }),
      prisma.joinApplication.findMany({ where: { name: { contains: q } }, take: 5, select: { id: true, name: true, email: true } }),
    ]);

    res.json({
      results: [
        ...events.map(e => ({ type: 'event', id: e.id, title: e.title, slug: e.slug })),
        ...resources.map(r => ({ type: 'resource', id: r.id, title: r.title, slug: r.slug })),
        ...members.map(m => ({ type: 'member', id: m.id, title: m.name, subtitle: m.role })),
        ...applications.map(a => ({ type: 'application', id: a.id, title: a.name, subtitle: a.email })),
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

// ── Active Transmission Popup Configuration ──
export const DEFAULT_POPUP_TRANSMISSION = {
  enabled: true,
  transmissionTag: '// ACTIVE TRANSMISSION • EVENT 18.09.2026',
  date: '18 SEPTEMBER 2026',
  title: 'CYBER HUNT II',
  subtitle: 'Campus-Wide Technical Scavenger Hunt',
  description: `Get ready for Cyber Hunt II, an entry-level technical scavenger hunt designed to test your observational skills, basic tech knowledge, and teamwork!

Spread across the college campus, teams will decode beginner-friendly riddles, solve simple logic puzzles, and scan hidden QR codes to uncover clues that lead to the next destination. Perfect for first-time participants, this level requires zero advanced coding skills — just quick thinking, sharp eyes, and a good strategy.`,
  showBanner: false,
  banner: null as string | null,
  highlights: [
    { icon: 'sparkles', label: 'Level', value: 'Basic (Beginner-Friendly)' },
    { icon: 'mapPin', label: 'Venue', value: 'Campus-wide (JIET Jodhpur)' },
    { icon: 'users', label: 'Team Size', value: '3–6 Members' },
    { icon: 'target', label: 'Objective', value: 'Decode clues & reach final terminal' },
  ],
  ctaText: 'REGISTER TEAM',
  ctaLink: '/events/cyber-hunt-ii',
  footerNote: 'LIMITED TEAM SLOTS AVAILABLE',
  expiryDate: '2026-09-18T23:59:59',
};

export const getPopupTransmission = async (_req: Request, res: Response): Promise<void> => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'active_popup_transmission' },
    });
    if (setting && setting.value) {
      try {
        const data = JSON.parse(setting.value);
        res.json({ popup: { ...DEFAULT_POPUP_TRANSMISSION, ...data } });
        return;
      } catch (parseErr) {
        console.error('Error parsing site setting value:', parseErr);
      }
    }
    res.json({ popup: DEFAULT_POPUP_TRANSMISSION });
  } catch (error) {
    console.error('Failed to get popup transmission:', error);
    res.json({ popup: DEFAULT_POPUP_TRANSMISSION });
  }
};

export const updatePopupTransmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let currentData = { ...DEFAULT_POPUP_TRANSMISSION };
    const existing = await prisma.siteSetting.findUnique({
      where: { key: 'active_popup_transmission' },
    });
    if (existing && existing.value) {
      try {
        currentData = { ...currentData, ...JSON.parse(existing.value) };
      } catch (e) {}
    }

    let bannerUrl = currentData.banner;
    if (req.file) {
      bannerUrl = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${path.basename(req.file.path)}`;
    } else if (req.body.banner !== undefined) {
      bannerUrl = req.body.banner || null;
    }

    let highlights = currentData.highlights;
    if (req.body.highlights) {
      try {
        highlights = typeof req.body.highlights === 'string'
          ? JSON.parse(req.body.highlights)
          : req.body.highlights;
      } catch (e) {
        console.warn('Failed to parse highlights in popup update:', e);
      }
    }

    const updatedData = {
      ...currentData,
      enabled: req.body.enabled !== undefined
        ? (String(req.body.enabled) === 'true' || req.body.enabled === true)
        : currentData.enabled,
      transmissionTag: req.body.transmissionTag !== undefined ? String(req.body.transmissionTag) : currentData.transmissionTag,
      date: req.body.date !== undefined ? String(req.body.date) : currentData.date,
      title: req.body.title !== undefined ? String(req.body.title) : currentData.title,
      subtitle: req.body.subtitle !== undefined ? String(req.body.subtitle) : currentData.subtitle,
      description: req.body.description !== undefined ? String(req.body.description) : currentData.description,
      showBanner: req.body.showBanner !== undefined
        ? (String(req.body.showBanner) === 'true' || req.body.showBanner === true)
        : currentData.showBanner,
      banner: bannerUrl,
      highlights,
      ctaText: req.body.ctaText !== undefined ? String(req.body.ctaText) : currentData.ctaText,
      ctaLink: req.body.ctaLink !== undefined ? String(req.body.ctaLink) : currentData.ctaLink,
      footerNote: req.body.footerNote !== undefined ? String(req.body.footerNote) : currentData.footerNote,
      expiryDate: req.body.expiryDate !== undefined ? String(req.body.expiryDate) : currentData.expiryDate,
    };

    await prisma.siteSetting.upsert({
      where: { key: 'active_popup_transmission' },
      create: {
        key: 'active_popup_transmission',
        value: JSON.stringify(updatedData),
      },
      update: {
        value: JSON.stringify(updatedData),
      },
    });

    res.json({ message: 'Active transmission popup updated successfully', popup: updatedData });
  } catch (error) {
    console.error('Failed to update popup transmission:', error);
    res.status(500).json({ error: 'Failed to update popup transmission settings' });
  }
};
