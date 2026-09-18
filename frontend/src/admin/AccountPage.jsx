import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useData } from '../context/DataContext';
import { api, errorMessage } from '../lib/api';

export default function AccountPage() {
  const { auth } = useData();
  const navigate = useNavigate();
  const [username, setUsername] = useState(auth.user?.username || '');
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async e => {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Konfirmasi password tidak sama'); return; }
    setBusy(true);
    try {
      await api.put('/api/auth/account', { username, current_password: current, new_password: password || null });
      auth.logout(); toast.success('Akun berhasil diperbarui. Masuk dengan akun baru Anda.'); navigate('/admin/login', { replace: true });
    } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };
  return <div className="max-w-2xl" data-testid="account-page"><p className="eyebrow" data-testid="account-eyebrow">KEAMANAN AKUN</p><h1 className="font-display text-3xl font-bold mt-2 text-ink" data-testid="account-title">Akun Admin</h1><p className="text-sm text-sand mt-3" data-testid="account-description">Ganti username dan password. Setelah disimpan, seluruh sesi lama akan keluar.</p>
    <form onSubmit={submit} className="space-y-6 mt-9" data-testid="account-form">
      <div className="space-y-2"><Label htmlFor="account-username">Username</Label><Input id="account-username" data-testid="account-username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required minLength={3} maxLength={40} pattern="[a-zA-Z0-9_.\-]+" className="bg-white" /></div>
      {[['current', 'Password saat ini', current, setCurrent, true], ['new', 'Password baru (kosongkan jika tidak diganti)', password, setPassword, false], ['confirm', 'Konfirmasi password baru', confirm, setConfirm, !!password]].map(([key, label, value, setter, required]) => <div key={key} className="space-y-2"><Label htmlFor={`account-${key}-password`}>{label}</Label><Input id={`account-${key}-password`} data-testid={`account-${key}-password`} type={show ? 'text' : 'password'} value={value} onChange={e => setter(e.target.value)} required={required} minLength={key === 'new' ? 8 : undefined} autoComplete={key === 'current' ? 'current-password' : 'new-password'} className="bg-white" /></div>)}
      <div className="flex items-center justify-between gap-4"><span className="text-xs text-sand" data-testid="account-password-hint">Password baru minimal 8 karakter.</span><button type="button" onClick={() => setShow(v => !v)} className="inline-flex items-center gap-2 text-xs text-sand hover:text-brand" data-testid="account-show-password">{show ? <EyeOff size={16} /> : <Eye size={16} />}{show ? 'Sembunyikan' : 'Tampilkan'}</button></div>
      {error && <p role="alert" className="text-sm text-red-600 bg-red-50 p-4 rounded-lg" data-testid="account-error">{error}</p>}
      <div className="border-t border-ink/10 pt-6 flex flex-wrap justify-between gap-4 items-center"><span className="text-xs text-sand inline-flex items-center gap-2" data-testid="account-security-note"><ShieldCheck size={16} className="text-sage-700" /> Password saat ini wajib dikonfirmasi</span><button type="submit" disabled={busy} className="btn-brand disabled:opacity-60" data-testid="account-save"><Save size={16} /> {busy ? 'Menyimpan…' : 'Simpan akun'}</button></div>
    </form></div>;
}