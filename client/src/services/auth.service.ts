import api from './api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'MENTOR' | 'PRESIDENT';
  avatar?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ admin: AdminUser }> => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const res = await api.post('/api/auth/logout');
    return res.data;
  },

  getMe: async (): Promise<{ admin: AdminUser }> => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
};
