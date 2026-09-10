import React, { useState } from 'react';
import { Flame, Grid2x2, SlidersHorizontal, Mail, Phone, Users } from 'lucide-react';
import { PageHero, Newsletter } from '../components/Layout';
import { Reveal, Stagger, Item } from '../components/Reveal';
import { SectionHeading, Pill } from '../components/ui-bits';
import { ActivityCard } from '../components/Cards';
import BookingDialog from '../components/BookingDialog';
import Icon from '../components/Icon';
import IMG from '../mock/images';
import { ACTIVITY_WHY, COMPANY } from '../mock/common';
import { ACTIVITY_TYPES } from '../mock/activities';
import { useData } from '../context/DataContext';
import { openWhatsApp } from '../lib/whatsapp';

const typeIcon = { 'All Activities': 'LayoutGrid', 'Water Sports & Marine': 'Waves', 'Adventure & Trekking': 'Mountain', 'Culture & Workshops': 'Palette', 'Wellness & Spa': 'Flower2', 'Wildlife & Nature': 'PawPrint' };

const Activities = () => {
  const { activities } = useData();
  const all = activities.list();
  const [type, setType] = useState('All Activities');
  const [booking, setBooking] = useState(null);
  const list = type === 'All Activities' ? all : all.filter((a) => a.type === type);

  return (
    <div data-testid="activities-page">
      <PageHero image={IMG.batur} eyebrow="Authentic Island Adventures" eyebrowIcon={<Flame className="w-3.5 h-3.5" />} title="Thrilling Activities & Cultural Experiences" desc="Dive into the vibrant heart of Bali: adrenaline-fueled river rafting, sunrise volcano treks, sacred wellness rituals, and pristine marine encounters.">
        <Reveal delay={0.15} className="flex flex-wrap gap-3 mt-8">
          {[['Waves', '40+ Curated', 'Activities & Tours', 'sage'], ['ShieldCheck', '100% Insured', 'Certified Instructors', 'brand'], ['MessageCircle', '24/7 Concierge', 'Instant WhatsApp Support', 'brand']].map(([ic, t, s, tone]) => (
            <div key={t} className="flex items-center gap-3 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-soft"><span className={`w-9 h-9 rounded-full flex items-center justify-center ${tone === 'sage' ? 'bg-sage text-sage-700' : 'bg-brand-50 text-brand'}`}><Icon name={ic} className="w-4 h-4" /></span><div><div className="font-semibold text-ink text-sm leading-tight">{t}</div><div className="text-[11px] text-sand">{s}</div></div></div>
          ))}
        </Reveal>
        <Reveal delay={0.25} className="mt-8">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] font-bold text-ink/60 mb-3"><span>Filter by Experience Type:</span><span className="normal-case tracking-normal font-normal text-sand">Showing {list.length} Top Rated Experiences</span></div>
          <div className="bg-white rounded-full p-2 shadow-card flex gap-1 overflow-x-auto no-scrollbar" data-testid="activity-filters">
            {ACTIVITY_TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} className={`whitespace-nowrap flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition-colors ${type === t ? 'bg-forest text-white' : 'text-ink/80 hover:bg-cream-100'}`} data-testid={`activity-filter-${t.toLowerCase().replace(/[^a-z]+/g, '-')}`}><Icon name={typeIcon[t]} className="w-3.5 h-3.5" /> {t}</button>
            ))}
          </div>
        </Reveal>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <SectionHeading eyebrow="Handpicked Adventures" title="Featured Bali Activities" />
          <div className="text-xs text-sand flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-sage-700" /> All prices include standard equipment, round-trip transport availability &amp; insurance</div>
        </Reveal>
        {list.length === 0 ? <div className="mt-10 bg-white rounded-3xl p-14 text-center shadow-soft"><div className="font-display text-2xl font-bold">No activities in this category yet</div></div> : (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">{list.map((a) => <Item key={a.id}><ActivityCard activity={a} onBook={setBooking} /></Item>)}</Stagger>
        )}
      </section>

      <section className="bg-cream-100 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
          <Reveal><SectionHeading align="center" eyebrow="The Bali Vision Standard" title="Why Book Activities with Us" desc="We vet every single instructor, river run, and mountain guide in person so you experience Bali at its most magical and safest." /></Reveal>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {ACTIVITY_WHY.map((w) => (
              <Item key={w.title}><div className="bg-white rounded-2xl p-6 text-center shadow-soft lift h-full"><span className={`w-12 h-12 rounded-full inline-flex items-center justify-center ${w.tone === 'sage' ? 'bg-sage text-sage-700' : w.tone === 'sand' ? 'bg-cream-200 text-sand' : 'bg-brand-50 text-brand'}`}><Icon name={w.icon} className="w-5 h-5" /></span><h3 className="font-display font-bold text-ink text-lg mt-4">{w.title}</h3><p className="text-sand text-xs mt-2 leading-relaxed">{w.desc}</p></div></Item>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16">
        <Reveal className="sunset-band grain rounded-[28px] text-white">
          <div className="relative z-10 p-8 md:p-14 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <Pill tone="glass" uppercase><Users className="w-3 h-3" /> Group Gatherings &amp; Corporate Retreats</Pill>
              <h2 className="font-display font-bold text-3xl md:text-5xl leading-[1.05] mt-5">Planning a company outing, wedding group, or private retreat in Bali?</h2>
              <p className="text-white/85 mt-5 max-w-xl leading-relaxed">We organize seamless group activities and team-building adventures tailored to your schedule. Custom private buses, luxury beachside catering, and dedicated tour coordinators included.</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <button onClick={() => openWhatsApp('Halo, saya ingin inquiry paket group / corporate retreat di Bali.')} className="inline-flex items-center gap-2 rounded-full bg-white text-brand-800 font-bold px-6 py-3.5 text-sm shadow-card hover:bg-cream transition-colors" data-testid="inquire-group"><Mail className="w-4 h-4" /> Inquire Group Package</button>
              <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="btn-ghost-light"><Phone className="w-4 h-4" /> Call {COMPANY.phone}</a>
            </div>
          </div>
        </Reveal>
      </section>

      <Newsletter eyebrow="Stay Inspired" desc="Subscribe for secret waterfalls, exclusive cultural event dates, and seasonal Bali adventure privileges." />
      <BookingDialog key={booking?.id || 'none'} open={!!booking} onOpenChange={(o) => !o && setBooking(null)} type="Activity" item={booking} unitPrice={booking?.price} unitLabel="Person" defaultPax={2} />
    </div>
  );
};

export default Activities;
