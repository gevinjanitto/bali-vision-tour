import axios from 'axios';

export const AUTH_KEY = 'bvt_admin_token';
export const API_BASE = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem(AUTH_KEY)) {
      localStorage.removeItem(AUTH_KEY);
      onUnauthorized?.();
    }
    return Promise.reject(err);
  }
);

export const errorMessage = (e, fallback = 'Something went wrong') => {
  const d = e?.response?.data?.detail;
  if (!d) return e?.message || fallback;
  if (typeof d === 'string') return d;
  if (Array.isArray(d)) return d.map((x) => x.msg || JSON.stringify(x)).join(' ');
  return d.msg || String(d);
};

export const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.url;
};
