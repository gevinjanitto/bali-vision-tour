import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Car, Camera, CircleCheck, Clock, ShieldCheck, MessageCircle, CalendarDays, MapPin, Plane, Route, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Reveal } from '../components/Reveal';
import { RichText } from '../components/RichText';
import { Pill, Stars } from '../components/ui-bits';
import { Newsletter } from '../components/Layout';
import BookingDialog from '../components/BookingDialog';
import Icon from '../components/Icon';
import { useData } from '../context/DataContext';
import { formatIDR } from '../lib/format';

const Card = ({ children, className = '' }) => <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-soft ${className}`}>{children}</div>;

const CarDetail = () => {
  const { slug } = useParams();
  const { cars } = useData();
  const car = cars.get(slug);
  const [duration, setDuration] = useState('10');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('08:30 AM (Recommended)');
  const [area, setArea] = useState('Seminyak / Kerobokan');
  const [addons, setAddons] = useState([]);
  const [open, setOpen] = useState(false);

  const base = duration === '12' ? car?.price12h : car?.price;
  const total = useMemo(() => (base || 0) + (car?.addons || []).filter((a) => addons.includes(a.title)).reduce((s, a) => s + a.price, 0), [base, car, addons]);

  if (!car) return <div className="mx-auto max-w-7xl px-6 py-32 text-center"><h1 className="font-display text-3xl font-bold">Vehicle not found</h1><Link to="/car-rental" className="btn-brand mt-6">Back to Fleet</Link></div>;

  const option = `${duration} Hours Charter • ${time} • Pickup: ${area}${addons.length ? ` • Add-ons: ${addons.join(', ')}` : ''}`;
  const specs = [
    { label: 'Passenger Capacity', value: car.capacity, sub: car.capacitySub, icon: 'Users' },
    { label: 'Luggage Capacity', value: car.luggage, sub: car.luggageSub, icon: 'Luggage' },
    { label: 'Drivetrain & NVH', value: car.drivetrain, sub: car.drivetrainSub, icon: 'Zap' },
    { label: 'Interior Seating', value: car.seating, sub: car.seatingSub, icon: 'Armchair' },
  ];

  return (
    <div data-testid="car-detail-page">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">{(car.tags || []).map((t, i) => <Pill key={t} tone={i === 0 ? 'forest' : i === 1 ? 'sage' : 'brand-soft'} uppercase>{t}</Pill>)}</div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm shadow-soft"><Star className="w-4 h-4 fill-gold text-gold" /> <b>5.0</b> <span className="text-sand">(120+ reviews)</span></div>
          </div>
          <h1 className="font-display font-bold text-ink text-3xl md:text-5xl leading-[1.1] tracking-tight mt-5 max-w-4xl">{car.headline}</h1>
          <RichText value={car.longDesc} className="text-sand text-base md:text-lg mt-4 max-w-3xl leading-relaxed" testId="car-long-description" />
        </Reveal>
        <Reveal className="grid lg:grid-cols-2 gap-4 mt-8">
          <div className="relative rounded-3xl overflow-hidden h-72 lg:h-[420px] img-zoom shadow-soft">
            <img src={car.gallery?.[0]?.src} alt={car.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between">
              <div><Pill tone="brand" uppercase>Flagship Fleet</Pill><div className="font-display font-bold text-xl mt-2">{car.name}</div><div className="text-xs text-white/75">Smooth cruising across Bali's coastal and mountain roads</div></div>
              <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center"><Camera className="w-4 h-4" /></span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(car.gallery || []).slice(1, 5).map((g, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden h-36 lg:h-[202px] img-zoom shadow-soft"><img src={g.src} alt={g.label} className="w-full h-full object-cover" loading="lazy" /><div className="absolute bottom-3 left-3"><Pill tone="dark">{g.label}</Pill></div></div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-12 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Reveal>
            <Card>
              <div className="flex items-start gap-3"><Car className="w-6 h-6 text-brand mt-1" /><div><h2 className="font-display font-bold text-2xl text-ink">Vehicle Specifications &amp; Luxury Amenities</h2><p className="text-sand text-sm mt-1">Engineered for silky silent travel through Bali's bustling towns and highland roads.</p></div></div>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {specs.map((s) => (
                  <div key={s.label} className="flex gap-3 bg-cream rounded-2xl p-4">
                    <span className="w-10 h-10 rounded-xl bg-sage text-sage-700 flex items-center justify-center shrink-0"><Icon name={s.icon} className="w-5 h-5" /></span>
                    <div><div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink/60">{s.label}</div><div className="font-semibold text-ink text-sm mt-0.5">{s.value}</div><div className="text-xs text-sand mt-0.5">{s.sub}</div></div>
                  </div>
                ))}
              </div>
              <h3 className="font-display font-bold text-ink text-lg mt-8">Complimentary Onboard Luxury Touches</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">{(car.amenities || []).map((a) => <div key={a} className="bg-cream rounded-xl px-3 py-3 text-xs font-medium text-ink flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-brand" /> {a}</div>)}</div>
            </Card>
          </Reveal>

          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 text-white p-8 grain relative overflow-hidden shadow-card">
              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-gold-100">The Bali Vision Distinction</div>
                <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 flex items-center gap-3"><ShieldCheck className="w-7 h-7 text-gold" /> White-Glove Private Chauffeur Guarantee</h2>
                <p className="text-white/85 mt-4 leading-relaxed">Unlike standard cab or ride-hailing services, our chauffeurs are handpicked Balinese hospitality professionals trained to anticipate your needs, navigate island traffic seamlessly, and safeguard your journey.</p>
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  {[['Languages', 'Fluent English Speakers', 'Articulate local experts who share Balinese culture, etiquette, and authentic hidden gems along your route.'], ['SprayCan', 'Pristine Daily Sanitization', 'Vehicles undergo rigorous pre-departure deep cleaning, ozone deodorization, and strict non-smoking adherence.'], ['Compass', 'Informal Island Concierge', "From arranging temple sarongs to timing sunset dinners in Jimbaran without traffic stress, we've got you covered."]].map(([ic, t, d]) => (
                    <div key={t} className="rounded-2xl border border-white/20 bg-white/10 p-4"><Icon name={ic} className="w-5 h-5 text-gold" /><div className="font-semibold mt-3">{t}</div><div className="text-xs text-white/80 mt-1 leading-relaxed">{d}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <Card>
              <h2 className="font-display font-bold text-2xl text-ink flex items-center gap-2"><Clock className="w-5 h-5 text-brand" /> Charter Duration &amp; Geographic Coverage</h2>
              <div className="space-y-4 mt-6">
                {[['01', '10 Hours Full Day Charter', car.price, 'Ideal for Southern and Central Bali explorations. Easily covers Seminyak, Canggu, Kuta, Sanur, Uluwatu cliff temples, Tanah Lot sunset, or central Ubud waterfalls and monkey forest.', ['10 Hours on-call chauffeur', 'Unlimited kms in designated zone'], false], ['02', '12 Hours Extended Island Expedition', car.price12h, 'Recommended for long-distance highland adventures: Kintamani Mount Batur volcano view, Bedugul Lake Beratan water temple, Jatiluwih UNESCO Rice Terraces, or Eastern Bali Besakih Mother Temple.', ['12 Hours on-call chauffeur', 'Extended highland fuel included'], true]].map(([n, t, p, d, pts, popular]) => (
                  <button key={n} onClick={() => setDuration(n === '01' ? '10' : '12')} className={`w-full text-left rounded-2xl border p-5 transition-colors relative ${(n === '01' ? '10' : '12') === duration ? 'border-brand bg-brand-50/40' : 'border-ink/10 hover:border-brand/40'}`} data-testid={`charter-option-${n}`}>
                    {popular && <span className="absolute -top-2.5 right-4 bg-brand-800 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">Most Popular</span>}
                    <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Pill tone={n === '01' ? 'sage' : 'brand'}>Option {n}</Pill><span className="font-display font-bold text-ink">{t}</span></div><span className="font-display font-bold text-brand-700">{formatIDR(p)}</span></div>
                    <p className="text-sm text-sand mt-2">{d}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-[11px] font-bold text-sage-700 uppercase tracking-wide">{pts.map((x) => <span key={x} className="flex items-center gap-1"><CircleCheck className="w-3.5 h-3.5" /> {x}</span>)}</div>
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-cream px-5 py-4 text-sm flex gap-3"><Plane className="w-5 h-5 text-brand shrink-0" /><span><b>Need Ngurah Rai (DPS) Airport VIP Transfer?</b> <span className="text-sand">Chauffeur greets you at arrival with personalized nameboard, luggage portering, and chilled refreshments directly to your luxury villa.</span></span></div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <h2 className="font-display font-bold text-2xl text-ink flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand" /> Transparent Inclusions &amp; Zero Hidden Costs</h2>
              <p className="text-sand text-sm mt-1">We believe luxury means no unexpected surprises or uncomfortable tipping moments.</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[['Chauffeur Fee & Meals', 'Full driver honorarium and daily meal allowance are completely covered.'], ['Vehicle Gasoline / Fuel', 'Standard fuel allowance for the entire 10 or 12 hour charter radius.'], ['Parking & Local Village Fees', 'Toll roads, temple village retribution passes, and parking permits paid for you.'], ['100% Flexible Custom Route', 'You design the stops, or pause whenever you wish for spontaneous photography.']].map(([t, d]) => (
                  <div key={t} className="flex gap-3 bg-cream rounded-2xl p-4"><CircleCheck className="w-5 h-5 text-sage-700 shrink-0" /><div><div className="font-semibold text-ink text-sm">{t}</div><div className="text-xs text-sand mt-0.5">{d}</div></div></div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <div className="flex items-center justify-between"><h2 className="font-display font-bold text-2xl text-ink flex items-center gap-2"><Route className="w-5 h-5 text-brand" /> Suggested Curated Day Routes</h2><span className="text-xs text-sand">Customize anytime with your chauffeur</span></div>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {(car.routes || []).map((r) => (
                  <div key={r.title} className="rounded-2xl border border-ink/10 p-5">
                    <div className="flex items-center justify-between"><Pill tone={r.tone === 'sage' ? 'sage' : 'brand-soft'} uppercase>{r.tag}</Pill><span className="text-xs text-sand">{r.hours}</span></div>
                    <div className="font-display font-bold text-ink text-lg mt-3">{r.title}</div>
                    <ul className="mt-3 space-y-1.5">{r.stops.map((s) => <li key={s} className="flex items-start gap-2 text-xs text-ink/75"><MapPin className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" /> {s}</li>)}</ul>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand mt-4">Included at standard rate →</div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <div className="bg-cream-100 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between"><div><div className="eyebrow">Guest Experiences</div><h2 className="font-display font-bold text-2xl text-ink mt-1">What Discerning Travelers Say</h2></div><div className="text-right"><Stars value={5} className="w-4 h-4" /><div className="text-xs text-sand mt-1">5.0 / 5.0 Rating</div></div></div>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {(car.reviewsList || []).map((r) => (
                  <div key={r.name} className="bg-white rounded-2xl p-5"><div className="flex items-center gap-3"><span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${r.tone === 'forest' ? 'bg-forest' : 'bg-brand'}`}>{r.initials}</span><div><div className="font-semibold text-sm text-ink">{r.name}</div><div className="text-xs text-sand">{r.meta}</div></div></div><p className="font-serif italic text-ink/80 text-sm leading-relaxed mt-4">"{r.text}"</p></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:sticky lg:top-24 space-y-5">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden" data-testid="car-booking-sidebar">
            <div className="h-1.5 bg-gradient-to-r from-brand-700 via-brand to-gold" />
            <div className="p-6">
              <div className="flex items-start justify-between"><div><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60">Starting From</div><div className="font-display font-bold text-3xl text-brand-700 mt-1">{formatIDR(car.price)}</div></div><div className="text-right"><div className="text-xs text-sand line-through">{formatIDR(Math.round(car.price * 1.18))}</div><Pill tone="brand" className="mt-1">18% OFF</Pill></div></div>
              <div className="mt-4 text-xs text-sage-700 flex items-center gap-1.5 font-medium"><CircleCheck className="w-3.5 h-3.5" /> Guaranteed Model: {car.name}</div>
              <div className="mt-5"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Select Charter Duration</div>
                <div className="grid grid-cols-2 gap-3">
                  {[['10', 'South & Central', car.price], ['12', 'Highlands Expedition', car.price12h]].map(([d, l, p]) => (
                    <button key={d} onClick={() => setDuration(d)} className={`rounded-2xl border p-3 text-center transition-colors ${duration === d ? 'border-brand bg-brand-50/50' : 'border-ink/10 hover:border-brand/40'}`} data-testid={`duration-${d}`}><div className="font-display font-bold text-ink">{d} Hours</div><div className="text-[11px] text-sand">{l}</div><div className="text-xs font-bold text-brand-700 mt-1">{formatIDR(p)}</div></button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Rental Date</div>
                  <Popover><PopoverTrigger asChild><button className="w-full h-11 rounded-xl bg-cream border border-ink/10 px-3 text-sm flex items-center gap-2 hover:border-brand/40"><CalendarDays className="w-4 h-4 text-brand" /><span className={date ? 'text-ink' : 'text-ink/40'}>{date ? format(date, 'dd/MM/yyyy') : 'Pick date'}</span></button></PopoverTrigger><PopoverContent className="p-0 w-auto rounded-2xl" align="start"><Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} initialFocus /></PopoverContent></Popover>
                </div>
                <div><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Pickup Time</div>
                  <Select value={time} onValueChange={setTime}><SelectTrigger className="h-11 rounded-xl bg-cream border-ink/10 text-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{['06:00 AM', '07:00 AM', '08:30 AM (Recommended)', '10:00 AM', '12:00 PM'].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
              <div className="mt-4"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Pickup Location / Villa Area</div>
                <Select value={area} onValueChange={setArea}><SelectTrigger className="h-11 rounded-xl bg-cream border-ink/10 text-sm"><span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand" /><SelectValue /></span></SelectTrigger><SelectContent className="rounded-xl">{(car.pickupAreas || []).map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
              </div>
              {car.addons?.length > 0 && (
                <div className="mt-5"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">Bespoke Add-ons</div>
                  <div className="space-y-2">{car.addons.map((a) => <label key={a.title} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cream px-3 py-2.5 cursor-pointer hover:border-brand/40"><Checkbox checked={addons.includes(a.title)} onCheckedChange={(c) => setAddons((s) => (c ? [...s, a.title] : s.filter((x) => x !== a.title)))} /><span className="flex-1 text-sm text-ink">{a.title}</span><span className="text-xs font-bold text-brand">+{formatIDR(a.price)}</span></label>)}</div>
                </div>
              )}
              <div className="mt-5 pt-4 border-t border-ink/8 text-sm space-y-1.5"><div className="flex justify-between text-ink/70"><span>Base Charter Service</span><span>{formatIDR(base)}</span></div><div className="flex justify-between font-bold text-ink"><span>Estimated Total</span><span className="text-brand-700 font-display text-lg" data-testid="car-total">{formatIDR(total)}</span></div><div className="text-[11px] text-sand text-right">No booking fees • Pay Chauffeur on Departure</div></div>
              <button onClick={() => setOpen(true)} className="btn-brand w-full !py-3.5 !rounded-2xl mt-5 !bg-brand-800 hover:!bg-brand-700" data-testid="book-car-btn"><MessageCircle className="w-4 h-4" /> Book Vehicle via WhatsApp</button>
              <button onClick={() => setOpen(true)} className="btn-outline w-full !py-3 !rounded-2xl mt-2.5"><CalendarDays className="w-4 h-4" /> Reserve Online Now</button>
              <ul className="mt-5 space-y-2 text-xs text-ink/70">{['Free cancellation up to 24 hours prior', 'Zero credit card surcharge or prepayment hold', 'Instant confirmation & chauffeur contact via WhatsApp'].map((t) => <li key={t} className="flex items-center gap-2"><CircleCheck className="w-3.5 h-3.5 text-sage-700" /> {t}</li>)}</ul>
            </div>
          </div>
          <div className="bg-cream-100 rounded-3xl p-6 text-center"><ShieldCheck className="w-7 h-7 text-brand-700 mx-auto" /><div className="font-display font-bold text-ink text-lg mt-2">100% Satisfaction Guarantee</div><p className="text-xs text-sand mt-1">If your chauffeur is late or the vehicle does not match the guaranteed model, your charter is free.</p></div>
        </Reveal>
      </div>

      <Newsletter eyebrow="Curated Island Inspirations" title="Make Moments That Last Across Bali" desc="Subscribe to receive secret luxury villa recommendations, off-the-beaten-path cultural itineraries, and private chauffeur seasonal privileges." cta="Join Privileges" />
      <BookingDialog open={open} onOpenChange={setOpen} type="Car Rental" item={car} option={option} unitPrice={total} unitLabel="Vehicle" defaultPax={2} extra={{ date }} />
    </div>
  );
};

export default CarDetail;
