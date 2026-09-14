// Shared content snapshot. SettingsProvider owns loading, saving and reactivity.
let settings = { texts: {}, blocks: {}, contact: {}, brand: {}, social: {} };
export const BLOCK_DEFAULTS = {};
export const getSiteSnapshot = () => settings;
export const setSiteSnapshot = (next) => { settings = next; };
export const cmsText = (key, fallback) => Object.prototype.hasOwnProperty.call(settings.texts || {}, key) ? settings.texts[key] : fallback;
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