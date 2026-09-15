import api from './api';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface EventFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[]; // for select/radio
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  banner?: string | null;
  eventType: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  meetingLink?: string | null;
  regStart?: string | null;
  regEnd?: string | null;
  maxParticipants?: number | null;
  status: 'DRAFT' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    registrations: number;
  };
  form?: {
    id: string;
    fields: string | EventFormField[];
  } | null;
}

export interface EventFilterParams {
  type?: string;
  status?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export const eventService = {
  // Public
  listEvents: async (params?: EventFilterParams): Promise<{ events: EventItem[]; total: number; page: number; totalPages: number }> => {
    const res = await api.get('/api/events', { params });
    return res.data;
  },

  getEventBySlug: async (slug: string): Promise<{ event: EventItem }> => {
    const res = await api.get(`/api/events/${slug}`);
    return res.data;
  },

  // Admin
  adminListEvents: async (params?: EventFilterParams): Promise<{ events: EventItem[]; total: number; page: number; totalPages: number }> => {
    try {
      const res = await api.get('/api/events/admin/list', { params });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const res = await api.get('/api/events/admin/all', { params });
          return res.data;
        } catch {
          const res = await api.get('/api/events', { params });
          return res.data;
        }
      }
      throw err;
    }
  },

  createEvent: async (formData: FormData): Promise<{ event: EventItem }> => {
    const res = await api.post('/api/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateEvent: async (id: string, formData: FormData): Promise<{ event: EventItem }> => {
    const res = await api.patch(`/api/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteEvent: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/api/events/${id}`);
    return res.data;
  },

  getEventForm: async (id: string): Promise<{ form: { id?: string; fields: EventFormField[] } }> => {
    const res = await api.get(`/api/events/${id}/form`);
    return res.data;
  },

  saveEventForm: async (id: string, fields: EventFormField[]): Promise<{ form: { id: string; fields: EventFormField[] } }> => {
    const res = await api.post(`/api/events/${id}/form`, { fields });
    return res.data;
  },
};
