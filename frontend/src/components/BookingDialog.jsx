import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarDays, Minus, Plus, MessageCircle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { buildBookingMessage, openWhatsApp } from '../lib/whatsapp';
import { formatIDR } from '../lib/format';
import { useData } from '../context/DataContext';

// Short booking form -> saves booking request -> redirects to WhatsApp with prefilled message
const BookingDialog = ({ open, onOpenChange, type, item, option, unitPrice, unitLabel = 'Person', defaultPax = 2, extra = {} }) => {
  const { bookings } = useData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(extra.date || null);
  const [pax, setPax] = useState(defaultPax);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    if (!unitPrice) return null;
    return unitLabel === 'Family' || unitLabel === 'Vehicle' ? unitPrice : unitPrice * pax;
  }, [unitPrice, pax, unitLabel]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Mohon isi nama Anda');
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) return toast.error('Mohon isi nomor WhatsApp yang valid');
    if (!date) return toast.error('Mohon pilih tanggal');
    setLoading(true);
    const payload = {
      type, itemId: item?.id, itemName: item?.title || item?.name, name, phone,
      date: format(date, 'dd MMM yyyy'), pax, option: option || null, notes, total,
    };
    const msg = buildBookingMessage({ ...payload, total: total ? formatIDR(total) : null });
    try {
      await bookings.create(payload);
      toast.success('Permintaan booking tersimpan. Melanjutkan ke WhatsApp...');
    } catch (err) {
      toast.error('Gagal menyimpan booking, tetap melanjutkan ke WhatsApp.');
    }
    openWhatsApp(msg);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl p-0 overflow-hidden border-0 shadow-card" data-testid="booking-dialog">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-700 via-brand to-gold" />
        <div className="p-6 md:p-8">
          <DialogHeader className="text-left">
            <div className="eyebrow">Quick Booking &bull; {type}</div>
            <DialogTitle className="font-display text-2xl text-ink leading-tight mt-1">{item?.title || item?.name}</DialogTitle>
            <DialogDescription className="text-sand">Isi data singkat di bawah, lalu kami arahkan ke WhatsApp dengan detail yang sudah terisi.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bk-name" className="text-[11px] uppercase tracking-wider font-bold text-ink/70">Nama Lengkap</Label>
                <Input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wayan Putra" className="rounded-xl h-11 bg-cream" data-testid="booking-name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bk-phone" className="text-[11px] uppercase tracking-wider font-bold text-ink/70">No. WhatsApp</Label>
                <Input id="bk-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xx xxxx xxxx" className="rounded-xl h-11 bg-cream" data-testid="booking-phone" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-ink/70">Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="w-full h-11 rounded-xl bg-cream border border-input px-3 text-sm flex items-center gap-2 text-left hover:border-brand/50 transition-colors" data-testid="booking-date">
                      <CalendarDays className="w-4 h-4 text-brand" />
                      <span className={date ? 'text-ink' : 'text-ink/40'}>{date ? format(date, 'dd/MM/yyyy') : 'Pilih tanggal'}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto rounded-2xl" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-ink/70">{unitLabel === 'Vehicle' ? 'Jumlah Penumpang' : 'Jumlah Peserta'}</Label>
                <div className="h-11 rounded-xl bg-cream border border-input flex items-center justify-between px-2">
                  <button type="button" onClick={() => setPax((p) => Math.max(1, p - 1))} className="w-8 h-8 rounded-lg bg-white hover:bg-brand-50 text-brand flex items-center justify-center transition-colors" data-testid="booking-pax-minus"><Minus className="w-4 h-4" /></button>
                  <span className="font-semibold text-ink" data-testid="booking-pax">{pax}</span>
                  <button type="button" onClick={() => setPax((p) => Math.min(30, p + 1))} className="w-8 h-8 rounded-lg bg-white hover:bg-brand-50 text-brand flex items-center justify-center transition-colors" data-testid="booking-pax-plus"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
            {option && (
              <div className="rounded-xl bg-brand-50 border border-brand-100 px-4 py-2.5 text-sm text-brand-700 font-medium">Opsi: {option}</div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="bk-notes" className="text-[11px] uppercase tracking-wider font-bold text-ink/70">Catatan (opsional)</Label>
              <Textarea id="bk-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Hotel pickup, permintaan khusus, dll." className="rounded-xl bg-cream min-h-[80px]" data-testid="booking-notes" />
            </div>
            {total !== null && (
              <div className="flex items-center justify-between rounded-xl bg-cream-100 px-4 py-3">
                <span className="text-sm text-sand">Estimasi Total</span>
                <span className="font-display font-bold text-brand-700 text-lg" data-testid="booking-total">{formatIDR(total)}</span>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-brand w-full !py-3.5 !rounded-2xl disabled:opacity-70" data-testid="booking-submit">
              <MessageCircle className="w-4 h-4" /> {loading ? 'Menyiapkan WhatsApp...' : 'Lanjutkan ke WhatsApp'}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-sand"><ShieldCheck className="w-3.5 h-3.5 text-sage-700" /> Tanpa biaya booking. Konfirmasi instan via WhatsApp concierge.</div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
