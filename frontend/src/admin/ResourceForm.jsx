import React, { useMemo, useState } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ImageUpload, GalleryEditor } from './ImageUpload';
import { ListEditor } from './ListEditor';
import { RESOURCE_CONFIG, blocksToText, textToBlocks } from './fields';
import { errorMessage } from '../lib/api';
import { ArticleBlocksEditor } from './ArticleBlocksEditor';
import { RichTextEditor } from './RichTextEditor';
import { toHtml } from '../components/RichText';

const RAW_TYPES = new Set(['lines', 'json', 'blocks']);

const toRaw = (type, v) => {
  if (type === 'lines') return (v || []).join('\n');
  if (type === 'json') return JSON.stringify(v ?? [], null, 2);
  if (type === 'blocks') return blocksToText(v || []);
  return '';
};

const Field = ({ field, value, onChange, raw, onRaw }) => {
  const id = `f-${field.key.replace(/\./g, '-')}`;
  const testId = `field-${field.key.replace(/\./g, '-')}`;
  switch (field.type) {
    case 'richblocks': return <ArticleBlocksEditor value={value || []} onChange={onChange} />;
    case 'richtext': return <RichTextEditor value={toHtml(value)} onChange={onChange} testId={testId} />;
    case 'textarea': return <Textarea id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="bg-white min-h-[90px]" data-testid={testId} />;
    case 'lines': return <Textarea id={id} value={raw} onChange={(e) => onRaw(e.target.value)} className="bg-white min-h-[110px] font-mono text-xs" data-testid={testId} />;
    case 'blocks': return <Textarea id={id} value={raw} onChange={(e) => onRaw(e.target.value)} className="bg-white min-h-[320px] text-sm leading-relaxed" data-testid={testId} />;
    case 'json': return <Textarea id={id} value={raw} onChange={(e) => onRaw(e.target.value)} className="bg-white min-h-[140px] font-mono text-xs" data-testid={testId} />;
    case 'number': return <Input id={id} type="number" step={field.step || 1} value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className="bg-white" data-testid={testId} />;
    case 'date': return <Input id={id} type="date" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="bg-white" data-testid={testId} />;
    case 'switch': return <div className="h-10 flex items-center"><Switch id={id} checked={!!value} onCheckedChange={onChange} data-testid={testId} /></div>;
    case 'select': return (
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger id={id} className="bg-white" data-testid={testId}><SelectValue placeholder="Select..." /></SelectTrigger>
        <SelectContent>{[...(field.options || []), ...(value && !(field.options || []).includes(value) ? [value] : [])].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    );
    case 'image': return <ImageUpload value={value} onChange={onChange} testId={testId} recommendation={field.key.includes('avatar') ? '400 × 400 px · foto profil' : '1200 × 800 px · rasio 3:2'} />;
    case 'gallery': return <GalleryEditor value={value || []} onChange={onChange} />;
    case 'list': return <ListEditor field={field} value={value} onChange={onChange} />;
    default: return <Input id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="bg-white" data-testid={testId} />;
  }
};

export const ResourceForm = ({ resource, item, onSubmit, onCancel }) => {
  const cfg = RESOURCE_CONFIG[resource];
  const allFields = useMemo(() => cfg.sections.flatMap((s) => s.fields), [cfg]);
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify({ ...cfg.defaults, ...(item || {}) })));
  const [raw, setRaw] = useState(() => Object.fromEntries(allFields.filter((f) => RAW_TYPES.has(f.type)).map((f) => [f.key, toRaw(f.type, get(item || cfg.defaults, f.key))])));
  const [saving, setSaving] = useState(false);

  const setValue = (key, v) => setForm((f) => { const next = { ...f }; set(next, key, v); return next; });

  const submit = async (e) => {
    e.preventDefault();
    const payload = JSON.parse(JSON.stringify(form));
    for (const f of allFields) {
      if (f.required && !String(get(payload, f.key) ?? '').trim()) return toast.error(`${f.label} is required`);
      if (f.type === 'lines') set(payload, f.key, raw[f.key].split('\n').map((s) => s.trim()).filter(Boolean));
      if (f.type === 'blocks') set(payload, f.key, textToBlocks(raw[f.key]));
      if (f.type === 'json') {
        try { set(payload, f.key, raw[f.key].trim() ? JSON.parse(raw[f.key]) : []); } catch (err) { return toast.error(`Invalid JSON in "${f.label}"`); }
      }
      if (f.type === 'list') set(payload, f.key, (get(payload, f.key) || []).map((it) => Object.fromEntries(Object.entries(it).map(([k, v]) => [k, Array.isArray(v) ? v.map((s) => String(s).trim()).filter(Boolean) : v]))));
      if (f.type === 'number' && get(payload, f.key) === '') set(payload, f.key, null);
    }
    if (!payload.gallery?.length && payload.image && cfg.sections.some((s) => s.fields.some((x) => x.key === 'gallery'))) payload.gallery = [{ src: payload.image, label: 'Signature Experience' }];
    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      toast.error(errorMessage(err, 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col h-full" data-testid="resource-form">
      <Tabs defaultValue={cfg.sections[0].title} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar bg-cream-100 rounded-xl h-auto p-1">
          {cfg.sections.map((s) => <TabsTrigger key={s.title} value={s.title} className="rounded-lg text-xs data-[state=active]:bg-forest data-[state=active]:text-white" data-testid={`tab-${s.title.toLowerCase().replace(/\s+/g, '-')}`}>{s.title}</TabsTrigger>)}
        </TabsList>
        {cfg.sections.map((s) => (
          <TabsContent key={s.title} value={s.title} forceMount className="flex-1 overflow-y-auto admin-scroll pr-1 mt-4 data-[state=inactive]:hidden">
            <div className="grid sm:grid-cols-2 gap-4">
              {s.fields.map((f) => (
                <div key={f.key} className={`space-y-1.5 ${f.span === 2 ? 'sm:col-span-2' : ''}`}>
                  <Label htmlFor={`f-${f.key.replace(/\./g, '-')}`} className="text-[11px] uppercase tracking-wider font-bold text-ink/70">{f.label}{f.required && <span className="text-brand"> *</span>}</Label>
                  <Field field={f} value={get(form, f.key)} onChange={(v) => setValue(f.key, v)} raw={raw[f.key]} onRaw={(v) => setRaw((r) => ({ ...r, [f.key]: v }))} />
                  {f.hint && <p className="text-[11px] text-sand">{f.hint}</p>}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-ink/8">
        <button type="button" onClick={onCancel} className="btn-outline !py-2.5 !px-5" data-testid="form-cancel">Cancel</button>
        <button type="submit" disabled={saving} className="btn-brand !py-2.5 !px-6 disabled:opacity-60" data-testid="form-submit">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {item ? 'Save changes' : `Create ${cfg.singular}`}</button>
      </div>
    </form>
  );
};

export default ResourceForm;
