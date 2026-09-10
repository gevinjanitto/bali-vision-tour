import { TOUR_CATEGORIES } from '../mock/tours';
import { CAR_FILTERS } from '../mock/cars';
import { ACTIVITY_TYPES } from '../mock/activities';
import { ARTICLE_CATEGORIES } from '../mock/articles';

const f = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra });
const JSON_HINT = 'Advanced: edit as JSON array. Leave empty [] if not needed.';

export const RESOURCE_CONFIG = {
  tours: {
    title: 'Tour Packages', singular: 'Tour Package', titleKey: 'title', bookingType: 'Tour Package',
    columns: [{ key: 'category', label: 'Category' }, { key: 'duration', label: 'Duration' }, { key: 'price', label: 'Price', type: 'price' }, { key: 'rating', label: 'Rating', type: 'rating' }, { key: 'featured', label: 'Featured', type: 'bool' }],
    defaults: { category: TOUR_CATEGORIES[0], priceUnit: 'Person', rating: 5, reviews: 0, days: 1, bestseller: false, featured: true, highlights: [], longDescription: [], inclusions: [], exclusions: [], gallery: [], features: [], itinerary: [], addons: [], tips: [], reviewsList: [] },
    sections: [
      { title: 'Basic Info', fields: [f('title', 'Title', 'text', { required: true, span: 2 }), f('slug', 'Slug (auto if empty)'), f('category', 'Category', 'select', { options: TOUR_CATEGORIES }), f('region', 'Region / Destination'), f('badge', 'Badge (e.g. Bestseller)'), f('duration', 'Duration label (e.g. 4 Days 3 Nights)'), f('days', 'Days', 'number'), f('rating', 'Rating (0-5)', 'number', { step: 0.1 }), f('reviews', 'Review count', 'number'), f('bestseller', 'Show on Home (Bestselling)', 'switch'), f('featured', 'Featured', 'switch')] },
      { title: 'Pricing & Media', fields: [f('price', 'Price (IDR)', 'number', { required: true }), f('priceUnit', 'Price unit', 'select', { options: ['Person', 'Family'] }), f('originalPrice', 'Original price (for discount)', 'number'), f('image', 'Cover image', 'image', { span: 2 }), f('gallery', 'Gallery', 'gallery', { span: 2 })] },
      { title: 'Content', fields: [f('subtitle', 'Subtitle', 'text', { span: 2 }), f('description', 'Short description', 'textarea', { span: 2 }), f('longDescription', 'Long description (one paragraph per line)', 'lines', { span: 2 }), f('highlights', 'Highlights (one per line)', 'lines', { span: 2 }), f('inclusions', 'Inclusions (one per line)', 'lines'), f('exclusions', 'Exclusions (one per line)', 'lines')] },
      { title: 'Advanced', fields: [f('features', 'Features [{title, desc, icon}]', 'json', { hint: JSON_HINT }), f('itinerary', 'Itinerary [{day, title, desc, points[], meals}]', 'json', { hint: JSON_HINT }), f('addons', 'Add-ons [{title, desc, price}]', 'json', { hint: JSON_HINT }), f('tips', 'Tips [{title, desc, icon}]', 'json', { hint: JSON_HINT })] },
    ],
  },
  cars: {
    title: 'Car Rental', singular: 'Vehicle', titleKey: 'name', bookingType: 'Car Rental',
    columns: [{ key: 'category', label: 'Category' }, { key: 'filter', label: 'Group' }, { key: 'price', label: 'Price / 10h', type: 'price' }, { key: 'price12h', label: 'Price / 12h', type: 'price' }, { key: 'badge', label: 'Badge' }],
    defaults: { filter: 'Family MPV', tags: [], features: [], specs: [], amenities: [], gallery: [], addons: [], pickupAreas: [], routes: [], reviewsList: [] },
    sections: [
      { title: 'Basic Info', fields: [f('name', 'Vehicle name', 'text', { required: true, span: 2 }), f('slug', 'Slug (auto if empty)'), f('category', 'Category label (e.g. Premium MPV)'), f('filter', 'Filter group', 'select', { options: CAR_FILTERS.filter((x) => x !== 'All Vehicles') }), f('badge', 'Badge (e.g. Most Popular)'), f('headline', 'Detail headline', 'text', { span: 2 }), f('description', 'Short description', 'textarea', { span: 2 }), f('longDesc', 'Long description', 'textarea', { span: 2 })] },
      { title: 'Pricing & Media', fields: [f('price', 'Price 10 hours (IDR)', 'number', { required: true }), f('price12h', 'Price 12 hours (IDR)', 'number'), f('image', 'Cover image', 'image', { span: 2 }), f('gallery', 'Gallery', 'gallery', { span: 2 })] },
      { title: 'Specifications', fields: [f('capacity', 'Capacity'), f('capacitySub', 'Capacity note'), f('luggage', 'Luggage'), f('luggageSub', 'Luggage note'), f('drivetrain', 'Drivetrain'), f('drivetrainSub', 'Drivetrain note'), f('seating', 'Seating'), f('seatingSub', 'Seating note'), f('tags', 'Tags (one per line)', 'lines'), f('features', 'Key features (one per line)', 'lines'), f('amenities', 'Amenities (one per line)', 'lines'), f('pickupAreas', 'Pickup areas (one per line)', 'lines')] },
      { title: 'Advanced', fields: [f('specs', 'Spec chips [{icon, label}]', 'json', { hint: JSON_HINT }), f('addons', 'Add-ons [{title, price}]', 'json', { hint: JSON_HINT }), f('routes', 'Suggested routes [{tag, tone, hours, title, stops[]}]', 'json', { hint: JSON_HINT })] },
    ],
  },
  activities: {
    title: 'Activities', singular: 'Activity', titleKey: 'title', bookingType: 'Activity',
    columns: [{ key: 'type', label: 'Type' }, { key: 'duration', label: 'Duration' }, { key: 'price', label: 'Price', type: 'price' }, { key: 'rating', label: 'Rating', type: 'rating' }, { key: 'badge', label: 'Badge' }],
    defaults: { type: ACTIVITY_TYPES[1], badgeTone: 'brand', rating: 5, reviews: 0, includes: [], tags: [], inclusions: [], exclusions: [], gallery: [], facts: [], highlights: [], timeline: [], addons: [], slots: [{ label: 'Morning Session', sub: '07:30 - 08:30 AM Hotel Dispatch' }], packing: [], reviewsList: [] },
    sections: [
      { title: 'Basic Info', fields: [f('title', 'Title', 'text', { required: true, span: 2 }), f('slug', 'Slug (auto if empty)'), f('type', 'Experience type', 'select', { options: ACTIVITY_TYPES.filter((x) => x !== 'All Activities') }), f('category', 'Category label (e.g. Adventure & Waters)'), f('badge', 'Badge (e.g. Must Do)'), f('badgeTone', 'Badge color', 'select', { options: ['brand', 'forest', 'sand', 'gold'] }), f('duration', 'Duration (e.g. 3 Hours)'), f('rating', 'Rating (0-5)', 'number', { step: 0.1 }), f('reviews', 'Review count', 'number')] },
      { title: 'Pricing & Media', fields: [f('price', 'Price per person (IDR)', 'number', { required: true }), f('image', 'Cover image', 'image', { span: 2 }), f('gallery', 'Gallery', 'gallery', { span: 2 })] },
      { title: 'Content', fields: [f('headline', 'Detail headline', 'text', { span: 2 }), f('description', 'Short description', 'textarea', { span: 2 }), f('longDescription', 'Long description', 'textarea', { span: 2 }), f('includes', 'Card includes (one per line)', 'lines'), f('tags', 'Detail tags (one per line)', 'lines'), f('inclusions', 'Inclusions (one per line)', 'lines'), f('exclusions', 'Exclusions (one per line)', 'lines')] },
      { title: 'Advanced', fields: [f('facts', 'Fast facts [{label, value, sub, icon}]', 'json', { hint: JSON_HINT }), f('highlights', 'Highlights [{title, desc, icon}]', 'json', { hint: JSON_HINT }), f('timeline', 'Timeline [{time, title, desc, tone}]', 'json', { hint: JSON_HINT }), f('slots', 'Time slots [{label, sub}]', 'json', { hint: JSON_HINT }), f('addons', 'Add-ons [{title, desc, price}]', 'json', { hint: JSON_HINT }), f('packing', 'Packing guide [{title, desc, icon}]', 'json', { hint: JSON_HINT })] },
    ],
  },
  articles: {
    title: 'Articles', singular: 'Article', titleKey: 'title', bookingType: null,
    columns: [{ key: 'category', label: 'Category' }, { key: 'author.name', label: 'Author' }, { key: 'date', label: 'Date' }, { key: 'readTime', label: 'Read time' }, { key: 'featured', label: 'Featured', type: 'bool' }],
    defaults: { category: ARTICLE_CATEGORIES[0], readTime: '5 min read', featured: false, date: new Date().toISOString().slice(0, 10), author: { name: 'Bali Vision Editorial', role: 'Concierge Team', avatar: '', bio: '' }, tags: [], highlights: [], facts: [], content: [] },
    sections: [
      { title: 'Basic Info', fields: [f('title', 'Title', 'text', { required: true, span: 2 }), f('slug', 'Slug (auto if empty)'), f('category', 'Category', 'select', { options: ARTICLE_CATEGORIES, allowCustom: true }), f('date', 'Publish date', 'date'), f('readTime', 'Read time (e.g. 5 min read)'), f('location', 'Location'), f('featured', 'Featured guide of the month', 'switch'), f('subtitle', 'Subtitle', 'text', { span: 2 }), f('excerpt', 'Excerpt', 'textarea', { span: 2, required: true })] },
      { title: 'Media & Author', fields: [f('image', 'Cover image', 'image', { span: 2 }), f('imageCaption', 'Image caption', 'text', { span: 2 }), f('author.name', 'Author name'), f('author.role', 'Author role'), f('author.avatar', 'Author avatar', 'image'), f('author.license', 'Author license / badge'), f('author.bio', 'Author bio', 'textarea', { span: 2 })] },
      { title: 'Content', fields: [f('content', 'Article body', 'blocks', { span: 2, hint: 'Write paragraphs separated by blank lines. Use "## " for headings, "- " for bullet lists, "> " for quotes.' }), f('tags', 'Header tags (one per line)', 'lines'), f('highlights', "Curator's highlights (one per line)", 'lines')] },
      { title: 'Advanced', fields: [f('facts', 'Fast facts [{label, value}]', 'json', { hint: JSON_HINT })] },
    ],
  },
};

export const blocksToText = (blocks = []) =>
  blocks.map((b) => {
    if (b.type === 'h2') return `## ${b.text}`;
    if (b.type === 'quote') return `> ${b.text}${b.cite ? `\n> — ${b.cite}` : ''}`;
    if (b.type === 'list') return b.items.map((i) => `- ${i}`).join('\n');
    if (b.type === 'p') return b.text;
    return `\`\`\`json\n${JSON.stringify(b)}\n\`\`\``;
  }).join('\n\n');

export const textToBlocks = (text = '') =>
  text.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
    if (chunk.startsWith('```json')) {
      try { return JSON.parse(chunk.replace(/^```json\s*/, '').replace(/```$/, '').trim()); } catch (e) { return { type: 'p', text: chunk }; }
    }
    if (chunk.startsWith('## ')) return { type: 'h2', text: chunk.slice(3).trim() };
    if (chunk.startsWith('> ')) {
      const lines = chunk.split('\n').map((l) => l.replace(/^>\s?/, ''));
      const citeIdx = lines.findIndex((l) => l.startsWith('— '));
      const cite = citeIdx >= 0 ? lines[citeIdx].slice(2) : undefined;
      return { type: 'quote', text: lines.filter((_, i) => i !== citeIdx).join(' ').trim(), cite };
    }
    if (chunk.split('\n').every((l) => l.startsWith('- '))) return { type: 'list', items: chunk.split('\n').map((l) => l.slice(2).trim()) };
    return { type: 'p', text: chunk.replace(/\n/g, ' ') };
  });
