import React, { useMemo, useState } from 'react';
import get from 'lodash/get';
import { Plus, Search, Pencil, Trash2, Star, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../components/ui/alert-dialog';
import { Input } from '../components/ui/input';
import { useData } from '../context/DataContext';
import { RESOURCE_CONFIG } from './fields';
import { ResourceForm } from './ResourceForm';
import { PageHeader, EmptyState } from './ui';
import { formatIDR, formatDate } from '../lib/format';
import { errorMessage } from '../lib/api';

const PUBLIC_PATH = { tours: '/tour-packages', cars: '/car-rental', activities: '/activities', articles: '/articles' };

const Cell = ({ col, item }) => {
  const v = get(item, col.key);
  if (col.type === 'price') return <span className="font-semibold text-ink">{v ? formatIDR(v) : '-'}</span>;
  if (col.type === 'rating') return <span className="inline-flex items-center gap-1 text-ink"><Star className="w-3.5 h-3.5 fill-gold text-gold" /> {Number(v || 0).toFixed(1)}</span>;
  if (col.type === 'bool') return v ? <span className="text-sage-700 font-semibold text-xs">Yes</span> : <span className="text-sand text-xs">No</span>;
  if (col.key === 'date') return <span className="text-ink/80">{formatDate(v)}</span>;
  return <span className="text-ink/80">{v || '-'}</span>;
};

const ResourcePage = ({ resource }) => {
  const cfg = RESOURCE_CONFIG[resource];
  const data = useData();
  const collection = data[resource];
  const items = collection.list();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => JSON.stringify([i[cfg.titleKey], i.category, i.type, i.region, i.badge]).toLowerCase().includes(s));
  }, [items, q, cfg.titleKey]);

  const startCreate = () => { setEditing(null); setOpen(true); };
  const startEdit = (item) => { setEditing(item); setOpen(true); };

  const submit = async (payload) => {
    if (editing) {
      await collection.update(editing.id, payload);
      toast.success(`${cfg.singular} updated`);
    } else {
      await collection.create(payload);
      toast.success(`${cfg.singular} created`);
    }
    setOpen(false);
  };

  const remove = async () => {
    try {
      await collection.remove(confirm.id);
      toast.success(`${cfg.singular} deleted`);
    } catch (e) {
      toast.error(errorMessage(e, 'Delete failed'));
    }
    setConfirm(null);
  };

  return (
    <div data-testid={`admin-${resource}-page`}>
      <PageHeader title={cfg.title} desc={`${items.length} ${items.length === 1 ? 'item' : 'items'} published on the website.`}>
        <div className="relative"><Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${cfg.title.toLowerCase()}...`} className="pl-9 h-10 w-56 rounded-xl bg-white" data-testid="resource-search" /></div>
        <button onClick={startCreate} className="btn-brand !py-2.5 !px-5 !text-xs" data-testid="resource-add-button"><Plus className="w-4 h-4" /> Add {cfg.singular}</button>
      </PageHeader>

      {filtered.length === 0 ? (
        <EmptyState title={q ? 'No results' : `No ${cfg.title.toLowerCase()} yet`} desc={q ? 'Try another keyword.' : `Create your first ${cfg.singular.toLowerCase()} to publish it on the website.`}>
          {!q && <button onClick={startCreate} className="btn-forest !py-2.5 !px-5 !text-xs"><Plus className="w-4 h-4" /> Add {cfg.singular}</button>}
        </EmptyState>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="resource-table">
              <thead className="text-[11px] uppercase tracking-wider text-sand bg-cream/60">
                <tr className="text-left"><th className="px-5 py-3 font-bold">{cfg.singular}</th>{cfg.columns.map((c) => <th key={c.key} className="px-5 py-3 font-bold whitespace-nowrap">{c.label}</th>)}<th className="px-5 py-3 font-bold text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/50 transition-colors" data-testid={`resource-row-${item.slug}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 min-w-[260px]">
                        <img src={item.image} alt="" className="w-14 h-11 rounded-lg object-cover bg-cream-100 shrink-0" />
                        <div className="min-w-0"><div className="font-semibold text-ink truncate max-w-[320px]">{item[cfg.titleKey]}</div><div className="text-[11px] text-sand truncate">/{item.slug}</div></div>
                      </div>
                    </td>
                    {cfg.columns.map((c) => <td key={c.key} className="px-5 py-3 whitespace-nowrap"><Cell col={c} item={item} /></td>)}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`${PUBLIC_PATH[resource]}/${item.slug}`} target="_blank" className="w-8 h-8 rounded-lg hover:bg-cream-100 text-ink/50 hover:text-ink flex items-center justify-center" aria-label="View" data-testid={`view-${item.slug}`}><ExternalLink className="w-4 h-4" /></Link>
                        <button onClick={() => startEdit(item)} className="w-8 h-8 rounded-lg hover:bg-brand-50 text-ink/60 hover:text-brand flex items-center justify-center" aria-label="Edit" data-testid={`edit-${item.slug}`}><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setConfirm(item)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-ink/60 hover:text-red-600 flex items-center justify-center" aria-label="Delete" data-testid={`delete-${item.slug}`}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-3xl bg-cream flex flex-col p-6 md:p-8 overflow-hidden" data-testid="resource-sheet">
          <SheetHeader className="text-left">
            <div className="eyebrow">{cfg.title}</div>
            <SheetTitle className="font-display text-2xl text-ink">{editing ? `Edit ${cfg.singular}` : `New ${cfg.singular}`}</SheetTitle>
            <SheetDescription className="text-sand">Changes are published to the website instantly after saving.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 mt-4">
            {open && <ResourceForm key={editing?.id || 'new'} resource={resource} item={editing} onSubmit={submit} onCancel={() => setOpen(false)} />}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="rounded-3xl" data-testid="delete-dialog">
          <AlertDialogHeader><AlertDialogTitle className="font-display">Delete this {cfg.singular.toLowerCase()}?</AlertDialogTitle><AlertDialogDescription>"{confirm?.[cfg.titleKey]}" will be removed from the website permanently.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="rounded-full" data-testid="delete-cancel">Cancel</AlertDialogCancel><AlertDialogAction onClick={remove} className="rounded-full bg-red-600 hover:bg-red-700" data-testid="delete-confirm">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResourcePage;
