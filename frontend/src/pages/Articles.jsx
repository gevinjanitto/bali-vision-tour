import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ChevronLeft, MapPin, Camera, Timer, CircleCheck, ArrowRight, MessageCircle, Info } from 'lucide-react';
import { PageHero, Newsletter } from '../components/Layout';
import { Reveal, Stagger, Item } from '../components/Reveal';
import { SectionHeading, Pill } from '../components/ui-bits';
import { ArticleCard } from '../components/Cards';
import Icon from '../components/Icon';
import IMG from '../mock/images';
import { FAQ_FACTS, TRENDING_TAGS } from '../mock/common';
import { useData } from '../context/DataContext';
import { formatDate } from '../lib/format';
import { openWhatsApp } from '../lib/whatsapp';

const PER_PAGE = 6;

const Articles = () => {
  const { articles } = useData();
  const all = articles.list();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [q, cat]);
  const cats = useMemo(() => ['All', ...Array.from(new Set(all.map((a) => a.category)))], [all]);
  const featured = all.find((a) => a.featured) || all[0];

  const filtered = useMemo(() => all.filter((a) => (cat === 'All' || a.category === cat) && (!q || `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(q.toLowerCase()))), [all, cat, q]);
  const listed = filtered.filter((a) => a.id !== featured?.id || cat !== 'All' || q);
  const pages = Math.max(1, Math.ceil(listed.length / PER_PAGE));
  const currentPage = Math.min(page, pages);
  const pageItems = listed.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div data-testid="articles-page">
      <PageHero image={IMG.agung} title="The Bali Travel Journal: Insider Guides & Curated Stories" desc="Handcrafted itineraries, cultural etiquette, hidden culinary spots, and expert advice from native Balinese locals to inspire mindful island exploration." eyebrow="Curated Local Insights">
        <Reveal delay={0.2} className="mt-10 bg-white rounded-3xl p-5 md:p-6 shadow-card">
          <div className="flex items-center gap-3 rounded-2xl bg-cream border border-ink/10 px-4 py-2"><Search className="w-4 h-4 text-ink/50" /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search articles, destinations, or tips (e.g., Mount Batur sunrise, Jimbaran seafood, Nyepi rules)..." className="flex-1 bg-transparent py-2 text-sm outline-none" data-testid="article-search" /><button className="btn-forest !py-2 !px-4 !text-xs">Find Guides</button></div>
          <div className="flex flex-wrap items-center gap-2 mt-4"><span className="text-[11px] uppercase tracking-[0.14em] font-bold text-ink/60 mr-1">Filter by:</span>{cats.map((c) => <button key={c} onClick={() => { setCat(c); setPage(1); }} className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${cat === c ? 'bg-forest text-white' : 'bg-cream-100 text-ink/80 hover:bg-cream-200'}`} data-testid={`article-cat-${c.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{c === 'All' ? `All Articles (${all.length})` : c}</button>)}</div>
        </Reveal>
      </PageHero>

      {featured && cat === 'All' && !q && (
        <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-12">
          <Reveal className="flex items-end justify-between"><SectionHeading eyebrow="Cover Editorial" title="Featured Guide of the Month" /><span className="text-xs text-sand hidden md:block">Updated for 2025 Explorers</span></Reveal>
          <Reveal delay={0.1} className="mt-8 bg-white rounded-3xl overflow-hidden shadow-card grid lg:grid-cols-12" data-testid="featured-article">
            <Link to={`/articles/${featured.slug}`} className="lg:col-span-7 relative h-80 lg:h-auto min-h-[420px] img-zoom overflow-hidden block">
              <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 flex gap-2"><Pill tone="brand" uppercase>Featured Expedition</Pill><Pill tone="forest">Nusa Penida Series</Pill></div>
              <div className="absolute bottom-5 left-5 flex gap-4 text-white text-xs"><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {featured.location}</span><span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> Original Photo Journal</span></div>
            </Link>
            <div className="lg:col-span-5 p-8 md:p-10 flex flex-col">
              <div className="flex flex-wrap items-center gap-3 text-xs text-sand"><span className="text-sage-700 font-semibold">{featured.category}</span><span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {featured.readTime}</span><span>{formatDate(featured.date)}</span></div>
              <h3 className="font-display font-bold text-ink text-2xl md:text-3xl leading-tight mt-3">{featured.title}</h3>
              <p className="text-sand text-sm leading-relaxed mt-4 flex-1">{featured.excerpt}</p>
              <ul className="mt-5 space-y-2 border-t border-ink/8 pt-5">{(featured.bullets || []).map((b) => <li key={b} className="flex items-start gap-2 text-sm text-ink/80"><CircleCheck className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" /> {b}</li>)}</ul>
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-ink/8"><div className="flex items-center gap-3"><img src={featured.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /><div><div className="font-semibold text-sm text-ink">{featured.author.name}</div><div className="text-xs text-sand">{featured.author.role}</div></div></div><Link to={`/articles/${featured.slug}`} className="text-sm font-bold text-brand inline-flex items-center gap-1.5 hover:gap-2.5 transition-all" data-testid="read-featured">Read Full Story <ArrowRight className="w-4 h-4" /></Link></div>
            </div>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pb-16 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Reveal className="flex items-end justify-between"><SectionHeading eyebrow="Field Notes & Dispatch" title="Latest Journal Dispatches" titleClass="!text-3xl" /><span className="text-xs text-sand">Showing {pageItems.length} Handcrafted Guides</span></Reveal>
          {pageItems.length === 0 ? <div className="mt-8 bg-white rounded-3xl p-12 text-center shadow-soft" data-testid="article-empty-state"><div className="font-display text-xl font-bold">No articles found</div><p className="text-sand text-sm mt-2">Try a different keyword or category.</p><button onClick={() => { setQ(''); setCat('All'); setPage(1); }} className="btn-outline mt-5" data-testid="article-reset-filters">Reset Filters</button></div> : (
            <Stagger className="grid sm:grid-cols-2 gap-6 mt-8">{pageItems.map((a) => <Item key={a.id}><ArticleCard article={a} /></Item>)}</Stagger>
          )}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10" data-testid="pagination">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="w-9 h-9 rounded-full border border-ink/10 flex items-center justify-center disabled:opacity-40 hover:bg-cream-100"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: pages }).map((_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-full text-sm font-semibold ${page === i + 1 ? 'bg-brand-800 text-white' : 'bg-cream-100 hover:bg-cream-200'}`}>{i + 1}</button>)}
              <button disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="w-9 h-9 rounded-full border border-ink/10 flex items-center justify-center disabled:opacity-40 hover:bg-cream-100"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>
        <Reveal delay={0.1} className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-gradient-to-br from-forest to-forest-700 text-white p-7 shadow-card grain relative overflow-hidden">
            <div className="relative z-10"><Pill tone="gold" uppercase>Bali Vision Tour Advantage</Pill><h3 className="font-display font-bold text-2xl mt-4">Turn Any Article Into Your Private Itinerary</h3><p className="text-white/80 text-sm mt-3">Found a hidden waterfall or temple in our guides? Our licensed English-speaking chauffeurs will craft a bespoke daily route with VIP transport.</p><ul className="mt-5 space-y-2 text-sm text-white/90">{['10-Hour Private Chauffeur & Fuel Included', 'Flexible Stops & Custom Start Times', 'Complimentary Cold Spring Water & Towels'].map((t) => <li key={t} className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-gold" /> {t}</li>)}</ul><button onClick={() => openWhatsApp('Halo, saya ingin membuat itinerary privat berdasarkan artikel di website Anda.')} className="btn-brand w-full mt-6 !rounded-xl" data-testid="article-wa-cta"><MessageCircle className="w-4 h-4" /> Chat on WhatsApp (+62 822)</button></div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="eyebrow flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Essential Bali Intelligence</div>
            <h3 className="font-display font-bold text-ink text-xl mt-1">Traveler Fast Facts &amp; FAQ</h3>
            <div className="space-y-3 mt-5">{FAQ_FACTS.map((f) => <div key={f.title} className="rounded-2xl bg-cream p-4"><div className="flex items-start justify-between gap-3"><div className="font-semibold text-ink text-sm">{f.title}</div><Icon name={f.icon} className="w-4 h-4 text-brand shrink-0" /></div><p className="text-xs text-sand mt-2 leading-relaxed">{f.desc}</p></div>)}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-soft"><h3 className="font-display font-bold text-ink text-lg">Trending Journal Topics</h3><div className="flex flex-wrap gap-2 mt-4">{TRENDING_TAGS.map((t) => <button key={t} onClick={() => setQ(t.replace('#', '').replace(/([A-Z])/g, ' $1').trim().split(' ')[0])} className="rounded-lg bg-cream-100 hover:bg-brand-50 hover:text-brand px-3 py-1.5 text-xs font-medium transition-colors">{t}</button>)}</div></div>
        </Reveal>
      </section>

      <Newsletter variant="card" eyebrow="Private Concierge Bulletin" title="Make Moments That Last Across Bali" desc="Receive secret luxury villa recommendations, off-the-beaten-path cultural itineraries, and private chauffeur seasonal privileges delivered once a fortnight. No spam—only pure island magic." cta="Subscribe Free" />
    </div>
  );
};

export default Articles;
