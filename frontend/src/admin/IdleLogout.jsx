import React, { useEffect, useRef, useState } from 'react';
import { TimerOff } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '../components/ui/alert-dialog';
import { useData } from '../context/DataContext';

export const DEFAULT_IDLE_MINUTES = 15;
export const IDLE_OPTIONS = [
  { value: 5, label: '5 menit' },
  { value: 10, label: '10 menit' },
  { value: 15, label: '15 menit (bawaan)' },
  { value: 30, label: '30 menit' },
  { value: 60, label: '1 jam' },
  { value: 120, label: '2 jam' },
  { value: 0, label: 'Nonaktif (tidak pernah logout otomatis)' },
];
export const WARN_BEFORE_MS = 60 * 1000;
export const LAST_ACTIVE_KEY = 'bvt_admin_last_active';
const EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

export const IdleLogout = () => {
  const { auth } = useData();
  const minutes = auth.user?.idle_timeout_minutes ?? DEFAULT_IDLE_MINUTES;
  const limitMs = minutes * 60 * 1000;
  const [warning, setWarning] = useState(false);
  const [left, setLeft] = useState(WARN_BEFORE_MS / 1000);
  const logoutRef = useRef(auth.logout);
  logoutRef.current = auth.logout;

  useEffect(() => {
    if (!limitMs) { setWarning(false); return undefined; }
    const stored = Number(localStorage.getItem(LAST_ACTIVE_KEY));
    if (stored && Date.now() - stored >= limitMs) { localStorage.removeItem(LAST_ACTIVE_KEY); logoutRef.current(); return undefined; }
    if (!stored) localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));

    let lastWrite = 0;
    const touch = () => {
      const now = Date.now();
      if (now - lastWrite < 1000) return;
      lastWrite = now;
      localStorage.setItem(LAST_ACTIVE_KEY, String(now));
      setWarning(false);
    };
    EVENTS.forEach((ev) => window.addEventListener(ev, touch, { passive: true }));

    const tick = setInterval(() => {
      const idle = Date.now() - Number(localStorage.getItem(LAST_ACTIVE_KEY) || Date.now());
      const remaining = limitMs - idle;
      if (remaining <= 0) { localStorage.removeItem(LAST_ACTIVE_KEY); logoutRef.current(); return; }
      if (remaining <= WARN_BEFORE_MS) { setWarning(true); setLeft(Math.ceil(remaining / 1000)); } else setWarning(false);
    }, 1000);

    return () => { EVENTS.forEach((ev) => window.removeEventListener(ev, touch)); clearInterval(tick); };
  }, [limitMs]);

  return (
    <AlertDialog open={warning}>
      <AlertDialogContent className="rounded-3xl" data-testid="idle-warning-dialog">
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand flex items-center justify-center mb-2"><TimerOff className="w-6 h-6" /></div>
          <AlertDialogTitle className="font-display">Sesi akan berakhir</AlertDialogTitle>
          <AlertDialogDescription>Tidak ada aktivitas selama {Math.max(minutes - 1, 0)} menit. Anda akan otomatis logout dalam <span className="font-bold text-brand tabular-nums" data-testid="idle-countdown">{left}</span> detik. Gerakkan mouse atau klik untuk tetap masuk.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <button type="button" onClick={() => { localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now())); setWarning(false); }} className="btn-brand !py-2.5 !px-5" data-testid="idle-stay-button">Tetap masuk</button>
          <button type="button" onClick={() => { localStorage.removeItem(LAST_ACTIVE_KEY); auth.logout(); }} className="btn-outline !py-2.5 !px-5" data-testid="idle-logout-now-button">Logout sekarang</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IdleLogout;
