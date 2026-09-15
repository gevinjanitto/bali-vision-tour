// Shared content snapshot. SettingsProvider owns loading, saving and reactivity.
import { Fragment, cloneElement, createElement, isValidElement } from 'react';
let settings = { texts: {}, blocks: {}, contact: {}, brand: {}, social: {} };
export const BLOCK_DEFAULTS = {};
export const getSiteSnapshot = () => settings;
export const setSiteSnapshot = (next) => { settings = next; };
export const cmsText = (key, fallback) => Object.prototype.hasOwnProperty.call(settings.texts || {}, key) ? settings.texts[key] : fallback;
// "Showing {1} experiences" → text segments interleaved with the original dynamic parts.
export const cmsTemplate = (key, fallback, parts) => cmsText(key, fallback).split(/\{(\d+)\}/).map((seg, i) => {
  const part = i % 2 ? parts[Number(seg) - 1] : seg;
  return isValidElement(part) ? cloneElement(part, { key: i }) : createElement(Fragment, { key: i }, part ?? null);
});
export const mediaUrl = (url = '') => url.startsWith('/api/') ? `${process.env.REACT_APP_BACKEND_URL}${url}` : url;
export const bindContent = (key, defaults) => {
  BLOCK_DEFAULTS[key] = defaults;
  return new Proxy(defaults, {
    get: (target, prop) => {
      let current = settings.blocks?.[key] ?? target;
      if (key === 'company') current = { ...target, ...settings.brand, ...settings.contact };
      const value = current[prop];
      return key === 'images' && typeof value === 'string' ? mediaUrl(value) : value;
    },
  });
};
export const safeLink = (value = '', fallback = '#') => {
  const v = String(value).trim();
  if (v.startsWith('/') && !v.startsWith('//') && !v.includes('\\')) return v;
  if (v.startsWith('#')) return v;
  try { const url = new URL(v); return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) ? v : fallback; } catch { return fallback; }
};