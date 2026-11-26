import type { Metadata } from 'next'
import { CtaBand, HowItWorks, PageHero, SectionHead, ServiceCard } from '@/components/Blocks'
import { getServices, getSettings } from '@/lib/data'
import { t, toLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const s = await getSettings(locale)
  return pageMetadata({ locale, path: '/services', title: tr('services_title'), description: tr('services_sub'), siteName: s.siteName })
}

export default async function ServicesPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [services, s] = await Promise.all([getServices(locale), getSettings(locale)])

  return (
    <>
      <PageHero eyebrow={tr('services_eyebrow')} title={tr('services_title')} text={tr('services_sub')} />
      <section className="container page-body">
        <h2 className="sr-only">{tr('nav_services')}</h2>
        <div className="card-grid">
          {services.map((x) => <ServiceCard key={x.id} service={x} locale={locale} />)}
        </div>
      </section>
      <section className="container section">
        <SectionHead eyebrow={tr('how_eyebrow')} title={tr('how_title')} center />
        <HowItWorks locale={locale} />
      </section>
      <CtaBand locale={locale} s={s} />
    </>
  )
}
