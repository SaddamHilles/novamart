import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('novamart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function apiErrorMessage(err: unknown, fallback: string) {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    return typeof message === 'string' ? message : fallback;
  }
  return fallback;
}

export default api;
