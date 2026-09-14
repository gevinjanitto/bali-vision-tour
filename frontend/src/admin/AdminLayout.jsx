import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Car, Compass, Newspaper, Inbox, LogOut, ExternalLink, Menu, X, Settings, FilePenLine, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import Logo from '../components/Logo';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/tours', label: 'Tour Packages', icon: Map },
  { to: '/admin/cars', label: 'Car Rental', icon: Car },
  { to: '/admin/activities', label: 'Activities', icon: Compass },
  { to: '/admin/articles', label: 'Articles', icon: Newspaper },
  { to: '/admin/bookings', label: 'Booking Requests', icon: Inbox },
  { to: '/admin/settings', label: 'Kontak & Identitas', icon: Settings },
  { to: '/admin/content', label: 'Isi Halaman', icon: FilePenLine },
  { to: '/admin/account', label: 'Akun Admin', icon: ShieldCheck },
];

const Sidebar = ({ onNavigate }) => {
  const { auth } = useData();
  return (
    <div className="h-full flex flex-col bg-forest text-white relative overflow-y-auto">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 px-6 h-[72px] border-b border-white/10">
        <Logo light size="sm" testId="admin-logo" />
      </div>
      <nav className="relative z-10 flex-1 px-4 py-6 space-y-1" data-testid="admin-sidebar">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate} data-testid={`admin-nav-${n.label.toLowerCase().replace(/\s+/g, '-')}`} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-brand text-white shadow-glow' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <n.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="relative z-10 px-4 pb-6 space-y-2">
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors" data-testid="admin-view-site"><ExternalLink className="w-4 h-4" /> View website</Link>
        <div className="rounded-2xl bg-white/10 p-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-gold text-forest font-bold flex items-center justify-center text-sm">{(auth.user?.name || 'A')[0]}</span>
          <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{auth.user?.name || 'Administrator'}</div><div className="text-[11px] text-white/60">@{auth.user?.username || 'admin'}</div></div>
          <button onClick={auth.logout} className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label="Logout" data-testid="logout-button"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label || 'Dashboard';
  return (
    <div className="min-h-screen bg-cream flex" data-testid="admin-layout">
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen"><Sidebar /></aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 h-full shadow-2xl"><Sidebar onNavigate={() => setOpen(false)} /></div>
          <button className="flex-1 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close menu" />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 h-[72px] bg-cream/85 backdrop-blur-md border-b border-ink/5 flex items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen((o) => !o)} className="lg:hidden w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center" aria-label="Menu" data-testid="admin-menu-toggle">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            <div><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-brand">Bali Vision Tour</div><div className="font-display font-bold text-ink">{current}</div></div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-sand"><span className="w-2 h-2 rounded-full bg-sage-700 pulse-dot" /> Live &bull; {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </header>
        <main className="flex-1 p-5 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
