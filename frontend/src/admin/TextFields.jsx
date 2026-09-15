import React, { useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const roles = {
  heading: ['Judul', 'bg-ink text-white'],
  eyebrow: ['Label kecil', 'bg-brand-50 text-brand'],
  paragraph: ['Paragraf', 'bg-cream-200 text-sand'],
  button: ['Tombol / link', 'bg-forest/10 text-forest'],
  bold: ['Teks tebal', 'bg-ink/10 text-ink'],
  italic: ['Teks miring (font serif)', 'bg-gold/20 text-brand-800'],
  accent: ['Teks aksen (warna brand)', 'bg-brand text-white'],
  placeholder: ['Placeholder kolom', 'bg-cream-200 text-sand'],
  alt: ['Teks alternatif foto', 'bg-cream-200 text-sand'],
  label: ['Label', 'bg-cream-200 text-sand'],
  text: ['Teks', 'bg-cream-200 text-sand'],
};
const hasSlots = (s) => /\{\d+\}/.test(s);

export const TextField = ({ field: f, value, onChange, onReset, index }) => {
  const [label, tone] = roles[f.role] || roles.text;
  const current = value ?? f.default;
  const long = f.default.length > 90 || f.role === 'paragraph';
  const Comp = long ? Textarea : Input;
  return (
    <div className="bg-white rounded-2xl border border-ink/8 p-4 shadow-soft" data-testid={`cms-field-${f.key}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-sand font-semibold shrink-0">{index}.</span>
          <span className={`text-[10px] uppercase tracking-[0.12em] font-bold px-2 py-1 rounded-full ${tone}`} data-testid={`cms-role-${f.key}`}>{label}</span>
          {value !== undefined && <span className="text-[10px] font-semibold text-brand" data-testid={`cms-modified-${f.key}`}>• diubah</span>}
        </div>
        <button type="button" title="Kembalikan teks awal" aria-label="Kembalikan teks awal" onClick={onReset} disabled={value === undefined} className="p-1.5 rounded-lg hover:bg-cream text-sand disabled:opacity-30 shrink-0" data-testid={`cms-reset-${f.key}`}><RotateCcw size={14} /></button>
      </div>
      <Comp id={`cms-${f.key}`} data-testid={`cms-input-${f.key}`} value={current} onChange={(e) => onChange(e.target.value)} className={`bg-cream/60 ${long ? 'min-h-[96px]' : ''} ${f.role === 'heading' ? 'font-display font-bold text-base' : ''} ${f.role === 'italic' ? 'italic font-serif' : ''}`} />
      {hasSlots(f.default) && <p className="text-[11px] text-sand mt-2 leading-relaxed" data-testid={`cms-hint-${f.key}`}>Kode <code className="bg-cream px-1 rounded">{'{1}'}</code>, <code className="bg-cream px-1 rounded">{'{2}'}</code>… adalah bagian otomatis (angka, ikon, atau teks berformat khusus yang bisa diubah di kolom berikutnya). Biarkan kode itu tetap ada, cukup ubah kalimat di sekitarnya.</p>}
    </div>
  );
};

export const TextSections = ({ fields, texts, setTexts }) => {
  const groups = useMemo(() => {
    const map = new Map();
    fields.forEach((f) => { if (!map.has(f.section)) map.set(f.section, { label: f.sectionLabel, items: [] }); map.get(f.section).items.push(f); });
    return [...map.entries()];
  }, [fields]);
  let n = 0;
  return (
    <div className="space-y-8" data-testid="cms-sections">
      {groups.map(([section, g]) => (
        <section key={section} className="space-y-3" data-testid={`cms-section-${section}`}>
          <div className="flex items-center gap-3 pt-2"><span className="eyebrow">{section ? `Bagian ${section}` : 'Umum'}</span><span className="h-px flex-1 bg-ink/10" /><span className="text-xs text-sand">{g.items.length} teks</span></div>
          {g.label && <h3 className="font-display font-bold text-ink text-lg leading-tight" data-testid={`cms-section-title-${section}`}>{g.label}</h3>}
          {g.items.map((f) => <TextField key={f.key} field={f} index={++n} value={texts[f.key]} onChange={(v) => setTexts((prev) => ({ ...prev, [f.key]: v }))} onReset={() => setTexts((prev) => { const next = { ...prev }; delete next[f.key]; return next; })} />)}
        </section>
      ))}
    </div>
  );
};
