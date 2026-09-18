import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sun, MapPin, CalendarDays, Wallet, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { PageHero, Newsletter } from '../components/Layout';
import { Reveal, Stagger, Item } from '../components/Reveal';
import { SectionHeading } from '../components/ui-bits';
import { TourCard } from '../components/Cards';
import Icon from '../components/Icon';
import IMG from '../mock/images';
import { TOUR_PERKS, DESTINATIONS } from '../mock/common';
import { TOUR_CATEGORIES } from '../mock/tours';
import { useData } from '../context/DataContext';

const FilterSelect = ({ icon: I, label, value, onChange, options, placeholder }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-ink/60 mb-2">{label}</div>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger data-testid={`tour-select-${placeholder.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="h-12 rounded-xl bg-cream border-ink/10 text-sm font-medium"><span className="flex items-center gap-2"><I className="w-4 h-4 text-brand" /><SelectValue placeholder={placeholder} /></span></SelectTrigger>
      <SelectContent className="rounded-xl">{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);

const TourPackages = () => {
  const { tours } = useData();
  const all = tours.list();
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [destination, setDestination] = useState(params.get('destination') || 'All Bali Destinations');
  const [duration, setDuration] = useState(params.get('duration') || 'Any Length');
  const [budget, setBudget] = useState(params.get('budget') || 'All Price Ranges');
  const [visible, setVisible] = useState(9);
  useEffect(() => { setVisible(9); }, [category, destination, duration, budget]);
  useEffect(() => {
    setCategory(params.get('category') || 'All');
    setDestination(params.get('destination') || 'All Bali Destinations');
    setDuration(params.get('duration') || 'Any Length');
    setBudget(params.get('budget') || 'All Price Ranges');
  }, [params]);
  const reset = () => {
    setCategory('All'); setDestination('All Bali Destinations');
    setDuration('Any Length'); setBudget('All Price Ranges');
    setVisible(9); setParams({});
  };

  const filtered = useMemo(() => all.filter((t) => {
    if (category !== 'All' && t.category !== category) return false;
    if (destination !== 'All Bali Destinations') {
      const hay = `${t.title} ${t.region} ${t.description} ${(t.highlights || []).join(' ')}`.toLowerCase();
      if (!hay.includes(destination.toLowerCase())) return false;
    }
    if (duration === '1 Day' && t.days !== 1) return false;
    if (duration === '2-3 Days' && !(t.days >= 2 && t.days <= 3)) return false;
    if (duration === '4+ Days' && t.days < 4) return false;
    if (budget === 'Under Rp 1,000,000' && t.price >= 1000000) return false;
    if (budget === 'Rp 1,000,000 - 3,000,000' && (t.price < 1000000 || t.price > 3000000)) return false;
    if (budget === 'Above Rp 3,000,000' && t.price <= 3000000) return false;
    return true;
  }), [all, category, destination, duration, budget]);

  const apply = () => {
    const p = new URLSearchParams();
    if (category !== 'All') p.set('category', category);
    if (destination !== 'All Bali Destinations') p.set('destination', destination);
    if (duration !== 'Any Length') p.set('duration', duration);
    if (budget !== 'All Price Ranges') p.set('budget', budget);
    setParams(p);
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div data-testid="tour-packages-page">
      <PageHero image={IMG.bedugul} eyebrow="Sun-Drenched Tropical Luxe" eyebrowIcon={<Sun className="w-3.5 h-3.5" />} title="Curated Tour Packages" titleAccent="in Bali" desc="Immerse yourself in authentic Balinese culture, sacred temples, stunning waterfalls, and island escapades with dedicated private guides and comfortable chauffeur-driven fleets.">
        <Reveal delay={0.2} className="mt-10 bg-white rounded-3xl p-6 md:p-7 shadow-card">
          <div className="flex flex-wrap items-center gap-2" data-testid="tour-filter-chips">
            <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-ink/60 mr-2">Filter by:</span>
            {['All', ...TOUR_CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${category === c ? 'bg-forest text-white' : 'bg-cream-100 text-ink/80 hover:bg-cream-200'}`} data-testid={`chip-${c.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                {c === 'All' ? `All Packages (${all.length})` : c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-4 gap-4 mt-6 items-end">
            <FilterSelect icon={MapPin} label="Destination Region" value={destination} onChange={setDestination} options={['All Bali Destinations', ...DESTINATIONS.map((d) => d.name)]} placeholder="All Bali Destinations" />
            <FilterSelect icon={CalendarDays} label="Duration" value={duration} onChange={setDuration} options={['Any Length', '1 Day', '2-3 Days', '4+ Days']} placeholder="Any Length" />
            <FilterSelect icon={Wallet} label="Budget Tier (IDR)" value={budget} onChange={setBudget} options={['All Price Ranges', 'Under Rp 1,000,000', 'Rp 1,000,000 - 3,000,000', 'Above Rp 3,000,000']} placeholder="All Price Ranges" />
            <button onClick={apply} className="btn-brand h-12 !rounded-xl" data-testid="apply-filters"><SlidersHorizontal className="w-4 h-4" /> Apply Filters</button>
          </div>
        </Reveal>
      </PageHero>

      <section className="bg-cream-100 border-y border-ink/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-8 grid grid-cols-2 md:grid-cols-5 gap-6 divide-x-0 md:divide-x divide-ink/8">
          {TOUR_PERKS.map((p) => (
            <div key={p.title} className="text-center px-2">
              <span className="w-11 h-11 rounded-full bg-sage text-sage-700 inline-flex items-center justify-center"><Icon name={p.icon} className="w-5 h-5" /></span>
              <div className="font-semibold text-ink text-sm mt-3">{p.title}</div>
              <div className="text-xs text-sand">{p.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="packages" className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <SectionHeading eyebrow="Handpicked Itineraries" title="Featured Travel Packages" />
          <div className="text-sm text-sand" data-testid="tour-count">Showing {Math.min(visible, filtered.length)} of {filtered.length} exclusive island experiences</div>
        </Reveal>
        {filtered.length === 0 ? (
          <div data-testid="tour-empty-state" className="mt-12 text-center bg-white rounded-3xl p-14 shadow-soft">
            <div className="font-display text-2xl text-ink font-bold">No packages match your filters</div>
            <p className="text-sand mt-2">Try broadening your destination or duration.</p>
            <button onClick={reset} className="btn-outline mt-6" data-testid="tour-reset-filters">Reset Filters</button>
          </div>
        ) : (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filtered.slice(0, visible).map((t) => <Item key={t.id}><TourCard tour={t} /></Item>)}
          </Stagger>
        )}
        {filtered.length > visible && (
          <div className="text-center mt-12">
            <button onClick={() => setVisible((v) => v + 6)} className="btn-outline !border-forest !text-forest" data-testid="load-more">Load More Packages <ChevronDown className="w-4 h-4" /></button>
            <div className="text-xs text-sand mt-3">Showing {visible} of {filtered.length} curated Bali adventures</div>
          </div>
        )}
      </section>

      <Newsletter eyebrow="Insider Bali Dispatch" desc="Join 12,000+ discerning travelers receiving curated hidden temple routes, seasonal secret waterfalls, and VIP rate privileges." />
    </div>
  );
};

export default TourPackages;
