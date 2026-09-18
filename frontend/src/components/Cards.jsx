import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star, CircleCheck, Timer, ChevronRight } from 'lucide-react';
import { Pill } from './ui-bits';
import Icon from './Icon';
import { formatIDR, formatDate } from '../lib/format';

export const TourCard = ({ tour, compact = false }) => (
  <Link to={`/tour-packages/${tour.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-soft lift" data-testid={`tour-card-${tour.slug}`}>
    <div className={`relative img-zoom overflow-hidden ${compact ? 'h-40' : 'h-56'}`}>
      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        {tour.badge && <Pill tone={tour.badge === 'Top Rated' ? 'brand' : tour.badge === 'Sunset Highlight' ? 'brand' : 'brand'} uppercase>{tour.badge}</Pill>}
        <Pill tone="white">{tour.category}</Pill>
      </div>
      {!compact && <div className="absolute bottom-3 right-3"><Pill tone="dark"><Clock className="w-3 h-3" /> {tour.duration}</Pill></div>}
    </div>
    <div className={compact ? 'p-4' : 'p-5'}>
      <div className="flex items-center justify-between text-[11px]">
        {compact ? (
          <span className="flex items-center gap-1 text-sand"><Clock className="w-3 h-3" /> {tour.duration}</span>
        ) : (
          <span className="uppercase tracking-[0.14em] font-bold text-sage-700">{tour.region}</span>
        )}
        <span className="flex items-center gap-1 text-ink font-semibold"><Star className="w-3.5 h-3.5 fill-gold text-gold" /> {tour.rating.toFixed(1)} <span className="text-sand font-normal">({tour.reviews})</span></span>
      </div>
      <h3 className={`font-display font-bold text-ink mt-2 leading-snug group-hover:text-brand transition-colors duration-200 ${compact ? 'text-sm uppercase tracking-wide truncate' : 'text-lg'}`}>{tour.title}</h3>
      {!compact && (
        <ul className="mt-3 space-y-1.5">
          {tour.highlights?.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2 text-[13px] text-ink/75"><CircleCheck className="w-4 h-4 text-brand shrink-0 mt-[1px]" /> {h}</li>
          ))}
        </ul>
      )}
      <div className={`flex items-center justify-between border-t border-ink/8 ${compact ? 'mt-3 pt-3' : 'mt-4 pt-4'}`}>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-sand font-semibold">{tour.priceUnit === 'Family' ? 'Package Rate' : 'Starting from'}</div>
          <div className="font-display font-bold text-brand text-lg leading-tight">{formatIDR(tour.price)} <span className="text-xs text-sand font-body font-normal">/ {tour.priceUnit}</span></div>
        </div>
        <span className="w-9 h-9 rounded-full bg-cream-100 group-hover:bg-brand group-hover:text-white text-brand flex items-center justify-center transition-colors duration-200"><ArrowRight className="w-4 h-4" /></span>
      </div>
    </div>
  </Link>
);

export const CarCard = ({ car, onBook }) => (
  <div className={`group bg-white rounded-2xl overflow-hidden shadow-soft lift flex flex-col ${car.badge ? 'ring-2 ring-brand/70' : ''}`} data-testid={`car-card-${car.slug}`}>
    <Link to={`/car-rental/${car.slug}`} className="relative img-zoom overflow-hidden h-48 block">
      <img src={car.image} alt={car.name} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute top-3 left-3"><Pill tone="forest" uppercase>{car.category}</Pill></div>
      {car.badge && <div className="absolute top-0 right-0"><span className="inline-block bg-brand-800 text-white text-[10px] font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-bl-xl">{car.badge}</span></div>}
    </Link>
    <div className="p-5 flex flex-col flex-1">
      <Link to={`/car-rental/${car.slug}`}><h3 className="font-display font-bold text-ink text-lg leading-snug group-hover:text-brand transition-colors">{car.name}</h3></Link>
      <p className="text-[13px] text-sand mt-1.5 leading-relaxed">{car.description}</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-4 rounded-xl bg-cream-100 p-3">
        {car.specs?.slice(0, 4).map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-[12px] text-ink/80 font-medium"><Icon name={s.icon} className="w-3.5 h-3.5 text-brand" /> {s.label}</div>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 flex-1">
        {car.features?.slice(0, 2).map((f) => (
          <li key={f} className="flex items-start gap-2 text-[12.5px] text-ink/70"><CircleCheck className="w-3.5 h-3.5 text-sage-700 shrink-0 mt-[2px]" /> {f}</li>
        ))}
      </ul>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink/8">
        <div>
          <div className="text-[10px] text-sand">From / 10 Hours</div>
          <div className="font-display font-bold text-brand text-lg leading-tight">{formatIDR(car.price)}</div>
        </div>
        <button onClick={() => onBook?.(car)} className={`${car.badge ? 'btn-brand !bg-brand-800 hover:!bg-brand-700' : 'btn-forest'} !py-2 !px-4 !text-xs`} data-testid={`car-book-${car.slug}`}>Book Vehicle <ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  </div>
);

const badgeTone = { brand: 'brand', forest: 'forest', sand: 'sand', gold: 'gold' };

export const ActivityCard = ({ activity, onBook }) => (
  <div className="group bg-white rounded-2xl overflow-hidden shadow-soft lift flex flex-col" data-testid={`activity-card-${activity.slug}`}>
    <Link to={`/activities/${activity.slug}`} className="relative img-zoom overflow-hidden h-52 block">
      <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
      <div className="absolute top-3 left-3"><Pill tone={badgeTone[activity.badgeTone] || 'brand'} uppercase>{activity.badge}</Pill></div>
      <div className="absolute bottom-3 left-3"><Pill tone="dark"><Clock className="w-3 h-3" /> {activity.duration}</Pill></div>
    </Link>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="uppercase tracking-[0.14em] font-bold text-sage-700">{activity.category}</span>
        <span className="flex items-center gap-1 text-ink font-semibold"><Star className="w-3.5 h-3.5 fill-gold text-gold" /> {activity.rating.toFixed(1)} <span className="text-sand font-normal">({activity.reviews})</span></span>
      </div>
      <Link to={`/activities/${activity.slug}`}><h3 className="font-display font-bold text-ink text-lg leading-snug mt-2 group-hover:text-brand transition-colors">{activity.title}</h3></Link>
      <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink/60 mt-3">Includes:</div>
      <ul className="mt-1.5 space-y-1.5 flex-1">
        {activity.includes?.slice(0, 3).map((h) => (
          <li key={h} className="flex items-start gap-2 text-[12.5px] text-ink/75"><CircleCheck className="w-3.5 h-3.5 text-sage-700 shrink-0 mt-[2px]" /> {h}</li>
        ))}
      </ul>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/8">
        <div>
          <div className="text-[10px] text-sand">From</div>
          <div className="font-display font-bold text-brand text-lg leading-tight">{formatIDR(activity.price)} <span className="text-xs text-sand font-body font-normal">/ Person</span></div>
        </div>
        <button onClick={() => onBook?.(activity)} className="btn-forest !py-2 !px-4 !text-xs" data-testid={`activity-book-${activity.slug}`}>Book <ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  </div>
);

export const ArticleCard = ({ article }) => (
  <Link to={`/articles/${article.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-soft lift" data-testid={`article-card-${article.slug}`}>
    <div className="relative img-zoom overflow-hidden h-52">
      <img src={article.image} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute top-3 left-3"><Pill tone={article.featured ? 'brand' : 'forest'} uppercase>{article.category}</Pill></div>
      <div className="absolute bottom-3 right-3"><Pill tone="white"><Timer className="w-3 h-3 text-brand" /> {article.readTime}</Pill></div>
    </div>
    <div className="p-5">
      <h3 className="font-display font-bold text-ink text-[17px] leading-snug group-hover:text-brand transition-colors">{article.title}</h3>
      <p className="text-[13px] text-sand mt-2 leading-relaxed clamp-2">{article.excerpt}</p>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/8 text-xs">
        <div className="flex items-center gap-2">
          <img src={article.author?.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
          <span className="text-ink/80 font-medium">{article.author?.name}</span>
        </div>
        <span className="text-sand">{formatDate(article.date)}</span>
      </div>
    </div>
  </Link>
);
