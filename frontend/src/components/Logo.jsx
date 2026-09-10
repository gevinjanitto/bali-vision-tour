import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ light = false, size = 'md', to = '/' }) => {
  const dims = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const title = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';
  return (
    <Link to={to} className="flex items-center gap-2.5 group" data-testid="logo-link">
      <img src="/logo-icon.png" alt="Bali Vision Tour" className={`${dims} rounded-full transition-transform duration-500 group-hover:rotate-[-8deg]`} />
      <div className="leading-none">
        <div className={`font-display font-bold ${title} ${light ? 'text-white' : 'text-ink'}`}>Bali Vision</div>
        <div className={`font-display font-bold tracking-[0.12em] ${size === 'lg' ? 'text-xs' : 'text-[9px]'} ${light ? 'text-white/85' : 'text-brand'}`}>TOUR &amp; TRAVEL</div>
      </div>
    </Link>
  );
};

export default Logo;
