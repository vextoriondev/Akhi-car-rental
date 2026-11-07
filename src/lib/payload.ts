import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from './i18n'

export const getClient = () => getPayload({ config })

/** Run a query; if the database is unreachable/empty return the fallback so the site never hard-crashes. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    console.error('[payload]', (e as Error).message)
    return fallback
  }
}

export const getHome = (locale: Locale) =>
  safe(async () => (await getClient()).findGlobal({ slug: 'home', locale, depth: 1 }), null)

export const getSettings = (locale: Locale) =>
  safe(async () => (await getClient()).findGlobal({ slug: 'site-settings', locale }), null)

export const getServices = (locale: Locale) =>
  safe(
    async () =>
      (await (await getClient()).find({ collection: 'services', locale, limit: 50, sort: 'order', depth: 1 })).docs,
    [],
  )

export const getService = (locale: Locale, slug: string) =>
  safe(
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

export const getCars = (
  locale: Locale,
  opts: { q?: string; category?: string; serviceId?: number | string; featured?: boolean; limit?: number } = {},
) =>
  safe(async () => {
    const and: any[] = []
    if (opts.q) {
      and.push({
        or: [{ name: { like: opts.q } }, { brand: { like: opts.q } }, { description: { like: opts.q } }],
      })
    }
    if (opts.category) and.push({ category: { equals: opts.category } })
    if (opts.serviceId) and.push({ services: { in: [opts.serviceId] } })
    if (opts.featured) and.push({ featured: { equals: true } })
    return (
      await (await getClient()).find({
        collection: 'cars',
        locale,
        where: and.length ? { and } : undefined,
        limit: opts.limit ?? 60,
        depth: 1,
        sort: '-featured',
      })
    ).docs
  }, [])

export const getCar = (locale: Locale, slug: string) =>
  safe(
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

export const getFacilities = (locale: Locale) =>
  safe(
    async () => (await (await getClient()).find({ collection: 'facilities', locale, limit: 50, sort: 'order' })).docs,
    [],
  )

export const getTestimonials = (locale: Locale) =>
  safe(async () => (await (await getClient()).find({ collection: 'testimonials', locale, limit: 12 })).docs, [])

export const mediaUrl = (m: unknown): string | null => {
  if (m && typeof m === 'object' && 'url' in m) return ((m as any).sizes?.hero?.url ?? (m as any).url) as string
  return null
}
export const cardUrl = (m: unknown): string | null => {
  if (m && typeof m === 'object' && 'url' in m) return ((m as any).sizes?.card?.url ?? (m as any).url) as string
  return null
}
