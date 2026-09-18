import React from 'react';
import { Star } from 'lucide-react';

export const Stars = ({ value = 5, className = 'w-3.5 h-3.5' }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${className} ${i < Math.round(value) ? 'fill-gold text-gold' : 'text-ink/15'}`} />
    ))}
  </div>
);

const tones = {
  brand: 'bg-brand text-white',
  'brand-soft': 'bg-brand-50 text-brand-700',
  forest: 'bg-forest text-white',
  sage: 'bg-sage text-sage-700',
  gold: 'bg-gold text-white',
  sand: 'bg-cream-200 text-sand',
  glass: 'bg-white/20 backdrop-blur text-white border border-white/30',
  white: 'bg-white text-ink',
  dark: 'bg-ink/80 backdrop-blur text-white',
};

export const Pill = ({ tone = 'brand', children, className = '', uppercase = false }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${uppercase ? 'uppercase tracking-[0.12em] text-[10px]' : ''} ${tones[tone] || tones.brand} ${className}`}>
    {children}
  </span>
);

export const SectionHeading = ({ eyebrow, title, desc, align = 'left', className = '', titleClass = '' }) => (
  <div className={`${align === 'center' ? 'text-center mx-auto max-w-2xl' : ''} ${className}`}>
    {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
    <h2 className={`font-display font-bold text-ink text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] tracking-tight ${titleClass}`}>{title}</h2>
    {desc && <p className={`mt-4 text-sand text-[15px] leading-relaxed ${align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl'}`}>{desc}</p>}
  </div>
);

export const Divider = () => <div className="h-px w-full bg-ink/8" />;
