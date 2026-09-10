import React from 'react';
import Icon from '../components/Icon';

export const PageHeader = ({ title, desc, children }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
    <div>
      <h1 className="font-display font-bold text-ink text-2xl md:text-3xl tracking-tight" data-testid="admin-page-title">{title}</h1>
      {desc && <p className="text-sand text-sm mt-1">{desc}</p>}
    </div>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);

const tones = {
  brand: 'bg-brand-50 text-brand',
  forest: 'bg-sage text-sage-700',
  gold: 'bg-gold-100 text-gold',
  sand: 'bg-cream-200 text-sand',
};

export const StatCard = ({ label, value, icon, tone = 'brand', sub, testId }) => (
  <div className="bg-white rounded-2xl p-5 shadow-soft flex items-start justify-between lift" data-testid={testId}>
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-sand">{label}</div>
      <div className="font-display font-bold text-ink text-3xl mt-2 leading-none">{value}</div>
      {sub && <div className="text-xs text-sand mt-2">{sub}</div>}
    </div>
    <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tones[tone]}`}><Icon name={icon} className="w-5 h-5" /></span>
  </div>
);

const statusTone = {
  new: 'bg-brand-50 text-brand-700 border-brand-100',
  contacted: 'bg-gold-100 text-gold border-gold/30',
  confirmed: 'bg-sage text-sage-700 border-sage-700/20',
  cancelled: 'bg-cream-200 text-sand border-ink/10',
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusTone[status] || statusTone.new}`} data-testid={`status-${status}`}>{status}</span>
);

export const EmptyState = ({ title, desc, children }) => (
  <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-ink/15" data-testid="empty-state">
    <div className="font-display font-bold text-ink text-lg">{title}</div>
    <p className="text-sand text-sm mt-1">{desc}</p>
    {children && <div className="mt-5">{children}</div>}
  </div>
);
