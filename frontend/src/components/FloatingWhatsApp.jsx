import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';
import { buildWhatsAppUrl } from '../lib/whatsapp';

export const FloatingWhatsApp = () => {
  const { settings } = useSettings();
  if (!settings?.contact.whatsapp) return null;
  return <a href={buildWhatsAppUrl(settings.contact.whatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label="Hubungi Bali Vision Tour melalui WhatsApp" title="Chat WhatsApp" data-testid="floating-whatsapp" className="fixed right-5 bottom-[84px] md:right-7 md:bottom-7 z-40 w-14 h-14 rounded-full bg-brand text-white shadow-card flex items-center justify-center hover:bg-brand-700 hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand/30 transition-[background-color,transform] duration-200"><FaWhatsapp className="w-8 h-8" aria-hidden="true" /></a>;
};