/**
 * Seeds demo content (EN + BN). Run once after the DB is connected:
 *   npm run seed
 * Needs POSTGRES_URL + PAYLOAD_SECRET in .env.local (or exported).
 * Creates an admin user if SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD are set.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })
loadEnv()

const run = async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'services' })
  if (existing.totalDocs > 0) {
    console.log('Already seeded — skipping.')
    process.exit(0)
  }

  const seedEmail = process.env.SEED_ADMIN_EMAIL || 'admin@akhicarrental.com'
  const seedPassword = process.env.SEED_ADMIN_PASSWORD || 'AkhiRentalAdmin2026!'
  const u = await payload.count({ collection: 'users' })
  if (u.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: seedEmail,
        password: seedPassword,
        name: 'Super Admin',
        role: 'superadmin',
      },
    })
    console.log(`👤 Admin created: ${seedEmail} / ${seedPassword}`)
  }

  type L = { en: string; bn: string }
  const svc = async (d: {
    slug: string; type: string; icon: string; accent: string; order: number
    title: L; summary: L; description: L; startingPrice: L; highlights: L[]
  }) => {
    const base = {
      slug: d.slug, type: d.type, icon: d.icon, accent: d.accent, order: d.order,
    } as any
    const doc = await payload.create({
      collection: 'services', locale: 'en',
      data: {
        ...base, title: d.title.en, summary: d.summary.en, description: d.description.en,
        startingPrice: d.startingPrice.en, highlights: d.highlights.map((h) => ({ label: h.en })),
      },
    })
    await payload.update({
      collection: 'services', id: doc.id, locale: 'bn',
      data: {
        title: d.title.bn, summary: d.summary.bn, description: d.description.bn,
        startingPrice: d.startingPrice.bn,
        highlights: (doc.highlights as any[]).map((h, i) => ({ id: h.id, label: d.highlights[i].bn })),
      },
    })
    return doc
  }

  const daily = await svc({
    slug: 'daily-rental', type: 'daily', icon: '🚗', accent: 'violet', order: 1,
    title: { en: 'Daily & Hourly Rental', bn: 'দৈনিক ও ঘণ্টাভিত্তিক রেন্টাল' },
    summary: { en: 'Book a car with a professional driver for a few hours or a few days.', bn: 'কয়েক ঘণ্টা বা কয়েক দিনের জন্য পেশাদার ড্রাইভারসহ গাড়ি।' },
    description: { en: 'City trips, meetings, shopping or family outings — choose your car and we handle the rest. Fuel and driver options are clear upfront.', bn: 'শহরে ঘোরাঘুরি, মিটিং, শপিং বা ফ্যামিলি আউটিং — গাড়ি বেছে নিন, বাকিটা আমাদের।' },
    startingPrice: { en: 'From ৳3,500 / day', bn: 'শুরু ৳৩,৫০০ / দিন' },
    highlights: [
      { en: 'Professional, verified drivers', bn: 'যাচাইকৃত পেশাদার ড্রাইভার' },
      { en: 'Transparent pricing, no hidden fees', bn: 'স্বচ্ছ মূল্য, গোপন চার্জ নেই' },
      { en: 'Clean, sanitised cars', bn: 'পরিষ্কার ও স্যানিটাইজড গাড়ি' },
      { en: 'Instant WhatsApp confirmation', bn: 'হোয়াটসঅ্যাপে তাৎক্ষণিক কনফার্মেশন' },
    ],
  })
  const monthly = await svc({
    slug: 'monthly-rental', type: 'monthly', icon: '📅', accent: 'pink', order: 2,
    title: { en: 'Monthly Rental', bn: 'মান্থলি রেন্টাল' },
    summary: { en: 'A dedicated car and driver every month at a fixed, lower rate.', bn: 'প্রতি মাসে নির্দিষ্ট কম রেটে ডেডিকেটেড গাড়ি ও ড্রাইভার।' },
    description: { en: 'Perfect for executives, families and small businesses. Fixed monthly price, a regular driver and a backup car whenever yours is in service.', bn: 'এক্সিকিউটিভ, পরিবার ও ছোট ব্যবসার জন্য উপযুক্ত। ফিক্সড মাসিক মূল্য, নিয়মিত ড্রাইভার ও সার্ভিসিংয়ের সময় ব্যাকআপ গাড়ি।' },
    startingPrice: { en: 'From ৳65,000 / month', bn: 'শুরু ৳৬৫,০০০ / মাস' },
    highlights: [
      { en: 'Dedicated car & regular driver', bn: 'নির্দিষ্ট গাড়ি ও নিয়মিত ড্রাইভার' },
      { en: 'Backup car during maintenance', bn: 'মেইনটেন্যান্সে ব্যাকআপ গাড়ি' },
      { en: 'Flexible monthly billing', bn: 'নমনীয় মাসিক বিলিং' },
      { en: 'Swap models any time', bn: 'যেকোনো সময় মডেল বদল' },
    ],
  })
  const corporate = await svc({
    slug: 'corporate-contract', type: 'corporate', icon: '🏢', accent: 'amber', order: 3,
    title: { en: 'Corporate Contracts', bn: 'কর্পোরেট চুক্তি' },
    summary: { en: 'Long-term fleet agreements for companies, NGOs and embassies.', bn: 'কোম্পানি, এনজিও ও দূতাবাসের জন্য দীর্ঘমেয়াদি ফ্লিট চুক্তি।' },
    description: { en: 'We build a fleet around your team: staff transport, executive cars and event logistics, with monthly consolidated invoicing and a named account manager.', bn: 'আপনার টিমের জন্য ফ্লিট: স্টাফ ট্রান্সপোর্ট, এক্সিকিউটিভ কার ও ইভেন্ট লজিস্টিক্স — মাসিক একত্রিত ইনভয়েস ও নির্দিষ্ট অ্যাকাউন্ট ম্যানেজারসহ।' },
    startingPrice: { en: 'Custom quote', bn: 'কাস্টম কোটেশন' },
    highlights: [
      { en: '6–36 month agreements', bn: '৬–৩৬ মাসের চুক্তি' },
      { en: 'VAT/TAX-ready invoices', bn: 'ভ্যাট/ট্যাক্স ইনভয়েস' },
      { en: '24/7 dispatch & support', bn: '২৪/৭ ডিসপ্যাচ ও সাপোর্ট' },
      { en: 'GPS tracked vehicles', bn: 'জিপিএস ট্র্যাকড গাড়ি' },
    ],
  })
  const airport = await svc({
    slug: 'airport-transfer', type: 'airport', icon: '✈️', accent: 'cyan', order: 4,
    title: { en: 'Airport Transfer', bn: 'এয়ারপোর্ট ট্রান্সফার' },
    summary: { en: 'On-time pickup & drop with flight tracking.', bn: 'ফ্লাইট ট্র্যাকিংসহ সময়মতো পিকআপ ও ড্রপ।' },
    description: { en: 'Land stress-free. Our driver tracks your flight, waits with a name board and helps with luggage.', bn: 'চিন্তামুক্ত ল্যান্ডিং। আমাদের ড্রাইভার ফ্লাইট ট্র্যাক করে নেমবোর্ডসহ অপেক্ষা করবে ও লাগেজে সাহায্য করবে।' },
    startingPrice: { en: 'From ৳1,800 / trip', bn: 'শুরু ৳১,৮০০ / ট্রিপ' },
    highlights: [
      { en: 'Flight tracking', bn: 'ফ্লাইট ট্র্যাকিং' },
      { en: 'Meet & greet', bn: 'মিট অ্যান্ড গ্রিট' },
      { en: 'Fixed fares', bn: 'নির্দিষ্ট ভাড়া' },
    ],
  })
  const wedding = await svc({
    slug: 'wedding-events', type: 'wedding', icon: '💍', accent: 'orange', order: 5,
    title: { en: 'Wedding & Events', bn: 'বিয়ে ও ইভেন্ট' },
    summary: { en: 'Decorated luxury cars and guest shuttles for your big day.', bn: 'আপনার বিশেষ দিনে সাজানো লাক্সারি গাড়ি ও গেস্ট শাটল।' },
    description: { en: 'Flowers, ribbons and a chauffeur in uniform — plus minibuses to move your guests together.', bn: 'ফুল, রিবন ও ইউনিফর্ম পরা শোফার — সাথে অতিথিদের জন্য মাইক্রোবাস।' },
    startingPrice: { en: 'From ৳12,000 / event', bn: 'শুরু ৳১২,০০০ / ইভেন্ট' },
    highlights: [
      { en: 'Floral decoration', bn: 'ফুলের সাজসজ্জা' },
      { en: 'Uniformed chauffeurs', bn: 'ইউনিফর্মধারী শোফার' },
      { en: 'Guest shuttles', bn: 'গেস্ট শাটল' },
    ],
  })
  const tour = await svc({
    slug: 'tours-outstation', type: 'tour', icon: '🏞️', accent: 'lime', order: 6,
    title: { en: 'Tours & Outstation', bn: 'ট্যুর ও আউটস্টেশন' },
    summary: { en: "Cox's Bazar, Sylhet, Sajek — go anywhere with a comfortable ride.", bn: 'কক্সবাজার, সিলেট, সাজেক — আরামদায়ক গাড়িতে যেখানে খুশি।' },
    description: { en: 'Multi-day trips with experienced highway drivers and well-maintained vehicles.', bn: 'অভিজ্ঞ হাইওয়ে ড্রাইভার ও সুরক্ষিত গাড়িসহ মাল্টি-ডে ট্রিপ।' },
    startingPrice: { en: 'From ৳6,500 / day', bn: 'শুরু ৳৬,৫০০ / দিন' },
    highlights: [
      { en: 'Experienced highway drivers', bn: 'অভিজ্ঞ হাইওয়ে ড্রাইভার' },
      { en: 'Family-friendly SUVs & vans', bn: 'ফ্যামিলি-ফ্রেন্ডলি এসইউভি ও ভ্যান' },
    ],
  })

  type Car = {
    slug: string; brand: string; category: string; accent: string; year?: number; yearRange?: string; seats: number; luggage: number
    transmission: string; fuel: string; price?: number; month?: number; featured?: boolean; order?: number
    name: L; desc: L; features: L[]; services: number[]
  }
  const cars: Car[] = [
    { slug: 'toyota-axio-hybrid', brand: 'Toyota', category: 'sedan', accent: 'gold', year: 2019, yearRange: '2016–2020', seats: 4, luggage: 2, transmission: 'auto', fuel: 'hybrid', price: 3500, month: 68000, featured: true, order: 1,
      name: { en: 'Toyota Axio Hybrid', bn: 'টয়োটা অ্যাক্সিও হাইব্রিড' }, desc: { en: 'Smooth, fuel-efficient city sedan for office runs and airport trips.', bn: 'অফিস ও এয়ারপোর্ট ট্রিপের জন্য মসৃণ ও সাশ্রয়ী সেডান।' },
      features: [{ en: 'Air conditioning', bn: 'এয়ার কন্ডিশন' }, { en: 'Bluetooth audio', bn: 'ব্লুটুথ অডিও' }, { en: 'Push Start', bn: 'পুশ স্টার্ট' }], services: [daily.id, monthly.id, corporate.id, airport.id] },
    { slug: 'toyota-noah-deluxe', brand: 'Toyota', category: 'microbus', accent: 'cyan', year: 2021, yearRange: '2018–2022', seats: 7, luggage: 4, transmission: 'auto', fuel: 'hybrid', price: 6000, month: 115000, featured: true, order: 2,
      name: { en: 'Toyota Noah Deluxe', bn: 'টয়োটা নোয়া ডিলাক্স' }, desc: { en: 'Spacious 7-seater for family trips and group transfers.', bn: 'ফ্যামিলি ট্রিপ ও গ্রুপ ট্রান্সফারের জন্য প্রশস্ত ৭ সিটার।' },
      features: [{ en: 'Dual sliding doors', bn: 'ডুয়াল স্লাইডিং ডোর' }, { en: 'Rear dual AC', bn: 'রিয়ার ডুয়াল এসি' }, { en: 'Captain seats', bn: 'ক্যাপ্টেন সিট' }], services: [daily.id, monthly.id, tour.id, airport.id] },
    { slug: 'toyota-land-cruiser-prado', brand: 'Toyota', category: 'suv', accent: 'gold', year: 2020, yearRange: '2018–2022', seats: 7, luggage: 4, transmission: 'auto', fuel: 'diesel', price: 15000, month: 290000, featured: true, order: 3,
      name: { en: 'Toyota Land Cruiser Prado TX-L', bn: 'টয়োটা ল্যান্ড ক্রুজার প্রাডো টিএক্স-এল' }, desc: { en: 'Commanding 4x4 comfort for executives, VIPs and highway journeys.', bn: 'এক্সিকিউটিভ, ভিআইপি ও দূরপাল্লার মহাসড়কের জন্য রাজকীয় ৪x৪।' },
      features: [{ en: 'Premium leather interior', bn: 'প্রিমিয়াম লেদার ইন্টেরিয়র' }, { en: 'Full-time 4WD', bn: 'ফুল-টাইম ৪x৪' }, { en: 'Sunroof & Coolbox', bn: 'সানরুফ ও কুলবক্স' }], services: [daily.id, corporate.id, tour.id] },
    { slug: 'toyota-hiace-super-gl', brand: 'Toyota', category: 'microbus', accent: 'lime', year: 2022, yearRange: '2019–2023', seats: 11, luggage: 6, transmission: 'auto', fuel: 'octane', price: 7500, month: 145000, featured: true, order: 4,
      name: { en: 'Toyota Hiace Super GL', bn: 'টয়োটা হায়েস সুপার জিএল' }, desc: { en: 'The gold standard van for corporate delegations, family tours and event transport.', bn: 'কর্পোরেট প্রতিনিধি, পরিবার ও ইভেন্টের জন্য সেরা মাইক্রোবাস।' },
      features: [{ en: 'High roof spacious cabin', bn: 'হাই রুফ প্রশস্ত কেবিন' }, { en: 'Dual chill AC', bn: 'ডুয়াল চিল এসি' }, { en: 'Tinted privacy glass', bn: 'টিন্টেড প্রাইভেসি গ্লাস' }], services: [corporate.id, tour.id, wedding.id, monthly.id] },
    { slug: 'mercedes-e-class-amg', brand: 'Mercedes-Benz', category: 'luxury', accent: 'gold', year: 2021, yearRange: '2020–2023', seats: 4, luggage: 3, transmission: 'auto', fuel: 'petrol', price: 20000, month: 380000, featured: true, order: 5,
      name: { en: 'Mercedes-Benz E-Class Luxury', bn: 'মার্সিডিজ-বেঞ্জ ই-ক্লাস লাক্সারি' }, desc: { en: 'Ultimate VIP luxury for state dignitaries, weddings, and high-profile corporate delegates.', bn: 'ভিআইপি প্রটোকল, জমকালো বিয়ে ও হাই-প্রোফাইল মিটিংয়ের জন্য সর্বোচ্চ আভিজাত্য।' },
      features: [{ en: 'Uniformed chauffeur', bn: 'ইউনিফর্মধারী পেশাদার শোফার' }, { en: 'Burmester surround sound', bn: 'প্রিমিয়াম সাউন্ড সিস্টেম' }, { en: 'Ambient cabin lighting', bn: 'অ্যাম্বিয়েন্ট লাইটিং' }], services: [wedding.id, airport.id, corporate.id] },
    { slug: 'toyota-hilux-double-cabin', brand: 'Toyota', category: 'pickup', accent: 'amber', year: 2021, yearRange: '2019–2023', seats: 5, luggage: 8, transmission: 'manual', fuel: 'diesel', price: 9000, month: 175000, featured: true, order: 6,
      name: { en: 'Toyota Hilux Revo Double Cabin', bn: 'টয়োটা হাইল্যাক্স রেভো ডাবল কেবিন' }, desc: { en: 'Heavy-duty rugged 4x4 pickup for project sites, engineering teams and logistics.', bn: 'প্রজেক্ট সাইট, ইঞ্জিনিয়ারিং টিম ও পাহাড়ি রুটের শক্তিশালী ৪x৪ ডাবল কেবিন।' },
      features: [{ en: 'Heavy duty cargo bed', bn: 'হেভি ডিউটি কার্গো বেড' }, { en: '4x4 Off-road mode', bn: '৪x৪ অফ-রোড মোড' }, { en: 'Reinforced suspension', bn: 'মজবুত সাসপেনশন' }], services: [corporate.id, monthly.id, tour.id] },
    { slug: 'toyota-allion-executive', brand: 'Toyota', category: 'sedan', accent: 'violet', year: 2018, yearRange: '2015–2019', seats: 4, luggage: 2, transmission: 'auto', fuel: 'octane', month: 72000, featured: false, order: 7,
      name: { en: 'Toyota Allion Executive (Monthly Dedicated)', bn: 'টয়োটা অ্যালিয়ন এক্সিকিউটিভ (মাসিক ডেডিকেটেড)' }, desc: { en: 'Dedicated monthly rental for office commuters and business executives. Fixed driver & replacement car included.', bn: 'অফিস ও এক্সিকিউটিভদের জন্য ফিক্সড মাসিক রেন্টাল। সার্বক্ষণিক ড্রাইভার ও ব্যাকআপ কার সুবিধা।' },
      features: [{ en: 'Dedicated regular driver', bn: 'নিয়মিত ডেডিকেটেড ড্রাইভার' }, { en: 'Free replacement car', bn: 'ফ্রি রিপ্লেসমেন্ট ব্যাকআপ' }, { en: 'Monthly billing', bn: 'মাসিক সমন্বিত বিলিং' }], services: [monthly.id, corporate.id] },
    { slug: 'toyota-coaster-deluxe', brand: 'Toyota', category: 'bus', accent: 'cyan', year: 2020, yearRange: '2018–2022', seats: 29, luggage: 12, transmission: 'manual', fuel: 'diesel', price: 18000, featured: false, order: 8,
      name: { en: 'Toyota Coaster Executive Coach', bn: 'টয়োটা কোস্টার এক্সিকিউটিভ কোচ' }, desc: { en: 'Full-size 29-seater coach for corporate outings, factories, wedding shuttles, and inter-city tours.', bn: 'কর্পোরেট পিকনিক, ফ্যাক্টরি টিম, বিয়ের গেস্ট ও ট্যুরের জন্য ২৯ সিটার বিলাসবহুল কোচ।' },
      features: [{ en: 'Reclining high-back seats', bn: 'হাই-ব্যাক রিক্লাইনিং সিট' }, { en: 'Microphone & sound system', bn: 'মাইক্রোফোন ও সাউন্ড সিস্টেম' }, { en: 'Overhead luggage racks', bn: 'ওভারহেড লাগেজ র্যাক' }], services: [corporate.id, wedding.id, tour.id] },
    { slug: 'mitsubishi-pajero-sport', brand: 'Mitsubishi', category: 'suv', accent: 'gold', year: 2022, yearRange: '2020–2023', seats: 7, luggage: 4, transmission: 'auto', fuel: 'diesel', featured: false, order: 9,
      name: { en: 'Mitsubishi Pajero Sport Elite (VIP Protocol)', bn: 'মিতসুবিশি পাজেরো স্পোর্ট এলিট (ভিআইপি প্রটোকল)' }, desc: { en: 'Elite SUV available on custom inquiry for VIP protocols, foreign delegations, and government projects.', bn: 'ভিআইপি প্রটোকল, বিদেশি ডেলিগেট ও বিশেষ প্রকল্পের জন্য কাস্টম চাহিদায় প্রস্তুত।' },
      features: [{ en: 'Armored protection option', bn: 'বিশেষ নিরাপত্তা সুবিধা' }, { en: 'Super Select 4WD-II', bn: 'সুপার সিলেক্ট ৪x৪' }, { en: 'On-demand custom quote', bn: 'চাহিদা অনুযায়ী কাস্টম রেট' }], services: [corporate.id, tour.id] },
  ]

  for (const c of cars) {
    const doc = await payload.create({
      collection: 'cars', locale: 'en',
      data: {
        slug: c.slug, brand: c.brand, category: c.category as any, accent: c.accent as any, year: c.year, yearRange: c.yearRange, seats: c.seats,
        luggage: c.luggage, transmission: c.transmission as any, fuel: c.fuel as any,
        pricePerDay: c.price, pricePerMonth: c.month, withDriver: true, available: true, featured: !!c.featured,
        status: 'published', order: c.order || 10,
        name: c.name.en, description: c.desc.en, features: c.features.map((f) => ({ label: f.en })), services: c.services,
      },
    })
    await payload.update({
      collection: 'cars', id: doc.id, locale: 'bn',
      data: {
        name: c.name.bn, description: c.desc.bn,
        features: (doc.features as any[]).map((f, i) => ({ id: f.id, label: c.features[i].bn })),
      },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings', locale: 'en',
    data: { phone: '+880 1625-347735', whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735', email: 'hello@akhirental.com', address: 'Dhaka, Bangladesh', hours: 'Open 24/7', tagline: 'Drive the extraordinary' },
  })
  await payload.updateGlobal({
    slug: 'site-settings', locale: 'bn',
    data: { address: 'ঢাকা, বাংলাদেশ', hours: '২৪/৭ খোলা', tagline: 'অসাধারণের পথে চলুন' },
  })

  const homeEn = {
    slides: [
      { eyebrow: 'Premium car rental', title: 'Your journey, our responsibility', subtitle: 'Daily, monthly and corporate rentals — under one roof.', ctaLabel: 'Explore the fleet', ctaLink: '/fleet', theme: 'violet' as const },
      { eyebrow: 'Monthly rentals', title: 'Smarter driving on a monthly plan', subtitle: 'A dedicated car and driver, at a fixed price.', ctaLabel: 'See plans', ctaLink: '/services/monthly-rental', theme: 'pink' as const },
      { eyebrow: 'Corporate contracts', title: 'A fleet built around your team', subtitle: 'Invoicing, backup cars and 24/7 support included.', ctaLabel: 'Talk contracts', ctaLink: '/services/corporate-contract', theme: 'amber' as const },
      { eyebrow: 'Airport & events', title: 'Arrive in style', subtitle: 'Luxury cars for airports, weddings and VIPs.', ctaLabel: 'Book a luxury ride', ctaLink: '/contact', theme: 'cyan' as const },
    ],
    about: { eyebrow: 'About Akhi', title: 'Rentals that feel personal', text: 'Akhi Rental Solution started with one simple idea: renting a car should be reliable, transparent and human. Today we serve families, professionals and companies with a growing, well-maintained fleet and drivers who treat every trip as their own.' },
    stats: [{ value: '500+', label: 'Happy clients' }, { value: '40+', label: 'Vehicles' }, { value: '24/7', label: 'Support' }, { value: '10+', label: 'Corporate partners' }],
    whyUs: [
      { icon: '🛡️', title: 'Verified drivers', text: 'Background-checked, trained and courteous.' },
      { icon: '💸', title: 'Honest pricing', text: 'The quote you get is the price you pay.' },
      { icon: '🔧', title: 'Well maintained', text: 'Regular servicing and a backup car when needed.' },
      { icon: '⚡', title: 'Fast response', text: 'Real people on WhatsApp, day and night.' },
    ],
  }
  const created = await payload.updateGlobal({ slug: 'home', locale: 'en', data: homeEn as any })
  const bn = {
    slides: [
      { eyebrow: 'প্রিমিয়াম কার রেন্টাল', title: 'আপনার যাত্রা, আমাদের দায়িত্ব', subtitle: 'ডেইলি, মান্থলি ও কর্পোরেট রেন্টাল — একই ছাদের নিচে।', ctaLabel: 'গাড়ি দেখুন' },
      { eyebrow: 'মান্থলি রেন্টাল', title: 'মাসিক প্ল্যানে সাশ্রয়ী ড্রাইভ', subtitle: 'নির্দিষ্ট গাড়ি ও ড্রাইভার, ফিক্সড মূল্যে।', ctaLabel: 'প্ল্যান দেখুন' },
      { eyebrow: 'কর্পোরেট চুক্তি', title: 'আপনার টিমের জন্য ফ্লিট', subtitle: 'ইনভয়েসিং, ব্যাকআপ কার ও ২৪/৭ সাপোর্টসহ।', ctaLabel: 'চুক্তির জন্য কথা বলুন' },
      { eyebrow: 'এয়ারপোর্ট ও ইভেন্ট', title: 'স্টাইলে পৌঁছান', subtitle: 'এয়ারপোর্ট, বিয়ে ও ভিআইপির জন্য লাক্সারি গাড়ি।', ctaLabel: 'লাক্সারি গাড়ি বুক করুন' },
    ].map((s, i) => ({ id: (created.slides as any[])[i].id, ...s })),
    about: { eyebrow: 'আখি সম্পর্কে', title: 'যে রেন্টাল আপন মনে হয়', text: 'আখি রেন্টাল সলিউশনের শুরু একটি সহজ ধারণা থেকে: গাড়ি ভাড়া হতে হবে নির্ভরযোগ্য, স্বচ্ছ ও মানবিক। আজ আমরা পরিবার, পেশাজীবী ও কোম্পানিকে সেবা দিচ্ছি সুরক্ষিত ফ্লিট ও আন্তরিক ড্রাইভারদের মাধ্যমে।' },
    stats: [{ label: 'সন্তুষ্ট ক্লায়েন্ট' }, { label: 'গাড়ি' }, { label: 'সাপোর্ট' }, { label: 'কর্পোরেট পার্টনার' }].map((s, i) => ({ id: (created.stats as any[])[i].id, ...s })),
    whyUs: [
      { title: 'যাচাইকৃত ড্রাইভার', text: 'ব্যাকগ্রাউন্ড চেক করা, প্রশিক্ষিত ও বিনয়ী।' },
      { title: 'সৎ মূল্য', text: 'যে কোটেশন পাবেন, সেই দামই দেবেন।' },
      { title: 'নিয়মিত মেইনটেন্যান্স', text: 'নিয়মিত সার্ভিসিং ও প্রয়োজনে ব্যাকআপ গাড়ি।' },
      { title: 'দ্রুত সাড়া', text: 'দিনরাত হোয়াটসঅ্যাপে সত্যিকারের মানুষ।' },
    ].map((s, i) => ({ id: (created.whyUs as any[])[i].id, ...s })),
  }
  await payload.updateGlobal({ slug: 'home', locale: 'bn', data: bn as any })

  const facilities: { icon: string; accent: string; title: L; text: L }[] = [
    { icon: '👨‍✈️', accent: 'violet', title: { en: 'Professional drivers', bn: 'পেশাদার ড্রাইভার' }, text: { en: 'Verified, trained and uniformed chauffeurs.', bn: 'যাচাইকৃত, প্রশিক্ষিত ও ইউনিফর্মধারী ড্রাইভার।' } },
    { icon: '🕒', accent: 'pink', title: { en: '24/7 support', bn: '২৪/৭ সাপোর্ট' }, text: { en: 'Real people on call and WhatsApp, day and night.', bn: 'দিনরাত ফোন ও হোয়াটসঅ্যাপে সত্যিকারের মানুষ।' } },
    { icon: '🛰️', accent: 'cyan', title: { en: 'GPS tracking', bn: 'জিপিএস ট্র্যাকিং' }, text: { en: 'Live-tracked vehicles for safety and transparency.', bn: 'নিরাপত্তা ও স্বচ্ছতার জন্য লাইভ ট্র্যাকড গাড়ি।' } },
    { icon: '🔁', accent: 'amber', title: { en: 'Backup car', bn: 'ব্যাকআপ গাড়ি' }, text: { en: 'A replacement car whenever yours is in service.', bn: 'সার্ভিসিংয়ের সময় বিকল্প গাড়ি।' } },
    { icon: '🧼', accent: 'lime', title: { en: 'Sanitised & clean', bn: 'পরিষ্কার ও স্যানিটাইজড' }, text: { en: 'Every car cleaned and sanitised before each trip.', bn: 'প্রতিটি ট্রিপের আগে গাড়ি পরিষ্কার ও স্যানিটাইজ করা হয়।' } },
    { icon: '📶', accent: 'orange', title: { en: 'Wi-Fi & water onboard', bn: 'ওয়াই-ফাই ও পানি' }, text: { en: 'Stay connected and refreshed on the road.', bn: 'পথে থাকুন সংযুক্ত ও সতেজ।' } },
    { icon: '🧾', accent: 'violet', title: { en: 'Corporate invoicing', bn: 'কর্পোরেট ইনভয়েস' }, text: { en: 'Monthly consolidated, VAT-ready invoices.', bn: 'মাসিক একত্রিত, ভ্যাট-রেডি ইনভয়েস।' } },
    { icon: '🛡️', accent: 'pink', title: { en: 'Insured vehicles', bn: 'বিমাকৃত গাড়ি' }, text: { en: 'Fully insured and documented fleet.', bn: 'পূর্ণ বিমা ও কাগজপত্রসহ ফ্লিট।' } },
  ]
  for (const [i, f] of facilities.entries()) {
    const d = await payload.create({ collection: 'facilities', locale: 'en', data: { icon: f.icon, accent: f.accent as any, order: i + 1, title: f.title.en, text: f.text.en } })
    await payload.update({ collection: 'facilities', id: d.id, locale: 'bn', data: { title: f.title.bn, text: f.text.bn } })
  }

  const reviews = [
    { name: 'Rafiq Ahmed', role: { en: 'CEO, Nexa Tech', bn: 'সিইও, নেক্সা টেক' }, quote: { en: 'Our monthly contract has been flawless — the driver is punctual and the backup car shows up the same day.', bn: 'আমাদের মান্থলি চুক্তি নিখুঁত — ড্রাইভার সময়ানুবর্তী আর ব্যাকআপ গাড়ি একই দিনে আসে।' } },
    { name: 'Nusrat Jahan', role: { en: 'Family trip to Cox\'s Bazar', bn: 'কক্সবাজার ফ্যামিলি ট্রিপ' }, quote: { en: 'Clean Noah, careful driver and the kids loved it. Booked everything on WhatsApp in minutes.', bn: 'পরিষ্কার নোয়া, সতর্ক ড্রাইভার, বাচ্চারা খুব উপভোগ করেছে। হোয়াটসঅ্যাপেই মিনিটে বুকিং।' } },
    { name: 'Tanvir Hasan', role: { en: 'Wedding client', bn: 'বিয়ের ক্লায়েন্ট' }, quote: { en: 'The decorated Mercedes made our wedding day special. Highly recommended.', bn: 'সাজানো মার্সিডিজ আমাদের বিয়েকে বিশেষ করে তুলেছে। অসাধারণ।' } },
  ]
  for (const r of reviews) {
    const d = await payload.create({ collection: 'testimonials', locale: 'en', data: { name: r.name, role: r.role.en, quote: r.quote.en, rating: 5 } })
    await payload.update({ collection: 'testimonials', id: d.id, locale: 'bn', data: { role: r.role.bn, quote: r.quote.bn } })
  }

  console.log('✅ Seed complete.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
