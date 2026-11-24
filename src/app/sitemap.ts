import type { MetadataRoute } from 'next'
import { getCars, getServices } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhi-car-rental.vercel.app'
  const locales = ['en', 'bn']

  const staticRoutes = ['', '/fleet', '/services', '/facilities', '/about', '/contact']

  const routes: MetadataRoute.Sitemap = []

  // Add static routes for both locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      routes.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/fleet' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/fleet' ? 0.9 : 0.8,
      })
    }
  }

  // Add dynamic cars for both locales
  try {
    const cars = await getCars('en', { limit: 100 })
    for (const car of cars) {
      for (const locale of locales) {
        routes.push({
          url: `${siteUrl}/${locale}/fleet/${car.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.85,
        })
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  // Add dynamic services for both locales
  try {
    const services = await getServices('en')
    for (const svc of services) {
      for (const locale of locales) {
        routes.push({
          url: `${siteUrl}/${locale}/services/${svc.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.75,
        })
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  return routes
}
