import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, AUTH_KEY, errorMessage, setUnauthorizedHandler } from '../lib/api';

const DataContext = createContext(null);
const RESOURCES = ['tours', 'cars', 'activities', 'articles'];

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({ tours: [], cars: [], activities: [], articles: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_KEY));
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setToken(null);
    setUser(null);
    api.post('/api/auth/logout').catch(() => {});
  }, []);

  useEffect(() => { setUnauthorizedHandler(() => { setToken(null); setUser(null); }); }, []);

  useEffect(() => {
    Promise.all(RESOURCES.map((r) => api.get(`/api/content/${r}`).then((res) => [r, res.data]).catch(() => [r, []])))
      .then((entries) => setData((d) => ({ ...d, ...Object.fromEntries(entries) })))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!token) return;
    api.get('/api/auth/me').then((r) => setUser(r.data)).catch(() => {});
  }, [token]);

  const value = useMemo(() => {
    const collection = (key) => ({
      list: () => data[key],
      get: (idOrSlug) => data[key].find((x) => x.id === idOrSlug || x.slug === idOrSlug),
      create: async (item) => {
        const { data: created } = await api.post(`/api/content/${key}`, item);
        setData((d) => ({ ...d, [key]: [...d[key], created] }));
        return created;
      },
      update: async (id, patch) => {
        const { data: updated } = await api.put(`/api/content/${key}/${id}`, patch);
        setData((d) => ({ ...d, [key]: d[key].map((x) => (x.id === id ? updated : x)) }));
        return updated;
      },
      remove: async (id) => {
        await api.delete(`/api/content/${key}/${id}`);
        setData((d) => ({ ...d, [key]: d[key].filter((x) => x.id !== id) }));
      },
    });
    return {
      data,
      loading,
      tours: collection('tours'),
      cars: collection('cars'),
      activities: collection('activities'),
      articles: collection('articles'),
      bookings: {
        list: () => data.bookings,
        create: async (payload) => {
          const { data: created } = await api.post('/api/bookings', payload);
          return created;
        },
        load: async () => {
          const { data: list } = await api.get('/api/bookings');
          setData((d) => ({ ...d, bookings: list }));
          return list;
        },
        setStatus: async (id, status) => {
          const { data: updated } = await api.patch(`/api/bookings/${id}`, { status });
          setData((d) => ({ ...d, bookings: d.bookings.map((b) => (b.id === id ? updated : b)) }));
        },
        remove: async (id) => {
          await api.delete(`/api/bookings/${id}`);
          setData((d) => ({ ...d, bookings: d.bookings.filter((b) => b.id !== id) }));
        },
      },
      auth: {
        token,
        user,
        isAuthed: !!token,
        login: async (username, password) => {
          try {
            const { data: res } = await api.post('/api/auth/login', { username, password });
            localStorage.setItem(AUTH_KEY, res.token);
            setToken(res.token);
            setUser(res.user);
            return { ok: true };
          } catch (e) {
            return { ok: false, error: errorMessage(e, 'Login failed') };
          }
        },
        logout,
      },
    };
  }, [data, loading, token, user, logout]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
