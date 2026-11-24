import type { Locale } from './i18n'

/** High quality automotive imagery used for fallback & demo presentations */
export const CAR_IMAGES = {
  axio: 'https://images.unsplash.com/photo-1590362891988-3950473975ba?auto=format&fit=crop&w=1200&q=80',
  noah: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
  prado: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  hiace: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  mercedes: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
  hilux: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80',
  allion: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  coaster: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
  pajero: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80',
  heroBg1: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85',
  heroBg2: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=85',
  heroBg3: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2000&q=85',
}

/** Shown on the home hero if the CMS has no slides yet (or DB unreachable). */
export const fallbackSlides = (locale: Locale) =>
  locale === 'bn'
    ? [
        {
          eyebrow: 'প্রিমিয়াম কার রেন্টাল সলিউশন',
          title: 'শ্রেষ্ঠত্বের সাথে ভ্রমণ করুন, আভিজাত্যের স্পর্শে থাকুন',
          subtitle: 'দৈনিক, মাসিক ও কর্পোরেট কার রেন্টাল — পেশাদার ড্রাইভার ও সর্বোচ্চ নিরাপত্তার সাথে।',
          ctaLabel: 'গাড়ি দেখুন',
          ctaLink: '/bn/fleet',
          theme: 'gold',
          imageUrl: CAR_IMAGES.heroBg1,
        },
        {
          eyebrow: 'মাসিক ডেডিকেটেড রেন্টাল',
          title: 'সাশ্রয়ী মূল্যে এক্সিকিউটিভ ও ফ্যামিলি প্ল্যান',
          subtitle: 'অফিস বা পরিবারের জন্য নির্দিষ্ট গাড়ি ও ড্রাইভার, ব্যাকআপ সাপোর্টসহ ফিক্সড রেটে।',
          ctaLabel: 'সার্ভিসসমূহ দেখুন',
          ctaLink: '/bn/services',
          theme: 'cyan',
          imageUrl: CAR_IMAGES.heroBg2,
        },
        {
          eyebrow: 'কর্পোরেট ফ্লিট চুক্তি',
          title: 'আপনার প্রতিষ্ঠানের জন্য নিবেদিত পরিবহন বহর',
          subtitle: 'মাসিক সমন্বিত ভ্যাট ইনভয়েসিং, জিপিএস ট্র্যাকিং ও সার্বক্ষণিক ব্যাকআপ গাড়ি।',
          ctaLabel: 'কর্পোরেট চুক্তি করুন',
          ctaLink: '/bn/contact',
          theme: 'gold',
          imageUrl: CAR_IMAGES.heroBg3,
        },
      ]
    : [
        {
          eyebrow: 'PREMIUM AUTOMOTIVE SOLUTION',
          title: 'Drive Excellence. Experience Luxury & Comfort.',
          subtitle: 'Daily, monthly, and corporate chauffeur services across Bangladesh with unrivaled reliability.',
          ctaLabel: 'Explore Fleet',
          ctaLink: '/en/fleet',
          theme: 'gold',
          imageUrl: CAR_IMAGES.heroBg1,
        },
        {
          eyebrow: 'MONTHLY EXECUTIVE RENTALS',
          title: 'Smarter Long-Term Mobility Solutions',
          subtitle: 'Dedicated vehicle and vetted chauffeur at fixed monthly rates with complimentary maintenance backup.',
          ctaLabel: 'View Monthly Plans',
          ctaLink: '/en/services',
          theme: 'cyan',
          imageUrl: CAR_IMAGES.heroBg2,
        },
        {
          eyebrow: 'CORPORATE FLEET CONTRACTS',
          title: 'Engineered for Business & Dignitary Protocols',
          subtitle: 'Comprehensive transport infrastructure for embassies, multinational corporations, and institutions.',
          ctaLabel: 'Contact Concierge',
          ctaLink: '/en/contact',
          theme: 'gold',
          imageUrl: CAR_IMAGES.heroBg3,
        },
      ]

export const fallbackCars = (locale: Locale) => [
  {
    id: 1,
    slug: 'toyota-axio-hybrid',
    brand: 'Toyota',
    category: 'sedan',
    accent: 'gold',
    year: 2020,
    yearRange: '2017–2021',
    seats: 4,
    luggage: 2,
    transmission: 'auto',
    fuel: 'hybrid',
    color: 'Pearl White',
    pricePerDay: 3500,
    pricePerMonth: 68000,
    withDriver: true,
    available: true,
    featured: true,
    status: 'published',
    order: 1,
    image: { url: CAR_IMAGES.axio },
    name: locale === 'bn' ? 'টয়োটা অ্যাক্সিও হাইব্রিড' : 'Toyota Axio Hybrid Executive',
    description:
      locale === 'bn'
        ? 'মসৃণ রাইড এবং জ্বালানি সাশ্রয়ী সেডান। অফিস যাতায়াত, পারিবারিক সফর ও এয়ারপোর্ট ট্রিপের জন্য আদর্শ।'
        : 'Smooth, fuel-efficient executive sedan designed for seamless city commutes, client meetings, and airport transfers.',
    features: [
      { label: locale === 'bn' ? 'ডুয়াল জোন এসি' : 'Dual Zone Climate AC' },
      { label: locale === 'bn' ? 'পুশ স্টার্ট' : 'Smart Push Start' },
      { label: locale === 'bn' ? 'ব্লুটুথ ও রিভার্স ক্যামেরা' : 'Bluetooth & Reverse Camera' },
      { label: locale === 'bn' ? 'পেশাদার ড্রাইভার' : 'Chauffeur Included' },
    ],
  },
  {
    id: 2,
    slug: 'toyota-noah-deluxe',
    brand: 'Toyota',
    category: 'microbus',
    accent: 'cyan',
    year: 2021,
    yearRange: '2018–2022',
    seats: 7,
    luggage: 4,
    transmission: 'auto',
    fuel: 'hybrid',
    color: 'Silver Metallic',
    pricePerDay: 6000,
    pricePerMonth: 115000,
    withDriver: true,
    available: true,
    featured: true,
    status: 'published',
    order: 2,
    image: { url: CAR_IMAGES.noah },
    name: locale === 'bn' ? 'টয়োটা নোয়া ডিলাক্স' : 'Toyota Noah Deluxe 7-Seater',
    description:
      locale === 'bn'
        ? 'প্রশস্ত ৭ সিটার প্রিমিয়াম মাইক্রোবাস। পরিবার ও ব্যবসায়িক দলের দীর্ঘ দূরত্বের ভ্রমণের সেরা পছন্দ।'
        : 'Spacious 7-seater multi-purpose vehicle featuring captain seats, dual chill AC, and automatic sliding doors.',
    features: [
      { label: locale === 'bn' ? 'ক্যাপ্টেন সিট' : 'Captain Executive Seats' },
      { label: locale === 'bn' ? 'ডুয়াল স্লাইডিং ডোর' : 'Dual Auto Sliding Doors' },
      { label: locale === 'bn' ? 'রিয়ার এসি ভেন্ট' : 'Rear Roof AC Vents' },
      { label: locale === 'bn' ? 'প্রচুর লাগেজ স্পেস' : 'Ample Luggage Capacity' },
    ],
  },
  {
    id: 3,
    slug: 'toyota-land-cruiser-prado',
    brand: 'Toyota',
    category: 'suv',
    accent: 'gold',
    year: 2021,
    yearRange: '2018–2022',
    seats: 7,
    luggage: 4,
    transmission: 'auto',
    fuel: 'diesel',
    color: 'Attitude Black',
    pricePerDay: 15000,
    pricePerMonth: 290000,
    withDriver: true,
    available: true,
    featured: true,
    status: 'published',
    order: 3,
    image: { url: CAR_IMAGES.prado },
    name: locale === 'bn' ? 'টয়োটা ল্যান্ড ক্রুজার প্রাডো টিএক্স-এল' : 'Toyota Land Cruiser Prado TX-L',
    description:
      locale === 'bn'
        ? 'রাজকীয় উপস্থিতি ও ৪x৪ কমান্ডিং শক্তি। ভিআইপি প্রটোকল, রাষ্ট্রদূত ও বিশেষ ইভেন্টের জন্য অপ্রতিদ্বন্দ্বী।'
        : 'Commanding 4x4 luxury SUV engineered for VIP protocols, visiting executives, rough highways, and prestigious occasions.',
    features: [
      { label: locale === 'bn' ? 'প্রিমিয়াম লেদার সিট' : 'Full Nappa Leather Interior' },
      { label: locale === 'bn' ? 'সানরুফ ও কুলবক্স' : 'Sunroof & Center Coolbox' },
      { label: locale === 'bn' ? 'ফুল-টাইম ৪x৪' : 'Full-Time Active 4WD' },
      { label: locale === 'bn' ? 'ইউনিফর্মধারী শোফার' : 'Uniformed Senior Chauffeur' },
    ],
  },
  {
    id: 4,
    slug: 'toyota-hiace-super-gl',
    brand: 'Toyota',
    category: 'microbus',
    accent: 'lime',
    year: 2022,
    yearRange: '2019–2023',
    seats: 11,
    luggage: 6,
    transmission: 'auto',
    fuel: 'octane',
    color: 'Diamond White',
    pricePerDay: 7500,
    pricePerMonth: 145000,
    withDriver: true,
    available: true,
    featured: true,
    status: 'published',
    order: 4,
    image: { url: CAR_IMAGES.hiace },
    name: locale === 'bn' ? 'টয়োটা হায়েস সুপার জিএল' : 'Toyota Hiace Super GL Executive',
    description:
      locale === 'bn'
        ? '১১ সিটার প্রশস্ত আরামদায়ক মাইক্রোবাস। ট্যুর ও কর্পোরেট ডেলিগেশনের নির্ভরযোগ্য বাহন।'
        : 'The industry-standard high-roof executive van for corporate delegations, outstation excursions, and large family transfers.',
    features: [
      { label: locale === 'bn' ? 'উচ্চ ছাদ কেবিন' : 'High-Roof Spacious Cabin' },
      { label: locale === 'bn' ? 'ডুয়াল শক্তিশালী এসি' : 'Dual Ultra-Chill AC' },
      { label: locale === 'bn' ? 'টিন্টেড প্রাইভেসি গ্লাস' : 'Factory Tinted Privacy Glass' },
      { label: locale === 'bn' ? '১১ সিটার ক্যাপাসিটি' : '11 Reclining Passenger Seats' },
    ],
  },
  {
    id: 5,
    slug: 'mercedes-e-class-luxury',
    brand: 'Mercedes-Benz',
    category: 'luxury',
    accent: 'gold',
    year: 2021,
    yearRange: '2020–2023',
    seats: 4,
    luggage: 3,
    transmission: 'auto',
    fuel: 'petrol',
    color: 'Obsidian Black',
    pricePerDay: 20000,
    pricePerMonth: 380000,
    withDriver: true,
    available: true,
    featured: true,
    status: 'published',
    order: 5,
    image: { url: CAR_IMAGES.mercedes },
    name: locale === 'bn' ? 'মার্সিডিজ-বেঞ্জ ই-ক্লাস লাক্সারি' : 'Mercedes-Benz E-Class Avantgarde',
    description:
      locale === 'bn'
        ? 'বিশ্বমানের আভিজাত্য ও প্রশান্তি। জমকালো বিয়ে, ভিআইপি পিকআপ ও শীর্ষ কর্পোরেটদের জন্য নিবেদিত।'
        : 'Ultimate automotive sophistication for VIP state dignitaries, high-profile nuptials, and executive board delegations.',
    features: [
      { label: locale === 'bn' ? 'বারমেস্টার সারাউন্ড সাউন্ড' : 'Burmester Surround Audio' },
      { label: locale === 'bn' ? 'অ্যাম্বিয়েন্ট লাইটিং' : '64-Color Ambient Lighting' },
      { label: locale === 'bn' ? 'পেশাদার শোফার' : 'Trained Protocol Chauffeur' },
      { label: locale === 'bn' ? 'অনবোর্ড ওয়াই-ফাই ও রিফ্রেশমেন্ট' : 'Onboard Wi-Fi & Amenities' },
    ],
  },
  {
    id: 6,
    slug: 'toyota-hilux-double-cabin',
    brand: 'Toyota',
    category: 'pickup',
    accent: 'amber',
    year: 2021,
    yearRange: '2019–2023',
    seats: 5,
    luggage: 8,
    transmission: 'manual',
    fuel: 'diesel',
    color: 'Crimson Red',
    pricePerDay: 9000,
    pricePerMonth: 175000,
    withDriver: true,
    available: true,
    featured: true,
    status: 'published',
    order: 6,
    image: { url: CAR_IMAGES.hilux },
    name: locale === 'bn' ? 'টয়োটা হাইল্যাক্স রেভো ডাবল কেবিন' : 'Toyota Hilux Revo 4x4 Double Cabin',
    description:
      locale === 'bn'
        ? 'শক্তিশালী ৪x৪ হেভি ডিউটি পিকআপ। প্রজেক্ট সাইট, ইঞ্জিনিয়ারিং টিম ও পাহাড়ি রুটের জন্য আদর্শ।'
        : 'Heavy-duty rugged 4x4 double cabin pickup crafted for remote industrial sites, project teams, and tough terrain.',
    features: [
      { label: locale === 'bn' ? 'হেভি ডিউটি কার্গো বেড' : 'Heavy Cargo Bed' },
      { label: locale === 'bn' ? '৪x৪ অফ-রোড ড্রাইভ' : 'Active Off-Road 4x4' },
      { label: locale === 'bn' ? 'উচ্চ গ্রাউন্ড ক্লিয়ারেন্স' : 'High Ground Clearance' },
      { label: locale === 'bn' ? 'হাইওয়ে ট্র্যাকিং' : 'Real-time GPS Monitoring' },
    ],
  },
  {
    id: 7,
    slug: 'toyota-allion-executive',
    brand: 'Toyota',
    category: 'sedan',
    accent: 'violet',
    year: 2019,
    yearRange: '2016–2020',
    seats: 4,
    luggage: 2,
    transmission: 'auto',
    fuel: 'octane',
    color: 'Silver Mica',
    pricePerDay: null, // Monthly only vehicle example!
    pricePerMonth: 72000,
    withDriver: true,
    available: true,
    featured: false,
    status: 'published',
    order: 7,
    image: { url: CAR_IMAGES.allion },
    name: locale === 'bn' ? 'টয়োটা অ্যালিয়ন (মাসিক ডেডিকেটেড)' : 'Toyota Allion Executive (Monthly Plan)',
    description:
      locale === 'bn'
        ? 'শুধুমাত্র মাসিক চুক্তির জন্য ডেডিকেটেড সেডান। নির্দিষ্ট পেশাদার ড্রাইভার ও ফ্রি ব্যাকআপ কার সুবিধা অন্তর্ভুক্ত।'
        : 'Exclusively available on monthly contract. Includes dedicated driver, preventative maintenance, and immediate backup car replacement.',
    features: [
      { label: locale === 'bn' ? 'শুধুমাত্র মাসিক চুক্তি' : 'Monthly Dedicated Contract' },
      { label: locale === 'bn' ? 'নির্দিষ্ট নিয়মিত ড্রাইভার' : 'Fixed Dedicated Chauffeur' },
      { label: locale === 'bn' ? 'ফ্রি ব্যাকআপ গাড়ি' : 'Guaranteed Backup Replacement' },
      { label: locale === 'bn' ? 'মাসিক সমন্বিত বিলিং' : 'Consolidated VAT Invoicing' },
    ],
  },
  {
    id: 8,
    slug: 'toyota-coaster-coach',
    brand: 'Toyota',
    category: 'bus',
    accent: 'cyan',
    year: 2020,
    yearRange: '2018–2022',
    seats: 29,
    luggage: 12,
    transmission: 'manual',
    fuel: 'diesel',
    color: 'Pearl White & Gold',
    pricePerDay: 18000,
    pricePerMonth: null, // Daily only vehicle example!
    withDriver: true,
    available: true,
    featured: false,
    status: 'published',
    order: 8,
    image: { url: CAR_IMAGES.coaster },
    name: locale === 'bn' ? 'টয়োটা কোস্টার এক্সিকিউটিভ কোচ' : 'Toyota Coaster Executive 29-Seater',
    description:
      locale === 'bn'
        ? '২৯ সিটার বিলাসবহুল এসি কোচ। কর্পোরেট পিকনিক, বিয়ে ও বিদেশি ডেলিগেশনের সুবিধাজনক পরিবহন।'
        : 'Full-size 29-passenger luxury coach equipped with high-back reclining seats, PA system, and expansive baggage compartments.',
    features: [
      { label: locale === 'bn' ? '২৯ রিক্লাইনিং সিট' : '29 Reclining High-Back Seats' },
      { label: locale === 'bn' ? 'কেন্দ্রীয় এয়ার কন্ডিশনিং' : 'Central Super AC System' },
      { label: locale === 'bn' ? 'মাইক্রোফোন ও সাউন্ড' : 'PA Microphone & Sound System' },
      { label: locale === 'bn' ? 'অভিজ্ঞ হাইওয়ে পাইলট' : 'Certified Highway Captain' },
    ],
  },
  {
    id: 9,
    slug: 'mitsubishi-pajero-sport-elite',
    brand: 'Mitsubishi',
    category: 'suv',
    accent: 'gold',
    year: 2022,
    yearRange: '2020–2023',
    seats: 7,
    luggage: 4,
    transmission: 'auto',
    fuel: 'diesel',
    color: 'Titanium Grey',
    pricePerDay: null, // On request vehicle example!
    pricePerMonth: null,
    withDriver: true,
    available: true,
    featured: false,
    status: 'published',
    order: 9,
    image: { url: CAR_IMAGES.pajero },
    name: locale === 'bn' ? 'মিতসুবিশি পাজেরো স্পোর্ট এলিট' : 'Mitsubishi Pajero Sport Elite',
    description:
      locale === 'bn'
        ? 'বিশেষ প্রটোকল ও কূটনৈতিক ব্যবহারের জন্য সংরক্ষিত। চাহিদা অনুযায়ী বিশেষ কোটেশনে সরবরাহ করা হয়।'
        : 'Reserved for high-security protocols, diplomatic itineraries, and customized inter-district operations. Pricing upon consultation.',
    features: [
      { label: locale === 'bn' ? 'আলোচনা সাপেক্ষে মূল্য' : 'Custom Quote on Request' },
      { label: locale === 'bn' ? 'সুপার সিলেক্ট ৪x৪-২' : 'Super Select 4WD-II' },
      { label: locale === 'bn' ? 'ভিআইপি কনভয় প্রটোকল' : 'VIP Convoy Equipped' },
      { label: locale === 'bn' ? 'সার্বক্ষণিক হটলাইন সাপোর্ট' : '24/7 Dedicated Dispatch' },
    ],
  },
]

export const fallbackServices = (locale: Locale) => [
  {
    id: 1,
    slug: 'daily-rental',
    type: 'daily',
    icon: '🚗',
    accent: 'gold',
    title: locale === 'bn' ? 'দৈনিক ও ঘণ্টাভিত্তিক রেন্টাল' : 'Daily & Hourly Car Rental',
    summary:
      locale === 'bn'
        ? 'শহরে মিটিং, পারিবারিক ভ্রমণ বা কেনাকাটার জন্য পেশাদার ড্রাইভারসহ নির্ভরযোগ্য গাড়ি।'
        : 'Flexible short-term rentals with professional vetted chauffeurs for city meetings, shopping, and family outings.',
    startingPrice: locale === 'bn' ? 'শুরু ৳৩,৫০০ / দিন' : 'From ৳3,500 / day',
    image: { url: CAR_IMAGES.axio },
    highlights: [
      { label: locale === 'bn' ? 'যাচাইকৃত পেশাদার ড্রাইভার' : 'Verified, trained chauffeurs' },
      { label: locale === 'bn' ? 'স্বচ্ছ মূল্য, গোপন চার্জ নেই' : 'All-inclusive transparent rates' },
      { label: locale === 'bn' ? 'পরিষ্কার ও স্যানিটাইজড গাড়ি' : 'Clean, sanitised vehicles' },
      { label: locale === 'bn' ? 'হোয়াটসঅ্যাপে তাৎক্ষণিক বুকিং' : 'Instant WhatsApp confirmation' },
    ],
  },
  {
    id: 2,
    slug: 'monthly-rental',
    type: 'monthly',
    icon: '📅',
    accent: 'cyan',
    title: locale === 'bn' ? 'মান্থলি এক্সিকিউটিভ রেন্টাল' : 'Monthly Dedicated Rental',
    summary:
      locale === 'bn'
        ? 'প্রতি মাসে নির্দিষ্ট সাশ্রয়ী মূল্যে ডেডিকেটেড গাড়ি, নির্দিষ্ট ড্রাইভার ও ব্যাকআপ কার সুবিধা।'
        : 'Fixed monthly packages for executives, expat families, and companies. Dedicated car, driver, and maintenance backup.',
    startingPrice: locale === 'bn' ? 'শুরু ৳৬৫,০০০ / মাস' : 'From ৳65,000 / month',
    image: { url: CAR_IMAGES.noah },
    highlights: [
      { label: locale === 'bn' ? 'নির্দিষ্ট গাড়ি ও নিয়মিত ড্রাইভার' : 'Dedicated vehicle & fixed chauffeur' },
      { label: locale === 'bn' ? 'সার্ভিসিং চলাকালীন বিকল্প গাড়ি' : 'Free backup vehicle during repairs' },
      { label: locale === 'bn' ? 'নমনীয় মাসিক বিলিং' : 'Flexible consolidated billing' },
      { label: locale === 'bn' ? 'মডেল আপগ্রেডের সুযোগ' : 'Option to switch models' },
    ],
  },
  {
    id: 3,
    slug: 'corporate-contract',
    type: 'corporate',
    icon: '🏢',
    accent: 'gold',
    title: locale === 'bn' ? 'কর্পোরেট ফ্লিট চুক্তি' : 'Corporate Fleet Contracts',
    summary:
      locale === 'bn'
        ? 'কোম্পানি, ব্যাংক, এনজিও ও দূতাবাসের জন্য সম্পূর্ণ পরিবহন বহর ব্যবস্থাপনা ও ইনভয়েসিং।'
        : 'Long-term corporate agreements for multinational enterprises, NGOs, and embassies with dedicated account managers.',
    startingPrice: locale === 'bn' ? 'কাস্টম কোটেশন' : 'Custom Corporate Quote',
    image: { url: CAR_IMAGES.prado },
    highlights: [
      { label: locale === 'bn' ? '৬ থেকে ৩৬ মাসের চুক্তি' : '6–36 month contracts' },
      { label: locale === 'bn' ? 'ভ্যাট/ট্যাক্স রেডি ইনভয়েস' : 'VAT/TAX-compliant invoicing' },
      { label: locale === 'bn' ? '২৪/৭ সাপোর্ট ও ডিসপ্যাচ' : '24/7 priority fleet dispatch' },
      { label: locale === 'bn' ? 'জিপিএস লাইভ ট্র্যাকিং' : 'GPS fleet tracking portal' },
    ],
  },
  {
    id: 4,
    slug: 'airport-transfer',
    type: 'airport',
    icon: '✈️',
    accent: 'lime',
    title: locale === 'bn' ? 'এয়ারপোর্ট পিক অ্যান্ড ড্রপ' : 'Airport VIP Transfers',
    summary:
      locale === 'bn'
        ? 'হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর থেকে সময়মতো পিকআপ ও ড্রপ, ফ্লাইট ট্র্যাকিংসহ।'
        : 'Punctual, stress-free transfers to and from Hazrat Shahjalal International Airport (DAC) with live flight monitoring.',
    startingPrice: locale === 'bn' ? 'শুরু ৳১,৮০০ / ট্রিপ' : 'From ৳1,800 / trip',
    image: { url: CAR_IMAGES.hiace },
    highlights: [
      { label: locale === 'bn' ? 'লাইভ ফ্লাইট ট্র্যাকিং' : 'Real-time flight tracking' },
      { label: locale === 'bn' ? 'নেমবোর্ড সহ মিট অ্যান্ড গ্রিট' : 'Meet & greet with name plaque' },
      { label: locale === 'bn' ? 'লাগেজে সহযোগিতা' : 'Luggage assistance included' },
      { label: locale === 'bn' ? 'ফিক্সড রেট, পার্কিং ফি সহ' : 'Fixed rate, no surge pricing' },
    ],
  },
  {
    id: 5,
    slug: 'wedding-events',
    type: 'wedding',
    icon: '💍',
    accent: 'pink',
    title: locale === 'bn' ? 'বিয়ে ও ভিআইপি ইভেন্ট' : 'Wedding & VIP Events',
    summary:
      locale === 'bn'
        ? 'আপনার বিশেষ দিনের জন্য সুসজ্জিত লাক্সারি গাড়ি ও বর-কনের কনভয় বহর।'
        : 'Stunning luxury wedding sedans, bridal convoys, and guest shuttles driven by uniformed chauffeurs.',
    startingPrice: locale === 'bn' ? 'শুরু ৳১২,০০০ / ইভেন্ট' : 'From ৳12,000 / event',
    image: { url: CAR_IMAGES.mercedes },
    highlights: [
      { label: locale === 'bn' ? 'ফুলের মনোমুগ্ধকর সাজসজ্জা' : 'Optional fresh floral decorations' },
      { label: locale === 'bn' ? 'ইউনিফর্মধারী অভিজ্ঞ শোফার' : 'Formal uniformed chauffeur' },
      { label: locale === 'bn' ? 'অতিথিদের জন্য মাইক্রোবাস শাটল' : 'Guest shuttle vans & coaches' },
      { label: locale === 'bn' ? 'সময়নিষ্ঠ ভিআইপি প্রটোকল' : 'Impeccable timing & protocol' },
    ],
  },
  {
    id: 6,
    slug: 'tours-outstation',
    type: 'tour',
    icon: '🏞️',
    accent: 'amber',
    title: locale === 'bn' ? 'আন্তঃজেলা ট্যুর ও ভ্রমণ' : 'Inter-District Tours',
    summary:
      locale === 'bn'
        ? 'কক্সবাজার, সিলেট, সাজেক, সুন্দরবন — বাংলাদেশের যেকোনো প্রান্তে নিরাপদ ও আরামদায়ক সফর।'
        : 'Multi-day outstation road trips to Cox’s Bazar, Sylhet, Sreemangal, and beyond with highway-certified captains.',
    startingPrice: locale === 'bn' ? 'শুরু ৳৬,৫০০ / দিন' : 'From ৳6,500 / day',
    image: { url: CAR_IMAGES.coaster },
    highlights: [
      { label: locale === 'bn' ? 'অভিজ্ঞ হাইওয়ে চালক' : 'Highway-certified drivers' },
      { label: locale === 'bn' ? 'পাহাড়ি ও দূরপাল্লার বিশেষ গাড়ি' : 'Hill-tract & rugged ready fleet' },
      { label: locale === 'bn' ? '২৪ ঘণ্টা রোডসাইড সাপোর্ট' : '24/7 on-road mechanical support' },
      { label: locale === 'bn' ? 'গ্রুপের জন্য উপযুক্ত কোচ' : 'Available coaches & microbuses' },
    ],
  },
]

export const fallbackFacilities = (locale: Locale) => [
  {
    id: 1,
    icon: '👨‍✈️',
    accent: 'gold',
    title: locale === 'bn' ? 'পেশাদার ও প্রশিক্ষিত ড্রাইভার' : 'Verified Professional Chauffeurs',
    text:
      locale === 'bn'
        ? 'আমাদের প্রতিটি ড্রাইভার ব্যাকগ্রাউন্ড ভেরিফায়েড, ট্রাফিক আইন সচেতন ও বিনয়ী।'
        : 'Thoroughly vetted, defensive-driving trained, and courteous chauffeurs dedicated to your safety.',
  },
  {
    id: 2,
    icon: '🕒',
    accent: 'cyan',
    title: locale === 'bn' ? '২৪/৭ সার্বক্ষণিক হটলাইন' : '24/7 Dedicated Concierge',
    text:
      locale === 'bn'
        ? 'যেকোনো সময় ফোন বা হোয়াটসঅ্যাপে আমাদের সাথে তাৎক্ষণিক যোগাযোগ করতে পারবেন।'
        : 'Round-the-clock live dispatch and client support via phone and direct WhatsApp.',
  },
  {
    id: 3,
    icon: '🛰️',
    accent: 'gold',
    title: locale === 'bn' ? 'লাইভ জিপিএস ট্র্যাকিং' : 'Real-Time GPS Fleet Tracking',
    text:
      locale === 'bn'
        ? 'প্রতিটি গাড়ি জিপিএস ট্র্যাকিংযুক্ত, যা পরিবার ও প্রতিষ্ঠানের জন্য নিশ্চিত করে পূর্ণ নিরাপত্তা।'
        : 'Satellite GPS monitoring on every vehicle ensures optimal routing and peace of mind.',
  },
  {
    id: 4,
    icon: '🔁',
    accent: 'amber',
    title: locale === 'bn' ? 'গ্যারান্টিযুক্ত ব্যাকআপ কার' : 'Immediate Replacement Vehicle',
    text:
      locale === 'bn'
        ? 'সার্ভিসিং বা জরুরি প্রয়োজনে অবিলম্বে বিকল্প গাড়ি পৌঁছে দেওয়া হয়।'
        : 'In the rare event of mechanical servicing, a replacement vehicle is dispatched immediately.',
  },
  {
    id: 5,
    icon: '🧼',
    accent: 'lime',
    title: locale === 'bn' ? 'পরিষ্কার ও স্যানিটাইজড কেবিন' : 'Pristine Sanitized Interiors',
    text:
      locale === 'bn'
        ? 'প্রতিটি ট্রিপের পূর্বে গাড়ির ভেতর ও বাইরে সম্পূর্ণ ডিপ ক্লিন ও স্যানিটাইজ করা হয়।'
        : 'Detailed exterior wash and hospital-grade interior sanitization conducted prior to each dispatch.',
  },
  {
    id: 6,
    icon: '📶',
    accent: 'pink',
    title: locale === 'bn' ? 'অনবোর্ড ওয়াই-ফাই ও পানীয়' : 'Onboard Wi-Fi & Refreshments',
    text:
      locale === 'bn'
        ? 'ভ্রমণকালে কানেক্টেড থাকতে ফ্রি হাই-স্পিড ওয়াই-ফাই, ফোন চার্জার ও মিনারেল ওয়াটার।'
        : 'Stay productive on the go with complimentary high-speed Wi-Fi, multi-chargers, and mineral water.',
  },
]

export const fallbackTestimonials = (locale: Locale) => [
  {
    id: 1,
    name: locale === 'bn' ? 'তানভীর আহমেদ চৌধুরী' : 'Tanvir Ahmed Chowdhury',
    role: locale === 'bn' ? 'ম্যানেজিং ডিরেক্টর, গ্লোবাল টেক' : 'Managing Director, Horizon FinTech',
    quote:
      locale === 'bn'
        ? 'আমাদের করপোরেট টিমের জন্য গত ২ বছর ধরে আখি কার রেন্টালের সেবা নিচ্ছি। তাদের ড্রাইভারদের সময়ানুবর্তিতা এবং ব্যাকআপ সাপোর্ট অসাধারণ।'
        : 'Our executive team has relied on Akhi Car Rental for two consecutive years. The chauffeur punctuality and immediate backup replacement have been flawless.',
    rating: 5,
  },
  {
    id: 2,
    name: locale === 'bn' ? 'ফারহানা ইসলাম' : 'Farhana Islam',
    role: locale === 'bn' ? 'প্রবাসী ক্লায়েন্ট (লন্ডন থেকে ফ্যামিলি ট্যুর)' : 'UK Expatriate (Family Tour to Sylhet)',
    quote:
      locale === 'bn'
        ? 'সিলেটে ফ্যামিলি ট্যুরের জন্য নোয়া গাড়ি নিয়েছিলাম। গাড়ি একদম নতুন ছিল এবং ড্রাইভার ভাই অত্যন্ত ভদ্র ছিলেন। হোয়াটসঅ্যাপে নিমেষেই বুকিং সম্পন্ন হয়েছে।'
        : 'Booked a Toyota Noah for our family vacation across Sylhet. The vehicle was spotless, the captain was very courteous, and booking on WhatsApp took less than 3 minutes.',
    rating: 5,
  },
  {
    id: 3,
    name: locale === 'bn' ? 'রেজাউল করিম' : 'Rezaul Karim',
    role: locale === 'bn' ? 'ইভেন্ট ডিরেক্টর, রয়্যাল ওয়েডিংস' : 'Event Director, Crown Events Dhaka',
    quote:
      locale === 'bn'
        ? 'ভিআইপি অতিথিদের প্রটোকল ও ওয়েডিং কনভয়ের জন্য মার্সিডিজ ও প্রাডো নিয়েছিলাম। ক্লায়েন্টরা তাদের আন্তরিকতায় ভীষণ মুগ্ধ হয়েছেন।'
        : 'We engaged Akhi for our VIP wedding convoy with decorated Mercedes sedans and Prados. World-class presentation and impeccable service from start to finish.',
    rating: 5,
  },
]

export const fallbackSettings = (locale: Locale) => ({
  siteName: 'Akhi Car Rental',
  tagline:
    locale === 'bn'
      ? 'প্রিমিয়াম কার রেন্টাল ও শোফার সলিউশন'
      : 'Premium Car Rental & Chauffeur Solution in Bangladesh',
  phone: '+880 1625-347735',
  whatsapp: '8801625347735',
  email: 'akhicarrental77@gmail.com',
  address:
    locale === 'bn'
      ? 'বাড়ি ১২, রোড ৪, সেক্টর ৩, উত্তরা, ঢাকা, বাংলাদেশ'
      : 'House 12, Road 4, Sector 3, Uttara, Dhaka, Bangladesh',
  hours: locale === 'bn' ? '২৪/৭ খোলা (সার্বক্ষণিক সেবা)' : 'Open 24 Hours / 7 Days a Week',
  facebook: 'https://facebook.com/akhicarrental',
  footerText:
    locale === 'bn'
      ? 'আখি কার রেন্টাল বাংলাদেশের অন্যতম বিশ্বস্ত ও প্রিমিয়াম কার রেন্টাল প্রতিষ্ঠান। বিলাসবহুল সেডান, হাই-এন্ড এসইউভি, নোয়া ও হায়েস মাইক্রোবাসের সমৃদ্ধ বহর নিয়ে আমরা সদা আপনার সেবায় নিয়োজিত।'
      : 'Akhi Car Rental is a premier luxury and corporate automotive rental provider in Dhaka, Bangladesh. We deliver an unrivaled standard of vehicle cleanliness, courteous professional chauffeurs, and competitive transparent pricing.',
})
