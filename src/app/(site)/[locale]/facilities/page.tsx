import type { Metadata } from 'next'
import { CtaBand, FeatureCard, PageHero } from '@/components/Blocks'
import { getFacilities, getSettings } from '@/lib/data'
import { t, toLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const s = await getSettings(locale)
  return pageMetadata({ locale, path: '/facilities', title: tr('facilities_title'), description: tr('facilities_sub'), siteName: s.siteName })
}

export default async function FacilitiesPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [items, s] = await Promise.all([getFacilities(locale), getSettings(locale)])

  return (
    <>
      <PageHero eyebrow={tr('facilities_eyebrow')} title={tr('facilities_title')} text={tr('facilities_sub')} />
      <section className="container page-body">
        <h2 className="sr-only">{tr('nav_facilities')}</h2>
        <div className="card-grid">
          {items.map((f) => <FeatureCard key={f.id} item={f} />)}
        </div>
      </section>
      <CtaBand locale={locale} s={s} />
    </>
  )
}
