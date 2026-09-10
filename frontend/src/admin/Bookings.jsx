import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Trash2, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { useData } from '../context/DataContext';
import { PageHeader, StatusBadge, EmptyState } from './ui';
import { formatIDR } from '../lib/format';
import { errorMessage } from '../lib/api';

const STATUSES = ['new', 'contacted', 'confirmed', 'cancelled'];

const Bookings = () => {
  const { bookings } = useData();
  const list = bookings.list();
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const load = () => { setLoading(true); bookings.load().catch(() => toast.error('Failed to load bookings')).finally(() => setLoading(false)); };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => list.filter((b) => (status === 'all' || b.status === status) && (!q || `${b.name} ${b.phone} ${b.itemName}`.toLowerCase().includes(q.toLowerCase()))), [list, q, status]);

  const change = async (id, s) => {
    try { await bookings.setStatus(id, s); toast.success('Status updated'); } catch (e) { toast.error(errorMessage(e)); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this booking request?')) return;
    try { await bookings.remove(id); toast.success('Booking deleted'); } catch (e) { toast.error(errorMessage(e)); }
  };
  const wa = (b) => `https://wa.me/${b.phone.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${b.name}, terima kasih sudah menghubungi Bali Vision Tour mengenai ${b.itemName}${b.date ? ` (${b.date})` : ''}. `)}`;

  return (
    <div data-testid="admin-bookings-page">
      <PageHeader title="Booking Requests" desc="Requests submitted through the website before guests are redirected to WhatsApp.">
        <div className="relative"><Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guest, phone, item..." className="pl-9 h-10 w-56 rounded-xl bg-white" data-testid="bookings-search" /></div>
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="h-10 w-40 rounded-xl bg-white" data-testid="bookings-status-filter"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <button onClick={load} className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center text-ink/60 hover:text-brand" aria-label="Refresh" data-testid="bookings-refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
      </PageHeader>
      {!loading && filtered.length === 0 ? (
        <EmptyState title="No booking requests" desc="When a guest fills the quick booking form on the website, it appears here." />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="bookings-table">
              <thead className="text-[11px] uppercase tracking-wider text-sand bg-cream/60"><tr className="text-left"><th className="px-5 py-3 font-bold">Guest</th><th className="px-5 py-3 font-bold">Request</th><th className="px-5 py-3 font-bold">Date &amp; Pax</th><th className="px-5 py-3 font-bold">Total</th><th className="px-5 py-3 font-bold">Status</th><th className="px-5 py-3 font-bold text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-cream/50 align-top" data-testid={`booking-row-${b.id}`}>
                    <td className="px-5 py-3"><div className="font-semibold text-ink">{b.name}</div><div className="text-xs text-sand">{b.phone}</div><div className="text-[10px] text-sand mt-1">{new Date(b.createdAt).toLocaleString('en-GB')}</div></td>
                    <td className="px-5 py-3 max-w-xs"><div className="text-ink font-medium">{b.itemName}</div><div className="text-xs text-brand font-semibold">{b.type}</div>{b.option && <div className="text-xs text-sand mt-1 clamp-2">{b.option}</div>}{b.notes && <div className="text-xs text-ink/60 italic mt-1 clamp-2">"{b.notes}"</div>}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-ink/80">{b.date || '-'}<div className="text-xs text-sand">{b.pax ? `${b.pax} pax` : ''}</div></td>
                    <td className="px-5 py-3 whitespace-nowrap font-semibold text-ink">{b.total ? formatIDR(b.total) : '-'}</td>
                    <td className="px-5 py-3">
                      <Select value={b.status} onValueChange={(s) => change(b.id, s)}>
                        <SelectTrigger className="h-8 w-36 rounded-lg bg-cream border-0 text-xs" data-testid={`booking-status-${b.id}`}><StatusBadge status={b.status} /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3"><div className="flex items-center justify-end gap-1"><a href={wa(b)} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg hover:bg-sage text-ink/60 hover:text-sage-700 flex items-center justify-center" aria-label="WhatsApp" data-testid={`booking-wa-${b.id}`}><MessageCircle className="w-4 h-4" /></a><button onClick={() => remove(b.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-ink/60 hover:text-red-600 flex items-center justify-center" aria-label="Delete" data-testid={`booking-delete-${b.id}`}><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
