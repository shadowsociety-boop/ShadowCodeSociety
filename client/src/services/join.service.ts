import api from './api';

export interface JoinApplicationItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  college: string;
  course?: string | null;
  year?: string | null;
  branch?: string | null;
  experience?: string | null;
  skills: string[];
  motivation: string;
  domainInterest?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  resumeUrl?: string | null;
  status: 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const joinService = {
  submitApplication: async (formData: FormData): Promise<{ application: JoinApplicationItem; message: string }> => {
    const res = await api.post('/api/join', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  listApplications: async (params?: { status?: string; page?: number; limit?: number; search?: string }) => {
    try {
      const res = await api.get('/api/join/admin/list', { params });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const res = await api.get('/api/join/admin/applications', { params });
        return res.data;
      }
      throw err;
    }
  },

  updateStatus: async (id: string, status: string, adminNotes?: string) => {
    try {
      const res = await api.patch(`/api/join/admin/${id}`, { status, adminNotes });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const res = await api.patch(`/api/join/admin/applications/${id}`, { status, adminNotes });
        return res.data;
      }
      throw err;
    }
  },

  getApplication: async (id: string) => {
    try {
      const res = await api.get(`/api/join/admin/${id}`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const res = await api.get(`/api/join/admin/applications/${id}`);
        return res.data;
      }
      throw err;
    }
  },
};
