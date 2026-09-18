import React, { useState } from 'react';
import { TimerOff, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { useData } from '../context/DataContext';
import { api, errorMessage } from '../lib/api';
import { IDLE_OPTIONS, DEFAULT_IDLE_MINUTES } from './IdleLogout';

export const IdleSettingsCard = () => {
  const { auth } = useData();
  const saved = auth.user?.idle_timeout_minutes ?? DEFAULT_IDLE_MINUTES;
  const [value, setValue] = useState(String(saved));
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put('/api/auth/preferences', { idle_timeout_minutes: Number(value) });
      auth.updateUser({ idle_timeout_minutes: data.idle_timeout_minutes });
      toast.success(Number(value) === 0 ? 'Logout otomatis dinonaktifkan.' : `Logout otomatis diatur ke ${IDLE_OPTIONS.find((o) => o.value === Number(value))?.label}.`);
    } catch (err) { toast.error(errorMessage(err, 'Gagal menyimpan pengaturan')); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-ink/8 p-6 shadow-soft space-y-5" data-testid="idle-settings-card">
      <div className="flex items-start gap-4">
        <span className="w-11 h-11 rounded-2xl bg-brand-50 text-brand flex items-center justify-center shrink-0"><TimerOff className="w-5 h-5" /></span>
        <div>
          <h2 className="font-display font-bold text-ink text-lg" data-testid="idle-settings-title">Logout otomatis</h2>
          <p className="text-sm text-sand mt-1" data-testid="idle-settings-description">Admin akan keluar otomatis jika tidak ada interaksi (atau halaman ditutup) selama durasi ini. Peringatan muncul 1 menit sebelum logout.</p>
        </div>
      </div>
      <div className="space-y-2 max-w-sm">
        <Label htmlFor="idle-timeout">Durasi tanpa aktivitas</Label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger id="idle-timeout" className="bg-cream/60" data-testid="idle-timeout-select"><SelectValue /></SelectTrigger>
          <SelectContent>{IDLE_OPTIONS.map((o) => <SelectItem key={o.value} value={String(o.value)} data-testid={`idle-timeout-option-${o.value}`}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-ink/8">
        <span className="text-xs text-sand" data-testid="idle-settings-current">Saat ini: <strong className="text-ink">{IDLE_OPTIONS.find((o) => o.value === saved)?.label || `${saved} menit`}</strong></span>
        <button type="submit" disabled={busy || Number(value) === saved} className="btn-brand !py-2.5 !px-5 disabled:opacity-60" data-testid="idle-settings-save"><Save size={16} /> {busy ? 'Menyimpan…' : 'Simpan durasi'}</button>
      </div>
    </form>
  );
};

export default IdleSettingsCard;
