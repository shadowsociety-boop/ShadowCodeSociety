import api from './api';

export interface DashboardStats {
  totalMembers: number;
  currentMembers: number;
  alumni: number;
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  pendingResources: number;
  pendingApplications: number;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  admin?: {
    name: string;
    role: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

export const adminService = {
  getDashboardStats: async (): Promise<{
    stats: DashboardStats;
    recentActivity: AuditLogItem[];
    notifications: NotificationItem[];
  }> => {
    const res = await api.get('/api/admin/dashboard');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/api/admin/analytics');
    return res.data;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number; entity?: string; action?: string }) => {
    const res = await api.get('/api/admin/audit-logs', { params });
    return res.data;
  },

  getNotifications: async (): Promise<{ notifications: NotificationItem[]; unread: number }> => {
    const res = await api.get('/api/admin/notifications');
    return res.data;
  },

  markNotificationRead: async (id: string) => {
    const res = await api.patch(`/api/admin/notifications/${id}/read`);
    return res.data;
  },

  globalSearch: async (q: string) => {
    const res = await api.get('/api/admin/search', { params: { q } });
    return res.data;
  },
};
