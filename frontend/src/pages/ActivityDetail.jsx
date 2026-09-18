import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, X, CalendarDays, Minus, Plus, ArrowRight, MessageCircle, Clock, CircleCheck, Backpack, Bus, ShieldCheck, CloudRain } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { Checkbox } from '../components/ui/checkbox';
import { Reveal } from '../components/Reveal';
import { RichText } from '../components/RichText';
import { Pill, Stars } from '../components/ui-bits';
import { Newsletter } from '../components/Layout';
import BookingDialog from '../components/BookingDialog';
import Icon from '../components/Icon';
import { useData } from '../context/DataContext';
import { formatIDR } from '../lib/format';
import { openWhatsApp } from '../lib/whatsapp';

const Card = ({ children, className = '' }) => <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-soft ${className}`}>{children}</div>;
const Bar = ({ tone = 'brand' }) => <span className={`inline-block w-2.5 h-7 rounded-full mr-3 ${tone === 'forest' ? 'bg-forest' : tone === 'gold' ? 'bg-gold' : 'bg-brand-800'}`} />;
const dotTone = { brand: 'bg-brand-800', forest: 'bg-forest', gold: 'bg-gold', sand: 'bg-sand' };

const ActivityDetail = () => {
  const { slug } = useParams();
  const { activities } = useData();
  const act = activities.get(slug);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(0);
  const [pax, setPax] = useState(2);
  const [addons, setAddons] = useState([]);
  const [open, setOpen] = useState(false);

  const total = useMemo(() => (act ? act.price * pax + (act.addons || []).filter((a) => addons.includes(a.title)).reduce((s, a) => s + a.price * pax, 0) : 0), [act, pax, addons]);
  if (!act) return <div className="mx-auto max-w-7xl px-6 py-32 text-center"><h1 className="font-display text-3xl font-bold">Activity not found</h1><Link to="/activities" className="btn-brand mt-6">Back to Activities</Link></div>;

  const option = `${act.slots?.[slot]?.label || 'Standard'}${addons.length ? ` • Add-ons: ${addons.join(', ')}` : ''}`;

  return (
    <div data-testid="activity-detail-page">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">{(act.tags || [act.badge, act.category, `Duration: ${act.duration}`]).map((t, i) => <Pill key={t} tone={i === 0 ? 'brand-soft' : i === 1 ? 'sand' : 'sage'} uppercase>{t}</Pill>)}</div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm shadow-soft"><Star className="w-4 h-4 fill-gold text-gold" /> <b>{act.rating.toFixed(1)}</b> <span className="text-sand">({act.reviews}+ reviews)</span></div>
          </div>
          <h1 className="font-display font-bold text-ink text-3xl md:text-5xl leading-[1.1] tracking-tight mt-5 max-w-4xl">{act.headline || act.title}</h1>
          <p className="text-sand text-base md:text-lg mt-4 max-w-3xl leading-relaxed">{act.description}</p>
        </Reveal>
        <Reveal className="grid lg:grid-cols-12 gap-4 mt-8">
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden h-72 lg:h-[420px] img-zoom shadow-soft">
            <img src={act.gallery?.[0]?.src} alt={act.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-white"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-gold">{act.category}</div><div className="font-display font-bold text-xl mt-1">{act.gallery?.[0]?.label}</div></div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {(act.gallery || []).slice(1, 5).map((g, i) => <div key={i} className="relative rounded-2xl overflow-hidden h-36 lg:h-[202px] img-zoom shadow-soft"><img src={g.src} alt={g.label} className="w-full h-full object-cover" loading="lazy" /><div className="absolute bottom-3 left-3"><Pill tone="dark">{g.label}</Pill></div></div>)}
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-12 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Reveal><Card className="!p-5"><div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-ink/8">{(act.facts || []).map((f) => <div key={f.label} className="text-center px-3 py-2"><span className="w-10 h-10 rounded-full bg-brand-50 text-brand inline-flex items-center justify-center"><Icon name={f.icon} className="w-4 h-4" /></span><div className="text-[11px] text-sand mt-2">{f.label}</div><div className="font-display font-bold text-ink">{f.value}</div><div className="text-[10px] text-sand">{f.sub}</div></div>)}</div></Card></Reveal>

          <Reveal><Card>
            <h2 className="font-display font-bold text-2xl text-ink flex items-center"><Bar /> Experience Overview &amp; Highlights</h2>
            <RichText value={act.longDescription || act.description} className="text-ink/75 leading-relaxed mt-5 text-[15px]" testId="activity-long-description" />
            <div className="grid sm:grid-cols-2 gap-4 mt-6">{(act.highlights || []).map((h) => <div key={h.title} className="flex gap-3 bg-cream rounded-2xl p-4"><span className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0"><Icon name={h.icon} className="w-5 h-5" /></span><div><div className="font-semibold text-ink text-sm">{h.title}</div><div className="text-xs text-sand mt-0.5 leading-relaxed">{h.desc}</div></div></div>)}</div>
          </Card></Reveal>

          <Reveal><Card>
            <div className="flex items-center justify-between"><div><h2 className="font-display font-bold text-2xl text-ink flex items-center"><Bar tone="forest" /> Detailed Journey Timeline</h2><p className="text-sand text-sm mt-1 ml-[22px]">Carefully calibrated for zero-stress pacing and pristine arrival.</p></div><Pill tone="sand" uppercase><Clock className="w-3 h-3" /> {act.duration} total</Pill></div>
            <div className="mt-8 relative pl-6 border-l-2 border-dashed border-gold/40 space-y-7" data-testid="activity-timeline">
              {(act.timeline || []).map((t) => <div key={t.time + t.title} className="relative"><span className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${dotTone[t.tone] || 'bg-brand'}`} /><div className="flex flex-wrap items-baseline gap-x-3"><span className="text-brand-700 font-bold text-sm">{t.time}</span><span className="font-display font-bold text-ink">{t.title}</span></div><p className="text-sm text-sand mt-1 leading-relaxed">{t.desc}</p></div>)}
            </div>
          </Card></Reveal>

          <Reveal><Card>
            <h2 className="font-display font-bold text-2xl text-ink flex items-center"><Bar tone="gold" /> Inclusions &amp; Exclusions</h2>
            <div className="grid sm:grid-cols-2 gap-8 mt-6">
              <div><div className="flex items-center gap-2 font-display font-bold text-sage-700"><Check className="w-5 h-5" /> Included in Package</div><ul className="mt-4 space-y-2.5">{(act.inclusions || []).map((i) => <li key={i} className="flex items-start gap-2 text-sm text-ink/75"><Check className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" /> {i}</li>)}</ul></div>
              <div><div className="flex items-center gap-2 font-display font-bold text-ink/60"><X className="w-5 h-5" /> Not Included</div><ul className="mt-4 space-y-2.5">{(act.exclusions || []).map((i) => <li key={i} className="flex items-start gap-2 text-sm text-ink/75"><X className="w-4 h-4 text-ink/40 shrink-0 mt-0.5" /> {i}</li>)}</ul></div>
            </div>
          </Card></Reveal>

          <Reveal><div className="bg-cream-100 rounded-3xl p-6 md:p-8">
            <h3 className="font-display font-bold text-2xl text-ink flex items-center gap-2"><Backpack className="w-6 h-6 text-brand" /> Essential Preparation &amp; Packing Guide</h3>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">{(act.packing || []).map((p) => <div key={p.title} className="bg-white rounded-2xl p-5"><div className="flex items-center gap-2 font-semibold text-ink text-sm"><Icon name={p.icon} className="w-4 h-4 text-brand" /> {p.title}</div><p className="text-xs text-sand mt-2 leading-relaxed">{p.desc}</p></div>)}</div>
          </div></Reveal>

          <Reveal><Card>
            <div className="flex items-center justify-between"><h2 className="font-display font-bold text-2xl text-ink flex items-center"><Bar /> Traveler Experiences</h2><span className="text-xs font-semibold text-brand">{act.reviews} Verified Reviews</span></div>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">{(act.reviewsList || []).map((r) => <div key={r.name} className="rounded-2xl border border-ink/10 p-5"><div className="flex items-center justify-between"><Stars value={5} /><span className="text-xs text-sand">{r.date}</span></div><p className="font-serif italic text-ink/80 text-sm leading-relaxed mt-3">"{r.text}"</p><div className="flex items-center gap-3 mt-4 pt-4 border-t border-ink/8"><span className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${r.tone === 'forest' ? 'bg-forest' : 'bg-brand-700'}`}>{r.initials}</span><div><div className="font-semibold text-sm text-ink">{r.name}</div><div className="text-xs text-sand">{r.location}</div></div></div></div>)}</div>
          </Card></Reveal>
        </div>

        <Reveal delay={0.15} className="lg:sticky lg:top-24 space-y-5">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden" data-testid="activity-booking-sidebar">
            <div className="h-1.5 bg-gradient-to-r from-brand-700 via-brand to-gold" />
            <div className="p-6">
              <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60">Starting From</div>
              <div className="font-display font-bold text-4xl text-brand-700 mt-1">{formatIDR(act.price)} <span className="text-xs text-sand font-body font-normal">/ person</span></div>
              <div className="mt-4 text-xs text-sage-700 flex items-center gap-1.5 font-medium"><CircleCheck className="w-3.5 h-3.5" /> All Gear, Meals &amp; Hotel Transfers Included</div>
              <div className="mt-5"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Select Date</div>
                <Popover><PopoverTrigger asChild><button className="w-full h-12 rounded-xl bg-cream border border-ink/10 px-4 text-sm flex items-center gap-2 hover:border-brand/40" data-testid="activity-date"><CalendarDays className="w-4 h-4 text-brand" /><span className={date ? 'text-ink font-medium' : 'text-ink/40'}>{date ? format(date, 'dd/MM/yyyy') : 'Choose date'}</span></button></PopoverTrigger><PopoverContent className="p-0 w-auto rounded-2xl" align="start"><Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} initialFocus /></PopoverContent></Popover>
              </div>
              <div className="mt-4"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Time Slot &amp; Pickup</div>
                <div className="space-y-2">{(act.slots || []).map((s, i) => <button key={s.label} onClick={() => setSlot(i)} className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${slot === i ? 'border-brand bg-brand-50/50' : 'border-ink/10 hover:border-brand/40'}`}><div><div className="font-semibold text-ink text-sm">{s.label}</div><div className="text-[11px] text-sand">{s.sub}</div></div>{slot === i && <CircleCheck className="w-5 h-5 text-brand-700" />}</button>)}</div>
              </div>
              <div className="mt-4"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Number of Participants</div>
                <div className="h-12 rounded-xl bg-cream border border-ink/10 flex items-center justify-between px-3"><span className="text-sm text-ink/70">Participants</span><div className="flex items-center gap-3"><button onClick={() => setPax((p) => Math.max(1, p - 1))} className="w-8 h-8 rounded-lg bg-white text-brand flex items-center justify-center hover:bg-brand-50"><Minus className="w-4 h-4" /></button><span className="font-semibold w-4 text-center">{pax}</span><button onClick={() => setPax((p) => Math.min(30, p + 1))} className="w-8 h-8 rounded-lg bg-white text-brand flex items-center justify-center hover:bg-brand-50"><Plus className="w-4 h-4" /></button></div></div>
              </div>
              {act.addons?.length > 0 && <div className="mt-4"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Optional Upgrades</div><div className="space-y-2">{act.addons.map((a) => <label key={a.title} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cream px-3 py-2.5 cursor-pointer hover:border-brand/40"><Checkbox checked={addons.includes(a.title)} onCheckedChange={(c) => setAddons((s) => (c ? [...s, a.title] : s.filter((x) => x !== a.title)))} /><div className="flex-1"><div className="text-sm font-medium text-ink">{a.title}</div><div className="text-[11px] text-sand">{a.desc}</div></div><div className="text-xs font-bold text-brand">+{formatIDR(a.price)}/pax</div></label>)}</div></div>}
              <div className="mt-5 pt-4 border-t border-ink/8 text-sm space-y-1.5"><div className="flex justify-between text-ink/70"><span>Standard ({pax} Persons)</span><span>{formatIDR(act.price * pax)}</span></div><div className="flex justify-between text-ink/70 text-xs"><span>Transfers &amp; Equipment</span><span className="text-sage-700">Included</span></div><div className="flex justify-between font-bold text-ink pt-1"><span>Total Investment</span><span className="text-brand-700 font-display text-lg" data-testid="activity-total">{formatIDR(total)}</span></div></div>
              <button onClick={() => setOpen(true)} className="btn-brand w-full !py-4 !rounded-2xl mt-5 !bg-brand-800 hover:!bg-brand-700" data-testid="book-activity-btn">Book Activity Now <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => openWhatsApp(`Halo, saya ingin bertanya tentang aktivitas "${act.title}".`)} className="w-full mt-3 text-sm font-semibold text-forest inline-flex items-center justify-center gap-2 hover:text-brand transition-colors"><MessageCircle className="w-4 h-4" /> Quick Inquiry via WhatsApp</button>
              <ul className="mt-5 space-y-2 text-xs text-ink/70">{[[Bus, 'Free hotel pickup in South Bali & Ubud'], [ShieldCheck, 'Full medical and passenger insurance included'], [CloudRain, '100% Weather Refund / Reschedule Guarantee']].map(([I, t]) => <li key={t} className="flex items-center gap-2"><I className="w-3.5 h-3.5 text-sage-700" /> {t}</li>)}</ul>
            </div>
          </div>
        </Reveal>
      </div>

      <Newsletter eyebrow="Curated Balinese Journeys" desc="Subscribe to receive secret dawn trekking trails, private villa retreats, and seasonal cultural festival access directly to your inbox." />
      <BookingDialog open={open} onOpenChange={setOpen} type="Activity" item={act} option={option} unitPrice={total / pax} unitLabel="Person" defaultPax={pax} extra={{ date }} />
    </div>
  );
};

export default ActivityDetail;
