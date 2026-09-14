import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MessageCircle, Search, ChevronDown, Tag, Compass, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Reveal, Stagger, Item } from '../components/Reveal';
import { SectionHeading, Pill, Stars } from '../components/ui-bits';
import { TourCard } from '../components/Cards';
import { Newsletter, ArrowLink } from '../components/Layout';
import Icon from '../components/Icon';
import IMG from '../mock/images';
import { HOME_STATS, HOME_CATEGORIES, DESTINATIONS, HOME_FEATURES, TESTIMONIALS } from '../mock/common';
import { TOUR_CATEGORIES } from '../mock/tours';
import { useData } from '../context/DataContext';
import { openWhatsApp } from '../lib/whatsapp';
import { bindContent } from '../lib/siteContent';

const SearchField = ({ icon: I, label, value, onChange, options, placeholder }) => (
  <div className="flex items-center gap-3 bg-white rounded-2xl border border-ink/8 px-4 py-2.5 flex-1 min-w-0">
    <span className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0"><I className="w-4 h-4" /></span>
    <div className="flex-1 min-w-0">
      <div className="text-[9px] uppercase tracking-[0.16em] font-bold text-sand">{label}</div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-6 p-0 border-0 shadow-none bg-transparent text-sm font-semibold text-ink focus:ring-0 [&>svg]:text-ink/50"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent className="rounded-xl">{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  </div>
);

const LineReveal = ({ lines, delay = 0.3 }) => (
  <>
    {lines.map((l, i) => (
      <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
        <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{l}</motion.span>
      </span>
    ))}
  </>
);

const Hero = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const [cat, setCat] = useState('All Categories');
  const [dest, setDest] = useState('');
  const [dur, setDur] = useState('Any Duration');
  const search = () => {
    const params = new URLSearchParams();
    if (cat && cat !== 'All Categories') params.set('category', cat);
    if (dest) params.set('destination', dest);
    if (dur && dur !== 'Any Duration') params.set('duration', dur);
    navigate(`/tour-packages?${params.toString()}`);
  };
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-4 md:pt-6" data-testid="hero">
      <motion.div ref={ref} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative rounded-[28px] md:rounded-[36px] overflow-hidden bg-forest text-white shadow-card grain min-h-[560px] md:min-h-[600px]">
        <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
          <motion.img src={IMG.hero} alt="Bali temple gate and volcano" className="w-full h-full object-cover object-center" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-forest/20 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent" />
        <motion.div style={{ y: contentY }} className="relative z-10 p-6 md:p-12 lg:p-14 flex flex-col justify-between min-h-[560px] md:min-h-[600px]">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-3.5 py-1.5 text-[10px] font-bold tracking-[0.18em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand pulse-dot" /> Authentic &amp; Bespoke Bali Escapes
            </motion.div>
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-[4.2rem] leading-[1.02] tracking-tight mt-6" data-testid="hero-title">
              <LineReveal lines={["Discover Bali's Soul,", <span key="a" className="font-serif italic font-medium text-brand">Craft Your Timeless</span>, <span key="b" className="font-serif italic font-medium text-brand">Journey.</span>]} />
            </h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }} className="mt-6 text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
              Handpicked private tours, thrilling island adventures, and premier transportation crafted for an unforgettable luxury holiday in the Island of the Gods.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-wrap items-center gap-3 mt-8">
              <Link to="/tour-packages" className="btn-brand" data-testid="hero-explore">Explore Tour Packages <ArrowRight className="w-4 h-4" /></Link>
              <button onClick={() => openWhatsApp('Halo Bali Vision Tour! Saya ingin konsultasi rencana liburan di Bali.')} className="btn-ghost-light" data-testid="hero-chat"><MessageCircle className="w-4 h-4" /> Chat Concierge</button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-10 bg-white rounded-3xl p-3 shadow-card flex flex-col lg:flex-row gap-3" data-testid="hero-search">
            <SearchField icon={Tag} label="Holiday Type" value={cat} onChange={setCat} options={['All Categories', ...TOUR_CATEGORIES]} placeholder="All Categories" />
            <SearchField icon={Compass} label="Destination" value={dest} onChange={setDest} options={DESTINATIONS.map((d) => d.name)} placeholder="Choose Destination" />
            <SearchField icon={Clock} label="Duration" value={dur} onChange={setDur} options={['Any Duration', '1 Day', '2-3 Days', '4+ Days']} placeholder="Any Duration" />
            <button onClick={search} className="btn-forest lg:w-52 !rounded-2xl !py-4" data-testid="hero-search-btn"><Search className="w-4 h-4" /> Find Experience</button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const StatsRow = () => (
  <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 mt-6">
    <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {HOME_STATS.map((s) => (
        <Item key={s.label}>
          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-soft lift" data-testid="stat-card">
            <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${s.tone === 'sage' ? 'bg-sage text-sage-700' : 'bg-brand-50 text-brand'}`}><Icon name={s.icon} className="w-5 h-5" /></span>
            <div>
              <div className="font-display font-bold text-ink text-lg leading-tight">{s.value}</div>
              <div className="text-xs text-sand">{s.label}</div>
            </div>
          </div>
        </Item>
      ))}
    </Stagger>
  </section>
);

const MARQUEE = bindContent('homeMarquee', ['Ubud Rice Terraces', 'Nusa Penida Cliffs', 'Uluwatu Kecak Sunset', 'Mount Batur Sunrise', 'Tirta Empul Blessing', 'Jimbaran Seafood', 'Lempuyang Gate of Heaven', 'Manta Ray Snorkeling']);

const Marquee = () => (
  <section className="mt-16 border-y border-ink/8 py-5 overflow-hidden" aria-hidden="true" data-testid="marquee">
    <div className="flex w-max marquee-slow">
      {[...MARQUEE, ...MARQUEE].map((t, i) => (
        <span key={i} className="flex items-center gap-6 pr-6 font-display font-semibold text-ink/70 text-lg md:text-2xl whitespace-nowrap">
          <span className={i % 2 ? 'font-serif italic font-medium text-brand' : ''}>{t}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
        </span>
      ))}
    </div>
  </section>
);

const Categories = () => (
  <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-20">
    <Reveal className="grid md:grid-cols-2 gap-6 items-end">
      <SectionHeading eyebrow="Exclusive Signature Categories" title="Curate Your Island Journey" />
      <p className="text-sand text-[15px] md:text-right md:justify-self-end max-w-md leading-relaxed">Discover our exclusive destinations and bespoke services tailored for ultimate comfort, flexibility, and unforgettable moments.</p>
    </Reveal>
    <Stagger className="grid md:grid-cols-3 gap-6 mt-10">
      {HOME_CATEGORIES.map((c) => (
        <Item key={c.index}>
          <Link to={c.to} className="group relative block h-[420px] rounded-3xl overflow-hidden shadow-card img-zoom" data-testid={`category-card-${c.index}`}>
            <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/50 to-transparent" />
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <Pill tone="white" uppercase>{c.index} &bull; {c.tag}</Pill>
              <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-colors duration-300"><ArrowUpRight className="w-4 h-4" /></span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="font-display font-bold text-2xl">{c.title}</h3>
              <p className="text-white/80 text-sm mt-2 leading-relaxed">{c.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold group-hover:gap-3 transition-all duration-300">{c.cta} <ArrowRight className="w-3.5 h-3.5" /></div>
            </div>
          </Link>
        </Item>
      ))}
    </Stagger>
  </section>
);

const Destinations = () => (
  <section className="bg-cream-100 py-20">
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
      <Reveal><SectionHeading align="center" eyebrow="Iconic Spots of Bali" title="Popular Destinations in Bali" desc="Unveil the breathtaking natural splendor and rich cultural sanctuary across Bali's most iconic corners." /></Reveal>
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {DESTINATIONS.map((d) => (
          <Item key={d.name}>
            <Link to={`/tour-packages?destination=${encodeURIComponent(d.name)}`} className="group relative block h-64 rounded-3xl overflow-hidden shadow-soft img-zoom" data-testid={`destination-${d.name.toLowerCase().replace(/\s/g, '-')}`}>
              <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <Pill tone={d.tagStyle === 'brand' ? 'brand' : 'glass'} uppercase={d.tagStyle === 'brand'}>{d.tag}</Pill>
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white flex items-center justify-center group-hover:bg-brand transition-colors duration-300"><ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-display font-bold text-2xl">{d.name}</h3>
                <p className="text-white/75 text-xs mt-1 leading-relaxed">{d.desc}</p>
              </div>
            </Link>
          </Item>
        ))}
      </Stagger>
    </div>
  </section>
);

const Bestselling = () => {
  const { tours } = useData();
  const list = tours.list().filter((t) => t.bestseller).slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-20">
      <Reveal>
        <Pill tone="brand-soft" className="!bg-white border border-brand-100"><Heart className="w-3 h-3" /> Guest Favorite Collection</Pill>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
          <SectionHeading title="Bestselling Tour Packages" desc="Curated signature tour packages with meticulously crafted itineraries for your dream escape." />
          <ArrowLink to="/tour-packages" className="border-b-2 border-brand pb-0.5">View All Packages</ArrowLink>
        </div>
      </Reveal>
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {list.map((t) => <Item key={t.id}><TourCard tour={t} compact /></Item>)}
      </Stagger>
    </section>
  );
};

const Comfort = () => (
  <section className="bg-cream-100 py-20">
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-start">
      <Reveal className="lg:col-span-5">
        <Pill tone="sage" className="!bg-white border border-sage"><ShieldCheck className="w-3 h-3" /> New Standard of Bali Travel</Pill>
        <h2 className="font-display font-bold text-forest text-4xl md:text-5xl leading-[1.05] tracking-tight mt-5">Uncompromised Comfort &amp; Peace of Mind</h2>
        <p className="text-sand mt-5 leading-relaxed">Bali Vision Tour is your trusted island partner. From scenic hidden gems to private chauffeurs, every itinerary is designed for a seamless, memorable experience.</p>
        <div className="mt-8 bg-forest text-white rounded-3xl p-6 flex items-start gap-4 shadow-card grain relative overflow-hidden">
          <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5 text-gold" /></span>
          <div>
            <div className="font-display font-bold text-lg">Privacy &amp; Absolute Flexibility</div>
            <p className="text-white/75 text-sm mt-1">Immaculate fleet, certified local drivers, and guaranteed itineraries without stress or rushing.</p>
          </div>
        </div>
      </Reveal>
      <Stagger className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
        {HOME_FEATURES.map((f) => (
          <Item key={f.index}>
            <div className="bg-white rounded-2xl p-6 shadow-soft lift h-full" data-testid={`feature-${f.index}`}>
              <div className="flex items-center justify-between">
                <Pill tone="brand-soft" uppercase>Feature {f.index}</Pill>
                <Icon name={f.icon} className="w-5 h-5 text-brand" />
              </div>
              <h3 className="font-display font-bold text-ink text-lg mt-5">{f.title}</h3>
              <p className="text-sand text-sm mt-2 leading-relaxed">{f.desc}</p>
            </div>
          </Item>
        ))}
      </Stagger>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-20">
    <Reveal><SectionHeading align="center" eyebrow="Voices of Travelers" title="Why Our Guests Keep Returning" desc="Hear directly from travelers who trusted Bali Vision Tour for their island adventures." titleClass="text-forest" /></Reveal>
    <Stagger className="grid md:grid-cols-2 gap-6 mt-12">
      {TESTIMONIALS.map((t) => (
        <Item key={t.name}>
          <div className="bg-white rounded-3xl p-7 shadow-soft lift h-full flex flex-col" data-testid="testimonial-card">
            <Stars value={5} className="w-4 h-4" />
            <p className="font-serif italic text-ink/85 text-[17px] leading-relaxed mt-4 flex-1">"{t.text}"</p>
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-ink/8">
              <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
              <div><div className="font-semibold text-ink text-sm">{t.name}</div><div className="text-xs text-sand">{t.location}</div></div>
            </div>
          </div>
        </Item>
      ))}
    </Stagger>
  </section>
);

const Home = () => (
  <div data-testid="home-page">
    <Hero />
    <StatsRow />
    <Marquee />
    <Categories />
    <Destinations />
    <Bestselling />
    <Comfort />
    <Testimonials />
    <Newsletter variant="card" />
  </div>
);

export default Home;
