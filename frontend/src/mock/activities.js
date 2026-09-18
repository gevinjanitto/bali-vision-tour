import IMG from './images';

export const ACTIVITY_TYPES = ['All Activities', 'Water Sports & Marine', 'Adventure & Trekking', 'Culture & Workshops', 'Wellness & Spa', 'Wildlife & Nature'];

const baseTimeline = [
  { time: '07:30 AM', title: 'Hotel Pickup', desc: 'Private air-conditioned transfer from your villa or hotel in South Bali or Ubud.', tone: 'brand' },
  { time: '09:00 AM', title: 'Briefing & Gear Fitting', desc: 'Meet your certified instructors, receive safety briefing and fitted equipment.', tone: 'forest' },
  { time: '09:30 AM', title: 'Main Experience Begins', desc: 'Enjoy the core activity with professional guides and photo stops along the way.', tone: 'brand' },
  { time: '12:30 PM', title: 'Lunch & Refresh', desc: 'Buffet lunch, hot showers and fresh towels at the base camp.', tone: 'gold' },
  { time: '02:00 PM', title: 'Return Transfer', desc: 'Comfortable ride back to your accommodation.', tone: 'sand' },
];

const baseReviews = [
  { name: 'Elena & Henrik', location: 'Copenhagen, Denmark', initials: 'EH', tone: 'forest', date: 'Oct 2024', text: 'The single most magical morning of my Bali holiday. Our guide kept our pace steady and knew the exact vantage point to avoid crowds.' },
  { name: 'Marcus Turner', location: 'Melbourne, Australia', initials: 'MT', tone: 'brand', date: 'Nov 2024', text: 'Bali Vision Tour handled every detail flawlessly. Chauffeur arrived exactly on time in a luxury private van. The photo shots our guide took look like National Geographic covers.' },
];

const basePacking = [
  { title: 'Comfortable Clothing', desc: 'Quick-dry clothing and a change of clothes for after the activity.', icon: 'Shirt' },
  { title: 'Footwear Needs', desc: 'Sturdy sneakers or strapped sandals with good grip.', icon: 'Footprints' },
  { title: 'Essentials', desc: 'Sunscreen, sunglasses, and a small waterproof bag for valuables.', icon: 'Sun' },
];

const mk = (o) => ({
  gallery: [{ src: o.image, label: 'Signature Experience' }, { src: IMG.jungle, label: 'Tropical Setting' }, { src: IMG.riceMist, label: 'Highland Views' }, { src: IMG.beachClub, label: 'Coastal Relax' }, { src: IMG.ubud, label: 'Scenic Route' }],
  facts: [{ label: 'Difficulty', value: 'Moderate', sub: 'Suitable for beginners', icon: 'Activity' }, { label: 'Departure Time', value: '07:30 AM', sub: 'Direct hotel pickup', icon: 'Clock' }, { label: 'Group Size', value: 'Max 8', sub: 'Small private groups', icon: 'Users' }, { label: 'Guide Ratio', value: '1 : 4 Ratio', sub: 'Certified local guide', icon: 'UserRound' }],
  highlights: [{ title: 'Certified Local Guides', desc: 'Licensed instructors born and raised in the area.', icon: 'ShieldCheck' }, { title: 'Premium Gear Provided', desc: 'Clean, sanitized and regularly inspected equipment.', icon: 'Package' }, { title: 'Meals Included', desc: 'Authentic local lunch or breakfast included.', icon: 'UtensilsCrossed' }, { title: 'Round-trip Transport', desc: 'Private AC transfer from major Bali hubs.', icon: 'Car' }],
  timeline: baseTimeline,
  inclusions: ['Door-to-door private AC transport from all major Bali hubs', 'Licensed English-speaking guide or instructor', 'All entrance fees & equipment rental', 'Meal as described & bottled mineral water', 'Comprehensive medical passenger insurance coverage'],
  exclusions: ['Personal expenses and souvenirs', 'Alcoholic drinks at the cafe', 'Gratuities / tips for your guide'],
  addons: [{ title: 'Pro Photographer', desc: 'High-res edited album delivered same day', price: 500000 }, { title: 'Private Group Upgrade', desc: 'Exclusive guide for your party only', price: 350000 }],
  slots: [{ label: 'Morning Session', sub: '07:30 - 08:30 AM Hotel Dispatch' }, { label: 'Afternoon Session', sub: '12:30 - 01:30 PM Hotel Dispatch' }],
  packing: basePacking,
  reviewsList: baseReviews,
  ...o,
});

export const ACTIVITIES = [
  mk({
    id: 'a1', slug: 'ayung-river-white-water-rafting', title: 'Ayung River White Water Rafting', category: 'Adventure & Waters', type: 'Water Sports & Marine', badge: 'Terlaris / Bestseller', badgeTone: 'brand', duration: '3 Hours', rating: 4.9, reviews: 420, price: 350000, image: IMG.rafting,
    includes: ['Buffet lunch & fresh towel facility', 'Safety equipment & professional instructor', 'Full participant insurance coverage'],
    description: 'Paddle 12km of Class II-III rapids through the lush Ayung gorge, past waterfalls and carved stone reliefs.',
  }),
  mk({
    id: 'a2', slug: 'mount-batur-sunrise-trekking', title: 'Mount Batur Sunrise Trekking & Breakfast', category: 'Trekking & Volcano', type: 'Adventure & Trekking', badge: 'Iconic Experience', badgeTone: 'forest', duration: '6 Hours (Early Morning)', rating: 5.0, reviews: 680, price: 425000, image: IMG.batur,
    includes: ['Headlamps, trekking poles & local guide', 'Volcanic steam egg breakfast on summit', 'Natural hot spring relaxation stop'],
    headline: 'Mount Batur Sunrise Volcano Trekking & Lakeside Hot Springs',
    tags: ['Iconic Experience', 'Early Morning Adventure', 'Duration: 6 Hours'],
    description: 'Ascend sacred volcanic ridges under starry skies to witness an unforgettable golden sunrise above the clouds, followed by volcanic steam-cooked breakfast and mineral hot spring relaxation.',
    longDescription: 'Mount Batur is Bali’s most revered active sacred caldera. On this bespoke dawn expedition, bypass crowds with private chauffeur dispatch, dedicated Mount Batur Association mountaineers, and all-weather trekking equipment. Following your breathless sunrise, soak in natural therapeutic thermal pools fed directly by the subterranean volcanic bed.',
    gallery: [{ src: IMG.batur, label: 'Golden Sunrise Peak Experience' }, { src: IMG.agung, label: 'Crater Steam Vents' }, { src: IMG.kintamani, label: 'Lakeside Hot Springs' }, { src: IMG.riceMist, label: 'Midnight Starlight Trail' }, { src: IMG.cooking, label: 'Volcanic Steam Breakfast' }],
    facts: [{ label: 'Trekking Difficulty', value: 'Moderate', sub: '~2 hrs summit climb', icon: 'Activity' }, { label: 'Departure Time', value: '02:00 AM', sub: 'Direct hotel pickup', icon: 'Moon' }, { label: 'Summit Altitude', value: '1,717 Meters', sub: 'Above sea level', icon: 'Mountain' }, { label: 'Guide Ratio', value: '1 : 4 Ratio', sub: 'Certified local guide', icon: 'Users' }],
    highlights: [{ title: 'Native Mountain Guides', desc: 'Trek in full confidence with certified locals born and raised on the slopes of Songan caldera.', icon: 'ShieldCheck' }, { title: 'Premium Gear Provided', desc: 'Ultra-bright LED headlamps, carbon trekking poles, and thermal windbreakers provided at base.', icon: 'Flashlight' }, { title: 'Volcanic Steam Breakfast', desc: 'Taste organic eggs and caramel bananas cooked instantly inside live geothermal steam vents.', icon: 'UtensilsCrossed' }, { title: 'Lakeside Thermal Soak', desc: '2-hour access to Toya Devasya hot spring pools with panoramic vistas of Lake Batur and Abang.', icon: 'Waves' }],
    timeline: [
      { time: '01:30 - 02:30 AM', title: 'VIP Chauffeur Pickup', desc: 'Private air-conditioned transfer from your villa or hotel in Nusa Dua, Seminyak, Canggu, Sanur, or Ubud. Relax in reclining comfort during the night drive into Kintamani highlands.', tone: 'brand' },
      { time: '03:30 AM', title: 'Base Camp Briefing & Gear Fitting', desc: 'Arrival at Mount Batur private base camp. Enjoy hot Balinese tea, a warm safety briefing by your head guide, and high-intensity headlamp distribution.', tone: 'forest' },
      { time: '04:00 AM', title: 'Starlight Volcanic Ascent', desc: 'Commence the trek through lush pine forests before ascending the black volcanic sand trails under an unpolluted canopy of shooting stars.', tone: 'brand' },
      { time: '05:45 AM', title: 'Summit Caldera Sunrise Panorama', desc: 'Reach the 1,717m peak just as the sky erupts into crimson and gold. Marvel at silhouettes of Mount Abang, Lake Batur, and Lombok’s distant Mount Rinjani.', tone: 'gold' },
      { time: '06:15 AM', title: 'Volcanic Steam Breakfast & Hot Coffee', desc: 'Your guide cooks eggs directly inside geothermal vents. Savor warm banana sandwiches, chocolate biscuits, and fresh hot tea while seated above clouds.', tone: 'brand' },
      { time: '07:15 AM', title: 'Crater Rim Descent & Wild Macaques', desc: 'Follow the scenic rim path down toward the lava fields. Observe native friendly mountain monkeys and explore recent 1963 volcanic fissures.', tone: 'forest' },
      { time: '08:45 AM', title: 'Toya Devasya Lakeside Hot Spring Dip', desc: 'Immerse in geothermal sulfuric pools (38°C - 40°C) directly abutting Lake Batur. Clean shower amenities, locker, towel, and welcome drink included.', tone: 'brand' },
      { time: '11:30 AM', title: 'Artisanal Coffee Stop & Hotel Return', desc: 'En route home, enjoy a brief tasting of organic Luwak and ginger coffee at a jungle plantation before arriving comfortably back at your hotel.', tone: 'sand' },
    ],
    inclusions: ['Door-to-door private AC transport from all major Bali hubs', 'Licensed English-speaking Mount Batur trekking guide', 'All mountain association entrance fees & caldera tickets', 'Hot mineral lake spring entry ticket + towel + locker', 'Fresh volcanic steam summit breakfast & hot drinks', 'High-lumen LED headlamp & lightweight trekking poles', 'Comprehensive medical passenger insurance coverage'],
    exclusions: ['Personal trekking boots or heavy thermal gloves', 'Lunch / alcoholic drinks at the hot springs cafe', 'Luwak specialty coffee upgrade at spice plantation', 'Gratuities / tips for your personal mountain guide'],
    addons: [{ title: 'Private 4WD Jeep Alternative', desc: 'Skip hiking & ride straight to sunrise point', price: 350000 }, { title: 'Pro Summit Photographer', desc: 'High-res edited album delivered same day', price: 500000 }],
    slots: [{ label: 'Sunrise Ascent', sub: '01:30 - 02:30 AM Hotel Dispatch' }],
    packing: [{ title: 'Temperature Check', desc: 'Summit temperatures range from 14°C to 18°C at 05:00 AM before warming quickly after dawn. Layering with a fleece or windbreaker is strongly recommended.', icon: 'Thermometer' }, { title: 'Footwear Needs', desc: 'Sturdy sneakers with good grip or lightweight hiking shoes. Avoid flat street sneakers or sandals as volcanic gravel can be slick on descent.', icon: 'Footprints' }, { title: 'Hot Spring Essentials', desc: 'Bring swimwear and a dry change of clothes in a small daypack. Secure lockers and private shower facilities are provided at Toya Devasya.', icon: 'Waves' }],
  }),
  mk({
    id: 'a3', slug: 'nusa-penida-manta-ray-snorkeling', title: 'Nusa Penida Manta Ray Snorkeling', category: 'Water Sports & Ocean', type: 'Water Sports & Marine', badge: 'Must Do', badgeTone: 'brand', duration: 'Full Day', rating: 4.9, reviews: 850, price: 550000, image: IMG.manta,
    includes: ['Speedboat transfer & premium snorkel gear', 'Manta Point, Crystal Bay & Gamat Bay stops', 'Underwater GoPro photography included'],
    description: 'Glide alongside majestic oceanic manta rays and explore three of Nusa Penida’s most vibrant coral bays.',
    gallery: [{ src: IMG.manta, label: 'Manta Point' }, { src: IMG.penidaBay, label: 'Crystal Bay' }, { src: IMG.kelingking, label: 'Cliff Views' }, { src: IMG.diamond, label: 'Gamat Bay' }, { src: IMG.beachClub, label: 'Beach Lunch' }],
  }),
  mk({
    id: 'a4', slug: 'ubud-atv-quad-bike-jungle-trail', title: 'Ubud ATV Quad Bike Jungle Trail', category: 'Adventure & Motor', type: 'Adventure & Trekking', badge: 'High Adrenaline', badgeTone: 'brand', duration: '2.5 Hours', rating: 4.8, reviews: 310, price: 450000, image: IMG.atv,
    includes: ['Mud tracks, bamboo forest & gorilla cave', 'Safety boots, helmet & locker provided', 'Hot shower facility and Indonesian lunch'],
    description: 'Rip through muddy jungle tracks, bamboo tunnels and rice-field ridges on an automatic quad bike.',
  }),
  mk({
    id: 'a5', slug: 'traditional-balinese-cooking-class', title: 'Traditional Balinese Cooking Class in Organic Farm', category: 'Culinary & Culture', type: 'Culture & Workshops', badge: 'Culture & Taste', badgeTone: 'sand', duration: '4 Hours', rating: 5.0, reviews: 195, price: 375000, image: IMG.cooking,
    includes: ['Vibrant local market tour & herb harvest', '5-course homemade authentic feast', 'Printed recipe booklet & certificate'],
    description: 'Harvest herbs on an organic farm and master five classic Balinese dishes with a family of village cooks.',
  }),
  mk({
    id: 'a6', slug: 'tirta-empul-melukat-purification', title: 'Tirta Empul Sacred Melukat Purification Ritual', category: 'Wellness & Heritage', type: 'Wellness & Spa', badge: 'Sacred Ritual', badgeTone: 'forest', duration: '3 Hours', rating: 4.9, reviews: 240, price: 280000, image: IMG.tirta,
    includes: ['Traditional temple sarong and sash rental', 'Fresh canang sari ritual offerings', 'Certified spiritual heritage guide'],
    description: 'Take part in the centuries-old Melukat cleansing ritual at the holy spring temple of Tirta Empul.',
  }),
  mk({
    id: 'a7', slug: 'bali-safari-marine-park-jungle-hopper', title: 'Bali Safari & Marine Park Jungle Hopper', category: 'Wildlife & Family', type: 'Wildlife & Nature', badge: 'Family Favorite', badgeTone: 'forest', duration: 'Full Day', rating: 4.8, reviews: 520, price: 720000, image: IMG.safari,
    includes: ['Guided safari tram ride through habitats', 'Animal education shows & water play zone', 'Bali Agung theatrical performance pass'],
    description: 'A full family day of safari trams, animal shows, water play and the spectacular Bali Agung theatre.',
  }),
  mk({
    id: 'a8', slug: 'seawalker-watersports-tanjung-benoa', title: 'Seawalker & Watersports at Tanjung Benoa', category: 'Water Sports', type: 'Water Sports & Marine', badge: 'Popular Choice', badgeTone: 'brand', duration: '4 Hours', rating: 4.8, reviews: 390, price: 390000, image: IMG.seawalker,
    includes: ['Specialized helmet diving (no swimming needed)', 'Hands-on marine fish feeding experience', 'Locker, towel, shower & beach lounge pass'],
    description: 'Walk on the ocean floor with a helmet dive and feed tropical fish, no swimming skills required.',
  }),
  mk({
    id: 'a9', slug: 'aloha-ubud-jungle-swing-photo-spot', title: 'Aloha Ubud Jungle Swing & Photo Spot', category: 'Adventure & Photo', type: 'Adventure & Trekking', badge: 'Instagram Iconic', badgeTone: 'gold', duration: '2 Hours', rating: 4.9, reviews: 610, price: 250000, image: IMG.swing,
    includes: ['Extreme single & romantic tandem swings', 'Giant woven bird nests and photo vantage points', 'Safety harness and comprehensive insurance'],
    description: 'Soar over the Ubud jungle canopy on giant swings and pose in woven bird nests for iconic photos.',
  }),
];

export default ACTIVITIES;
