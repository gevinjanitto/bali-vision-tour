import React, { useMemo, useState } from 'react';
import { Save, Search, Loader2, Type, Image, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ContentTree } from './ContentTree';
import { TextSections } from './TextFields';
import { useSettings } from '../context/SettingsContext';
import { BLOCK_DEFAULTS } from '../lib/siteContent';
import { errorMessage } from '../lib/api';
import '../mock/common';
import '../components/SiteFooter';
import '../pages/PolicyPage';

const scopes = { Home: 'Beranda', TourPackages: 'Tour Packages', TourDetail: 'Detail Tour', CarRental: 'Car Rental', CarDetail: 'Detail Kendaraan', Activities: 'Activities', ActivityDetail: 'Detail Aktivitas', About: 'About Us', Articles: 'Articles', ArticleDetail: 'Detail Artikel', PolicyPage: 'Halaman kebijakan', Layout: 'Newsletter & hero', Navbar: 'Navigasi', Cards: 'Kartu daftar', BookingDialog: 'Form booking' };
const blockLabels = { homeStats: 'Beranda · Statistik', homeCategories: 'Beranda · Kategori layanan', destinations: 'Beranda · Destinasi', homeFeatures: 'Beranda · Keunggulan', testimonials: 'Beranda · Testimoni', homeMarquee: 'Beranda · Teks berjalan', about: 'About Us · Statistik, tim & testimoni', airportRates: 'Car Rental · Tarif bandara', carInclusions: 'Car Rental · Fasilitas', activityWhy: 'Activities · Keunggulan', tourPerks: 'Tour Packages · Fasilitas', faqFacts: 'Articles · FAQ', trendingTags: 'Articles · Topik populer', navigation: 'Navigasi website', footer: 'Footer · Deskripsi, menu & pembayaran', policies: 'Halaman kebijakan & syarat' };
const imageLabels = { hero: 'Beranda · Foto hero utama', lempuyang2: 'Tour Packages / About · Pura Lempuyang', batur: 'Activities · Foto hero', bedugul: 'Car Rental · Foto hero / destinasi Bedugul', agung: 'Articles · Foto hero', group: 'About · Foto sejarah perusahaan', riceMist: 'About · Foto keberlanjutan', ubud: 'About / Destinasi · Ubud', suv2: 'About / Kategori layanan · Kendaraan' };
const catalog = globalThis.__BVT_CMS_CATALOG__;

export default function ContentPage() {
  const { settings, save } = useSettings();
  const [texts, setTexts] = useState(() => ({ ...settings.texts }));
  const [blocks, setBlocks] = useState(() => structuredClone({ ...BLOCK_DEFAULTS, ...settings.blocks }));
  const [scope, setScope] = useState('Home');
  const [block, setBlock] = useState('homeStats');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const visible = useMemo(() => catalog.filter(f => f.scope === scope && `${f.default} ${texts[f.key] || ''}`.toLowerCase().includes(q.toLowerCase())), [scope, q, texts]);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    const { company, ...contentBlocks } = blocks;
    try { await save({ ...settings, texts, blocks: contentBlocks }); toast.success('Konten website berhasil disimpan'); }
    catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };
  return <form onSubmit={submit} className="max-w-5xl" data-testid="content-editor-form"><p className="eyebrow" data-testid="content-eyebrow">KONTEN WEBSITE</p><h1 className="font-display text-3xl font-bold text-ink mt-2" data-testid="content-title">Isi Halaman</h1><p className="text-sm text-sand mt-3 mb-8" data-testid="content-description">Teks, foto, dan bagian pendukung website. Data paket, kendaraan, aktivitas, dan artikel tersedia di menu masing-masing.</p>
    <Tabs defaultValue="texts"><TabsList className="bg-white border border-ink/10 h-auto flex flex-wrap justify-start p-1 gap-1"><TabsTrigger value="texts" data-testid="content-tab-texts"><Type size={16} className="mr-2" /> Teks halaman</TabsTrigger><TabsTrigger value="blocks" data-testid="content-tab-blocks"><Layers size={16} className="mr-2" /> Bagian & daftar</TabsTrigger><TabsTrigger value="images" data-testid="content-tab-images"><Image size={16} className="mr-2" /> Foto website</TabsTrigger></TabsList>
      <TabsContent value="texts" className="mt-7"><div className="grid sm:grid-cols-2 gap-4 mb-7"><div><label htmlFor="content-page-select" className="text-xs text-sand font-semibold">Pilih halaman</label><select id="content-page-select" data-testid="content-page-select" className="mt-2 w-full h-11 rounded-lg bg-white border border-ink/10 px-3" value={scope} onChange={e => { setScope(e.target.value); setQ(''); }}>{Object.entries(scopes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div><div><label htmlFor="content-search" className="text-xs text-sand font-semibold">Cari teks</label><div className="relative mt-2"><Search size={16} className="absolute left-3 top-3.5 text-sand" /><Input id="content-search" data-testid="content-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Cari judul, deskripsi, atau teks tombol…" className="bg-white h-11 pl-10" /></div></div></div>
        <p className="text-xs text-sand mb-5" data-testid="content-field-count">{visible.length} teks di {scopes[scope] || scope}, dikelompokkan per bagian halaman dari atas ke bawah.</p>
        <TextSections fields={visible} texts={texts} setTexts={setTexts} />
      </TabsContent>
      <TabsContent value="blocks" className="mt-7"><label htmlFor="content-block-select" className="text-xs text-sand font-semibold">Pilih bagian</label><select id="content-block-select" data-testid="content-block-select" className="mt-2 mb-7 w-full h-11 rounded-lg bg-white border border-ink/10 px-3" value={block} onChange={e => setBlock(e.target.value)}>{Object.entries(blockLabels).filter(([key]) => blocks[key] !== undefined).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><ContentTree key={block} path={block} value={blocks[block]} template={BLOCK_DEFAULTS[block]} onChange={v => setBlocks(prev => ({ ...prev, [block]: v }))} /></TabsContent>
      <TabsContent value="images" className="mt-7"><p className="text-sm text-sand mb-6" data-testid="content-image-guidelines">Hero: 1920 × 1080 px. Foto konten: 1200 × 800 px. Potret tim: 800 × 1000 px. Maksimal 8 MB per gambar (JPG, PNG, WEBP).</p><div className="grid md:grid-cols-2 gap-x-8 gap-y-7">{Object.entries(blocks.images || {}).map(([key, value]) => <div key={key} className="space-y-3 border-b border-ink/10 pb-6 min-w-0"><h3 className="text-sm font-semibold" data-testid={`content-image-title-${key}`}>{imageLabels[key] || `Foto · ${key}`}</h3><ContentTree image path={`images.${key}`} value={value} recommendation={key.startsWith('av') ? '400 × 400 px' : key.startsWith('staff') ? '800 × 1000 px' : ['hero', 'lempuyang2', 'batur', 'bedugul', 'agung'].includes(key) ? '1920 × 1080 px · rasio 16:9' : '1200 × 800 px · rasio 3:2'} onChange={v => setBlocks(prev => ({ ...prev, images: { ...prev.images, [key]: v } }))} /></div>)}</div></TabsContent>
    </Tabs>
    {error && <p role="alert" className="text-red-600 bg-red-50 p-4 rounded-lg mt-5" data-testid="content-error">{error}</p>}
    <div className="sticky bottom-0 bg-cream/95 backdrop-blur py-4 border-t border-ink/10 flex justify-end mt-8"><button type="submit" disabled={busy} className="btn-brand disabled:opacity-60" data-testid="content-save">{busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Simpan konten</button></div>
  </form>;
}