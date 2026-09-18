export const formatIDR = (n) => {
  if (n === undefined || n === null || n === '') return '-';
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  return 'Rp ' + num.toLocaleString('id-ID');
};

export const slugify = (s = '') =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
