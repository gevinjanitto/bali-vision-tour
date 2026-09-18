import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Mail, MapPin } from 'lucide-react';
import Logo from './Logo';
import { NAV_LINKS } from '../mock/common';
import { useSettings } from '../context/SettingsContext';
import { bindContent, safeLink } from '../lib/siteContent';
import { buildWhatsAppUrl } from '../lib/whatsapp';

export const FOOTER_CONTENT = bindContent('footer', {
  description: 'Premier provider of handpicked tour packages, cultural experiences, and trusted transportation for your bespoke journey in Bali.',
  menuTitle: 'Menu', servicesTitle: 'Services & Policies', contactTitle: 'Contact Us', paymentTitle: 'Secure Payment Guaranteed:',
  services: [
    { label: 'Curated Itineraries', url: '/tour-packages' },
    { label: 'Private Villas & Escapes', url: '/tour-packages' },
    { label: 'Custom Experiences', url: '/activities' },
    { label: 'Sustainable Travel', url: '/about' },
    { label: 'Privacy Policy', url: '/policies/privacy' },
    { label: 'Terms of Service', url: '/policies/terms' },
  ],
  payments: ['BCA', 'MANDIRI', 'VISA', 'MASTERCARD'],
});
const socials = [['instagram', FaInstagram, 'Instagram'], ['facebook', FaFacebookF, 'Facebook'], ['youtube', FaYoutube, 'YouTube'], ['tiktok', FaTiktok, 'TikTok']];
export const SiteFooter = () => {
  const { settings } = useSettings();
  if (!settings) return null;
  const { contact, brand, social } = settings;
  const contacts = [
    ['whatsapp', FaWhatsapp, `+${contact.whatsapp}`, buildWhatsAppUrl()],
    ['email', Mail, contact.email, contact.emailLink || `mailto:${contact.email}`],
    ['address', MapPin, contact.address, contact.addressLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`],
  ];
  return <footer className="footer-band grain text-white" data-testid="footer">
    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4"><Logo light size="lg" testId="footer-logo" />
          <p className="mt-6 text-white/75 text-sm leading-relaxed max-w-sm" data-testid="footer-description">{FOOTER_CONTENT.description}</p>
          <div className="flex items-center gap-3 mt-6">
            {socials.map(([key, Icon, label]) => social[key] ? <a key={key} href={safeLink(social[key])} aria-label={label} title={label} target="_blank" rel="noopener noreferrer" data-testid={`footer-social-${key}`} className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand flex items-center justify-center transition-colors"><Icon className="w-4 h-4" /></a> : <span key={key} aria-label={`${label} belum diatur`} title={`${label} belum diatur`} data-testid={`footer-social-${key}-unset`} className="w-9 h-9 rounded-full bg-white/10 text-white/50 flex items-center justify-center"><Icon className="w-4 h-4" /></span>)}
          </div>
        </div>
        <div className="lg:col-span-2"><h3 className="text-xs tracking-widest font-bold uppercase mb-5" data-testid="footer-menu-title">{FOOTER_CONTENT.menuTitle}</h3><ul className="space-y-2.5 text-sm text-white/75">{NAV_LINKS.map((l, i) => <li key={i}><a href={safeLink(l.to)} data-testid={`footer-menu-${i}`} className="hover:text-white transition-colors">{l.label}</a></li>)}</ul></div>
        <div className="lg:col-span-3"><h3 className="text-xs tracking-widest font-bold uppercase mb-5" data-testid="footer-services-title">{FOOTER_CONTENT.servicesTitle}</h3><ul className="space-y-2.5 text-sm text-white/75">{FOOTER_CONTENT.services.map((l, i) => <li key={i}><a href={safeLink(l.url)} data-testid={`footer-service-${i}`} className="hover:text-white transition-colors">{l.label}</a></li>)}</ul></div>
        <div className="lg:col-span-3 min-w-0"><h3 className="text-xs tracking-widest font-bold uppercase mb-5" data-testid="footer-contact-title">{FOOTER_CONTENT.contactTitle}</h3><p className="text-sm font-semibold" data-testid="footer-legal">{brand.legal}</p>
          <ul className="space-y-3 text-sm text-white/75 mt-4">{contacts.map(([key, Icon, text, url]) => <li key={key}><a href={safeLink(url)} target={key === 'email' ? undefined : '_blank'} rel="noopener noreferrer" data-testid={`footer-contact-${key}`} className="flex items-start gap-2 hover:text-white transition-colors"><Icon className="w-4 h-4 text-brand shrink-0 mt-0.5" /><span className="break-words min-w-0">{text}</span></a></li>)}</ul>
        </div>
      </div>
      <div className="mt-14 pt-6 border-t border-white/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/60">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="footer-bottom-left">
          <p data-testid="footer-copyright">© 2026 Bali Vision Tour. All rights reserved. | Design &amp; Develop <a href="https://www.maiharta.com" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white underline-offset-4 hover:underline" data-testid="footer-maiharta-link">CV Maiharta</a></p>
          <span className="text-white/30" aria-hidden="true">|</span>
          <Link to="/admin/login" className="hover:text-white transition-colors" data-testid="footer-admin-link">Admin</Link>
        </div>
        <div className="flex flex-wrap items-center gap-2"><span data-testid="footer-payment-title">{FOOTER_CONTENT.paymentTitle}</span>{FOOTER_CONTENT.payments.map((p, i) => <span key={i} className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/85" data-testid={`footer-payment-${i}`}>{p}</span>)}</div>
      </div>
    </div>
  </footer>;
};