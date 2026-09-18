import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BadgeCheck, Share2, Link2, Bookmark, ShieldCheck, Clock, Landmark, Info, BookOpen, ThumbsUp, ThumbsDown, MessageCircle, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Reveal } from '../components/Reveal';
import { RichText } from '../components/RichText';
import { Pill } from '../components/ui-bits';
import { Newsletter } from '../components/Layout';
import Icon from '../components/Icon';
import { useData } from '../context/DataContext';
import { formatDate } from '../lib/format';
import { openWhatsApp } from '../lib/whatsapp';

const Block = ({ b }) => {
  switch (b.type) {
    case 'h2': return <h2 className="font-display font-bold text-ink text-2xl md:text-3xl mt-12 mb-4 leading-tight">{b.text}</h2>;
    case 'p': return <RichText value={b.text} className="text-ink/80 leading-[1.85] text-[16px] mt-4" />;
    case 'quote': return <blockquote className="my-8 border-l-4 border-brand bg-brand-50/60 rounded-r-2xl px-6 py-5"><p className="font-serif italic text-ink text-lg leading-relaxed">"{b.text}"</p>{b.cite && <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-brand-700 mt-3">— {b.cite}</div>}</blockquote>;
    case 'list': return <ul className="mt-4 space-y-2">{b.items.map((i) => <li key={i} className="flex items-start gap-2.5 text-ink/80"><span className="w-1.5 h-1.5 rounded-full bg-brand mt-2.5 shrink-0" /> {i}</li>)}</ul>;
    case 'steps': return (
      <div className="relative mt-8 pl-8 border-l-2 border-dashed border-sage-700/30 space-y-5">
        {b.items.map((s, i) => <div key={s.title} className="relative bg-white rounded-2xl p-5 shadow-soft"><span className={`absolute -left-[45px] top-4 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center ${i % 2 === 0 ? 'bg-brand-800' : 'bg-forest'}`}>{i + 1}</span><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] uppercase tracking-[0.16em] font-bold text-brand-700">{s.time}</span>{s.tag && <Pill tone={i % 2 === 0 ? 'brand-soft' : 'sage'}>{s.tag}</Pill>}</div><div className="font-display font-bold text-ink text-lg mt-1">{s.title}</div><p className="text-sm text-ink/70 leading-relaxed mt-1.5">{s.desc}</p></div>)}
      </div>
    );
    case 'gallery': return <div className="mt-8"><div className="font-display font-bold text-ink text-lg mb-3">Moments from the Expedition</div><div className="grid grid-cols-3 gap-3">{b.items.map((g, i) => <div key={i} className={`relative rounded-2xl overflow-hidden h-52 img-zoom ${i === 0 ? 'col-span-2' : ''}`}><img src={g.src} alt={g.label} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" /><div className="absolute bottom-3 left-3 text-white text-xs">{g.label}</div></div>)}</div></div>;
    case 'cards': return <div className="grid sm:grid-cols-2 gap-4 mt-6">{b.items.map((c) => <div key={c.title} className="bg-white rounded-2xl p-5 shadow-soft"><span className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center"><Icon name={c.icon} className="w-5 h-5" /></span><div className="font-display font-bold text-ink mt-4">{c.title}</div><p className="text-xs text-sand leading-relaxed mt-2">{c.desc}</p></div>)}</div>;
    default: return null;
  }
};

const ArticleDetail = () => {
  const { slug } = useParams();
  const { articles } = useData();
  const article = articles.get(slug);
  if (!article) return <div className="mx-auto max-w-7xl px-6 py-32 text-center"><h1 className="font-display text-3xl font-bold">Article not found</h1><Link to="/articles" className="btn-brand mt-6">Back to Journal</Link></div>;
  const related = articles.list().filter((a) => a.id !== article.id).slice(0, 3);
  const toc = (article.content || []).filter((b) => b.type === 'h2');
  const copy = () => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied to clipboard'); };

  return (
    <div data-testid="article-detail-page">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-8">
        <Reveal>
          <div className="flex flex-wrap gap-2">{(article.tags || [article.category, article.readTime]).map((t, i) => <Pill key={t} tone={i === 0 ? 'brand' : i === 3 ? 'sage' : 'sand'} uppercase>{t}</Pill>)}</div>
          <h1 className="font-display font-bold text-ink text-3xl md:text-5xl leading-[1.1] tracking-tight mt-5 max-w-4xl">{article.title}</h1>
          <p className="text-sand text-base md:text-lg mt-4 max-w-3xl leading-relaxed">{article.subtitle || article.excerpt}</p>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pb-6 border-b border-ink/8">
            <div className="flex items-center gap-3"><img src={article.author.avatar} alt="" className="w-11 h-11 rounded-full object-cover" /><div><div className="font-semibold text-ink text-sm flex items-center gap-1">{article.author.name} <BadgeCheck className="w-4 h-4 text-sage-700" /></div><div className="text-xs text-sand">{article.author.role} • {formatDate(article.date)} • Fact-checked by Bali Tourism Board</div></div></div>
            <div className="flex items-center gap-2 text-xs text-sand"><span className="uppercase tracking-wider font-bold mr-1">Share</span>{[Share2, Link2, Bookmark].map((I, i) => <button key={i} onClick={copy} className="w-9 h-9 rounded-full bg-cream-100 hover:bg-brand-50 hover:text-brand flex items-center justify-center transition-colors"><I className="w-4 h-4" /></button>)}</div>
          </div>
        </Reveal>
        <Reveal className="mt-8">
          <div className="relative rounded-3xl overflow-hidden h-72 md:h-[480px] shadow-card"><img src={article.image} alt={article.title} className="w-full h-full object-cover" /><div className="absolute top-4 right-4"><Pill tone="dark"><Camera className="w-3 h-3" /> {article.author.name}</Pill></div></div>
          {article.imageCaption && <p className="text-xs text-sand italic mt-3">{article.imageCaption}</p>}
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-12 grid lg:grid-cols-3 gap-10 items-start">
        <article className="lg:col-span-2">
          {article.highlights?.length > 0 && (
            <Reveal className="bg-cream-100 rounded-3xl p-6 md:p-8 border border-brand-100"><h3 className="font-display font-bold text-brand text-xl flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Curator's Highlights</h3><p className="text-sm text-ink/70 mt-2">Before lacing up your shoes, keep these essential rules in mind:</p><div className="grid sm:grid-cols-2 gap-4 mt-5">{article.highlights.map((h, i) => <div key={h} className="flex gap-3 text-sm text-ink font-medium"><Icon name={['Clock', 'Car', 'Landmark', 'UtensilsCrossed'][i % 4]} className="w-4 h-4 text-brand shrink-0 mt-0.5" /> {h}</div>)}</div></Reveal>
          )}
          <Reveal>{(article.content || []).map((b, i) => <Block key={i} b={b} />)}</Reveal>
          <Reveal className="mt-12 bg-cream-100 rounded-3xl p-6 md:p-8 border border-ink/5">
            <div className="flex flex-col sm:flex-row gap-5"><img src={article.author.avatar} alt="" className="w-16 h-16 rounded-full object-cover shrink-0" /><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="font-display font-bold text-ink text-lg">Written by {article.author.name}</div><div className="text-xs font-semibold text-brand">{article.author.role}</div></div>{article.author.license && <Pill tone="sand">{article.author.license}</Pill>}</div><RichText value={article.author.bio} className="text-sm text-ink/70 leading-relaxed mt-3" /><button onClick={() => openWhatsApp(`Halo, saya punya pertanyaan tentang artikel "${article.title}".`)} className="mt-4 text-sm font-semibold text-sage-700 inline-flex items-center gap-2 hover:text-brand transition-colors"><MessageCircle className="w-4 h-4" /> Have questions about this route? Ask directly via WhatsApp Concierge</button></div></div>
          </Reveal>
          <div className="mt-8 py-6 border-y border-ink/8 flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-ink">Was this travel guide helpful?</span><div className="flex gap-2"><button onClick={() => toast.success('Thanks for your feedback!')} className="btn-outline !py-2 !px-4 !text-xs"><ThumbsUp className="w-3.5 h-3.5" /> Yes, very helpful</button><button onClick={() => toast('We appreciate your honesty. Our editors will review this guide.')} className="btn-outline !py-2 !px-4 !text-xs"><ThumbsDown className="w-3.5 h-3.5" /> Could be better</button></div></div>
        </article>

        <Reveal delay={0.1} className="space-y-5 lg:sticky lg:top-24">
          {toc.length > 0 && <div className="bg-cream-100 rounded-3xl p-6 border border-ink/5"><div className="font-display font-bold text-ink flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand" /> Table of Contents</div><ul className="mt-4 space-y-2 text-sm">{toc.map((t, i) => <li key={t.text} className={`flex items-start gap-2 ${i === 0 ? 'text-brand font-semibold' : 'text-ink/70'}`}><span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${i === 0 ? 'bg-brand' : 'bg-ink/30'}`} /> {t.text}</li>)}</ul></div>}
          {article.facts?.length > 0 && <div className="bg-white rounded-3xl p-6 shadow-soft"><div className="font-display font-bold text-ink flex items-center gap-2"><Info className="w-4 h-4 text-brand" /> Traveler Fast Facts</div><div className="mt-4 divide-y divide-ink/8">{article.facts.map((f) => <div key={f.label} className="flex items-center justify-between py-2.5 text-sm"><span className="text-sand">{f.label}</span><span className="font-semibold text-ink text-right">{f.value}</span></div>)}</div></div>}
          <div className="bg-white rounded-3xl p-6 shadow-soft"><div className="font-display font-bold text-ink flex items-center gap-2"><Landmark className="w-4 h-4 text-brand" /> Related Guides &amp; Stories</div><div className="mt-4 space-y-4">{related.map((r) => <Link key={r.id} to={`/articles/${r.slug}`} className="flex gap-3 group"><img src={r.image} alt="" className="w-16 h-14 rounded-xl object-cover shrink-0" /><div><div className="text-sm font-semibold text-ink leading-snug group-hover:text-brand transition-colors clamp-2">{r.title}</div><div className="text-xs text-sand mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {r.readTime}</div></div></Link>)}</div></div>
        </Reveal>
      </div>

      <Newsletter eyebrow="Private Travel Journal" title="Make Moments That Last Across Bali" desc="Receive exclusive seasonal itineraries, early access to private yacht departures, and verified Balinese cultural calendars directly to your inbox." cta="Join Privileges" />
    </div>
  );
};

export default ArticleDetail;
