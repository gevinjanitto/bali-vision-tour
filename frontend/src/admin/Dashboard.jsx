import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowRight, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { PageHeader, StatCard, StatusBadge } from './ui';
import { formatIDR } from '../lib/format';

const typeTone = { 'Tour Package': 'bg-brand', 'Car Rental': 'bg-forest', Activity: 'bg-gold' };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/api/admin/stats').then((r) => setStats(r.data)).catch(() => setStats({ counts: {}, bookings: { total: 0, byStatus: {}, byType: {} }, recent: [], daily: [] })); }, []);
  if (!stats) return <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/60 animate-pulse" />)}</div>;
  const { counts, bookings, recent, daily } = stats;
  const totalType = Object.values(bookings.byType).reduce((a, b) => a + b, 0) || 1;
  return (
    <div data-testid="admin-dashboard">
      <PageHeader title="Overview" desc="A snapshot of your catalogue and incoming booking requests.">
        <Link to="/admin/tours" className="btn-brand !py-2.5 !px-5 !text-xs" data-testid="dashboard-add-tour"><Plus className="w-4 h-4" /> New Tour Package</Link>
      </PageHeader>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard label="Tour Packages" value={counts.tours ?? 0} icon="Map" tone="brand" testId="stat-tours" />
        <StatCard label="Vehicles" value={counts.cars ?? 0} icon="Car" tone="forest" testId="stat-cars" />
        <StatCard label="Activities" value={counts.activities ?? 0} icon="Compass" tone="gold" testId="stat-activities" />
        <StatCard label="Articles" value={counts.articles ?? 0} icon="Newspaper" tone="sand" testId="stat-articles" />
        <StatCard label="Booking Requests" value={bookings.total} icon="Inbox" tone="brand" sub={`${bookings.byStatus.new || 0} new to follow up`} testId="stat-bookings" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft" data-testid="bookings-chart">
          <div className="flex items-center justify-between"><div><div className="font-display font-bold text-ink text-lg">Booking Requests</div><div className="text-xs text-sand">Last 14 days</div></div></div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily.map((d) => ({ ...d, label: d.date.slice(5) }))} margin={{ left: -20, right: 0, top: 10 }}>
                <CartesianGrid vertical={false} stroke="#EFE6D8" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8A7A66' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8A7A66' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#FDF0EA' }} contentStyle={{ borderRadius: 12, border: '1px solid #EFE6D8', fontSize: 12 }} />
                <Bar dataKey="count" fill="#E8622C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft" data-testid="bookings-by-type">
          <div className="font-display font-bold text-ink text-lg">By Service</div>
          <div className="text-xs text-sand">Distribution of all requests</div>
          <div className="mt-6 space-y-5">
            {['Tour Package', 'Car Rental', 'Activity'].map((t) => {
              const n = bookings.byType[t] || 0;
              return (
                <div key={t}>
                  <div className="flex items-center justify-between text-sm"><span className="font-medium text-ink">{t}</span><span className="text-sand">{n}</span></div>
                  <div className="h-2 rounded-full bg-cream-100 mt-2 overflow-hidden"><div className={`h-full rounded-full ${typeTone[t]} transition-[width] duration-700`} style={{ width: `${Math.round((n / totalType) * 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-5 border-t border-ink/8 grid grid-cols-2 gap-3 text-xs">
            {['new', 'contacted', 'confirmed', 'cancelled'].map((s) => <div key={s} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2"><StatusBadge status={s} /><span className="font-bold text-ink">{bookings.byStatus[s] || 0}</span></div>)}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-soft mt-6 overflow-hidden" data-testid="recent-bookings">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/8"><div className="font-display font-bold text-ink text-lg">Recent Requests</div><Link to="/admin/bookings" className="text-sm font-semibold text-brand inline-flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="w-4 h-4" /></Link></div>
        {recent.length === 0 ? <div className="px-6 py-10 text-center text-sm text-sand">No booking requests yet. They will appear here once guests submit the booking form.</div> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-sand"><tr className="text-left"><th className="px-6 py-3 font-bold">Guest</th><th className="px-6 py-3 font-bold">Item</th><th className="px-6 py-3 font-bold">Date</th><th className="px-6 py-3 font-bold">Total</th><th className="px-6 py-3 font-bold">Status</th></tr></thead>
            <tbody className="divide-y divide-ink/5">{recent.map((b) => <tr key={b.id} className="hover:bg-cream/60"><td className="px-6 py-3"><div className="font-semibold text-ink">{b.name}</div><div className="text-xs text-sand">{b.phone}</div></td><td className="px-6 py-3"><div className="text-ink">{b.itemName}</div><div className="text-xs text-sand">{b.type}</div></td><td className="px-6 py-3 text-ink/80">{b.date}</td><td className="px-6 py-3 font-semibold text-ink">{b.total ? formatIDR(b.total) : '-'}</td><td className="px-6 py-3"><StatusBadge status={b.status} /></td></tr>)}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
