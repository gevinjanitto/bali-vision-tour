import React, { useState } from 'react';
import { Save, Loader2, ExternalLink } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ImageUpload } from './ImageUpload';
import { useSettings } from '../context/SettingsContext';
import { errorMessage } from '../lib/api';

const socialFields = [['instagram', 'Instagram', FaInstagram], ['facebook', 'Facebook', FaFacebookF], ['youtube', 'YouTube', FaYoutube], ['tiktok', 'TikTok', FaTiktok]];
const Section = ({ title, desc, children, id }) => <section className="border-b border-ink/10 pb-10 mb-10" data-testid={`settings-section-${id}`}><h2 className="font-display text-xl font-bold text-ink" data-testid={`settings-heading-${id}`}>{title}</h2>{desc && <p className="text-sm text-sand mt-2 mb-6" data-testid={`settings-desc-${id}`}>{desc}</p>}<div className="grid sm:grid-cols-2 gap-5 mt-5">{children}</div></section>;

export default function SettingsPage() {
  const { settings, save } = useSettings();
  const [draft, setDraft] = useState(() => structuredClone(settings));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (group, key, value) => setDraft(d => ({ ...d, [group]: { ...d[group], [key]: value } }));
  const field = (group, key, label, props = {}) => <div key={key} className="space-y-2 min-w-0"><Label htmlFor={`setting-${key}`}>{label}</Label><Input id={`setting-${key}`} data-testid={`settings-${key === 'title' ? 'brand-title' : key}`} value={draft[group][key]} onChange={e => set(group, key, e.target.value)} className="bg-white" {...props} /></div>;
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try { const result = await save({ ...settings, contact: draft.contact, social: draft.social, brand: draft.brand }); setDraft(structuredClone(result)); toast.success('Kontak dan identitas website berhasil disimpan'); }
    catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  };
  return <form onSubmit={submit} className="max-w-5xl" data-testid="settings-form">
    <div className="flex flex-wrap justify-between items-start gap-4 mb-9"><div><p className="eyebrow" data-testid="settings-eyebrow">PENGATURAN WEBSITE</p><h1 className="font-display text-3xl font-bold text-ink mt-2" data-testid="settings-title">Kontak & Identitas</h1><p className="text-sm text-sand mt-2" data-testid="settings-intro">Semua kontak, sosial media, dan logo dalam satu tempat.</p></div><a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline !py-2.5" data-testid="settings-view-site">Lihat website <ExternalLink className="w-4 h-4" /></a></div>
    <Section id="contact" title="Kontak utama" desc="Nomor WhatsApp ini digunakan oleh seluruh tombol chat dan booking di website. Gunakan kode negara, misalnya 62812…; nomor 0812… akan diubah otomatis.">
      {field('contact', 'whatsapp', <span className="inline-flex items-center gap-2"><FaWhatsapp className="text-brand" /> Nomor WhatsApp</span>, { required: true, inputMode: 'tel' })}
      {field('contact', 'email', 'Alamat email', { type: 'email', required: true })}
      {field('contact', 'emailLink', 'Link email (kosong = mailto otomatis)', { placeholder: 'mailto:hello@balivisiontour.com' })}
      {field('contact', 'address', 'Alamat', { required: true })}
      {field('contact', 'addressLink', 'Link alamat / Google Maps (kosong = pencarian otomatis)', { type: 'url', placeholder: 'https://maps.google.com/…' })}
      <div className="space-y-2"><Label htmlFor="setting-whatsappMessage">Pesan awal WhatsApp</Label><Textarea id="setting-whatsappMessage" data-testid="settings-whatsappMessage" className="bg-white" value={draft.contact.whatsappMessage} onChange={e => set('contact', 'whatsappMessage', e.target.value)} /></div>
    </Section>
    <Section id="social" title="Sosial media" desc="Masukkan URL profil lengkap. Ikon tanpa link tetap terlihat, tetapi tidak mengarah ke halaman yang salah.">{socialFields.map(([key, label, Icon]) => field('social', key, <span className="inline-flex items-center gap-2"><Icon className="text-brand" /> {label}</span>, { type: 'url', placeholder: `https://${key}.com/…` }))}</Section>
    <Section id="brand" title="Identitas & logo" desc="Gunakan PNG transparan atau WEBP. Logo ikon: 512 × 512 px. Logo lengkap: 800 × 240 px. Maksimal 8 MB per gambar.">
      {field('brand', 'name', 'Nama website', { required: true })}{field('brand', 'title', 'Nama di samping logo')}{field('brand', 'tagline', 'Tagline logo')}{field('brand', 'legal', 'Nama perusahaan di footer')}
      <div className="space-y-2"><Label htmlFor="logo-mode">Tampilan logo</Label><select id="logo-mode" data-testid="settings-logo-mode" className="w-full h-10 rounded-md border border-input px-3 bg-white text-sm" value={draft.brand.logoMode} onChange={e => set('brand', 'logoMode', e.target.value)}><option value="icon">Ikon + nama & tagline</option><option value="full">Logo lengkap (tanpa teks tambahan)</option></select></div>
      <div className="space-y-2"><Label>Logo utama</Label><ImageUpload value={draft.brand.logo} onChange={v => set('brand', 'logo', v)} testId="settings-logo" recommendation={draft.brand.logoMode === 'full' ? '800 × 240 px · logo lengkap' : '512 × 512 px · logo ikon'} contain /></div>
      <div className="space-y-2"><Label>Logo pada latar gelap (opsional)</Label><ImageUpload value={draft.brand.logoLight} onChange={v => set('brand', 'logoLight', v)} testId="settings-logo-light" recommendation="512 × 512 px atau 800 × 240 px" contain /></div>
      <div className="space-y-2"><Label>Favicon / ikon tab browser</Label><ImageUpload value={draft.brand.favicon} onChange={v => set('brand', 'favicon', v)} testId="settings-favicon" recommendation="64 × 64 px atau 512 × 512 px" contain /></div>
    </Section>
    {error && <p role="alert" className="text-red-600 bg-red-50 p-4 rounded-lg mb-4" data-testid="settings-error">{error}</p>}
    <div className="sticky bottom-0 bg-cream/95 backdrop-blur py-4 border-t border-ink/10 flex justify-end"><button type="submit" disabled={busy} className="btn-brand disabled:opacity-60" data-testid="settings-save">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan pengaturan</button></div>
  </form>;
}