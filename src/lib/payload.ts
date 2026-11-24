import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from './i18n'
import {
  fallbackCars,
  fallbackFacilities,
  fallbackServices,
  fallbackSettings,
  fallbackSlides,
  fallbackTestimonials,
} from './fallback'

export const isDbConfigured = () => {
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || ''
  return Boolean(url && !url.includes('user:password@host') && url.trim() !== '')
}

export const getClient = () => getPayload({ config })

/** Run a query; if the database is unreachable/empty return the fallback so the site never crashes. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured()) {
    return fallback
  }
  try {
    return await fn()
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      const summary = (e as Error).message?.split('\n')[0] || ''
      console.warn(`[payload] Database query notice: ${summary} (serving fallback content)`)
    }
    return fallback
  }
}

export const getHome = async (locale: Locale) => {
  const data = await safe(async () => (await getClient()).findGlobal({ slug: 'home', locale, depth: 1 }), null)
  if (data && (data as any).slides?.length) return data
  return {
    slides: fallbackSlides(locale),
    stats: [
      { value: '50+', label: locale === 'bn' ? 'আধুনিক গাড়ি' : 'Luxury Vehicles' },
      { value: '15,000+', label: locale === 'bn' ? 'সন্তুষ্ট গ্রাহক' : 'Happy Journeys' },
      { value: '24/7', label: locale === 'bn' ? 'রোড সাপোর্ট' : 'Emergency Roadside Support' },
      { value: '100%', label: locale === 'bn' ? 'অন-টাইম গ্যারান্টি' : 'On-Time Dispatch Guarantee' },
    ],
    whyUs: [
      {
        icon: '👨‍✈️',
        title: locale === 'bn' ? 'পেশাদার শোফার' : 'Verified Chauffeurs',
        text:
          locale === 'bn'
            ? 'দক্ষ, ট্রাফিক আইন সচেতন ও বিনয়ী ইউনিফর্মধারী চালক।'
            : 'Background-verified, courteous, and highway-tested professional drivers.',
      },
      {
        icon: '💸',
        title: locale === 'bn' ? 'স্বচ্ছ নির্ধারিত মূল্য' : 'Transparent Pricing',
        text:
          locale === 'bn'
            ? 'কোনো গোপন বা লুকানো খরচ নেই। যা দেখবেন তাই পরিশোধ করবেন।'
            : 'Zero hidden fees. All bridge, toll, and fuel arrangements are clear upfront.',
      },
      {
        icon: '🧼',
        title: locale === 'bn' ? 'সুরক্ষিত ও পরিষ্কার গাড়ি' : 'Pristine Clean Vehicles',
        text:
          locale === 'bn'
            ? 'প্রতিটি ট্রিপের আগে ভ্যাকুয়াম ক্লিন ও স্যানিটাইজ করা সুসজ্জিত গাড়ি।'
            : 'Detailed sanitization and rigorous 24-point mechanical checks before dispatch.',
      },
      {
        icon: '⚡',
        title: locale === 'bn' ? 'তাৎক্ষণিক হোয়াটসঅ্যাপ বুকিং' : 'Instant 24/7 Booking',
        text:
          locale === 'bn'
            ? 'হোয়াটসঅ্যাপে কয়েক মিনিটের মধ্যে নিশ্চিত করুন আপনার পছন্দের গাড়ি।'
            : 'Real human dispatchers ready 24/7 on WhatsApp for rapid confirmation.',
      },
    ],
    about: {
      eyebrow: locale === 'bn' ? 'আখি কার রেন্টাল সম্পর্কে' : 'ABOUT AKHI CAR RENTAL',
      title:
        locale === 'bn'
          ? 'নির্ভরযোগ্যতা ও আভিজাত্যের সমন্বয়ে বাংলাদেশের শীর্ষস্থানীয় কার রেন্টাল সার্ভিস'
          : 'Setting the Gold Standard for Luxury Chauffeur & Fleet Rentals in Bangladesh',
      text:
        locale === 'bn'
          ? 'আখি কার রেন্টাল দীর্ঘ এক দশকেরও বেশি সময় ধরে কর্পোরেট প্রতিষ্ঠান, দূতাবাস, প্রবাসী ও পরিবারকে নির্ভরযোগ্য গাড়ি ভাড়া সেবা প্রদান করে আসছে। আমাদের সুসজ্জিত বহরে রয়েছে প্রিমিয়াম সেডান, বিলাসবহুল প্রাডো এসইউভি, নোয়া ও হায়েস মাইক্রোবাস এবং আরামদায়ক কোস্টার বাস।'
          : 'With over a decade of excellence in Dhaka, Akhi Car Rental serves corporate multinationals, foreign delegations, expatriates, and valued families. Our immaculate fleet offers unparalleled comfort, safety, and prestige for every journey across Bangladesh.',
    },
  }
}

export const getSettings = async (locale: Locale) => {
  const data = await safe(async () => (await getClient()).findGlobal({ slug: 'site-settings', locale }), null)
  if (data && (data as any).phone) return data
  return fallbackSettings(locale)
}

export const getServices = async (locale: Locale) => {
  const docs = await safe(
    async () =>
      (await (await getClient()).find({ collection: 'services', locale, limit: 50, sort: 'order', depth: 1 })).docs,
    [],
  )
  if (docs && docs.length > 0) return docs
  return fallbackServices(locale)
}

export const getService = async (locale: Locale, slug: string) => {
  const doc = await safe(
    async () =>
      (
        await (await getClient()).find({
          collection: 'services',
          locale,
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
        })
      ).docs[0] ?? null,
    null,
  )
  if (doc) return doc
  return fallbackServices(locale).find((s) => s.slug === slug) ?? null
}

export const getCars = async (
  locale: Locale,
  opts: {
    q?: string
    category?: string
    serviceId?: number | string
    featured?: boolean
    limit?: number
    sort?: string
  } = {},
) => {
  const docs = await safe(async () => {
    const and: any[] = []
    if (opts.q) {
      and.push({
        or: [{ name: { like: opts.q } }, { brand: { like: opts.q } }, { description: { like: opts.q } }],
      })
    }
    if (opts.category) and.push({ category: { equals: opts.category } })
    if (opts.serviceId) and.push({ services: { in: [opts.serviceId] } })
    if (opts.featured) and.push({ featured: { equals: true } })

    let sort = '-featured'
    if (opts.sort === 'price-asc') sort = 'pricePerDay'
    else if (opts.sort === 'price-desc') sort = '-pricePerDay'
    else if (opts.sort === 'name') sort = 'name'

    const res = await (await getClient()).find({
      collection: 'cars',
      locale,
      where: and.length ? { and } : undefined,
      limit: opts.limit ?? 60,
      depth: 1,
      sort,
    })
    return res.docs
  }, [])

  if (docs && docs.length > 0) return docs

  // Use fallback data if DB returned nothing
  let fallback = fallbackCars(locale)
  if (opts.featured) fallback = fallback.filter((c) => c.featured)
  if (opts.category) fallback = fallback.filter((c) => c.category === opts.category)
  if (opts.q) {
    const q = opts.q.toLowerCase()
    fallback = fallback.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    )
  }
  if (opts.sort === 'price-asc') {
    fallback.sort((a, b) => (a.pricePerDay || 999999) - (b.pricePerDay || 999999))
  } else if (opts.sort === 'price-desc') {
    fallback.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0))
  } else if (opts.sort === 'name') {
    fallback.sort((a, b) => a.name.localeCompare(b.name))
  }
  return fallback.slice(0, opts.limit ?? 60)
}

export const getCar = async (locale: Locale, slug: string) => {
  const doc = await safe(
    async () =>
      (
        await (await getClient()).find({
          collection: 'cars',
          locale,
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        })
      ).docs[0] ?? null,
    null,
  )
  if (doc) return doc
  return fallbackCars(locale).find((c) => c.slug === slug) ?? null
}

export const getSimilarCars = async (locale: Locale, category: string, currentSlug: string) => {
  const all = await getCars(locale, { category, limit: 4 })
  const filtered = all.filter((c: any) => c.slug !== currentSlug)
  if (filtered.length >= 3) return filtered.slice(0, 3)
  // If not enough in same category, get other featured
  const featured = await getCars(locale, { featured: true, limit: 4 })
  return [...filtered, ...featured.filter((c: any) => c.slug !== currentSlug && !filtered.some((f: any) => f.slug === c.slug))].slice(0, 3)
}

export const getFacilities = async (locale: Locale) => {
  const docs = await safe(
    async () => (await (await getClient()).find({ collection: 'facilities', locale, limit: 50, sort: 'order' })).docs,
    [],
  )
  if (docs && docs.length > 0) return docs
  return fallbackFacilities(locale)
}

export const getTestimonials = async (locale: Locale) => {
  const docs = await safe(
    async () => (await (await getClient()).find({ collection: 'testimonials', locale, limit: 12 })).docs,
    [],
  )
  if (docs && docs.length > 0) return docs
  return fallbackTestimonials(locale)
}

export { cardUrl, mediaUrl } from './media'
