import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import Icon from '../components/Icon';

export const ICON_OPTIONS = ['Star', 'Users', 'UserRound', 'Car', 'Luggage', 'UtensilsCrossed', 'Footprints', 'Waves', 'Ticket', 'Sun', 'Sunrise', 'Moon', 'Landmark', 'Droplets', 'BedDouble', 'Banknote', 'BadgeDollarSign', 'Ship', 'ShieldCheck', 'Shield', 'Leaf', 'TreePine', 'Mountain', 'Map', 'Route', 'Headphones', 'Zap', 'MoveVertical', 'Bike', 'Armchair', 'Activity', 'Wind', 'Thermometer', 'SprayCan', 'Snowflake', 'Smile', 'Shirt', 'Plug', 'Package', 'LifeBuoy', 'Camera', 'Clock', 'Heart', 'Sparkles', 'Coffee', 'Wifi', 'Umbrella', 'Compass', 'Flag', 'Gift'];

const SubField = ({ sf, value, onChange, testId }) => {
  switch (sf.type) {
    case 'textarea': return <Textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="bg-white min-h-[64px] text-sm" placeholder={sf.placeholder} data-testid={testId} />;
    case 'lines': return <Textarea value={(value || []).join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} className="bg-white min-h-[72px] text-sm" placeholder={sf.placeholder || 'Satu item per baris'} data-testid={testId} />;
    case 'number': return <Input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className="bg-white" placeholder={sf.placeholder} data-testid={testId} />;
    case 'icon': return (
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className="bg-white" data-testid={testId}><SelectValue placeholder="Pilih ikon" /></SelectTrigger>
        <SelectContent className="max-h-64">{ICON_OPTIONS.map((o) => <SelectItem key={o} value={o}><span className="inline-flex items-center gap-2"><Icon name={o} className="w-4 h-4 text-brand" /> {o}</span></SelectItem>)}</SelectContent>
      </Select>
    );
    case 'select': return (
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className="bg-white" data-testid={testId}><SelectValue placeholder="Pilih..." /></SelectTrigger>
        <SelectContent>{sf.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    );
    default: return <Input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="bg-white" placeholder={sf.placeholder} data-testid={testId} />;
  }
};

export const ListEditor = ({ field, value = [], onChange }) => {
  const items = Array.isArray(value) ? value : [];
  const update = (i, key, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...items, Object.fromEntries(field.schema.map((sf) => [sf.key, sf.type === 'lines' ? [] : sf.default ?? '']))]);
  const testBase = `list-${field.key}`;
  return (
    <div className="space-y-3" data-testid={testBase}>
      {items.length === 0 && <div className="rounded-xl border border-dashed border-ink/15 bg-white/60 px-4 py-5 text-center text-xs text-sand">Belum ada {field.itemLabel.toLowerCase()}. Klik tombol di bawah untuk menambahkan.</div>}
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm" data-testid={`${testBase}-item-${i}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand">{field.itemLabel} {i + 1}</div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="w-7 h-7 rounded-lg hover:bg-cream-100 text-ink/50 disabled:opacity-30 flex items-center justify-center" aria-label="Naik"><ChevronUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="w-7 h-7 rounded-lg hover:bg-cream-100 text-ink/50 disabled:opacity-30 flex items-center justify-center" aria-label="Turun"><ChevronDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="w-7 h-7 rounded-lg hover:bg-red-50 text-ink/50 hover:text-red-600 flex items-center justify-center" aria-label="Hapus" data-testid={`${testBase}-remove-${i}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {field.schema.map((sf) => (
              <div key={sf.key} className={`space-y-1 ${sf.span === 2 || sf.type === 'textarea' || sf.type === 'lines' ? 'sm:col-span-2' : ''}`}>
                <label className="text-[10px] uppercase tracking-wider font-bold text-ink/60">{sf.label}</label>
                <SubField sf={sf} value={it[sf.key]} onChange={(v) => update(i, sf.key, v)} testId={`${testBase}-${i}-${sf.key}`} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-brand/50 bg-brand-50/50 text-brand-700 text-xs font-semibold px-3 py-2 hover:bg-brand-50" data-testid={`${testBase}-add`}><Plus className="w-3.5 h-3.5" /> Tambah {field.itemLabel}</button>
    </div>
  );
};

export default ListEditor;
