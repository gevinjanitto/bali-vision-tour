import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { ImageUpload } from './ImageUpload';

const labels = { title: 'Judul', name: 'Nama', desc: 'Deskripsi', description: 'Deskripsi', body: 'Isi halaman', text: 'Teks', label: 'Label', image: 'Foto', avatar: 'Foto profil', src: 'Foto', url: 'Link tujuan', to: 'Link tujuan', value: 'Nilai', sub: 'Keterangan', role: 'Jabatan', location: 'Lokasi', meta: 'Keterangan', tag: 'Label kecil', cta: 'Teks tombol', index: 'Nomor urut', icon: 'Ikon', tone: 'Warna', tagStyle: 'Gaya label', route: 'Rute', price: 'Harga (IDR)', initials: 'Inisial', suffix: 'Akhiran', link: 'Teks keterangan', stats: 'Statistik', pillars: 'Prinsip perusahaan', team: 'Tim', sustainability: 'Keberlanjutan', voices: 'Testimoni', services: 'Tautan layanan & kebijakan', payments: 'Metode pembayaran', descriptionTitle: 'Judul deskripsi', menuTitle: 'Judul menu', contactTitle: 'Judul kontak', servicesTitle: 'Judul layanan', paymentTitle: 'Judul pembayaran', privacy: 'Kebijakan privasi', terms: 'Syarat layanan' };
const imageKeys = /(^|\.)(image|avatar|src|logo|favicon)$/i;
const emptyLike = value => Array.isArray(value) ? [] : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, ['tone', 'icon', 'tagStyle'].includes(k) ? v : emptyLike(v)])) : typeof value === 'number' ? 0 : typeof value === 'boolean' ? false : '';
const idFor = path => `content-${path.replace(/[^a-zA-Z0-9-]/g, '-')}`;

export const ContentTree = ({ value, onChange, path, template, image = false, recommendation }) => {
  const id = idFor(path);
  if (Array.isArray(value)) {
    const move = (i, offset) => { const next = [...value]; [next[i], next[i + offset]] = [next[i + offset], next[i]]; onChange(next); };
    return <div className="space-y-4" data-testid={id}>
      {value.map((entry, i) => <div key={i} className="border-l-2 border-brand/20 pl-4 py-2" data-testid={`${id}-item-${i}`}><div className="flex justify-between items-center mb-4 gap-3"><h4 className="font-semibold text-sm truncate" data-testid={`${id}-item-title-${i}`}>{i + 1}. {entry?.title || entry?.name || entry?.label || 'Item'}</h4><div className="flex gap-1 shrink-0">{[[ArrowUp, -1, 'Naik'], [ArrowDown, 1, 'Turun']].map(([Icon, offset, label]) => <button type="button" key={offset} disabled={i + offset < 0 || i + offset >= value.length} onClick={() => move(i, offset)} className="p-2 rounded-lg hover:bg-white disabled:opacity-30" title={label} aria-label={label} data-testid={`${id}-${i}-${offset === -1 ? 'up' : 'down'}`}><Icon size={15} /></button>)}<button type="button" onClick={() => onChange(value.filter((_, index) => index !== i))} className="p-2 rounded-lg text-red-500 hover:bg-red-50" aria-label="Hapus item" title="Hapus item" data-testid={`${id}-${i}-remove`}><Trash2 size={15} /></button></div></div><ContentTree path={`${path}.${i}`} value={entry} template={template?.[0]} onChange={next => onChange(value.map((v, index) => index === i ? next : v))} /></div>)}
      <button type="button" onClick={() => onChange([...value, emptyLike(value[0] ?? template?.[0] ?? '')])} className="inline-flex gap-2 items-center border border-dashed border-brand/40 text-brand text-sm px-4 py-2 rounded-lg hover:bg-brand-50" data-testid={`${id}-add`}><Plus size={16} /> Tambah item</button>
    </div>;
  }
  if (value && typeof value === 'object') return <div className="grid sm:grid-cols-2 gap-4">{Object.entries(value).map(([key, child]) => <div key={key} className={`space-y-2 min-w-0 ${Array.isArray(child) || (child && typeof child === 'object') || ['text', 'desc', 'description', 'body'].includes(key) ? 'sm:col-span-2' : ''}`}><label htmlFor={idFor(`${path}.${key}`)} className="text-xs font-semibold text-ink/70" data-testid={`${id}-label-${key}`}>{labels[key] || key}</label><ContentTree path={`${path}.${key}`} value={child} template={template?.[key]} onChange={next => onChange({ ...value, [key]: next })} /></div>)}</div>;
  if (image || imageKeys.test(path)) return <ImageUpload value={value} onChange={onChange} testId={id} recommendation={recommendation || (path.includes('avatar') ? '400 × 400 px · foto profil' : '1200 × 800 px · rasio 3:2')} />;
  if (typeof value === 'boolean') return <Switch id={id} data-testid={id} checked={value} onCheckedChange={onChange} />;
  if (typeof value === 'number') return <Input id={id} data-testid={id} type="number" className="bg-white" value={value} onChange={e => onChange(Number(e.target.value))} />;
  if (String(value || '').length > 90 || /\.(desc|description|text|body)$/.test(path)) return <Textarea id={id} data-testid={id} className="bg-white min-h-[100px]" value={value || ''} onChange={e => onChange(e.target.value)} />;
  return <Input id={id} data-testid={id} className="bg-white" value={value ?? ''} onChange={e => onChange(e.target.value)} />;
};