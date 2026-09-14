import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { toast } from 'sonner';

export const Newsletter = ({ variant = 'band', eyebrow = 'Stay Connected', title = 'Make Moments That Last', desc = 'Receive holiday inspiration, secret island spots, and exclusive private tour offers directly to your inbox.', cta = 'Subscribe' }) => {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { toast.error('Please enter a valid email address'); return; }
    setSaving(true);
    try { await api.post('/api/newsletter', { email }); toast.success('Thank you! Your subscription has been saved.'); setEmail(''); }
    catch (err) { toast.error(errorMessage(err, 'Subscription could not be saved. Please try again.')); }
    finally { setSaving(false); }
  };
  const rounded = variant === 'card' ? 'mx-auto max-w-7xl px-6 lg:px-10' : '';
  return (
    <section className={`${rounded} ${variant === 'card' ? 'py-10' : ''}`} data-testid="newsletter">
      <div className={`sunset-band grain ${variant === 'card' ? 'rounded-[28px]' : ''}`}>
        <div className={`relative z-10 ${variant === 'card' ? 'px-8 md:px-12 py-14' : 'mx-auto max-w-7xl px-6 lg:px-10 py-14'} grid md:grid-cols-2 gap-10 items-center`}>
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] font-bold text-gold-100">{eyebrow}</div>
            <h3 className="font-display font-bold text-white text-3xl md:text-4xl mt-2 leading-tight">{title}</h3>
            <p className="text-white/85 mt-3 text-[15px] max-w-lg">{desc}</p>
          </div>
          <form onSubmit={submit} className="flex items-center bg-white rounded-full p-1.5 shadow-card max-w-xl md:ml-auto w-full">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email address" className="flex-1 min-w-0 bg-transparent px-5 py-3 text-sm outline-none text-ink placeholder:text-ink/40" data-testid="newsletter-email" />
            <button type="submit" disabled={saving} className="btn-brand !py-3 !px-6 disabled:opacity-60" data-testid="newsletter-submit">{saving ? '…' : cta}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export { SiteFooter as Footer } from './SiteFooter';

export const PageHero = ({ image, eyebrow, eyebrowIcon, title, titleAccent, desc, children }) => (
  <section className="page-hero" style={{ '--hero-img': `url(${image})` }} data-testid="page-hero">
    <style>{`.page-hero::before{background-image:var(--hero-img)}`}</style>
    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-10 md:pt-14 pb-10">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-[10px] font-bold tracking-[0.16em] uppercase text-brand shadow-soft">
          {eyebrowIcon}{eyebrow}
        </div>
      )}
      <h1 className="font-display font-bold text-ink text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.08] tracking-tight mt-5 max-w-3xl">
        {title} {titleAccent && <span className="font-serif italic font-medium text-brand">{titleAccent}</span>}
      </h1>
      {desc && <p className="mt-5 text-sand text-base md:text-[17px] leading-relaxed max-w-2xl">{desc}</p>}
      {children}
    </div>
  </section>
);

export const ArrowLink = ({ to, children, className = '' }) => (
  <Link to={to} className={`inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all duration-200 ${className}`}>
    {children} <ArrowRight className="w-4 h-4" />
  </Link>
);
