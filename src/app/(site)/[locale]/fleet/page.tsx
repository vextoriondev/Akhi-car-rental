import type { Metadata } from 'next'
import { FleetBrowser } from '@/components/FleetBrowser'
import { PageHero } from '@/components/Blocks'
import { getCars, getServices, getSettings } from '@/lib/data'
import { t, toLocale } from '@/lib/i18n'
import { categoryOptions } from '@/lib/categories'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [s, cars] = await Promise.all([getSettings(locale), getCars(locale).catch(() => [])])
  return pageMetadata({
    locale,
    path: '/fleet',
    title: tr('fleet_title'),
    description: tr('fleet_sub'),
    image: cars.find((c) => c.photo)?.photo?.url,
    siteName: s.siteName,
  })
}

export default async function Fleet({ params }: Props) {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [cars, services, s] = await Promise.all([getCars(locale), getServices(locale), getSettings(locale)])

  return (
    <>
      <PageHero eyebrow={tr('fleet_eyebrow')} title={tr('fleet_title')} text={tr('fleet_sub')} />
      <section className="container page-body">
        {/* No Suspense wrapper: the page renders per request, so the list belongs in the first HTML. */}
        <FleetBrowser
          cars={cars}
          locale={locale}
          categories={categoryOptions(locale, cars.map((c) => c.category))}
          services={services.map((x) => ({ value: x.slug, label: x.title }))}
          whatsapp={s.whatsapp}
        />
      </section>
    </>
  )
}
