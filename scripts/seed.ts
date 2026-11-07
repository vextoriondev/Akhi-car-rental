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

  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const u = await payload.count({ collection: 'users' })
    if (u.totalDocs === 0)
      await payload.create({
        collection: 'users',
        data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, name: 'Admin' },
      })
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
    slug: string; brand: string; category: string; accent: string; year: number; seats: number; luggage: number
    transmission: string; fuel: string; price: number; month?: number; featured?: boolean
    name: L; desc: L; features: L[]; services: number[]
  }
  const cars: Car[] = [
    { slug: 'toyota-axio-2019', brand: 'Toyota', category: 'sedan', accent: 'violet', year: 2019, seats: 4, luggage: 2, transmission: 'auto', fuel: 'hybrid', price: 3500, month: 68000, featured: true,
      name: { en: 'Toyota Axio Hybrid', bn: 'টয়োটা অ্যাক্সিও হাইব্রিড' }, desc: { en: 'Smooth, fuel-efficient city sedan for office runs and airport trips.', bn: 'অফিস ও এয়ারপোর্ট ট্রিপের জন্য মসৃণ ও সাশ্রয়ী সেডান।' },
      features: [{ en: 'Air conditioning', bn: 'এয়ার কন্ডিশন' }, { en: 'Bluetooth audio', bn: 'ব্লুটুথ অডিও' }], services: [daily.id, monthly.id, corporate.id, airport.id] },
    { slug: 'toyota-noah-2020', brand: 'Toyota', category: 'microbus', accent: 'cyan', year: 2020, seats: 7, luggage: 4, transmission: 'auto', fuel: 'hybrid', price: 6000, month: 110000, featured: true,
      name: { en: 'Toyota Noah', bn: 'টয়োটা নোয়া' }, desc: { en: 'Spacious 7-seater for family trips and group transfers.', bn: 'ফ্যামিলি ট্রিপ ও গ্রুপ ট্রান্সফারের জন্য প্রশস্ত ৭ সিটার।' },
      features: [{ en: 'Sliding doors', bn: 'স্লাইডিং ডোর' }, { en: 'Rear AC', bn: 'রিয়ার এসি' }], services: [daily.id, monthly.id, tour.id, airport.id] },
    { slug: 'toyota-land-cruiser-prado', brand: 'Toyota', category: 'suv', accent: 'amber', year: 2018, seats: 7, luggage: 4, transmission: 'auto', fuel: 'diesel', price: 14000, month: 280000, featured: true,
      name: { en: 'Toyota Land Cruiser Prado', bn: 'টয়োটা ল্যান্ড ক্রুজার প্রাডো' }, desc: { en: 'Commanding 4x4 comfort for executives, VIPs and rough roads.', bn: 'এক্সিকিউটিভ, ভিআইপি ও কঠিন রাস্তার জন্য শক্তিশালী ৪x৪।' },
      features: [{ en: 'Leather seats', bn: 'লেদার সিট' }, { en: '4x4', bn: '৪x৪' }], services: [daily.id, corporate.id, tour.id] },
    { slug: 'toyota-hiace-gl', brand: 'Toyota', category: 'microbus', accent: 'lime', year: 2021, seats: 11, luggage: 6, transmission: 'manual', fuel: 'octane', price: 7500, month: 140000, featured: true,
      name: { en: 'Toyota Hiace GL', bn: 'টয়োটা হায়েস জিএল' }, desc: { en: 'The go-to van for staff transport, tours and events.', bn: 'স্টাফ ট্রান্সপোর্ট, ট্যুর ও ইভেন্টের জনপ্রিয় ভ্যান।' },
      features: [{ en: 'High roof', bn: 'হাই রুফ' }, { en: 'Dual AC', bn: 'ডুয়াল এসি' }], services: [corporate.id, tour.id, wedding.id, monthly.id] },
    { slug: 'mercedes-e-class', brand: 'Mercedes-Benz', category: 'luxury', accent: 'pink', year: 2020, seats: 4, luggage: 3, transmission: 'auto', fuel: 'petrol', price: 18000, featured: true,
      name: { en: 'Mercedes-Benz E-Class', bn: 'মার্সিডিজ-বেঞ্জ ই-ক্লাস' }, desc: { en: 'Arrive in style — weddings, VIP pickups and board meetings.', bn: 'স্টাইলে পৌঁছান — বিয়ে, ভিআইপি পিকআপ ও বোর্ড মিটিং।' },
      features: [{ en: 'Chauffeur in uniform', bn: 'ইউনিফর্মধারী শোফার' }, { en: 'Ambient lighting', bn: 'অ্যাম্বিয়েন্ট লাইটিং' }], services: [wedding.id, airport.id, corporate.id] },
    { slug: 'toyota-corolla-cross', brand: 'Toyota', category: 'suv', accent: 'orange', year: 2022, seats: 5, luggage: 3, transmission: 'auto', fuel: 'hybrid', price: 8000, month: 150000, featured: true,
      name: { en: 'Toyota Corolla Cross', bn: 'টয়োটা করোলা ক্রস' }, desc: { en: 'Modern crossover with room for the whole crew.', bn: 'পুরো টিমের জন্য জায়গাসহ আধুনিক ক্রসওভার।' },
      features: [{ en: 'Reverse camera', bn: 'রিভার্স ক্যামেরা' }, { en: 'Sunroof', bn: 'সানরুফ' }], services: [daily.id, monthly.id, tour.id] },
    { slug: 'toyota-coaster', brand: 'Toyota', category: 'bus', accent: 'cyan', year: 2019, seats: 29, luggage: 10, transmission: 'manual', fuel: 'diesel', price: 16000, month: 320000,
      name: { en: 'Toyota Coaster', bn: 'টয়োটা কোস্টার' }, desc: { en: 'Mini-bus for corporate shuttles, wedding guests and tour groups.', bn: 'কর্পোরেট শাটল, বিয়ের অতিথি ও ট্যুর গ্রুপের মিনিবাস।' },
      features: [{ en: 'Reclining seats', bn: 'রিক্লাইনিং সিট' }, { en: 'Luggage bay', bn: 'লাগেজ বে' }], services: [corporate.id, wedding.id, tour.id] },
    { slug: 'suzuki-alto', brand: 'Suzuki', category: 'economy', accent: 'lime', year: 2021, seats: 4, luggage: 1, transmission: 'auto', fuel: 'petrol', price: 2500, month: 48000,
      name: { en: 'Suzuki Alto', bn: 'সুজুকি আল্টো' }, desc: { en: 'Light on your budget and easy to park.', bn: 'বাজেটে সাশ্রয়ী এবং পার্কিংয়ে সহজ।' },
      features: [{ en: 'Great mileage', bn: 'দারুণ মাইলেজ' }], services: [daily.id, monthly.id] },
  ]

  for (const c of cars) {
    const doc = await payload.create({
      collection: 'cars', locale: 'en',
      data: {
        slug: c.slug, brand: c.brand, category: c.category as any, accent: c.accent as any, year: c.year, seats: c.seats,
        luggage: c.luggage, transmission: c.transmission as any, fuel: c.fuel as any,
        pricePerDay: c.price, pricePerMonth: c.month, withDriver: true, available: true, featured: !!c.featured,
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
    data: { phone: '+880 1000 000000', whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801000000000', email: 'hello@akhirental.com', address: 'Dhaka, Bangladesh', hours: 'Open 24/7', tagline: 'Drive the extraordinary' },
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
