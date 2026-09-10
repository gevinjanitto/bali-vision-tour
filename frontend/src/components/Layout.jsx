import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ThumbsUp, Youtube, Music2, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { COMPANY } from '../mock/common';
import { toast } from 'sonner';

export const Newsletter = ({ variant = 'band', eyebrow = 'Stay Connected', title = 'Make Moments That Last', desc = 'Receive holiday inspiration, secret island spots, and exclusive private tour offers directly to your inbox.', cta = 'Subscribe' }) => {
  const [email, setEmail] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { toast.error('Please enter a valid email address'); return; }
    toast.success('Thank you! You are now subscribed to our island dispatch.');
    setEmail('');
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
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-5 py-3 text-sm outline-none text-ink placeholder:text-ink/40" data-testid="newsletter-email" />
            <button type="submit" className="btn-brand !py-3 !px-6" data-testid="newsletter-submit">{cta}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="footer-band grain text-white" data-testid="footer">
    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-8">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Logo light size="lg" />
          <p className="mt-6 text-white/75 text-sm leading-relaxed max-w-sm">Premier provider of handpicked tour packages, cultural experiences, and trusted transportation for your bespoke journey in Bali.</p>
          <div className="flex items-center gap-3 mt-6">
            {[Instagram, ThumbsUp, Youtube, Music2].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand flex items-center justify-center transition-colors duration-200"><I className="w-4 h-4" /></a>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 md:col-start-6">
          <div className="text-[11px] tracking-[0.16em] font-bold uppercase mb-5">Menu</div>
          <ul className="space-y-2.5 text-sm text-white/75">
            {[['Home', '/'], ['Tour Packages', '/tour-packages'], ['Car Rental', '/car-rental'], ['Activities', '/activities'], ['About Us', '/about'], ['Journal & Guides', '/articles']].map(([l, to]) => (
              <li key={l}><Link to={to} className="hover:text-white transition-colors duration-200">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <div className="text-[11px] tracking-[0.16em] font-bold uppercase mb-5">Services &amp; Policies</div>
          <ul className="space-y-2.5 text-sm text-white/75">
            {['Curated Itineraries', 'Private Villas & Escapes', 'Custom Experiences', 'Sustainable Travel', 'Privacy Policy', 'Terms of Service'].map((l) => (
              <li key={l}><a href="#" className="hover:text-white transition-colors duration-200">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <div className="text-[11px] tracking-[0.16em] font-bold uppercase mb-5">Contact Us</div>
          <div className="text-sm font-semibold">{COMPANY.legal}</div>
          <ul className="space-y-2.5 text-sm text-white/75 mt-3">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand" /> {COMPANY.phone}</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand" /> {COMPANY.email}</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand" /> {COMPANY.address}</li>
          </ul>
        </div>
      </div>
      <div className="mt-14 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <div>&copy; 2026 Bali Vision Tour. All rights reserved. <Link to="/admin/login" className="ml-2 hover:text-white/90 transition-colors" data-testid="footer-admin-link">Admin</Link></div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="mr-1">Secure Payment Guaranteed:</span>
          {['BCA', 'MANDIRI', 'VISA', 'MASTERCARD'].map((p) => (
            <span key={p} className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white/85">{p}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

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
