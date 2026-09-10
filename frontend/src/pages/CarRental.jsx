import React, { useState } from 'react';
import { ShieldCheck, Car, Search, CalendarDays, CircleCheck, Plane, MapPin, Send, MessageCircle, ArrowRight, Radar, Clock, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { PageHero, Newsletter } from '../components/Layout';
import { Reveal, Stagger, Item } from '../components/Reveal';
import { SectionHeading, Pill } from '../components/ui-bits';
import { CarCard } from '../components/Cards';
import BookingDialog from '../components/BookingDialog';
import Icon from '../components/Icon';
import IMG from '../mock/images';
import { AIRPORT_RATES, CAR_INCLUSIONS } from '../mock/common';
import { CAR_FILTERS } from '../mock/cars';
import { useData } from '../context/DataContext';
import { formatIDR } from '../lib/format';
import { openWhatsApp } from '../lib/whatsapp';

const Field = ({ label, children }) => (
  <div><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">{label}</div>{children}</div>
);

const CarRental = () => {
  const { cars } = useData();
  const all = cars.list();
  const [filter, setFilter] = useState('All Vehicles');
  const [vehicle, setVehicle] = useState(all[1]?.id || all[0]?.id);
  const [pkg, setPkg] = useState('Car + Driver + Petrol (10 Hours)');
  const [date, setDate] = useState(null);
  const [booking, setBooking] = useState(null);
  const [option, setOption] = useState(null);

  const list = filter === 'All Vehicles' ? all : all.filter((c) => c.filter === filter);

  const checkAvailability = () => {
    const car = all.find((c) => c.id === vehicle) || all[0];
    setOption(pkg);
    setBooking(car);
  };

  return (
    <div data-testid="car-rental-page">
      <PageHero image={IMG.bedugul} eyebrow="Official VIP Chauffeur Services • Bali Island" eyebrowIcon={<ShieldCheck className="w-3.5 h-3.5" />} title="Private Car Rental & Chauffeur Services in Bali" desc="Travel with ultimate peace of mind. Immaculate, air-conditioned vehicles driven by professional, English-speaking local drivers. Fuel, insurance, and unlimited smiles included.">
        <Reveal delay={0.2} className="mt-10 bg-white rounded-3xl p-6 md:p-7 shadow-card" data-testid="fleet-calculator">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-display font-bold text-ink"><Car className="w-5 h-5 text-brand" /> Fleet Availability &amp; Instant Rate Calculator</div>
            <Pill tone="sage">All-Inclusive Flat Pricing Guarantee</Pill>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mt-6 items-end">
            <Field label="Select Vehicle Category">
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger className="h-12 rounded-xl bg-cream border-ink/10 text-sm font-medium"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">{all.map((c) => <SelectItem key={c.id} value={c.id}>{c.category} ({c.name.split(' ').slice(1, 3).join(' ')})</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Service Package">
              <Select value={pkg} onValueChange={setPkg}>
                <SelectTrigger className="h-12 rounded-xl bg-cream border-ink/10 text-sm font-medium"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">{['Car + Driver + Petrol (10 Hours)', 'Car + Driver + Petrol (12 Hours)', 'Airport Transfer (One Way)', 'Multi-day Charter'].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Pickup Date & Time">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full h-12 rounded-xl bg-cream border border-ink/10 px-4 text-sm flex items-center justify-between hover:border-brand/40 transition-colors" data-testid="fleet-date"><span className={date ? 'text-ink font-medium' : 'text-ink/40'}>{date ? format(date, 'dd/MM/yyyy') : 'Select date'}</span><CalendarDays className="w-4 h-4 text-brand" /></button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto rounded-2xl" align="start"><Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} initialFocus /></PopoverContent>
              </Popover>
            </Field>
            <button onClick={checkAvailability} className="btn-brand h-12 !rounded-xl !bg-brand-800 hover:!bg-brand-700" data-testid="check-fleet"><Search className="w-4 h-4" /> Check Fleet Availability</button>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-5 text-xs text-ink/70">
            {['Zero hidden taxes or credit card fees', 'English-speaking chauffeur confirmed with license', 'Free cancellation up to 24h before pick-up', 'Complimentary bottled mineral water & cold towels'].map((t) => <span key={t} className="flex items-center gap-1.5"><CircleCheck className="w-3.5 h-3.5 text-sage-700" /> {t}</span>)}
          </div>
        </Reveal>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="eyebrow flex items-center gap-2"><Car className="w-3.5 h-3.5" /> Curated Luxury Fleet</div>
            <h2 className="font-display font-bold text-ink text-4xl md:text-5xl leading-[1.05] tracking-tight mt-3">Explore Private Vehicles &amp; Rates</h2>
            <p className="text-sand mt-4 max-w-xl text-[15px]">All rates include brand-new sanitized vehicles, experienced professional drivers, standard gasoline/fuel, and hotel pickup across South &amp; Central Bali.</p>
          </div>
          <div className="flex flex-wrap gap-2" data-testid="car-filters">
            {CAR_FILTERS.map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${filter === f ? 'bg-forest text-white' : 'bg-cream-100 text-ink/80 hover:bg-cream-200'}`} data-testid={`car-filter-${f.toLowerCase().replace(/\s/g, '-')}`}>{f}</button>)}
          </div>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {list.map((c) => <Item key={c.id}><CarCard car={c} onBook={(car) => { setOption('Car + Driver + Petrol (10 Hours)'); setBooking(car); }} /></Item>)}
        </Stagger>
      </section>

      <section className="bg-cream-100 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
          <Reveal><SectionHeading align="center" eyebrow="The Bali Vision Distinction" title="What Is Always Included In Your Charter" desc="Experience stress-free travel across the Island of the Gods with complete transparent rates and unmatched hospitality." /></Reveal>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {CAR_INCLUSIONS.map((c) => (
              <Item key={c.title}>
                <div className="bg-white rounded-2xl p-6 shadow-soft lift h-full">
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center ${c.tone === 'sage' ? 'bg-sage text-sage-700' : 'bg-brand-50 text-brand'}`}><Icon name={c.icon} className="w-5 h-5" /></span>
                  <h3 className="font-display font-bold text-ink text-lg mt-5">{c.title}</h3>
                  <p className="text-sand text-sm mt-2 leading-relaxed">{c.desc}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-5">
          <div className="eyebrow flex items-center gap-2"><Plane className="w-3.5 h-3.5" /> Airport Direct Service</div>
          <h2 className="font-display font-bold text-ink text-4xl md:text-5xl leading-[1.05] tracking-tight mt-3">Ngurah Rai Airport (DPS) Meet &amp; Greet Transfers</h2>
          <p className="text-sand mt-5 leading-relaxed">Skip lengthy taxi lines and airport negotiation stress. Your chauffeur awaits at the arrival terminal holding a personalized sign with your name, ready to assist with baggage and escort you to your air-conditioned vehicle.</p>
          <ul className="mt-6 space-y-2.5 text-sm text-ink/80">
            {[[Radar, 'Flight tracker monitoring for delayed flights at no extra charge'], [Clock, 'Up to 90 minutes complimentary airport waiting time after touchdown'], [Ticket, 'Includes all airport parking and highway toll road tickets']].map(([I, t]) => <li key={t} className="flex items-center gap-2.5"><I className="w-4 h-4 text-sage-700" /> {t}</li>)}
          </ul>
          <button onClick={() => { setOption('Airport Transfer (One Way)'); setBooking(all[1] || all[0]); }} className="btn-forest mt-8" data-testid="prebook-airport"><Send className="w-4 h-4" /> Pre-Book Airport Chauffeur</button>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden" data-testid="airport-rates">
            <div className="flex items-center justify-between px-6 py-4 bg-cream-100"><div className="font-display font-bold text-ink">Fixed Destination Rates (Per Vehicle)</div><span className="text-xs font-semibold text-brand">Standard MPV (Up to 4 Pax)</span></div>
            <div className="divide-y divide-ink/8">
              {AIRPORT_RATES.map((r) => (
                <div key={r.route} className="flex items-center gap-4 px-6 py-4 hover:bg-cream/60 transition-colors">
                  <span className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0"><MapPin className="w-4 h-4" /></span>
                  <div className="flex-1"><div className="font-semibold text-ink text-sm">{r.route.replace('->', '→')}</div><div className="text-xs text-sand">{r.meta}</div></div>
                  <div className="text-right"><div className="font-display font-bold text-brand-700">{formatIDR(r.price)}</div><div className="text-[9px] uppercase tracking-wider text-sand font-bold">Net Price</div></div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-6 py-4 bg-cream text-xs"><span className="text-sand">Need an Innova or HiAce upgrade for airport transfer?</span><button onClick={() => openWhatsApp('Halo, saya ingin upgrade kendaraan untuk airport transfer.')} className="text-brand font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">Contact Fleet Desk <ArrowRight className="w-3.5 h-3.5" /></button></div>
          </div>
        </Reveal>
      </section>

      <section className="sunset-band grain">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-16 grid md:grid-cols-3 gap-8 items-center text-white">
          <div className="md:col-span-2">
            <Pill tone="glass" uppercase>24/7 Bali Concierge Desk</Pill>
            <h2 className="font-display font-bold text-3xl md:text-5xl leading-[1.05] mt-4">Need an immediate driver or custom multi-day charter?</h2>
            <p className="text-white/85 mt-4 max-w-xl">Chat directly with our bilingual transport dispatch. Receive instant confirmations, custom quotes for Nusa Penida tours, or tailored multi-vehicle wedding fleets.</p>
          </div>
          <div className="md:justify-self-end"><button onClick={() => openWhatsApp('Halo, saya butuh driver / charter multi-day di Bali. Bisa bantu?')} className="inline-flex items-center gap-2 rounded-full bg-white text-brand-800 font-bold px-6 py-3.5 text-sm shadow-card hover:bg-cream transition-colors" data-testid="wa-quick-booking"><MessageCircle className="w-4 h-4 text-sage-700" /> WhatsApp Quick Booking</button></div>
        </div>
      </section>

      <Newsletter desc="Receive exclusive Bali travel guides, secret beach recommendations, and VIP chauffeur privileges directly to your inbox." />
      <BookingDialog key={booking?.id || 'none'} open={!!booking} onOpenChange={(o) => !o && setBooking(null)} type="Car Rental" item={booking} option={option} unitPrice={booking ? (option?.includes('12 Hours') ? booking.price12h : booking.price) : null} unitLabel="Vehicle" defaultPax={2} extra={{ date }} />
    </div>
  );
};

export default CarRental;
