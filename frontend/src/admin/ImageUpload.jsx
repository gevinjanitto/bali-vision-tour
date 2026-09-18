import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage, errorMessage } from '../lib/api';
import { Input } from '../components/ui/input';
import { mediaUrl } from '../lib/siteContent';

export const ImageUpload = ({ value, onChange, compact = false, testId = 'image-upload', recommendation = '1200 × 800 px · rasio 3:2', contain = false }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success('Image uploaded');
    } catch (e) {
      toast.error(errorMessage(e, 'Upload failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2" data-testid={testId}>
      <div className="flex gap-3 items-start">
        <div className={`relative shrink-0 rounded-xl overflow-hidden bg-cream-100 border border-ink/10 flex items-center justify-center ${compact ? 'w-16 h-16' : 'w-32 h-24'}`}>
          {value ? <img src={mediaUrl(value)} alt="Pratinjau gambar" data-testid={`${testId}-preview`} className={`w-full h-full ${contain ? 'object-contain' : 'object-cover'}`} /> : <ImageIcon className="w-5 h-5 text-ink/30" />}
          {value && <button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 text-white flex items-center justify-center hover:bg-brand" data-testid={`${testId}-clear`}><X className="w-3 h-3" /></button>}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-brand/50 bg-brand-50/50 text-brand-700 text-xs font-semibold px-3 py-2 hover:bg-brand-50 transition-colors disabled:opacity-60" data-testid={`${testId}-button`}>
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} {busy ? 'Uploading...' : 'Upload image'}
          </button>
          <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="or paste an image URL" className="h-8 text-xs bg-white" data-testid={`${testId}-url`} />
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-sand" data-testid={`${testId}-guidance`}>Rekomendasi: {recommendation}. JPG, PNG, WEBP · maksimal 8 MB per foto · maksimal 40 megapiksel.</p>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} data-testid={`${testId}-input`} />
    </div>
  );
};

export const GalleryEditor = ({ value = [], onChange }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (value.length + files.length > 20) { toast.error('Maksimal 20 foto per galeri'); return; }
    if (files.some(f => f.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(f.type))) { toast.error('Gunakan JPG, PNG, WEBP maksimal 8 MB per foto'); return; }
    setBusy(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      onChange([...value, ...urls.map((src, i) => ({ src, label: (files[i]?.name || 'Photo').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') }))]);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} added to gallery`);
    } catch (e) {
      toast.error(errorMessage(e, 'Upload failed'));
    } finally {
      setBusy(false);
    }
  };
  const update = (i, patch) => onChange(value.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  return (
    <div className="space-y-3" data-testid="gallery-editor">
      <div className="grid sm:grid-cols-2 gap-3">
        {value.map((g, i) => (
          <div key={i} className="flex gap-3 items-center rounded-xl border border-ink/10 bg-white p-2">
            <img src={g.src} alt="" className="w-14 h-14 rounded-lg object-cover bg-cream-100 shrink-0" />
            <div className="flex-1 min-w-0 space-y-2"><Input data-testid={`gallery-caption-${i}`} value={g.label || ''} onChange={(e) => update(i, { label: e.target.value })} placeholder="Caption" className="h-8 text-xs" /><Input data-testid={`gallery-url-${i}`} value={g.src || ''} onChange={(e) => update(i, { src: e.target.value })} placeholder="URL gambar" className="h-8 text-xs" /></div>
            <button type="button" data-testid={`gallery-remove-${i}`} aria-label={`Hapus foto ${i + 1}`} onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="w-7 h-7 rounded-full hover:bg-red-50 text-red-500 flex items-center justify-center shrink-0"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-brand/50 bg-brand-50/50 text-brand-700 text-xs font-semibold px-3 py-2 hover:bg-brand-50 disabled:opacity-60" data-testid="gallery-add-button">
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} {busy ? 'Uploading...' : 'Add gallery images'}
      </button>
      <p className="text-[11px] text-sand" data-testid="gallery-upload-guidance">1200 × 800 px (3:2). JPG, PNG, WEBP · maksimal 8 MB per foto · maksimal 20 foto per galeri.</p>
      <input ref={ref} data-testid="gallery-file-input" type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
    </div>
  );
};
