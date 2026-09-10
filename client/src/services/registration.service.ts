import api from './api';

export interface RegistrationItem {
  id: string;
  eventId: string;
  registrationNumber: number;
  name: string;
  email: string;
  status: 'REGISTERED' | 'WAITLISTED' | 'CANCELLED' | 'ATTENDED' | 'NO_SHOW';
  responses: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationStats {
  total: number;
  registered: number;
  waitlisted: number;
  attended: number;
  cancelled: number;
  noShow: number;
  available: number | null;
}

export const registrationService = {
  // Public registration
  registerForEvent: async (eventId: string, payload: { name: string; email: string; responses: Record<string, any> }) => {
    const res = await api.post(`/api/events/${eventId}/register`, payload);
    return res.data;
  },

  // Admin registrations
  listRegistrations: async (
    eventId: string,
    params?: { page?: number; limit?: number; status?: string; search?: string }
  ): Promise<{ registrations: RegistrationItem[]; total: number; page: number; totalPages: number }> => {
    const res = await api.get(`/api/events/${eventId}/registrations`, { params });
    return res.data;
  },

  updateStatus: async (registrationId: string, status: string): Promise<{ registration: RegistrationItem }> => {
    const res = await api.patch(`/api/registrations/${registrationId}`, { status });
    return res.data;
  },

  getStats: async (eventId: string): Promise<RegistrationStats> => {
    const res = await api.get(`/api/events/${eventId}/stats`);
    return res.data;
  },

  exportExcelUrl: (eventId: string): string => {
    return `/api/events/${eventId}/export`;
  },
};
