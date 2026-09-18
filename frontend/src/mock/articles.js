import IMG from './images';

export const ARTICLE_CATEGORIES = ['Island Itineraries', 'Cultural Etiquette', 'Food & Dining', 'Nusa Penida Guides', 'Sustainable Travel', 'Luxury Stays'];

const authors = {
  saraswati: { name: 'Ni Ketut Saraswati', role: 'Lead Cultural Curator', avatar: IMG.staff2, bio: 'Born in Klungkung Regency, Ketut has spent over a decade documenting the oral histories, sacred temples, and secluded coastal landscapes of the Nusa Islands. Her itineraries prioritize respectful cultural exchange and direct fair compensation for local Balinese drivers and boat crews.', license: 'Licensed Guide #BALI-4891' },
  wayan: { name: 'Wayan Suartana', role: 'Mountain Guide', avatar: IMG.staff1, bio: 'Wayan has led sunrise treks on Mount Batur for 12 years and knows every trail on the caldera.', license: 'Licensed Guide #BALI-2201' },
  gede: { name: 'Gede Putu Arya', role: 'Temple Heritage Writer', avatar: IMG.staff4, bio: 'Gede documents temple ceremonies and etiquette across Bali’s nine regencies.', license: 'Licensed Guide #BALI-3310' },
  made: { name: 'Made Darmayasa', role: 'Fleet Operations Lead', avatar: IMG.staff3, bio: 'Made oversees fleet safety and writes practical charter guides for families.', license: 'Fleet Lead' },
  ayu: { name: 'Ayu Mirah', role: 'Nature & Wellness Curator', avatar: IMG.av4, bio: 'Ayu explores hidden waterfalls and wellness retreats across northern Bali.', license: 'Licensed Guide #BALI-5120' },
  bagus: { name: 'Bagus Narendra', role: 'Sunset & Dining Editor', avatar: IMG.av3, bio: 'Bagus curates the best sunset vantage points and beachfront dining across South Bali.', license: 'Editor' },
  siti: { name: 'Siti Rahma', role: 'Sustainability Writer', avatar: IMG.av2, bio: 'Siti writes about marine conservation and sustainable island travel.', license: 'Editor' },
};

const genericContent = (topic) => [
  { type: 'p', text: `${topic} rewards travelers who plan around light, tide and ceremony calendars rather than rushing between viewpoints. Our concierge team has compiled the practical details below from years of escorting private guests across the island.` },
  { type: 'h2', text: 'Timing Your Visit' },
  { type: 'p', text: 'Arrive early. Most iconic spots are quiet before 08:30 AM and again after 04:00 PM. Midday heat and tour-bus crowds peak between 10:00 AM and 02:00 PM.' },
  { type: 'quote', text: 'Bali does not reveal its soul to those in a rush. Slow down, greet the locals, and let the island set the pace.', cite: 'Bali Vision Concierge Team' },
  { type: 'h2', text: 'Practical Intelligence' },
  { type: 'list', items: ['Carry small Rupiah notes for temple donations and parking', 'Dress respectfully: sarong and sash are mandatory at temples', 'A private chauffeur removes parking stress and lets you linger where you love', 'Reef-safe sunscreen protects both your skin and Bali’s coral'] },
  { type: 'p', text: 'Our chauffeurs can adapt any of these recommendations into a bespoke daily route. Message our WhatsApp concierge for a tailored plan.' },
];

export const ARTICLES = [
  {
    id: 'ar1', slug: 'ultimate-first-timers-guide-east-nusa-penida-2025', title: "The Ultimate First-Timer's Guide to Exploring East Nusa Penida in 2025", category: 'Island Itineraries', tags: ['Featured Expedition', 'Nusa Penida Series', '8 min read', 'Updated for 2025'],
    excerpt: 'Venture beyond the crowded western viewpoints into secluded Diamond Beach, the dramatic Thousand Islands viewpoint, and sacred cave temples. From chartering sea vessels from Sanur Harbour to navigating cliffside trails safely, here is the quintessential travel blueprint curated with private drivers and local safety insights.',
    subtitle: 'From beating the sunrise crowds at Diamond Beach to descending the sacred steps of Pura Goa Giri Putri — an insider’s manual curated by licensed Balinese storytellers.',
    image: IMG.diamond, imageCaption: 'Morning light over the dramatic limestone cliffs of Diamond Beach, taken during our sunrise private expedition. Photo: Bali Vision Tour archives.',
    author: authors.saraswati, date: '2025-01-15', readTime: '8 min read', featured: true, location: 'East Nusa Penida, Bali',
    bullets: ['Optimal speed boat transit windows to avoid rough swell', 'Private 4WD hire vs scooter rentals on island roads', 'Cultural customs when visiting Pura Goa Giri Putri'],
    highlights: ['06:30 AM departure from Sanur Harbour avoids 2-hour queue bottlenecks at diamond viewpoints.', '4WD charter only; gravel paths and sharp 30° cliff drops make scooters a dangerous gamble for tourists.', 'Temple attire is strictly required for Goa Giri Putri; sarong and yellow waist sash are non-negotiable.', 'Cliffside Warungs above Suwehan Bay offer fresh young coconuts and wood-fired snapper harvested at dawn.'],
    facts: [{ label: 'Best Season', value: 'Apr - Oct (Dry Season)' }, { label: 'Fast Boat Crossing', value: '40 Mins (Sanur Harbour)' }, { label: 'Recommended Time', value: '1 Full Day (10-12 Hrs)' }, { label: 'Fitness Requirement', value: 'Moderate (Stairs)' }],
    content: [
      { type: 'h2', text: 'Beyond the Instagram Clichés: The Wild Majesty of East Penida' },
      { type: 'p', text: 'While thousands of travelers queue patiently under the midday sun at Kelingking Beach on the western side of the island, East Nusa Penida remains an amphitheater of untamed geological drama. Here, razor-sharp karst formations slice directly through Indian Ocean swells, bathed in a celestial sunrise that warms the ivory limestone long before tour buses arrive.' },
      { type: 'p', text: 'To truly understand East Penida is to appreciate its dual nature: an exhilarating playground of sheer cliff paths alongside profound sacred geography. This is the dwelling place of ancestral spirits, where Balinese villagers have for generations farmed seaweed along hidden tides and gathered inside underground caverns to honor Ratu Hyang Giri Putri.' },
      { type: 'quote', text: "Nusa Penida doesn't reveal its soul to those in a rush. The island asks you to breathe with its ocean tides and honor the sanctity of its stone.", cite: 'Pemangku Ketut Raka, Pura Goa Giri Putri Elder' },
      { type: 'h2', text: 'Step-by-Step Itinerary: The Ideal 1-Day East Penida Route' },
      { type: 'p', text: 'Covering East Nusa Penida comfortably in a single day requires precise timing to avoid midday tropical heat and ensure seamless private boat connections. Here is the vetted route designed by our concierge team:' },
      { type: 'steps', items: [
        { time: '06:30 AM • Coastal Port', tag: 'VIP Priority Boarding', title: 'Sanur Private Terminal Fast Boat Departure', desc: 'Skip the wet, unorganized public boarding queues in Sanur. Board our chartered twin-engine speedboat via elevated private pontoon. The crossing takes exactly 40 minutes over calm morning waters with views of Mount Agung rising above the horizon.' },
        { time: '08:30 AM • Clifftop Lookout', tag: 'Pre-Crowd Advantage', title: 'Thousand Islands Viewpoint & Rumah Pohon (Treehouse)', desc: 'Arrive before the 10:00 AM wave of day-trippers. Gaze down from the Molenteng lookout across dozens of emerald pinnacle islands dotted along turquoise bays. Perfect natural lighting for photography without squinting against the harsh sun.' },
        { time: '10:45 AM • Coastal Trek', tag: 'Handrail Supported', title: 'Diamond Beach & Atuh Beach Limestone Descent', desc: 'Walk down the celebrated limestone stairway chiseled by hand into the cliff face. Relax on the powdery white sands beneath the towering diamond-shaped monolith. (Safety tip: Swimming here is recommended only during low tide due to shore breaks).' },
        { time: '01:15 PM • Culinary Break', tag: 'Private Table Reserved', title: 'Authentic Balinese Feast Overlooking Suwehan Bay', desc: 'Recharge in an open-air pavilion. Enjoy freshly caught ocean fish grilled over coconut husks, sambal matah, urap vegetables, organic red rice, and chilled young coconut water harvested right on property.' },
        { time: '03:00 PM • Sacred Sanctuary', tag: 'Spiritual Guide Provided', title: 'Sacred Purification inside Pura Goa Giri Putri', desc: 'Enter through a tiny crawl space in the limestone cliff to discover an astonishing cathedral-like cavern over 300 meters long. Receive a traditional tri-datu thread bracelet and holy water blessing (Melukat) by the resident Balinese priest.' },
        { time: '05:00 PM • Return Voyage', tag: 'Sunset Over Sanur', title: 'Return VIP Fast Boat to Sanur', desc: 'Board your reserved return vessel. Relax as the sun dips behind the volcanic ridge of Bali mainland, casting golden light across the Badung Strait.' },
      ] },
      { type: 'gallery', items: [{ src: IMG.tirta, label: 'Melukat ceremony deep within Pura Goa Giri Putri' }, { src: IMG.penidaBay, label: 'Turquoise shallows at Atuh Bay' }] },
      { type: 'h2', text: "Crucial Practical Intelligence (What Most Guides Won't Tell You)" },
      { type: 'p', text: 'A luxury journey relies on smooth execution. Avoid common traveler pitfalls by reviewing these verified logistical realities:' },
      { type: 'cards', items: [
        { icon: 'Car', title: 'Rugged Road Realities & 4WD Charter', desc: 'While East Penida’s arterial roads were paved in 2023, access paths to Diamond Beach and Suwehan remain steep and gravelly. Rental scooters witness dozens of gravel skids every week. A chartered private Toyota Innova or Avanza with a seasoned island driver ensures safety and continuous air conditioning.' },
        { icon: 'Banknote', title: 'Cash vs E-Wallet Connectivity', desc: 'Cellular reception fluctuates wildly behind the cliff ridges. While our tour packages cover all entrance tickets and meals in advance, keep Rp 200,000 to Rp 300,000 in cash for personal coconuts, treehouse photo fees (Rp 75,000), or tips. Island ATMs frequently run out of bills.' },
        { icon: 'Footprints', title: 'Physical Fitness & Cliff Staircases', desc: 'Reaching the shoreline at Diamond Beach involves 250 carved stone steps with rope railings. Good footwear with rubber grip is essential (prohibit flip-flops on the stairs). Those with vertigo can comfortably soak in the majestic views from clifftop pavilions without descending.' },
        { icon: 'Landmark', title: 'Temple Dress Code & Etiquette', desc: 'Pura Goa Giri Putri is a living Hindu sanctuary. Knees and shoulders must be covered. We provide complimentary freshly laundered batik sarongs and golden waist sashes to all Bali Vision guests before entering the cave.' },
      ] },
    ],
  },
  { id: 'ar2', slug: 'mount-batur-sunrise-trekking-essential-gear', title: 'Mount Batur Sunrise Trekking: Essential Gear, Weather Tips & What to Expect', category: 'Adventure & Hiking', excerpt: 'A comprehensive walkthrough of the 03:00 AM ascent up Kintamani’s sacred volcano. Learn how to dress for pre-dawn temperatures, avoid unlicensed guides, and time your summit for the perfect sunrise.', image: IMG.batur, author: authors.wayan, date: '2025-01-12', readTime: '5 min read', featured: false, content: genericContent('Mount Batur') },
  { id: 'ar3', slug: 'balinese-temple-etiquette', title: 'Balinese Temple Etiquette: What Every Traveler Needs to Know Before Entering Pura', category: 'Culture & Traditions', excerpt: 'Respecting Tri Hita Karana philosophy: Proper sarong tying, respectful posture during odalan ceremonies, rules regarding menstruation, and proper photo distance from praying locals.', image: IMG.lempuyang2, author: authors.gede, date: '2025-01-09', readTime: '6 min read', featured: false, content: genericContent('Temple etiquette') },
  { id: 'ar4', slug: 'innova-zenix-hybrid-vs-alphard-charter-fleet', title: 'Toyota Innova Zenix Hybrid vs Alphard: Choosing the Right Charter Fleet for Your Bali Group', category: 'Travel Fleet & Tips', excerpt: 'Compare luggage capacity, narrow village maneuverability, suspension comfort on mountain inclines, and daily cost efficiency for families and executive groups.', image: IMG.van1, author: authors.made, date: '2025-01-06', readTime: '4 min read', featured: false, content: genericContent('Choosing a charter fleet') },
  { id: 'ar5', slug: 'hidden-waterfalls-northern-ubud', title: 'Hidden Waterfalls of Northern Ubud: Escaping the Crowds in Gianyar', category: 'Hidden Gems', excerpt: 'Skip the packed tourist queues at Tegenungan. We explore secluded ravines, secret river canyons, and natural swimming pools tucked away in pristine jungle.', image: IMG.waterfall2, author: authors.ayu, date: '2025-01-03', readTime: '7 min read', featured: false, content: genericContent('Northern Ubud waterfalls') },
  { id: 'ar6', slug: 'uluwatu-sunset-kecak-dance-vantage-points', title: 'Uluwatu Sunset & Kecak Dance: Best Vantage Points and Dinner Spots in Jimbaran', category: 'Evening Itineraries', excerpt: 'How to reserve front-row amphitheater tickets without waiting in two-hour queues, plus our curated selection of authentic candlelit beachfront seafood.', image: IMG.kecak, author: authors.bagus, date: '2024-12-28', readTime: '5 min read', featured: false, content: genericContent('Uluwatu sunset') },
  { id: 'ar7', slug: 'sustainable-island-hopping-gili-nusa', title: 'A Guide to Sustainable Island Hopping in the Gili & Nusa Islands', category: 'Eco Travel', excerpt: 'Protecting marine sanctuaries: Reef-safe sunscreen standards, zero-single-use plastic charters, and ethical sea turtle snorkeling guidelines around Nusa Lembongan.', image: IMG.penidaBay, author: authors.siti, date: '2024-12-22', readTime: '6 min read', featured: false, content: genericContent('Sustainable island hopping') },
];

export default ARTICLES;
