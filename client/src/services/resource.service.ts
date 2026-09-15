import api from './api';

export interface ResourceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  thumbnail?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceSubmissionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  fileUrl?: string | null;
  externalUrl?: string | null;
  contributorName: string;
  contributorEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  adminNotes?: string | null;
  createdAt: string;
}

export const resourceService = {
  // Public
  listResources: async (params?: { page?: number; limit?: number; category?: string; search?: string; tag?: string }) => {
    const res = await api.get('/api/resources', { params });
    return res.data;
  },

  getResourceBySlug: async (slug: string): Promise<{ resource: ResourceItem }> => {
    try {
      const res = await api.get(`/api/resources/slug/${slug}`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const fallback = await api.get(`/api/resources/${slug}`);
        return fallback.data;
      }
      throw err;
    }
  },

  submitResource: async (formData: FormData) => {
    const res = await api.post('/api/resources/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Admin
  adminListResources: async (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    try {
      const res = await api.get('/api/resources/admin/list', { params });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const res = await api.get('/api/resources/admin/all', { params });
          return res.data;
        } catch {
          const res = await api.get('/api/resources', { params });
          return res.data;
        }
      }
      throw err;
    }
  },

  createResource: async (formData: FormData): Promise<{ resource: ResourceItem }> => {
    const res = await api.post('/api/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateResource: async (id: string, formData: FormData): Promise<{ resource: ResourceItem }> => {
    const res = await api.patch(`/api/resources/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteResource: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/api/resources/${id}`);
    return res.data;
  },

  listSubmissions: async (params?: { status?: string; page?: number; limit?: number }) => {
    const res = await api.get('/api/resources/admin/submissions', { params });
    return res.data;
  },

  approveSubmission: async (id: string) => {
    const res = await api.post(`/api/resources/admin/submissions/${id}/approve`);
    return res.data;
  },

  rejectSubmission: async (id: string, adminNotes?: string) => {
    const res = await api.post(`/api/resources/admin/submissions/${id}/reject`, { adminNotes });
    return res.data;
  },
};
