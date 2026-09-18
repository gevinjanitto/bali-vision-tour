import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { setSiteSnapshot, mediaUrl } from '../lib/siteContent';

const SettingsContext = createContext(null);
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const apply = useCallback((next) => { setSiteSnapshot(next); setSettings(next); setError(''); }, []);
  const reload = useCallback(async () => {
    try { const { data } = await api.get('/api/settings'); apply(data); }
    catch { setError('Pengaturan website gagal dimuat. Silakan coba kembali.'); }
  }, [apply]);
  useEffect(() => { reload(); }, [reload]);
  useEffect(() => {
    const focus = () => { if (!document.hidden) reload(); };
    window.addEventListener('focus', focus);
    return () => window.removeEventListener('focus', focus);
  }, [reload]);
  useEffect(() => {
    if (!settings) return;
    document.title = settings.brand.name;
    let icon = document.querySelector('link[rel="icon"]');
    if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = mediaUrl(settings.brand.favicon || settings.brand.logo);
  }, [settings]);
  const save = async (next) => { const { data } = await api.put('/api/settings', next); apply(data); return data; };
  return <SettingsContext.Provider value={{ settings, loading: !settings, error, reload, save }}>{children}</SettingsContext.Provider>;
};
export const useSettings = () => useContext(SettingsContext);