import { Response } from 'express';
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
