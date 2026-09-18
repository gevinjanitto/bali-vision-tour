import React from 'react';
import DOMPurify from 'dompurify';

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const toHtml = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) return value.filter(Boolean).map((p) => `<p>${escape(p)}</p>`).join('');
  const s = String(value);
  if (/<[a-z][\s\S]*>/i.test(s)) return s;
  return s.split(/\n\s*\n/).map((p) => `<p>${escape(p).replace(/\n/g, '<br/>')}</p>`).join('');
};

export const RichText = ({ value, className = '', testId }) => {
  const html = toHtml(value);
  if (!html) return null;
  return <div className={`rich-content ${className}`} data-testid={testId} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] }) }} />;
};

export default RichText;
