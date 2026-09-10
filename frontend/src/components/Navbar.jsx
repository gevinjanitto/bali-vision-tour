import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MessageSquareText, Home, Map, Car, Compass, Newspaper } from 'lucide-react';
import Logo from './Logo';
import { NAV_LINKS } from '../mock/common';
import { openWhatsApp } from '../lib/whatsapp';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-cream/85 backdrop-blur-md border-b border-ink/5 shadow-soft' : 'bg-cream/70 backdrop-blur'}`} data-testid="navbar">
      {/* Desktop */}
      <div className="hidden md:flex mx-auto max-w-7xl items-center justify-between px-6 lg:px-10 h-[72px]">
        <Logo />
        <nav className="flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `relative text-[14px] font-medium transition-colors duration-200 pb-1 ${isActive ? 'text-brand after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-brand after:rounded-full' : 'text-ink/80 hover:text-brand'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => openWhatsApp('Halo Bali Vision Tour! Saya ingin bertanya tentang paket & layanan Anda.')} className="btn-brand !py-2.5 !px-5" data-testid="nav-book-now">
          <MessageSquareText className="w-4 h-4" /> Book Now
        </button>
      </div>
      {/* Mobile: centered logo only */}
      <div className="md:hidden flex items-center justify-center h-16">
        <Logo size="sm" />
      </div>
    </header>
  );
};

const MOBILE_LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Tours', to: '/tour-packages', icon: Map },
  { label: 'Cars', to: '/car-rental', icon: Car },
  { label: 'Activities', to: '/activities', icon: Compass },
  { label: 'Articles', to: '/articles', icon: Newspaper },
];

export const MobileNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-ink/8 shadow-[0_-8px_30px_-12px_rgba(30,45,39,0.18)]" data-testid="mobile-nav">
      <div className="grid grid-cols-5 h-[66px] pb-[env(safe-area-inset-bottom)]">
        {MOBILE_LINKS.map((l) => {
          const active = l.to === '/' ? pathname === '/' : pathname.startsWith(l.to);
          return (
            <Link key={l.to} to={l.to} className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold" data-testid={`mobile-nav-${l.label.toLowerCase()}`}>
              <span className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors duration-200 ${active ? 'bg-brand-50 text-brand' : 'text-ink/55'}`}>
                <l.icon className="w-[18px] h-[18px]" />
              </span>
              <span className={active ? 'text-brand' : 'text-ink/60'}>{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
