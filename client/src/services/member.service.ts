import api from './api';

export interface MemberItem {
  id: string;
  name: string;
  photo?: string | null;
  role: string;
  department?: string | null;
  year?: string | null;
  branch?: string | null;
  bio?: string | null;
  skills: string[];
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  joinYear?: number | null;
  leaveYear?: number | null;
  status: 'CURRENT' | 'ALUMNI';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const memberService = {
  // Public
  listMembers: async (status: 'CURRENT' | 'ALUMNI' = 'CURRENT'): Promise<{ members: MemberItem[] }> => {
    const res = await api.get('/api/members', { params: { status } });
    return res.data;
  },

  // Admin
  createMember: async (formData: FormData): Promise<{ member: MemberItem }> => {
    const res = await api.post('/api/members', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateMember: async (id: string, formData: FormData): Promise<{ member: MemberItem }> => {
    const res = await api.patch(`/api/members/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteMember: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/api/members/${id}`);
    return res.data;
  },

  moveToAlumni: async (id: string): Promise<{ member: MemberItem }> => {
    try {
      const res = await api.patch(`/api/members/${id}/alumni`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || err.response?.status === 405) {
        const res = await api.post(`/api/members/${id}/alumni`);
        return res.data;
      }
      throw err;
    }
  },

  assignPresident: async (adminId: string): Promise<{ message: string }> => {
    try {
      const res = await api.post('/api/members/admin/assign-president', { adminId });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const res = await api.post('/api/members/assign-president', { adminId });
        return res.data;
      }
      throw err;
    }
  },

  getAdmins: async (): Promise<{ admins: Array<{ id: string; name: string; email: string; role: string; avatar?: string | null }> }> => {
    try {
      const res = await api.get('/api/members/admin/admins');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const res = await api.get('/api/members/admins');
        return res.data;
      }
      throw err;
    }
  },
};
