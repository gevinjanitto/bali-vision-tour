import IMG from './images';

export const CAR_FILTERS = ['All Vehicles', 'Family MPV', 'VIP Luxury', 'Group Vans'];

const baseRoutes = [
  { tag: 'Culture & Jungle', tone: 'sage', hours: '10 Hours', title: 'Ubud Royal Arts & Waterfall Trail', stops: ['Tegenungan or Kanto Lampo Waterfalls', 'Ubud Sacred Monkey Forest Sanctuary', 'Tegalalang Rice Terraces & Artisan Coffee Farm', 'Sunset dinner at modern Indonesian fine dining'] },
  { tag: 'Cliffs & Beach Clubs', tone: 'brand', hours: '10 Hours', title: 'Uluwatu Ocean Panorama & Sunset Fire', stops: ['Melasti Beach & Luxury Day Beach Club', 'Padang Padang Surf Cove exploration', 'Ancient Cliffside Uluwatu Temple & Kecak Dance', 'Jimbaran Bay candlelit seafood dinner on the sand'] },
];

const baseReviews = [
  { name: 'Marcus & Elena Vance', meta: 'Melbourne, Australia • 3 Days Charter', initials: 'M', tone: 'forest', text: 'Astonishingly silent and comfortable. Our driver Wayan was waiting outside our villa 15 minutes ahead of schedule daily in a pressed uniform with cold jasmine towels. Having the reclining ottoman seats after walking through Ubud was heaven.' },
  { name: 'Sophia Tan', meta: 'Singapore • Family Charter (4 Pax)', initials: 'S', tone: 'brand', text: 'Spotless cabin with zero gasoline fumes. The dual air conditioning blew ice cold during 34-degree Bali heat. Our driver Ketut navigated tight roads with effortless mastery and made table reservations at a cliffside lounge for us. Exceptional service.' },
];

const mk = (o) => ({
  gallery: [{ src: o.image, label: 'Flagship Fleet' }, { src: IMG.interior, label: 'Premium Interior' }, { src: IMG.chauffeur, label: 'Uniformed Chauffeur' }, { src: IMG.innova2, label: 'Luggage Capacity' }, { src: IMG.ubud, label: 'Scenic Routes' }],
  headline: `${o.name} Charter with Private English-Speaking Chauffeur`,
  longDesc: 'First-class comfort for island exploration. Experience smooth travel, dual climate control, and supreme ride suspension tailored for Bali’s scenic terrains.',
  amenities: ['Chilled Aqua Reflection', 'Dual Cold Zone A/C', 'Fast USB-C Chargers', 'Citrus Cold Towels'],
  addons: [{ title: 'Child Safety Baby Seat (ISOFIX)', price: 50000 }, { title: '1 Hour Extra Overtime Buffer', price: 85000 }],
  pickupAreas: ['Seminyak / Kerobokan', 'Kuta / Legian', 'Canggu / Pererenan', 'Ubud', 'Nusa Dua / Jimbaran', 'Sanur / Denpasar', 'Ngurah Rai Airport (DPS)'],
  routes: baseRoutes,
  reviewsList: baseReviews,
  ...o,
});

export const CARS = [
  mk({
    id: 'c1', slug: 'toyota-avanza-xenia', name: 'Toyota All New Avanza / Xenia', category: 'Compact MPV', filter: 'Family MPV', badge: null, image: IMG.innova3,
    description: 'Perfect for couples and compact families seeking effortless Bali island sightseeing.',
    specs: [{ icon: 'Users', label: '4-5 Passengers' }, { icon: 'Luggage', label: '3 Large Luggages' }, { icon: 'Snowflake', label: 'Double Cold AC' }, { icon: 'Droplets', label: 'Free Mineral Water' }],
    features: ['Dual front airbags & active ABS braking', 'Includes English-speaking driver + Fuel'],
    price: 450000, price12h: 550000, tags: ['Compact MPV', 'Fuel Efficient', 'Family Friendly'],
    capacity: '4-5 Passengers Max', capacitySub: 'Recommended 4 adults for comfort', luggage: '3 Large Suitcases', luggageSub: 'Foldable 3rd row for extra space', drivetrain: '1.5L Petrol Engine', drivetrainSub: 'Smooth CVT transmission', seating: 'Fabric Comfort Seats', seatingSub: 'Reclining second row',
  }),
  mk({
    id: 'c2', slug: 'toyota-grand-innova-reborn', name: 'Toyota Grand Innova Reborn', category: 'Premium MPV', filter: 'Family MPV', badge: 'Most Popular', image: IMG.innova1,
    description: "Bali's gold-standard touring MPV. Supreme comfort, quiet cabin, and smooth suspension.",
    specs: [{ icon: 'Users', label: '6-7 Passengers' }, { icon: 'Luggage', label: '4 Luggages' }, { icon: 'Plug', label: 'Fast USB Chargers' }, { icon: 'MoveVertical', label: 'Extra Legroom' }],
    features: ['Reclining ergonomic seats in all three rows', 'Chauffeur, fuel, parking & iced drinks included'],
    price: 650000, price12h: 780000, tags: ['Premium MPV', 'Quiet Cabin', 'Best Seller'],
    capacity: '6-7 Passengers Max', capacitySub: 'Recommended 5-6 adults for comfort', luggage: '4 Large Suitcases + Handbags', luggageSub: 'Roof rack available on request', drivetrain: '2.4L Diesel Engine', drivetrainSub: 'Torquey highland climbs', seating: 'Premium Leather Seats', seatingSub: 'Reclining captain-style second row',
  }),
  mk({
    id: 'c3', slug: 'toyota-innova-zenix-hybrid', name: 'Toyota Innova Zenix Hybrid', category: 'Modern Luxury Hybrid', filter: 'VIP Luxury', badge: null, image: IMG.innova2,
    description: 'Next-gen eco-luxury. Whisper-quiet hybrid drivetrain, captain seats, and panoramic roof.',
    specs: [{ icon: 'Users', label: '6-7 Passengers' }, { icon: 'Luggage', label: '4 Luggages' }, { icon: 'Armchair', label: 'VIP Captain Seats' }, { icon: 'Leaf', label: 'Hybrid Whisper-Quiet' }],
    features: ['Panoramic glass moonroof with ambient lighting', 'Senior verified driver with immaculate ratings'],
    price: 850000, price12h: 1000000, tags: ['Modern Luxury Hybrid', 'Eco-Quiet Fleet', 'VIP Captain Seats'],
    headline: 'Toyota Innova Zenix Hybrid Charter with Private English-Speaking Chauffeur',
    longDesc: "First-class comfort for island exploration. Experience whisper-quiet hybrid travel, panoramic glass roof, dual automatic climate control, and supreme ride suspension tailored for Bali's scenic terrains.",
    capacity: '6-7 Passengers Max', capacitySub: 'Recommended 4-5 adults for ultimate VIP reclining comfort', luggage: '4 Large Suitcases + 2 Handbags', luggageSub: 'Fold-down 3rd row configuration expands boot volume instantly', drivetrain: '2.0L 5th-Gen Hybrid Electric', drivetrainSub: 'Zero cabin vibration at low speeds, silent start-up, ultra-smooth ride', seating: 'Power Ottoman VIP Captain Seats', seatingSub: 'Micro-perforated premium leather with personal folding side tray tables',
  }),
  mk({
    id: 'c4', slug: 'toyota-fortuner-pajero-sport', name: 'Toyota Fortuner / Pajero Sport', category: 'Luxury 4x4 SUV', filter: 'VIP Luxury', badge: null, image: IMG.suv1,
    description: 'Prestige commanding road presence with high ground clearance for highland exploration.',
    specs: [{ icon: 'Users', label: '5-6 Passengers' }, { icon: 'Luggage', label: '4 Luggages' }, { icon: 'Mountain', label: 'Hill & Volcano Ready' }, { icon: 'Shield', label: 'Prestige Heavy Build' }],
    features: ['Ideal for Kintamani, Bedugul, and Karangasem slopes', 'Full leather upholstery & rear individual climate'],
    price: 1100000, price12h: 1300000, tags: ['Luxury 4x4 SUV', 'Highland Ready', 'Full Leather'],
    gallery: [{ src: IMG.suv1, label: 'Flagship Fleet' }, { src: IMG.suv2, label: 'Mountain Roads' }, { src: IMG.interior, label: 'Leather Interior' }, { src: IMG.chauffeur, label: 'Uniformed Chauffeur' }, { src: IMG.kintamani, label: 'Highland Routes' }],
    capacity: '5-6 Passengers Max', capacitySub: 'Recommended 4 adults for comfort', luggage: '4 Large Suitcases', luggageSub: 'Deep boot with 3rd row folded', drivetrain: '2.8L Turbo Diesel 4x4', drivetrainSub: 'High clearance for volcanic roads', seating: 'Full Leather Upholstery', seatingSub: 'Rear individual climate control',
  }),
  mk({
    id: 'c5', slug: 'toyota-hiace-commuter-premio', name: 'Toyota HiAce Commuter / Premio', category: 'Executive Group Van', filter: 'Group Vans', badge: null, image: IMG.minibus,
    description: 'Grand luxury transit for families and corporate groups. Walk-in headroom and huge luggage trunk.',
    specs: [{ icon: 'Users', label: '10-14 Passengers' }, { icon: 'Luggage', label: '8+ Luggages' }, { icon: 'Wind', label: 'Individual AC Vents' }, { icon: 'MoveVertical', label: 'High Ceiling Interior' }],
    features: ['Reclining high-back coach seats with armrests', 'Driver + petrol + mineral water included for 10 hours'],
    price: 1200000, price12h: 1400000, tags: ['Executive Group Van', 'Walk-in Headroom', 'Corporate Ready'],
    gallery: [{ src: IMG.minibus, label: 'Flagship Fleet' }, { src: IMG.van2, label: 'Group Comfort' }, { src: IMG.interior, label: 'Coach Seats' }, { src: IMG.chauffeur, label: 'Uniformed Chauffeur' }, { src: IMG.beachClub, label: 'Group Outings' }],
    capacity: '10-14 Passengers Max', capacitySub: 'Recommended 12 adults with luggage', luggage: '8+ Large Suitcases', luggageSub: 'Rear luggage compartment', drivetrain: '2.8L Diesel Engine', drivetrainSub: 'Stable long-distance cruising', seating: 'Reclining Coach Seats', seatingSub: 'Individual armrests & AC vents',
  }),
  mk({
    id: 'c6', slug: 'toyota-alphard-vellfire-luxury', name: 'Toyota Alphard / Vellfire Luxury', category: 'Presidential VIP', filter: 'VIP Luxury', badge: null, image: IMG.van1,
    description: 'First-class executive luxury. Power Ottoman captain loungers, dark privacy tint, and tailored VIP service.',
    specs: [{ icon: 'Star', label: '4-5 VIP Guests' }, { icon: 'Luggage', label: '4 Large Luggages' }, { icon: 'Armchair', label: 'Ottoman Footrests' }, { icon: 'UserRound', label: 'Suited VIP Chauffeur' }],
    features: ['Executive power sliding doors & premium audio', 'Chilled refreshing towels, evian water & mints'],
    price: 2200000, price12h: 2600000, tags: ['Presidential VIP', 'Ottoman Loungers', 'Privacy Tint'],
    gallery: [{ src: IMG.van1, label: 'Flagship Fleet' }, { src: IMG.van2, label: 'Executive Presence' }, { src: IMG.interior, label: 'Ottoman Loungers' }, { src: IMG.chauffeur, label: 'Suited Chauffeur' }, { src: IMG.uluwatuCliff, label: 'Cliffside Arrivals' }],
    capacity: '4-5 VIP Guests', capacitySub: 'Two power ottoman captain seats', luggage: '4 Large Suitcases', luggageSub: 'Electric tailgate', drivetrain: '2.5L Hybrid V6', drivetrainSub: 'Silent executive cruising', seating: 'Power Ottoman Loungers', seatingSub: 'Massage, heating & privacy curtains',
  }),
];

export default CARS;
