import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { ContentTree } from './ContentTree';
const templates = {
  p: { label: 'Paragraf', data: { text: '' } },
  h2: { label: 'Subjudul', data: { text: '' } },
  quote: { label: 'Kutipan', data: { text: '', cite: '' } },
  list: { label: 'Daftar poin', data: { items: [''] } },
  steps: { label: 'Langkah / itinerary', data: { items: [{ title: '', time: '', tag: '', desc: '' }] } },
  gallery: { label: 'Galeri foto', data: { items: [{ src: '', label: '' }] } },
  cards: { label: 'Kartu informasi', data: { items: [{ icon: 'Info', title: '', desc: '' }] } },
};
export const ArticleBlocksEditor = ({ value = [], onChange }) => {
  const [type, setType] = useState('p');
  const move = (i, dir) => { const next = [...value]; [next[i], next[i + dir]] = [next[i + dir], next[i]]; onChange(next); };
  return <div className="space-y-6" data-testid="article-block-editor">
    {value.map((block, i) => <div key={i} className="border-l-2 border-brand/30 pl-4"><div className="flex items-center justify-between gap-3 mb-3"><h4 className="text-xs font-bold text-brand" data-testid={`article-block-title-${i}`}>{i + 1}. {templates[block.type]?.label || block.type}</h4><div className="flex gap-1"><button type="button" disabled={i === 0} aria-label="Naik" data-testid={`article-block-up-${i}`} onClick={() => move(i, -1)} className="p-2 disabled:opacity-30 hover:bg-white"><ArrowUp size={15} /></button><button type="button" disabled={i === value.length - 1} aria-label="Turun" data-testid={`article-block-down-${i}`} onClick={() => move(i, 1)} className="p-2 disabled:opacity-30 hover:bg-white"><ArrowDown size={15} /></button><button type="button" aria-label="Hapus bagian" data-testid={`article-block-remove-${i}`} onClick={() => onChange(value.filter((_, j) => i !== j))} className="p-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button></div></div><ContentTree value={Object.fromEntries(Object.entries(block).filter(([k]) => k !== 'type'))} template={templates[block.type]?.data} path={block.type === 'p' ? `article-p-block-${i}` : `article-block-${i}`} onChange={v => onChange(value.map((b, j) => j === i ? { type: block.type, ...v } : b))} /></div>)}
    <div className="flex flex-wrap items-center gap-3"><select value={type} onChange={e => setType(e.target.value)} className="rounded-lg bg-white border border-input px-3 py-2 text-sm" data-testid="article-new-block-type">{Object.entries(templates).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select><button type="button" onClick={() => onChange([...value, { type, ...structuredClone(templates[type].data) }])} className="inline-flex gap-2 items-center text-brand text-sm font-semibold" data-testid="article-add-block"><Plus size={16} /> Tambah bagian</button></div>
  </div>;
};