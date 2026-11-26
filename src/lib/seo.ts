import type { Metadata } from 'next'
import { SITE_URL } from './site'
import type { Locale } from './i18n'

/** Title, description, canonical URL, language alternates and social cards for one page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  siteName,
}: {
  locale: Locale
  path: string
  title?: string
  description: string
  image?: string | null
  siteName: string
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`
  const images = image ? [{ url: image }] : undefined
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
      languages: { en: `${SITE_URL}/en${path}`, bn: `${SITE_URL}/bn${path}`, 'x-default': `${SITE_URL}/en${path}` },
    },
    openGraph: {
      title: title ? `${title} · ${siteName}` : siteName,
      description,
      url,
      siteName,
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      type: 'website',
      images,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary' },
  }
}
