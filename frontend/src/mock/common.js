import IMG from './images';
import { bindContent } from '../lib/siteContent';

export const COMPANY = bindContent('company', {
  name: 'Bali Vision Tour',
  legal: 'PT. Bali Vision Tour',
  phone: '+62 822 4747 9695',
  whatsapp: '6282247479695',
  email: 'hello@balivisiontour.com',
  address: 'Denpasar, Bali, Indonesia',
});

export const NAV_LINKS = bindContent('navigation', [
  { label: 'Home', to: '/' },
  { label: 'Tour Packages', to: '/tour-packages' },
  { label: 'Car Rental', to: '/car-rental' },
  { label: 'Activities', to: '/activities' },
  { label: 'About Us', to: '/about' },
  { label: 'Articles', to: '/articles' },
]);

export const HOME_STATS = bindContent('homeStats', [
  { value: '10,000+', label: 'Happy Travelers', icon: 'Smile', tone: 'brand' },
  { value: '150+', label: 'Handpicked Destinations', icon: 'Map', tone: 'sage' },
  { value: '4.9 / 5.0', label: 'Average Guest Rating', icon: 'Star', tone: 'brand' },
  { value: '24/7 Dedicated', label: 'Concierge & Care', icon: 'Headphones', tone: 'sage' },
]);

export const HOME_CATEGORIES = bindContent('homeCategories', [
  { index: '01', tag: 'Curated Tours', title: 'Complete Tour Packages', desc: 'Curated itineraries with premier destinations and private local guides for an unforgettable holiday.', cta: 'View Packages', to: '/tour-packages', image: IMG.penglipuran },
  { index: '02', tag: 'Adventure', title: 'Thrilling Adventures', desc: 'Immerse in exciting cultural and outdoor excursions across Bali, from Ayung river rafting to volcanic trails.', cta: 'Explore Activities', to: '/activities', image: IMG.rafting },
  { index: '03', tag: 'Private Fleet', title: 'Private Chauffeur & Fleet', desc: 'Travel in comfort and peace of mind with our executive vehicles and experienced drivers.', cta: 'Choose Fleet', to: '/car-rental', image: IMG.suv2 },
]);

export const DESTINATIONS = bindContent('destinations', [
  { name: 'Ubud', tag: 'TOP PICK', tagStyle: 'brand', desc: "Lush terraced hills, spiritual zen sanctuaries, and Bali's heart of fine art & craft.", image: IMG.ubud },
  { name: 'Nusa Penida', tag: 'Island Hopping', tagStyle: 'glass', desc: 'Dramatic cliff headlands, emerald ridges, and pristine turquoise ocean waters.', image: IMG.kelingking },
  { name: 'Uluwatu', tag: 'Sunset Sanctuary', tagStyle: 'brand', desc: 'Hypnotic Kecak fire dance against crashing waves and golden cliffside sunsets.', image: IMG.uluwatu },
  { name: 'Kintamani', tag: 'Volcano & Lakes', tagStyle: 'glass', desc: 'Crisp highland breezes, Mount Batur caldera peaks, and sunrise lake reflections.', image: IMG.kintamani },
  { name: 'Lovina', tag: 'Dolphin Coast', tagStyle: 'glass', desc: 'Calm northern waters, playful wild dolphin pods, and peaceful volcanic sand shores.', image: IMG.beachClub },
  { name: 'Bedugul', tag: 'Serene Water Temple', tagStyle: 'glass', desc: 'Majestic Ulun Danu temple nestled over foggy mountain waters and cool botanical gardens.', image: IMG.bedugul },
]);

export const HOME_FEATURES = bindContent('homeFeatures', [
  { index: '01', title: 'Curated Destinations', desc: 'From secluded tropical beaches to historic majestic temples, all tailored in one place.', icon: 'Map' },
  { index: '02', title: 'Best Value Guarantee', desc: 'Transparent, competitive rates with no hidden costs or surprise fees throughout your journey.', icon: 'BadgeDollarSign' },
  { index: '03', title: 'Seamless Instant Booking', desc: 'Instant confirmation via WhatsApp. Book packages, activities, and rentals in minutes.', icon: 'Zap' },
  { index: '04', title: '24/7 Dedicated Guest Care', desc: 'Our island concierge is ready to assist you from arrival until departure.', icon: 'Headphones' },
]);

export const TESTIMONIALS = bindContent('testimonials', [
  { name: 'Abdul Basith', location: 'Surabaya', avatar: IMG.av1, text: 'Holidaying in Bali was so much easier thanks to Bali Vision Tour. The driver arrived right on time, polite and exceptionally helpful. Our itinerary was perfectly spaced without any rush. Truly a memorable trip, will definitely book again next time!' },
  { name: 'Pahrurrozi', location: 'Lombok', avatar: IMG.av2, text: 'Booking our private vehicle was effortless. The car was spotlessly clean, comfortable, and airport pickup was punctual. Outstanding professional service from start to finish.' },
  { name: 'David Joseph', location: 'Surabaya', avatar: IMG.av3, text: "From booking to the actual journey, everything was smooth and well-organized. The guides were knowledgeable and courteous. I'll definitely use Bali Vision Tour again!" },
  { name: 'Sarah Louis', location: 'Bandung', avatar: IMG.av4, text: 'I loved how simple and fast the process was. The concierge support team answered every query promptly on WhatsApp and customized our trip perfectly!' },
]);

export const ABOUT = bindContent('about', {
  stats: [
    { value: '10+', label: 'Years Curating Bali', sub: 'Founded in 2014 in Denpasar' },
    { value: '45,000+', label: 'Delighted Travelers', sub: 'Domestic & global voyagers' },
    { value: '100%', label: 'Certified Native Guides', sub: 'HPPWD licensed Balinese drivers', tone: 'forest' },
    { value: '4.9', suffix: '/5', label: 'Average Guest Rating', sub: 'Over 3,200 verified reviews' },
  ],
  pillars: [
    { title: 'Authentic Cultural Connection', desc: 'Native Balinese guides who share local etiquette, sacred temple lore, and hidden culinary gems passed down through generations—not rehearsed textbook scripts.', link: 'Grassroots Storytelling', icon: 'Landmark', tone: 'brand' },
    { title: 'Uncompromised Safety & Luxury', desc: 'Modern hybrid fleet, stringent scheduled maintenance, comprehensive traveler insurance policies, and straightforward pricing without hidden shopping traps.', link: 'Modern Premium Fleet', icon: 'Shield', tone: 'sage' },
    { title: 'Community-First Tourism', desc: 'Direct economic contributions to village banjars, patronage of organic highland farms, and active sponsorship of ethical marine sanctuaries in Lovina and Nusa Penida.', link: 'Sustainable Impact', icon: 'Leaf', tone: 'sand' },
    { title: '24/7 White-Glove Concierge', desc: 'Real-time support via WhatsApp from the moment of your flight landing at Ngurah Rai to your final departure, ensuring seamless adaptations to weather or whim.', link: 'Instant Dispatch', icon: 'Headphones', tone: 'brand' },
  ],
  team: [
    { name: 'Wayan Sudiarta', role: 'Founder & Managing Director', tag: '10+ YRS EXP', desc: 'Denpasar native dedicated to ethical Balinese tourism and elevating guest journeys across all regencies.', image: IMG.staff1 },
    { name: 'Ni Ketut Saraswati', role: 'Head of Curated Experiences', tag: 'CULTURAL SPECIALIST', desc: 'Designs our exclusive wellness retreats, private temple blessings, and secluded culinary expeditions.', image: IMG.staff2 },
    { name: 'Made Arya', role: 'Fleet Operations & Safety Lead', tag: 'SAFETY CERTIFIED', desc: 'Supervises vehicle telemetry, daily sanitization, driver safety schooling, and eco-fleet maintenance.', image: IMG.staff3 },
    { name: 'Ketut Aris', role: 'Senior Guest Concierge', tag: '24/7 CONCIERGE', desc: 'First point of contact for custom bookings, flight rescheduling, and responsive in-trip guest inquiries.', image: IMG.staff4 },
  ],
  sustainability: [
    { title: 'Clean Coastal & Coral Reef Drives', desc: 'Monthly community beach cleans in Nusa Dua and funding artificial reef nurseries in Amed & Menjangan.', icon: 'Droplets' },
    { title: 'Direct Banjar & Artisan Guild Support', desc: 'Fair wage guarantees for local silver smiths in Celuk, wood carvers in Mas, and organic coffee cultivators in Kintamani.', icon: 'Users' },
    { title: 'Eco-Fleet & Carbon Offsets', desc: 'Progressive fleet electrification and active reforestation planting in the Bedugul highlands for every 500km journeyed.', icon: 'Leaf' },
  ],
  voices: [
    { name: 'Emma & Liam Walker', meta: 'Melbourne, Australia • 7-Day Bespoke Tour', initials: 'EW', text: 'Bali Vision Tour transformed our honeymoon. Wayan took us to temples where we were the only foreigners, arranged a private water blessing, and our driver Made drove like an angel. Truly pristine service.' },
    { name: 'Hendra Pratama', meta: 'Jakarta, Indonesia • Family Private Charter', initials: 'HP', text: 'Pelayanan Bali Vision Tour luar biasa! Mobil Alphard dan Innova Zenix sangat bersih dan wangi. Pak Ketut siap 24 jam di WhatsApp merekomendasikan beach club dan resto seafood terbaik di Jimbaran.' },
    { name: 'Sophie & Julian Dupont', meta: 'Geneva, Switzerland • Curated Villa Journey', initials: 'SD', text: "Total peace of mind. Transparent upfront pricing with no awkward surprise commissions at souvenir shops. Saraswati's culinary route in Ubud was the highlight of our three weeks in Southeast Asia." },
  ],
});

export const AIRPORT_RATES = bindContent('airportRates', [
  { route: 'DPS Airport -> Kuta / Seminyak', meta: 'Approx. 25 - 40 Mins • Toll included', price: 175000 },
  { route: 'DPS Airport -> Uluwatu / Nusa Dua', meta: 'Approx. 35 - 50 Mins • Toll included', price: 250000 },
  { route: 'DPS Airport -> Canggu / Pererenan', meta: 'Approx. 45 - 65 Mins • Coastal route', price: 275000 },
  { route: 'DPS Airport -> Ubud Cultural Center', meta: 'Approx. 75 - 90 Mins • Bypass highway', price: 350000 },
]);

export const CAR_INCLUSIONS = bindContent('carInclusions', [
  { title: 'English-Speaking Driver', desc: 'Knowledgeable local drivers with spotless safety records. They act as your informal island guide, navigating hidden scenic routes with ease.', icon: 'Users', tone: 'sage' },
  { title: 'Fuel & Parking Covered', desc: 'Clear upfront rates with standard gasoline included for 10 or 12 hours. No surprise charges or awkward tip obligations at the end of the day.', icon: 'Fuel', tone: 'brand' },
  { title: '100% Sanitized Fleet', desc: 'Vehicles less than 3 years old, routinely serviced, vacuumed daily, and fully air-conditioned before your pickup arrives.', icon: 'SprayCan', tone: 'sage' },
  { title: 'Flexible Itinerary & Free Cancel', desc: 'Create your own stops anywhere in Bali. Modify timing on the go or cancel free of charge up to 24 hours prior to departure.', icon: 'Route', tone: 'brand' },
]);

export const ACTIVITY_WHY = bindContent('activityWhy', [
  { title: 'Certified Safety Standards', desc: 'All operators adhere to international rescue standards, CE-marked safety gear, and licensed English-speaking instructors.', icon: 'ShieldCheck', tone: 'sage' },
  { title: 'Best Price Guarantee', desc: 'Direct partnerships with local communities mean transparent prices with zero hidden platform markups or surprise gate fees.', icon: 'BadgeDollarSign', tone: 'brand' },
  { title: 'Instant Confirmation', desc: 'Receive your digital travel voucher and pick-up time slot directly via WhatsApp and email within 5 minutes of checkout.', icon: 'Zap', tone: 'brand' },
  { title: 'Free Equipment & Insurance', desc: 'Clean sanitized equipment, lockers, fresh shower towels, and up to Rp 500M personal medical coverage on every trip.', icon: 'Shield', tone: 'sand' },
]);

export const TOUR_PERKS = bindContent('tourPerks', [
  { title: 'Private AC Fleet', sub: 'Toyota Innova / HiAce VIP', icon: 'Car' },
  { title: 'English Guide', sub: 'Warm Balinese Hospitality', icon: 'UserRound' },
  { title: 'All Entry Tickets', sub: 'Zero Hidden Charges', icon: 'Ticket' },
  { title: 'Bottled Water', sub: 'Fresh Chilled Daily', icon: 'Droplets' },
  { title: 'Flexible Pace', sub: 'Tailored to Your Flow', icon: 'CalendarClock' },
]);

export const FAQ_FACTS = bindContent('faqFacts', [
  { title: 'When is the Best Travel Season?', desc: 'Dry Season (April to October): Ideal for surfing, hiking Batur, and Nusa Penida boat transits. Green Season (Nov to March): Best for spa retreats, lush rice terrace photography, and fewer crowds.', icon: 'Sun' },
  { title: 'Visa On Arrival (e-VOA)', desc: 'Available for 90+ nationalities (IDR 500,000 / ~USD $35). Valid for 30 days and extendable once. We advise filling out the official e-Customs declaration form 3 days before arrival.', icon: 'Luggage' },
  { title: 'Currency & Payment Tips', desc: 'Indonesian Rupiah (IDR). Visa & Mastercard are accepted in upscale restaurants/hotels (often with a 2-3% fee). Keep IDR cash for temple donations, beach coconuts, and road tolls.', icon: 'Banknote' },
  { title: 'Scooter vs Chauffeur Safety', desc: 'Traffic in Canggu, Ubud, and Seminyak can be intense. For couples and families, chartered private air-conditioned transport eliminates accident liabilities and navigating narrow hillside alleys.', icon: 'Car' },
]);

export const TRENDING_TAGS = bindContent('trendingTags', ['#NusaPenidaCliffs', '#KintamaniCafes', '#NyepiSilence2025', '#JimbaranSeafood', '#TirtaEmpulBlessing', '#LuxuryVillasUluwatu', '#PrivateDriverRates']);

