import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Camera, Sparkles, Check, X, Lightbulb, ChevronDown, CalendarDays, Minus, Plus, Zap, ShieldCheck, Lock, CalendarClock, Flame, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { Checkbox } from '../components/ui/checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Reveal } from '../components/Reveal';
import { RichText } from '../components/RichText';
import { Pill, Stars } from '../components/ui-bits';
import { Newsletter } from '../components/Layout';
import BookingDialog from '../components/BookingDialog';
import Icon from '../components/Icon';
import { useData } from '../context/DataContext';
import { formatIDR } from '../lib/format';

const Gallery = ({ gallery = [], title }) => {
  const main = gallery[0];
  const rest = gallery.slice(1, 5);
  return (
    <Reveal className="grid lg:grid-cols-2 gap-4" data-testid="tour-gallery">
      <div className="relative rounded-3xl overflow-hidden h-72 lg:h-[420px] img-zoom shadow-soft">
        <img src={main?.src} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 text-white">
          <Pill tone="glass">West Coast Highlight</Pill>
          <div className="font-display font-bold text-xl mt-2">{main?.label}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {rest.map((g, i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden h-36 lg:h-[202px] img-zoom shadow-soft">
            <img src={g.src} alt={g.label} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute bottom-3 left-3"><Pill tone="dark">{g.label}</Pill></div>
            {i === rest.length - 1 && <button className="absolute bottom-3 right-3 btn-outline !py-1.5 !px-3 !text-xs"><Camera className="w-3.5 h-3.5" /> View all {gallery.length * 5} photos</button>}
          </div>
        ))}
      </div>
    </Reveal>
  );
};

const Card = ({ children, className = '' }) => <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-soft ${className}`}>{children}</div>;

const TourDetail = () => {
  const { slug } = useParams();
  const { tours } = useData();
  const tour = tours.get(slug);
  const [date, setDate] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [addons, setAddons] = useState([]);
  const [open, setOpen] = useState(false);

  const total = useMemo(() => {
    if (!tour) return 0;
    const base = tour.priceUnit === 'Family' ? tour.price : tour.price * adults + tour.price * 0.5 * children;
    const extra = (tour.addons || []).filter((a) => addons.includes(a.title)).reduce((s, a) => s + a.price, 0);
    return base + extra;
  }, [tour, adults, children, addons]);

  if (!tour) return <div className="mx-auto max-w-7xl px-6 py-32 text-center"><h1 className="font-display text-3xl font-bold">Package not found</h1><Link to="/tour-packages" className="btn-brand mt-6">Back to Packages</Link></div>;

  const discount = tour.originalPrice ? Math.round((1 - tour.price / tour.originalPrice) * 100) : 0;
  const option = addons.length ? `Add-ons: ${addons.join(', ')}` : null;

  return (
    <div data-testid="tour-detail-page">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {tour.badge && <Pill tone="brand" uppercase><Flame className="w-3 h-3" /> {tour.badge}</Pill>}
              <Pill tone="forest" uppercase><MapPin className="w-3 h-3" /> {tour.category}</Pill>
              <Pill tone="sand" uppercase><Clock className="w-3 h-3" /> {tour.duration}</Pill>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm shadow-soft"><Star className="w-4 h-4 fill-gold text-gold" /> <b>{tour.rating.toFixed(1)}</b> <span className="text-sand">({tour.reviews}+ reviews)</span></div>
          </div>
          <h1 className="font-display font-bold text-ink text-3xl md:text-5xl leading-[1.1] tracking-tight mt-5 max-w-4xl">{tour.title}{tour.subtitle ? `: ${tour.subtitle}` : ''}</h1>
          <p className="text-sand text-base md:text-lg mt-4 max-w-3xl leading-relaxed">{tour.description}</p>
        </Reveal>
        <div className="mt-8"><Gallery gallery={tour.gallery} title={tour.title} /></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-12 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Reveal>
            <Card>
              <h2 className="font-display font-bold text-2xl text-ink flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand" /> Curated Journey Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {(tour.features || []).map((f) => (
                  <div key={f.title} className="flex gap-3 bg-cream rounded-2xl p-4">
                    <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0"><Icon name={f.icon} className="w-5 h-5" /></span>
                    <div><div className="font-semibold text-ink text-sm">{f.title}</div><div className="text-xs text-sand mt-0.5 leading-relaxed">{f.desc}</div></div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <div className="eyebrow flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand" /> Experience the Extraordinary</div>
            <h2 className="font-display font-bold text-3xl text-ink mt-3">Unveiling {tour.region}</h2>
            <RichText value={tour.longDescription} className="text-ink/75 leading-relaxed mt-4 text-[15px]" testId="tour-long-description" />
          </Reveal>

          <Reveal>
            <div className="flex items-center justify-between">
              <div><div className="eyebrow">Comprehensive Schedule</div><h2 className="font-display font-bold text-3xl text-ink mt-1">Day-by-Day Curated Itinerary</h2></div>
              <Pill tone="sand">{tour.duration}</Pill>
            </div>
            <Accordion type="single" collapsible defaultValue="day-1" className="mt-6 space-y-4" data-testid="itinerary">
              {(tour.itinerary || []).map((d, idx) => (
                <AccordionItem key={d.day} value={`day-${d.day}`} className="bg-white rounded-2xl shadow-soft border-0 px-6 data-[state=open]:ring-1 data-[state=open]:ring-brand/20">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex items-center gap-4 text-left">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm ${idx === 0 ? 'bg-brand text-white' : 'bg-cream-100 text-ink'}`}>{String(d.day).padStart(2, '0')}</span>
                      <div><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-brand">Day {d.day}</div><div className="font-display font-bold text-ink text-lg leading-snug">{d.title}</div></div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-ink/75 text-sm leading-relaxed">{d.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-2 mt-4">
                      {(d.points || []).map((p) => <div key={p} className="flex items-start gap-2 text-sm text-ink font-medium"><Check className="w-4 h-4 text-brand shrink-0 mt-0.5" /> {p}</div>)}
                    </div>
                    {d.meals && <div className="mt-4 rounded-xl bg-cream px-4 py-3 text-xs text-ink/80 flex items-center gap-2"><Icon name="UtensilsCrossed" className="w-4 h-4 text-brand" /> {d.meals}</div>}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal>
            <Card>
              <h2 className="font-display font-bold text-2xl text-ink">Package Inclusions &amp; Exclusions</h2>
              <div className="grid sm:grid-cols-2 gap-8 mt-6">
                <div>
                  <div className="flex items-center gap-2 font-display font-bold text-ink text-lg pb-3 border-b border-ink/8"><Check className="w-5 h-5 text-sage-700" /> What Is Included</div>
                  <ul className="mt-4 space-y-2.5">{(tour.inclusions || []).map((i) => <li key={i} className="flex items-start gap-2 text-sm text-ink/75"><Check className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" /> {i}</li>)}</ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-display font-bold text-ink text-lg pb-3 border-b border-ink/8"><X className="w-5 h-5 text-brand" /> What Is Excluded</div>
                  <ul className="mt-4 space-y-2.5">{(tour.exclusions || []).map((i) => <li key={i} className="flex items-start gap-2 text-sm text-ink/75"><X className="w-4 h-4 text-brand shrink-0 mt-0.5" /> {i}</li>)}</ul>
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <div className="bg-cream-100 rounded-3xl p-6 md:p-8">
              <h3 className="font-display font-bold text-xl text-ink flex items-center gap-2"><Lightbulb className="w-5 h-5 text-brand" /> Curator's Island Advice &amp; Tips</h3>
              <div className="grid sm:grid-cols-3 gap-4 mt-5">
                {(tour.tips || []).map((t) => (
                  <div key={t.title} className="bg-white rounded-2xl p-4"><Icon name={t.icon} className="w-5 h-5 text-brand" /><div className="font-semibold text-ink text-sm mt-3">{t.title}</div><div className="text-xs text-sand mt-1 leading-relaxed">{t.desc}</div></div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="flex items-center justify-between"><div><div className="eyebrow">Guest Experiences</div><h2 className="font-display font-bold text-3xl text-ink mt-1">Verified Traveler Reviews</h2></div></div>
            <Card className="mt-6 flex flex-col sm:flex-row gap-8 items-center">
              <div className="text-center sm:pr-8 sm:border-r border-ink/8"><div className="font-display font-bold text-5xl text-brand-700">{tour.rating.toFixed(1)}</div><Stars value={5} className="w-4 h-4 mx-auto" /><div className="text-xs text-sand mt-1">Based on {tour.reviews} verified reviews</div></div>
              <div className="flex-1 w-full space-y-3">
                {[['Service', 5.0], ['Guide & 4x4', 4.9], ['Villa Stay', 4.8]].map(([l, v]) => (
                  <div key={l} className="flex items-center gap-4 text-xs"><span className="w-24 text-ink/70">{l}</span><div className="flex-1 h-1.5 rounded-full bg-cream-200 overflow-hidden"><div className="h-full bg-brand-700 rounded-full" style={{ width: `${(v / 5) * 100}%` }} /></div><span className="font-semibold w-8 text-right">{v.toFixed(1)}</span></div>
                ))}
              </div>
            </Card>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {(tour.reviewsList || []).map((r) => (
                <Card key={r.name} className="!p-6">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-3"><img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /><div><div className="font-semibold text-sm text-ink">{r.name}</div><div className="text-xs text-sand">{r.location}</div></div></div><Stars value={5} /></div>
                  <p className="font-serif italic text-ink/80 text-sm leading-relaxed mt-4">"{r.text}"</p>
                  <div className="text-[11px] text-sage-700 mt-4 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {r.date}</div>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Booking sidebar */}
        <Reveal delay={0.15} className="lg:sticky lg:top-24 space-y-5">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden" data-testid="booking-sidebar">
            <div className="h-1.5 bg-gradient-to-r from-brand-700 via-brand to-gold" />
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60">Starting From</div><div className="font-display font-bold text-3xl text-brand-700 mt-1">{formatIDR(tour.price)} <span className="text-xs text-sand font-body font-normal">/{tour.priceUnit.toLowerCase()}</span></div></div>
                {tour.originalPrice && <div className="text-right"><div className="text-xs text-sand line-through">{formatIDR(tour.originalPrice)}</div><Pill tone="brand" className="mt-1">{discount}% OFF</Pill></div>}
              </div>
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Select Departure Date</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full h-12 rounded-xl bg-cream border border-ink/10 px-4 text-sm flex items-center gap-2 hover:border-brand/40 transition-colors" data-testid="sidebar-date"><CalendarDays className="w-4 h-4 text-brand" /><span className={date ? 'text-ink font-medium' : 'text-ink/40'}>{date ? format(date, 'dd/MM/yyyy') : 'Choose date'}</span></button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto rounded-2xl" align="start"><Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} initialFocus /></PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[['Adults (12+)', adults, setAdults, 1], ['Children (3-11)', children, setChildren, 0]].map(([l, v, set, min]) => (
                  <div key={l}>
                    <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">{l}</div>
                    <div className="h-12 rounded-xl bg-cream border border-ink/10 flex items-center justify-between px-2">
                      <button onClick={() => set(Math.max(min, v - 1))} className="w-8 h-8 rounded-lg bg-white text-brand flex items-center justify-center hover:bg-brand-50"><Minus className="w-4 h-4" /></button>
                      <span className="font-semibold">{v}</span>
                      <button onClick={() => set(Math.min(20, v + 1))} className="w-8 h-8 rounded-lg bg-white text-brand flex items-center justify-center hover:bg-brand-50"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
              {tour.addons?.length > 0 && (
                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Optional Luxury Add-ons</div>
                  <div className="space-y-2">
                    {tour.addons.map((a) => (
                      <label key={a.title} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cream px-3 py-2.5 cursor-pointer hover:border-brand/40 transition-colors">
                        <Checkbox checked={addons.includes(a.title)} onCheckedChange={(c) => setAddons((s) => (c ? [...s, a.title] : s.filter((x) => x !== a.title)))} />
                        <div className="flex-1"><div className="text-sm font-medium text-ink">{a.title}</div><div className="text-[11px] text-sand">{a.desc}</div></div>
                        <div className="text-xs font-bold text-brand">+{formatIDR(a.price)}</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-5 pt-4 border-t border-ink/8 space-y-1.5 text-sm">
                <div className="flex justify-between text-ink/70"><span>Tour Base ({tour.priceUnit === 'Family' ? '1 family' : `${adults + children} guests`})</span><span>{formatIDR(tour.priceUnit === 'Family' ? tour.price : tour.price * adults + tour.price * 0.5 * children)}</span></div>
                {tour.originalPrice && <div className="flex justify-between text-sage-700 text-xs"><span>Seasonal Early Bird Discount</span><span>-{discount}% applied</span></div>}
                <div className="flex justify-between font-bold text-ink pt-2"><span>Total Estimated</span><span className="text-brand-700 font-display text-lg" data-testid="sidebar-total">{formatIDR(total)}</span></div>
              </div>
              <button onClick={() => setOpen(true)} className="btn-brand w-full !py-4 !rounded-2xl mt-5 !bg-brand-800 hover:!bg-brand-700" data-testid="book-tour-btn"><Zap className="w-4 h-4" /> Book This Tour Now</button>
              <ul className="mt-5 space-y-2 text-xs text-ink/70">
                {[['Instant confirmation via WhatsApp concierge', ShieldCheck], ['Zero hidden booking charges or port taxes', Lock], ['Free date reschedule up to 48 hours prior', CalendarClock]].map(([t, I]) => <li key={t} className="flex items-center gap-2"><I className="w-3.5 h-3.5 text-sage-700" /> {t}</li>)}
              </ul>
            </div>
          </div>
          <div className="bg-cream-100 rounded-3xl p-6 text-center">
            <ShieldCheck className="w-7 h-7 text-brand-700 mx-auto" />
            <div className="font-display font-bold text-ink text-lg mt-2">100% Satisfaction Guarantee</div>
            <p className="text-xs text-sand mt-1 leading-relaxed">If weather conditions make fast boat crossing unsafe, your trip is fully rescheduled or refunded without penalties.</p>
          </div>
        </Reveal>
      </div>

      <Newsletter variant="card" eyebrow="Make Moments That Last" title="Receive Secret Bali Guides & VIP Perks" desc="Join over 15,000 mindful travelers receiving our curated monthly private villa discounts and secret destination updates." />

      <BookingDialog open={open} onOpenChange={setOpen} type="Tour Package" item={tour} option={option} unitPrice={tour.priceUnit === 'Family' ? total : tour.price} unitLabel={tour.priceUnit} defaultPax={adults + children} extra={{ date }} />
    </div>
  );
};

export default TourDetail;
