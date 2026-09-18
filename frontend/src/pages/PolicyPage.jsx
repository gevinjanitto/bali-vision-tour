import React from 'react';
import { useParams } from 'react-router-dom';
import { bindContent } from '../lib/siteContent';
export const POLICIES = bindContent('policies', {
  privacy: { title: 'Privacy Policy', body: 'Information submitted with your booking request is used to arrange your trip and contact you about availability. Please contact us for requests concerning your personal information.' },
  terms: { title: 'Terms of Service', body: 'Bookings are subject to availability and confirmation by our team. Final prices, inclusions, payment and cancellation terms will be confirmed before you accept your booking.' },
});
export default function PolicyPage() {
  const { type } = useParams();
  const policy = POLICIES[type] || POLICIES.privacy;
  return <section className="max-w-4xl mx-auto px-6 py-20" data-testid="policy-page"><h1 className="font-display text-4xl font-bold text-ink" data-testid="policy-title">{policy.title}</h1><p className="whitespace-pre-line mt-8 leading-relaxed text-sand" data-testid="policy-body">{policy.body}</p></section>;
}