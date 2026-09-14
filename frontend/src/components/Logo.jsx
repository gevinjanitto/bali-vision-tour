import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { mediaUrl } from '../lib/siteContent';

const Logo = ({ light = false, size = 'md', to = '/', testId }) => {
  const { settings } = useSettings();
  const brand = settings?.brand || {};
  const dims = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const title = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';
  return (
    <Link to={to} className="flex items-center gap-2.5 group min-w-0 shrink-0" data-testid={testId || `logo-${light ? 'light' : 'dark'}-${size}`}>
      <img src={mediaUrl((light && brand.logoLight) || brand.logo || '/logo-icon.png')} alt={brand.name} data-testid={`${testId || `logo-${light ? 'light' : 'dark'}-${size}`}-image`} className={`${brand.logoMode === 'full' ? 'w-40 h-12' : dims} object-contain transition-transform duration-300 group-hover:scale-105`} />
      {brand.logoMode !== 'full' && <div className="leading-none">
        <div className={`font-display font-bold ${title} ${light ? 'text-white' : 'text-ink'}`} data-testid={`${testId || size}-brand-title`}>{brand.title}</div>
        <div className={`font-display font-bold tracking-[0.12em] ${size === 'lg' ? 'text-xs' : 'text-[9px]'} ${light ? 'text-white/85' : 'text-brand'}`} data-testid={`${testId || size}-brand-tagline`}>{brand.tagline}</div>
      </div>}
    </Link>
  );
};

export default Logo;
