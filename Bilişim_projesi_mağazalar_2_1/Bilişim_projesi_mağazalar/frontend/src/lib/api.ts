import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach user id from localStorage if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId') || '1';
    const token = localStorage.getItem('token');
    config.headers['x-user-id'] = userId;
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const searchAPI = {
  search: (q: string, params?: Record<string, string>) => api.get('/search', { params: { q, ...params } }),
  suggestions: (q: string) => api.get('/search/suggestions', { params: { q } }),
  categories: () => api.get('/search/categories'),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  getListings: (id: number) => api.get(`/products/${id}/listings`),
  getHistory: (id: number, platform?: string) => api.get(`/products/${id}/history`, { params: { platform } }),
  getPredict: (id: number, platform?: string, days?: number) => api.get(`/products/${id}/predict`, { params: { platform, days } }),
};

export const alertsAPI = {
  getAll: () => api.get('/alerts'),
  create: (productId: number, targetPrice: number) => api.post('/alerts', { productId, targetPrice }),
  delete: (id: number) => api.delete(`/alerts/${id}`),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (productId: number) => api.post(`/favorites/${productId}`),
  remove: (productId: number) => api.delete(`/favorites/${productId}`),
  check: (productId: number) => api.get(`/favorites/check/${productId}`),
};

export const reviewsAPI = {
  getByProduct: (productId: number) => api.get(`/reviews/${productId}`),
  create: (productId: number, data: { userName: string; rating: number; comment: string; platform?: string }) =>
    api.post(`/reviews/${productId}`, data),
};

export const authAPI = {
  register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password }),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export default api;
