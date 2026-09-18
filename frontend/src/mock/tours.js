import IMG from './images';

export const TOUR_CATEGORIES = ['Family Trip', 'Private Tour', 'Cultural & Heritage', 'Adventure & Eco', 'Romantic Honeymoon'];

const defaultItinerary = (days, titles) =>
  Array.from({ length: days }).map((_, i) => ({
    day: i + 1,
    title: titles[i] || `Day ${i + 1} Exploration`,
    desc: 'Your private chauffeur collects you from your hotel and escorts you through a carefully paced day of iconic sights and hidden local gems, with plenty of time for photography and refreshments.',
    points: ['07:30 AM: Hotel pickup & briefing', '10:30 AM: Signature landmark exploration', '01:00 PM: Authentic Balinese lunch', '05:30 PM: Golden hour sunset spot'],
    meals: 'Included Meals: Gourmet Indonesian Lunch, Welcome Drink',
  }));

const baseInclusions = [
  'Private AC vehicle with dedicated English-speaking guide',
  'All entrance tickets, retribution fees & parking permits',
  'Daily gourmet breakfasts & selected lunch experiences',
  'Unlimited bottled mineral water & cool refreshing towels',
];
const baseExclusions = [
  'International or domestic flights to/from Denpasar Bali',
  'Alcoholic beverages and specialty cocktails',
  'Personal travel insurance (highly recommended)',
  'Gratuities / tipping for local driver and boat crew',
];
const baseTips = [
  { title: 'Footwear & Terrain', desc: 'Wear sturdy trainers or strapped sandals for steep stone paths and temple stairs.', icon: 'Footprints' },
  { title: 'Sun Protection', desc: 'Reef-safe sunscreen, sunglasses, and wide hats are essential for bright midday sun.', icon: 'Sun' },
  { title: 'Cash on Island', desc: 'Carry small Indonesian Rupiah cash for local warung refreshments and coco stalls.', icon: 'Banknote' },
];
const baseReviews = [
  { name: 'Charlotte & Oliver M.', location: 'London, United Kingdom', avatar: IMG.av4, text: 'The VIP fast boat and private car made everything completely effortless. Bali Vision took care of every detail!', date: 'Stayed October 2024 • Verified Private Tour' },
  { name: 'David & Sarah Tan', location: 'Singapore', avatar: IMG.av5, text: 'Our driver Ketut was incredible—he knew all the exact spots to take photos without crowds. 10/10 recommendation.', date: 'Stayed November 2024 • Verified Private Tour' },
];

export const TOURS = [
  {
    id: 't1', slug: 'family-picnic-in-bali', title: 'Family Picnic in Bali', category: 'Family Trip', badge: 'Bestseller', region: 'Ubud & Safari Region',
    duration: '4 Days 3 Nights', days: 4, rating: 4.9, reviews: 15, price: 8190000, priceUnit: 'Family', originalPrice: 9500000, image: IMG.group, bestseller: true, featured: true,
    highlights: ['Bali Safari & Marine Park private safari', 'Sacred Ubud Monkey Forest sanctuary', 'Tanah Lot sea temple sunset & private MPV'],
    description: 'A relaxed 4-day family escape blending wildlife encounters, gentle cultural walks and a sunset picnic on the cliffs of Tanah Lot.',
    longDescription: ['Designed for families with young explorers, this itinerary balances excitement with plenty of downtime. Enjoy private safari trams, hands-on animal encounters and a curated picnic basket prepared by our partner chefs.', 'Every transfer is in a spacious private MPV with child seats available on request.'],
    gallery: [{ src: IMG.group, label: 'Family Moments' }, { src: IMG.safari, label: 'Safari Tram' }, { src: IMG.ubud, label: 'Ubud Rice Terraces' }, { src: IMG.tanahLot, label: 'Tanah Lot Sunset' }, { src: IMG.beachClub, label: 'Beach Picnic' }],
    features: [{ title: 'Private Family MPV', desc: 'Dedicated air-conditioned vehicle with child seats.', icon: 'Car' }, { title: 'Safari VIP Access', desc: 'Skip-the-line tram and animal feeding session.', icon: 'Ticket' }, { title: 'Picnic Chef Basket', desc: 'Curated gourmet picnic set with local fruits.', icon: 'UtensilsCrossed' }, { title: 'Family Resort Stay', desc: '3 nights at a family-friendly Ubud resort.', icon: 'BedDouble' }],
    itinerary: defaultItinerary(4, ['Arrival & Ubud Monkey Forest Welcome', 'Bali Safari & Marine Park Adventure', 'Rice Terrace Walk & Tanah Lot Picnic', 'Leisure Morning & Airport Transfer']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
  {
    id: 't2', slug: 'magical-bali-family-explorer', title: 'Magical Bali Family Explorer', category: 'Family Trip', badge: null, region: 'Central & Coast',
    duration: '3 Days 2 Nights', days: 3, rating: 4.9, reviews: 37, price: 5840000, priceUnit: 'Family', originalPrice: 6800000, image: IMG.tegenungan, bestseller: true, featured: true,
    highlights: ['Bali Bird Park interactive aviary tour', 'Tegenungan Waterfall & hidden spring dip', 'Sanur Beach golden sunrise cycling journey'],
    description: 'Three magical days of waterfalls, tropical birds and beachside cycling for families who love to keep moving.',
    longDescription: ['From the roar of Tegenungan Waterfall to the calm of Sanur’s sunrise beach path, this compact escape packs in the best of central Bali without long drives.'],
    gallery: [{ src: IMG.tegenungan, label: 'Tegenungan Waterfall' }, { src: IMG.jungle, label: 'Jungle Trails' }, { src: IMG.beachClub, label: 'Sanur Coast' }, { src: IMG.ubud, label: 'Rice Terraces' }, { src: IMG.couple, label: 'Family Fun' }],
    features: [{ title: 'Bird Park Passes', desc: 'Interactive feeding session included.', icon: 'Bird' }, { title: 'Waterfall Guide', desc: 'Safe path and hidden spring access.', icon: 'Droplets' }, { title: 'Sunrise Cycling', desc: 'Kids bikes & helmets provided.', icon: 'Bike' }, { title: 'Beachfront Stay', desc: '2 nights at Sanur family resort.', icon: 'BedDouble' }],
    itinerary: defaultItinerary(3, ['Arrival, Bird Park & Ubud Evening', 'Tegenungan Waterfall & Spring Dip', 'Sanur Sunrise Cycling & Departure']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
  {
    id: 't3', slug: 'bali-rafting-eco-tour', title: 'Bali Rafting & Eco Tour', category: 'Adventure & Eco', badge: null, region: 'Ayung River & Jungle',
    duration: '4 Days 3 Nights', days: 4, rating: 4.8, reviews: 200, price: 2460000, priceUnit: 'Person', originalPrice: 2900000, image: IMG.rafting, bestseller: true, featured: true,
    highlights: ['Ayung River Class II-III white water rafting', 'ATV Quad Bike through jungle tunnels & rice fields', 'Artisanal Luwak coffee tasting workshop'],
    description: 'Adrenaline meets eco-conscious travel in this four-day adventure through Bali’s rivers, jungles and highland plantations.',
    longDescription: ['Paddle the legendary Ayung River, tear through muddy jungle tracks on an ATV, and slow down at an organic coffee plantation in the Kintamani highlands.'],
    gallery: [{ src: IMG.rafting, label: 'Ayung Rafting' }, { src: IMG.atv, label: 'ATV Jungle Trail' }, { src: IMG.jungle, label: 'Jungle Canopy' }, { src: IMG.kintamani, label: 'Kintamani Highlands' }, { src: IMG.waterfall2, label: 'Hidden Waterfall' }],
    features: [{ title: 'Pro Rafting Crew', desc: 'Certified guides and safety gear.', icon: 'LifeBuoy' }, { title: 'ATV Adventure', desc: 'Single or tandem quad bikes.', icon: 'Bike' }, { title: 'Coffee Workshop', desc: 'Luwak coffee roasting session.', icon: 'Coffee' }, { title: 'Eco Lodge Stay', desc: '3 nights at a riverside eco lodge.', icon: 'TreePine' }],
    itinerary: defaultItinerary(4, ['Arrival & Riverside Eco Lodge', 'Ayung River White Water Rafting', 'ATV Jungle Trail & Coffee Plantation', 'Kintamani Sunrise & Departure']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
  {
    id: 't4', slug: 'enchanting-nusa-penida-escape', title: 'Enchanting Nusa Penida Escape', category: 'Private Tour', badge: 'Top Rated', region: 'Nusa Penida Island',
    duration: '4 Days 3 Nights', days: 4, rating: 5.0, reviews: 100, price: 2420000, priceUnit: 'Person', originalPrice: 2950000, image: IMG.kelingking, bestseller: true, featured: true,
    subtitle: 'Pristine Cliffs, Crystal Bays & Secret Lagoons',
    highlights: ['Kelingking T-Rex cliff & Angel’s Billabong', 'Pristine Diamond Beach & Thousand Islands', 'VIP Speedboat return tickets & private island 4x4'],
    description: 'A bespoke 4-day private island odyssey exploring the dramatic limestone cliffs of Kelingking Beach, Diamond Beach, manta ray snorkeling, and sunset oceanfront stays.',
    longDescription: ['Escape the ordinary and immerse yourself in the raw geological grandeur of Nusa Penida. Over four meticulously planned days, you will bypass the tourist rush through custom-timed departures, marveling at the towering headlands of Kelingking, navigating the turquoise waters of Angel’s Billabong, and tracing the dramatic cliff staircase down to Diamond Beach.', 'Designed for those who cherish authentic exploration without sacrificing creature comforts, this package pairs high-octane coastal adventures—like gliding beside oceanic manta rays at Manta Point—with secluded sunsets over Crystal Bay, authentic Balinese hospitality, and hand-selected cliffside retreats.'],
    gallery: [{ src: IMG.kelingking, label: 'Kelingking Secret Point' }, { src: IMG.diamond, label: 'Diamond Beach Steps' }, { src: IMG.manta, label: 'Manta Bay Safari' }, { src: IMG.uluwatuCliff, label: 'Cliffside 4-Star Stay' }, { src: IMG.beachClub, label: 'Sunset Beachfront Dining' }],
    features: [{ title: 'Private Island 4x4 Chauffeur', desc: 'Dedicated air-conditioned vehicle and island-born expert driver throughout.', icon: 'Car' }, { title: 'VIP Fast Boat Return', desc: 'Sanur - Nusa Penida priority check-in boarding passes with luggage assistance.', icon: 'Ship' }, { title: 'Private Snorkeling & Manta Bay', desc: 'Chartered boat, full snorkeling gear, and guide to swim with majestic manta rays.', icon: 'Waves' }, { title: '4-Star Oceanfront Stay', desc: '3 Nights at premium cliffside bungalow with daily gourmet breakfast included.', icon: 'BedDouble' }],
    itinerary: [
      { day: 1, title: 'VIP Fast Boat Arrival & Iconic West Coast Wonders', desc: 'Your private chauffeur collects you from your South Bali hotel and escorts you to Sanur Harbor for VIP fast boat check-in. Upon arriving in Nusa Penida, meet your island guide and begin your expedition into the dramatic West Coast.', points: ['07:30 AM: Hotel pickup & Sanur VIP check-in', '10:30 AM: Kelingking T-Rex Cliff exploration', '01:00 PM: Broken Beach & Angel’s Billabong', '05:30 PM: Golden sunset coconuts at Crystal Bay'], meals: 'Included Meals: Gourmet Indonesian Lunch, Sunset Welcome Drink' },
      { day: 2, title: 'East Coast Hidden Jewels & Cliffside Staircases', desc: 'Descend the legendary limestone staircase to Diamond Beach, then unwind at Atuh Beach and the Thousand Islands viewpoint.', points: ['08:00 AM: Breakfast & Diamond Beach descent', '11:00 AM: Atuh Beach cove swim', '02:00 PM: Thousand Islands & Rumah Pohon treehouse', '05:00 PM: Return to resort'], meals: 'Included Meals: Breakfast, Seafood Lunch' },
      { day: 3, title: 'Private Snorkeling Ocean Safari & Manta Ray Encounter', desc: 'Board your chartered boat for a private snorkeling safari across Manta Point, Crystal Bay and Gamat Bay.', points: ['08:30 AM: Boat departure', '09:30 AM: Manta Point snorkeling', '12:00 PM: Gamat Bay & Crystal Bay', '03:00 PM: Afternoon leisure'], meals: 'Included Meals: Breakfast, Picnic Lunch on Board' },
      { day: 4, title: 'Cultural Sacred Temple Visit & VIP Return Transfer', desc: 'Visit the sacred cave temple of Pura Goa Giri Putri before your VIP fast boat return to Sanur and hotel drop-off.', points: ['08:00 AM: Breakfast & check-out', '09:30 AM: Pura Goa Giri Putri', '12:00 PM: VIP fast boat return', '02:00 PM: South Bali hotel drop-off'], meals: 'Included Meals: Breakfast' },
    ],
    inclusions: ['VIP return fast boat transfers (Sanur - Nusa Penida)', '3 Nights 4-star cliffside boutique resort stay (Twin/King)', 'Private AC 4x4 SUV with dedicated English-speaking guide', 'Chartered snorkeling boat, sanitized masks, fins & life jackets', 'All entrance tickets, retribution fees & parking permits', 'Daily gourmet breakfasts & 4 restaurant lunch experiences', 'Unlimited bottled mineral water & cool refreshing towels'],
    exclusions: ['International or domestic flights to/from Denpasar Bali', 'Alcoholic beverages and specialty cocktails', 'Personal travel insurance (highly recommended)', 'Optional drone videography package (available as add-on)', 'Gratuities / tipping for local driver and boat crew'],
    addons: [{ title: 'Drone 4K Videographer', desc: 'Edited highlight reel of cliffs', price: 450000 }, { title: 'Private Speedboat Charter', desc: 'Direct island crossing, no wait', price: 950000 }],
    tips: [{ title: 'Footwear & Terrain', desc: 'Wear sturdy trainers or strapped sandals for steep stone paths like Diamond Beach stairs.', icon: 'Footprints' }, { title: 'Sun Protection', desc: 'Reef-safe sunscreen, sunglasses, and wide hats are essential for bright midday bay sun.', icon: 'Sun' }, { title: 'Cash on Island', desc: 'Carry small Indonesian Rupiah cash for local warung refreshments and beach coco stalls.', icon: 'Banknote' }],
    reviewsList: baseReviews,
  },
  {
    id: 't5', slug: 'instagram-iconic-bali-tour', title: 'Instagram Iconic Bali Tour', category: 'Private Tour', badge: null, region: 'East Bali & Ubud',
    duration: '3 Days 2 Nights', days: 3, rating: 5.0, reviews: 100, price: 1660000, priceUnit: 'Person', originalPrice: 1990000, image: IMG.lempuyang, bestseller: true, featured: true,
    highlights: ['Lempuyang Gate of Heaven sunrise priority', 'Tirta Gangga Royal Water Palace stepping stones', 'Aloha Ubud jungle swing & nest photography'],
    description: 'Bali’s most photogenic spots, timed for perfect light and minimal crowds, with a dedicated photo-savvy guide.',
    longDescription: ['Arrive at the Gate of Heaven before dawn with priority access, wander royal water gardens, and swing over the Ubud jungle with a professional photographer on hand.'],
    gallery: [{ src: IMG.lempuyang, label: 'Gate of Heaven' }, { src: IMG.lempuyang2, label: 'Lempuyang Temple' }, { src: IMG.swing, label: 'Ubud Jungle Swing' }, { src: IMG.templeLake, label: 'Water Palace' }, { src: IMG.ubud, label: 'Tegalalang' }],
    features: [{ title: 'Priority Sunrise Slot', desc: 'Skip the 2-hour photo queue.', icon: 'Sunrise' }, { title: 'Photo Guide', desc: 'Guide trained in mobile photography.', icon: 'Camera' }, { title: 'Swing Passes', desc: 'All Aloha swing & nest tickets.', icon: 'Ticket' }, { title: 'Boutique Ubud Stay', desc: '2 nights jungle-view boutique villa.', icon: 'BedDouble' }],
    itinerary: defaultItinerary(3, ['Arrival & Ubud Rice Terrace Golden Hour', 'Lempuyang Sunrise & Tirta Gangga', 'Aloha Swing & Departure']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
  {
    id: 't6', slug: 'heritage-stay-at-penglipuran', title: 'Heritage Stay at Penglipuran', category: 'Cultural & Heritage', badge: null, region: 'Bangli Highlands',
    duration: '2 Days 1 Night', days: 2, rating: 5.0, reviews: 100, price: 940000, priceUnit: 'Person', originalPrice: 1150000, image: IMG.penglipuran, bestseller: true, featured: true,
    highlights: ['Eco-bamboo village homestay immersion', '11th-century sacred Kehen Temple exploration', 'Authentic Balinese culinary workshop with elders'],
    description: 'Sleep inside one of the world’s cleanest villages and learn Balinese living traditions from local elders.',
    longDescription: ['Penglipuran’s bamboo-lined lanes and ancestral homes open their doors for a genuine homestay experience paired with a sacred temple visit and cooking with village families.'],
    gallery: [{ src: IMG.penglipuran, label: 'Penglipuran Village' }, { src: IMG.cooking, label: 'Culinary Workshop' }, { src: IMG.lempuyang2, label: 'Kehen Temple' }, { src: IMG.riceMist, label: 'Highland Mist' }, { src: IMG.jungle, label: 'Bamboo Forest' }],
    features: [{ title: 'Village Homestay', desc: 'Traditional compound with modern bath.', icon: 'Home' }, { title: 'Elder Cooking Class', desc: 'Learn lawar & sate lilit.', icon: 'UtensilsCrossed' }, { title: 'Temple Ceremony', desc: 'Sarong & offering included.', icon: 'Landmark' }, { title: 'Private Transfer', desc: 'Round-trip from South Bali.', icon: 'Car' }],
    itinerary: defaultItinerary(2, ['Village Arrival, Kehen Temple & Cooking', 'Bamboo Forest Walk & Return']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
  {
    id: 't7', slug: 'explore-nusa-lembongan-ceningan', title: 'Explore Nusa Lembongan & Ceningan', category: 'Private Tour', badge: null, region: 'Twin Islands',
    duration: '1 Day (Full Day)', days: 1, rating: 4.9, reviews: 1000, price: 399000, priceUnit: 'Person', originalPrice: 480000, image: IMG.penidaBay, bestseller: true, featured: true,
    highlights: ['Cross iconic Yellow Bridge & Devil’s Tear spray', 'Dream Beach infinity view & Blue Lagoon', 'Guided coral reef snorkeling with gear included'],
    description: 'A full-day twin-island hop with cliff-top lagoons, the famous Yellow Bridge and vibrant coral snorkeling.',
    longDescription: ['Board an early fast boat to Lembongan, cross the Yellow Bridge to Ceningan, and finish with guided reef snorkeling before the sunset return.'],
    gallery: [{ src: IMG.penidaBay, label: 'Blue Lagoon' }, { src: IMG.diamond, label: 'Dream Beach' }, { src: IMG.manta, label: 'Reef Snorkeling' }, { src: IMG.beachClub, label: 'Beach Club' }, { src: IMG.surf, label: 'Surf Break' }],
    features: [{ title: 'Fast Boat Tickets', desc: 'Round-trip Sanur departure.', icon: 'Ship' }, { title: 'Island Driver', desc: 'Private pickup truck tour.', icon: 'Car' }, { title: 'Snorkel Gear', desc: 'Sanitized mask, fins, vest.', icon: 'Waves' }, { title: 'Seafood Lunch', desc: 'Beachfront warung lunch.', icon: 'UtensilsCrossed' }],
    itinerary: defaultItinerary(1, ['Twin Islands Full Day Exploration']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
  {
    id: 't8', slug: 'east-nusa-penida-discovery', title: 'East Nusa Penida Discovery', category: 'Private Tour', badge: null, region: 'East Coast Penida',
    duration: '1 Day (Full Day)', days: 1, rating: 5.0, reviews: 100, price: 399000, priceUnit: 'Person', originalPrice: 470000, image: IMG.diamond, bestseller: true, featured: true,
    highlights: ['Diamond Beach cliff staircase & turquoise bay', 'Secluded Atuh Beach cove & palm forest', 'Tree House Molenteng panoramic viewpoint'],
    description: 'Discover the quieter east coast of Nusa Penida with its limestone staircases, secret coves and treehouse viewpoints.',
    longDescription: ['Avoid the west-coast crowds and explore Diamond Beach, Atuh Beach and the Thousand Islands viewpoint with an island-born guide.'],
    gallery: [{ src: IMG.diamond, label: 'Diamond Beach' }, { src: IMG.penidaBay, label: 'Atuh Cove' }, { src: IMG.kelingking, label: 'Cliff Views' }, { src: IMG.jungle, label: 'Palm Forest' }, { src: IMG.beachClub, label: 'Sunset Return' }],
    features: [{ title: 'Fast Boat Tickets', desc: 'Round-trip Sanur departure.', icon: 'Ship' }, { title: 'Island 4x4', desc: 'Private air-conditioned SUV.', icon: 'Car' }, { title: 'Treehouse Access', desc: 'Molenteng viewpoint pass.', icon: 'TreePine' }, { title: 'Local Lunch', desc: 'Cliffside warung lunch.', icon: 'UtensilsCrossed' }],
    itinerary: defaultItinerary(1, ['East Coast Full Day Discovery']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
  {
    id: 't9', slug: 'uluwatu-sunset-kecak-fire-dance', title: 'Uluwatu Sunset & Kecak Fire Dance', category: 'Cultural & Heritage', badge: 'Sunset Highlight', region: 'South Peninsula',
    duration: '1 Day (Afternoon)', days: 1, rating: 4.9, reviews: 540, price: 450000, priceUnit: 'Person', originalPrice: 520000, image: IMG.uluwatu, bestseller: false, featured: true,
    highlights: ['Cliffside Uluwatu Temple perched 70m above ocean', 'Mesmerizing Kecak & Fire Dance amphitheater seats', 'Candlelit grilled seafood dinner on Jimbaran Beach'],
    description: 'An unforgettable afternoon of cliff temples, hypnotic Kecak chants at sunset and a candlelit seafood feast on the sand.',
    longDescription: ['Start at the sacred cliffside temple of Uluwatu, take reserved seats for the Kecak fire dance as the sun drops into the Indian Ocean, then dine on fresh grilled seafood at Jimbaran Bay.'],
    gallery: [{ src: IMG.uluwatu, label: 'Uluwatu Temple' }, { src: IMG.kecak, label: 'Kecak Fire Dance' }, { src: IMG.uluwatuCliff, label: 'Cliff Ocean View' }, { src: IMG.tanahLotSunset, label: 'Golden Sunset' }, { src: IMG.beachClub, label: 'Jimbaran Dinner' }],
    features: [{ title: 'Reserved Seats', desc: 'Front-row Kecak amphitheater.', icon: 'Ticket' }, { title: 'Temple Sarong', desc: 'Sarong & sash provided.', icon: 'Landmark' }, { title: 'Seafood Dinner', desc: 'Candlelit Jimbaran set menu.', icon: 'UtensilsCrossed' }, { title: 'Private Transfer', desc: 'Hotel pickup & return.', icon: 'Car' }],
    itinerary: defaultItinerary(1, ['Uluwatu Sunset & Jimbaran Dinner']),
    inclusions: baseInclusions, exclusions: baseExclusions, tips: baseTips, reviewsList: baseReviews,
  },
];

export default TOURS;
