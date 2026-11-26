import type { MetadataRoute } from 'next'
import { getCars, getServices } from '@/lib/data'
import { locales } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cars, services] = await Promise.all([getCars('en').catch(() => []), getServices('en').catch(() => [])])
  const pages: { path: string; updated?: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/fleet', priority: 0.9 },
    { path: '/services', priority: 0.8 },
    { path: '/facilities', priority: 0.6 },
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.7 },
    ...cars.map((c) => ({ path: `/fleet/${c.slug}`, updated: c.updatedAt, priority: 0.8 })),
    ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.7 })),
  ]
  return pages.flatMap(({ path, updated, priority }) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      ...(updated ? { lastModified: new Date(updated) } : {}),
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  )
}
