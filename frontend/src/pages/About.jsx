import React from 'react';
import { Sparkles, ArrowDown, MessageCircle, Star, BadgeCheck, ArrowRight } from 'lucide-react';
import { Newsletter } from '../components/Layout';
import { Reveal, Stagger, Item } from '../components/Reveal';
import { SectionHeading, Pill, Stars } from '../components/ui-bits';
import Icon from '../components/Icon';
import IMG from '../mock/images';
import { ABOUT } from '../mock/common';
import { openWhatsApp } from '../lib/whatsapp';

const toneBg = { brand: 'bg-brand-50 text-brand', sage: 'bg-sage text-sage-700', sand: 'bg-cream-200 text-sand' };

const About = () => (
  <div data-testid="about-page">
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-10 md:pt-16 grid lg:grid-cols-2 gap-12 items-center">
      <Reveal>
        <Pill tone="brand-soft" uppercase className="!bg-white border border-brand-100"><Sparkles className="w-3 h-3" /> The Soul of Balinese Travel</Pill>
        <h1 className="font-display font-bold text-ink text-4xl md:text-6xl leading-[1.02] tracking-tight mt-6">Crafting Unforgettable Balinese Journeys with <span className="font-serif italic font-medium text-brand">Heart &amp; Heritage</span></h1>
        <p className="text-sand mt-6 text-[17px] leading-relaxed max-w-xl">Founded on authentic hospitality and deep reverence for the Island of the Gods, Bali Vision Tour blends curated luxury with grassroots Balinese warmth under the care of licensed, insured local professionals.</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <a href="#story" className="btn-brand !bg-brand-800 hover:!bg-brand-700">Read Our Story <ArrowDown className="w-4 h-4" /></a>
          <button onClick={() => openWhatsApp('Halo Bali Vision Tour! Saya ingin berbicara dengan concierge.')} className="btn-outline"><MessageCircle className="w-4 h-4" /> Chat with Concierge</button>
        </div>
      </Reveal>
      <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
        {[[IMG.lempuyang2, 'Sacred Heritage', 'h-60 md:h-72'], [IMG.suv2, 'Chauffeured Comfort', 'h-44 md:h-52 mt-6'], [IMG.staff2, 'Native Hospitality', 'h-44 md:h-52'], [IMG.ubud, 'Untouched Vistas', 'h-60 md:h-72 -mt-10']].map(([src, l, h]) => (
          <div key={l} className={`relative rounded-2xl overflow-hidden img-zoom shadow-card ${h}`}><img src={src} alt={l} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" /><div className="absolute bottom-3 left-3 text-white text-[10px] uppercase tracking-[0.16em] font-bold">{l}</div></div>
        ))}
      </Reveal>
    </section>

    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16">
      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-y border-ink/8 py-10">
        {ABOUT.stats.map((s) => <Item key={s.label}><div><div className={`font-display font-bold text-4xl md:text-5xl ${s.tone === 'forest' ? 'text-forest' : 'text-brand-700'}`}>{s.value}{s.suffix && <span className="text-lg text-sand">{s.suffix}</span>}{s.suffix && <Star className="inline w-5 h-5 ml-1 fill-gold text-gold" />}</div><div className="font-semibold text-ink mt-2">{s.label}</div><div className="text-xs text-sand">{s.sub}</div></div></Item>)}
      </Stagger>
    </section>

    <section id="story" className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pb-20 grid lg:grid-cols-12 gap-12 items-center">
      <Reveal className="lg:col-span-5 relative">
        <div className="rounded-3xl overflow-hidden h-[440px] img-zoom shadow-card"><img src={IMG.group} alt="Guide with travelers" className="w-full h-full object-cover" /></div>
        <div className="absolute -bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-card" data-testid="about-story-card"><div className="eyebrow">Since 2014</div><div className="font-display font-bold text-ink text-lg mt-1">Bali Vision Tour</div><div className="text-xs text-sand mt-0.5">Licensed &amp; insured tour operator based in Denpasar, Bali</div></div>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-7 lg:pl-6">
        <div className="eyebrow flex items-center gap-3"><span className="w-8 h-px bg-brand" /> Our Humble Roots</div>
        <h2 className="font-display font-bold text-ink text-4xl md:text-5xl leading-[1.05] tracking-tight mt-4">Born in Denpasar, Rooted Across the Archipelago</h2>
        <div className="space-y-4 mt-6 text-ink/75 leading-relaxed text-[15px]">
          <p>Bali Vision Tour emerged from a profound conviction: travel across Bali should never feel transactional. In 2014, our founder, Wayan Sudiarta, began escorting small groups of curious visitors across Mount Batur and Bedugul with a single well-maintained MPV and a genuine desire to unveil the island's mystical sanctity beyond tourist corridors.</p>
          <p>As <b className="text-ink">Bali Vision Tour</b>, we grew into a licensed premier destination management company. What remains unaltered is our philosophy of <i className="font-serif text-brand">Tri Hita Karana</i>—the sacred Balinese principle harmonizing human connection, pristine nature, and spiritual heritage.</p>
          <p>Today, with our own fleet of pristine luxury MPVs, private speedboats, and an elite network of certified native Balinese storytellers, we deliver bespoke, private day tours, airport VIP transfers, and curated retreats with uncompromised integrity.</p>
        </div>
        <div className="mt-8 flex items-center gap-4 bg-white border border-sage rounded-2xl p-5 shadow-soft"><span className="w-11 h-11 rounded-full bg-sage text-sage-700 flex items-center justify-center shrink-0"><BadgeCheck className="w-5 h-5" /></span><div><div className="font-semibold text-ink">Registered Tourism Operator in Bali</div><div className="text-xs text-sand">Fully insured vehicles, licensed local guides, transparent billing with zero tourist surcharges.</div></div></div>
      </Reveal>
    </section>

    <section className="bg-cream-100 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <Reveal><SectionHeading align="center" eyebrow="Our Operating Creed" title="The Four Pillars of Bali Vision Tour" desc="Every itinerary, chauffeur assignment, and bespoke itinerary is guided by our four non-negotiable promises." /></Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {ABOUT.pillars.map((p) => <Item key={p.title}><div className="bg-white rounded-2xl p-6 shadow-soft lift h-full flex flex-col"><span className={`w-12 h-12 rounded-xl flex items-center justify-center ${toneBg[p.tone]}`}><Icon name={p.icon} className="w-5 h-5" /></span><h3 className="font-display font-bold text-ink text-xl mt-5">{p.title}</h3><p className="text-sand text-sm mt-3 leading-relaxed flex-1">{p.desc}</p><div className="mt-5 pt-4 border-t border-ink/8 text-xs font-bold text-brand inline-flex items-center gap-1">{p.link} <ArrowRight className="w-3.5 h-3.5" /></div></div></Item>)}
        </Stagger>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-20">
      <Reveal className="grid md:grid-cols-2 gap-6 items-end"><SectionHeading eyebrow="The Stewards of Your Journey" title="Meet Our Leadership & Concierge Team" /><p className="text-sand md:text-right max-w-md md:justify-self-end">Over 40 certified Balinese professionals, mechanics, dispatchers, and guides united by warm family values.</p></Reveal>
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {ABOUT.team.map((m) => <Item key={m.name}><div className="bg-white rounded-2xl overflow-hidden shadow-soft lift" data-testid="team-card"><div className="relative h-64 img-zoom overflow-hidden"><img src={m.image} alt={m.name} className="w-full h-full object-cover" loading="lazy" /><div className="absolute bottom-3 left-3"><Pill tone="dark" uppercase>{m.tag}</Pill></div></div><div className="p-5"><div className="font-display font-bold text-ink text-lg">{m.name}</div><div className="text-xs font-semibold text-brand">{m.role}</div><p className="text-xs text-sand mt-3 leading-relaxed">{m.desc}</p></div></div></Item>)}
      </Stagger>
    </section>

    <section className="sunset-band grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-12 items-center text-white">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-gold-100">Sustainable &amp; Ethical Stewardship</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1.05] mt-3">Protecting the Sacred Island We Call Home</h2>
          <p className="text-white/85 mt-5 leading-relaxed">As native custodians of Bali, Bali Vision Tour commits 5% of annual proceeds to direct community eco-funds, artisan guilds, and temple preservation trusts across Bali's less traveled rural regencies.</p>
          <div className="space-y-3 mt-8">{ABOUT.sustainability.map((s) => <div key={s.title} className="flex gap-4 rounded-2xl border border-white/25 bg-white/10 p-4"><Icon name={s.icon} className="w-5 h-5 text-gold shrink-0 mt-0.5" /><div><div className="font-semibold">{s.title}</div><div className="text-xs text-white/80 mt-1">{s.desc}</div></div></div>)}</div>
        </Reveal>
        <Reveal delay={0.15} className="relative rounded-3xl overflow-hidden h-[420px] shadow-card img-zoom"><img src={IMG.riceMist} alt="Rice terraces" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" /><div className="absolute bottom-6 left-6 right-6"><div className="text-[10px] uppercase tracking-[0.16em] font-bold text-gold">The Subak Tradition</div><div className="font-display font-bold text-2xl mt-1">UNESCO World Heritage Cultural Landscape</div><p className="text-xs text-white/80 mt-1">We educate every guest on Bali's ancient cooperative water management systems dating back to the 9th century.</p></div></Reveal>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-20">
      <Reveal><SectionHeading align="center" eyebrow="Guest Reflections" title="Voices of Our Travelers" desc="Stories shared by couples, families, and solo adventurers who explored Bali with us." /></Reveal>
      <Stagger className="grid md:grid-cols-3 gap-5 mt-12">
        {ABOUT.voices.map((v) => <Item key={v.name}><div className="bg-white rounded-3xl p-7 shadow-soft lift h-full flex flex-col"><Stars value={5} className="w-4 h-4" /><p className="font-serif italic text-ink/85 leading-relaxed mt-4 flex-1 text-[15px]">"{v.text}"</p><div className="flex items-center gap-3 mt-6 pt-5 border-t border-ink/8"><span className="w-10 h-10 rounded-full bg-brand-50 text-brand font-bold text-xs flex items-center justify-center">{v.initials}</span><div><div className="font-semibold text-ink text-sm">{v.name}</div><div className="text-xs text-sand">{v.meta}</div></div></div></div></Item>)}
      </Stagger>
    </section>

    <Newsletter variant="card" eyebrow="Curated Invitations" title="Make Moments That Last Across Bali" desc="Receive secret luxury villa recommendations, off-the-beaten-path cultural itineraries, and private chauffeur seasonal privileges." cta="Subscribe Free" />
  </div>
);

export default About;
