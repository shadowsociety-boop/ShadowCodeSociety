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
  login: async (credentials: LoginCredentials): Promise<{ admin: AdminUser; token?: string }> => {
    const res = await api.post('/api/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('admin_token', res.data.token);
    }
    return res.data;
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const res = await api.post('/api/auth/logout');
      return res.data;
    } finally {
      localStorage.removeItem('admin_token');
    }
  },

  getMe: async (): Promise<{ admin: AdminUser }> => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
};
