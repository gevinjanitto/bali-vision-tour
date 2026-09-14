import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useData } from '../context/DataContext';
import IMG from '../mock/images';
import Logo from '../components/Logo';

const AdminLogin = () => {
  const { auth } = useData();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (auth.isAuthed) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await auth.login(username.trim(), password);
    setLoading(false);
    if (res.ok) navigate('/admin', { replace: true });
    else setError(res.error);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream" data-testid="admin-login-page">
      <div className="relative hidden lg:block overflow-hidden">
        <img src={IMG.hero} alt="Bali" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/30" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors w-fit" data-testid="login-back-home"><ArrowLeft className="w-4 h-4" /> Back to website</Link>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold">Bali Vision Tour &bull; Control Room</div>
            <h2 className="font-display font-bold text-4xl xl:text-5xl leading-[1.05] mt-4 max-w-md">Curate every journey from one place.</h2>
            <p className="text-white/75 mt-4 max-w-sm text-sm leading-relaxed">Manage tour packages, fleet, activities, journal articles and incoming WhatsApp booking requests.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">
          <div className="flex items-center gap-3">
            <Logo testId="admin-login-logo" />
          </div>
          <h1 className="font-display font-bold text-ink text-3xl mt-10">Welcome back</h1>
          <p className="text-sand text-sm mt-2">Sign in with your administrator credentials.</p>
          <form onSubmit={submit} className="mt-8 space-y-5" data-testid="admin-login-form">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-[11px] uppercase tracking-wider font-bold text-ink/70">Username</Label>
              <div className="relative"><User className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" /><Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="h-12 pl-10 rounded-xl bg-white" placeholder="admin" data-testid="login-username-input" /></div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[11px] uppercase tracking-wider font-bold text-ink/70">Password</Label>
              <div className="relative"><Lock className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" /><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="h-12 pl-10 rounded-xl bg-white" placeholder="••••••" data-testid="login-password-input" /></div>
            </div>
            {error && <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3" data-testid="login-error">{error}</div>}
            <button type="submit" disabled={loading} className="btn-brand w-full !py-3.5 !rounded-xl disabled:opacity-60" data-testid="login-submit-button">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
