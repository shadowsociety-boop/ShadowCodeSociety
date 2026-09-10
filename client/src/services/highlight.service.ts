import api from './api';

export interface HighlightItem {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  date: string;
  category: 'Photo' | 'Achievement' | 'Event' | 'Workshop' | 'Competition' | 'Other';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const highlightService = {
  listHighlights: async (params?: { category?: string; featured?: boolean; page?: number; limit?: number }): Promise<{ highlights: HighlightItem[]; total: number; page: number; totalPages: number }> => {
    const res = await api.get('/api/highlights', { params });
    return res.data;
  },

  createHighlight: async (formData: FormData): Promise<{ highlight: HighlightItem }> => {
    const res = await api.post('/api/highlights', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateHighlight: async (id: string, formData: FormData): Promise<{ highlight: HighlightItem }> => {
    const res = await api.patch(`/api/highlights/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteHighlight: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/api/highlights/${id}`);
    return res.data;
  },
};
