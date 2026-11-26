import 'server-only'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { connection } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CONTENT_TAG } from '@/server/revalidate'
import { CONTACT_DEFAULTS } from './site'
import type { Locale } from './i18n'
import type { Car, Facility, HomeContent, Photo, Service, Settings, Testimonial } from './types'

export const getClient = () => getPayload({ config })

export const isDbConfigured = () => {
  const url = process.env.POSTGRES_URL || ''
  return Boolean(url.trim() && !url.includes('user:password@host'))
}

/**
 * Database reads are cached across requests and expired by the CMS hooks, so admin
 * edits appear at once. The time limit covers writes made outside the web server.
 * Errors are never cached; they surface in the route's error boundary.
 */
function query<T>(key: string, run: (locale: Locale) => Promise<T>) {
  const cached = unstable_cache(run, [key], { tags: [CONTENT_TAG], revalidate: 60 })
  return cache(async (locale: Locale): Promise<T> => {
    await connection()
    if (!isDbConfigured()) throw new Error('POSTGRES_URL is not configured')
    return cached(locale)
  })
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const num = (v: unknown) => (typeof v === 'number' && v > 0 ? v : null)

function toPhoto(media: any, fallbackAlt: string): Photo | null {
  if (!media || typeof media !== 'object' || !media.url) return null
  const size = (name: string) => media.sizes?.[name]?.url as string | undefined
  return {
    url: size('hero') || media.url,
    card: size('card') || media.url,
    thumb: size('thumb') || size('card') || media.url,
    alt: str(media.alt) || fallbackAlt,
  }
}

function toCar(d: any): Car {
  const name = str(d.name)
  const photo = toPhoto(d.image, name)
  return {
    id: d.id,
    slug: d.slug,
    name,
    brand: str(d.brand),
    category: str(d.category),
    years: str(d.yearRange) || (d.year ? String(d.year) : ''),
    seats: d.seats ?? 4,
    luggage: num(d.luggage),
    transmission: d.transmission || null,
    fuel: d.fuel || null,
    color: d.color || null,
    pricePerDay: num(d.pricePerDay),
    pricePerMonth: num(d.pricePerMonth),
    available: d.available !== false,
    featured: Boolean(d.featured),
    withDriver: d.withDriver !== false,
    description: str(d.description),
    features: (d.features ?? []).map((f: any) => str(f.label)).filter(Boolean),
    serviceSlugs: (d.services ?? []).map((s: any) => s?.slug).filter(Boolean),
    photo,
    gallery: [photo, ...(d.gallery ?? []).map((g: any) => toPhoto(g.image, name))].filter(Boolean) as Photo[],
    updatedAt: str(d.updatedAt),
  }
}

export const getCars = query('cars', async (locale) => {
  const res = await (await getClient()).find({
    collection: 'cars',
    locale,
    overrideAccess: false, // visitors' rules: published only
    where: { status: { equals: 'published' } },
    sort: 'order',
    limit: 500,
    depth: 1,
  })
  return res.docs.map(toCar)
})

export async function getCar(locale: Locale, slug: string) {
  return (await getCars(locale)).find((c) => c.slug === slug) ?? null
}

export async function getSimilarCars(locale: Locale, car: Car, limit = 3) {
  const others = (await getCars(locale)).filter((c) => c.id !== car.id)
  const score = (c: Car) => (c.category === car.category ? 4 : 0) + (c.brand === car.brand ? 2 : 0) + (c.photo ? 1 : 0)
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit)
}

export const getServices = query('services', async (locale) => {
  const res = await (await getClient()).find({ collection: 'services', locale, sort: 'order', limit: 50, depth: 1 })
  return res.docs.map(
    (d: any): Service => ({
      id: d.id,
      slug: d.slug,
      type: str(d.type),
      title: str(d.title),
      icon: str(d.icon),
      summary: str(d.summary),
      description: str(d.description),
      startingPrice: str(d.startingPrice),
      highlights: (d.highlights ?? []).map((h: any) => str(h.label)).filter(Boolean),
      photo: toPhoto(d.image, str(d.title)),
    }),
  )
})

export async function getService(locale: Locale, slug: string) {
  return (await getServices(locale)).find((s) => s.slug === slug) ?? null
}

export const getFacilities = query('facilities', async (locale) => {
  const res = await (await getClient()).find({ collection: 'facilities', locale, sort: 'order', limit: 50 })
  return res.docs.map((d: any): Facility => ({ id: d.id, title: str(d.title), text: str(d.text), icon: str(d.icon) }))
})

export const getTestimonials = query('testimonials', async (locale) => {
  const res = await (await getClient()).find({ collection: 'testimonials', locale, limit: 12 })
  return res.docs.map(
    (d: any): Testimonial => ({
      id: d.id,
      name: str(d.name),
      role: str(d.role),
      quote: str(d.quote),
      rating: Math.min(5, Math.max(1, d.rating ?? 5)),
    }),
  )
})

export const getHome = query('home', async (locale): Promise<HomeContent> => {
  const d: any = await (await getClient()).findGlobal({ slug: 'home', locale, depth: 1 })
  return {
    slides: (d.slides ?? []).map((s: any) => ({
      eyebrow: str(s.eyebrow),
      title: str(s.title),
      subtitle: str(s.subtitle),
      ctaLabel: str(s.ctaLabel),
      ctaLink: str(s.ctaLink) || '/fleet',
      photo: toPhoto(s.image, str(s.title)),
    })),
    about: { eyebrow: str(d.about?.eyebrow), title: str(d.about?.title), text: str(d.about?.text) },
    stats: (d.stats ?? []).map((s: any) => ({ value: str(s.value), label: str(s.label) })),
    whyUs: (d.whyUs ?? []).map((w: any) => ({ icon: str(w.icon), title: str(w.title), text: str(w.text) })),
  }
})

const settingsQuery = query('site-settings', async (locale): Promise<Settings> => {
  const d: any = await (await getClient()).findGlobal({ slug: 'site-settings', locale, depth: 1 })
  const socials = (['facebook', 'instagram', 'youtube', 'linkedin'] as const)
    .map((k) => ({ label: k[0].toUpperCase() + k.slice(1), href: str(d.socials?.[k]) }))
    .filter((s) => /^https?:\/\//.test(s.href))
  return {
    siteName: str(d.siteName) || CONTACT_DEFAULTS.siteName,
    tagline: str(d.tagline),
    phone: str(d.phone) || CONTACT_DEFAULTS.phone,
    whatsapp: str(d.whatsapp) || CONTACT_DEFAULTS.whatsapp,
    email: str(d.email) || CONTACT_DEFAULTS.email,
    address: str(d.address) || CONTACT_DEFAULTS.address,
    hours: str(d.hours),
    footerText: str(d.footerText),
    metaTitle: str(d.seo?.metaTitle),
    metaDescription: str(d.seo?.metaDescription),
    socials,
    logo: toPhoto(d.logo, str(d.siteName)),
  }
})

/** Used by the layout, so it must not take the whole site down. */
export async function getSettings(locale: Locale): Promise<Settings> {
  await connection()
  try {
    return await settingsQuery(locale)
  } catch (e) {
    console.error('[settings]', (e as Error).message.split('\n')[0])
    return {
      ...CONTACT_DEFAULTS,
      tagline: '',
      hours: '',
      footerText: '',
      metaTitle: '',
      metaDescription: '',
      socials: [],
      logo: null,
    }
  }
}
