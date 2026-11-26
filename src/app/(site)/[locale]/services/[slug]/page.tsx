import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CarCard } from '@/components/CarCard'
import { InquiryForm } from '@/components/InquiryForm'
import { PageHero, SectionHead } from '@/components/Blocks'
import { Icon, WhatsAppIcon } from '@/components/Icons'
import { getCars, getService, getSettings } from '@/lib/data'
import { inquiryOptions } from '@/lib/inquiry-options'
import { t, toLocale } from '@/lib/i18n'
import { greetingUrl } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, ...rest } = await params
  const locale = toLocale(rest.locale)
  const [service, s] = await Promise.all([getService(locale, slug), getSettings(locale)])
  if (!service) notFound()
  return pageMetadata({
    locale,
    path: `/services/${service.slug}`,
    title: service.title,
    description: service.summary,
    image: service.photo?.url,
    siteName: s.siteName,
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug, ...rest } = await params
  const locale = toLocale(rest.locale)
  const tr = t(locale)
  const service = await getService(locale, slug)
  if (!service) notFound()
  const [cars, options, s] = await Promise.all([getCars(locale), inquiryOptions(locale), getSettings(locale)])
  const matching = cars.filter((c) => c.serviceSlugs.includes(service.slug))
  // Photographed vehicles first, otherwise keeping the CMS order.
  const shown = [...matching].sort((a, b) => Number(!a.photo) - Number(!b.photo)).slice(0, 6)

  return (
    <>
      <PageHero eyebrow={tr('services_eyebrow')} title={service.title} text={service.summary} photo={service.photo}>
        <div className="hero-buttons">
          <a className="btn btn-gold" href="#reserve">{tr('inquiry_title')}</a>
          <a className="btn btn-wa" href={greetingUrl(s.whatsapp, locale)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> {tr('whatsapp_chat')}
          </a>
        </div>
      </PageHero>

      <section className="container section split">
        <div>
          <Link className="text-link" href={`/${locale}/services`}><Icon name="back" /> {tr('back_services')}</Link>
          <h2>{tr('service_overview')}</h2>
          <p className="muted prose">{service.description || service.summary}</p>
          {service.startingPrice && <p className="service-price">{service.startingPrice}</p>}
        </div>
        {service.highlights.length > 0 && (
          <div className="note">
            <h2>{tr('highlights')}</h2>
            <ul className="ticks">
              {service.highlights.map((h) => <li key={h}><Icon name="check" /> {h}</li>)}
            </ul>
          </div>
        )}
      </section>

      {shown.length > 0 && (
        <section className="container section">
          <SectionHead
            title={tr('service_cars')}
            action={{ href: `/${locale}/fleet?service=${service.slug}`, label: `${tr('view_all')} (${matching.length})` }}
          />
          <div className="car-grid">
            {shown.map((c) => <CarCard key={c.id} car={c} locale={locale} whatsapp={s.whatsapp} />)}
          </div>
        </section>
      )}

      <section id="reserve" className="container section reserve">
        <SectionHead eyebrow={tr('reserve_eyebrow')} title={tr('inquiry_title')} center />
        <InquiryForm locale={locale} {...options} whatsapp={s.whatsapp} defaultService={String(service.id)} />
      </section>
    </>
  )
}
