import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CarCard } from '@/components/Cards'
import { InquiryForm } from '@/components/InquiryForm'
import { formLabels, formOptions } from '@/lib/form'
import { getCars, getService, getSettings } from '@/lib/payload'
import { buildWhatsAppUrl, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const s: any = await getService(locale, slug)
  return { title: s?.title ?? 'Service' }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const s: any = await getService(locale, slug)
  if (!s) notFound()

  const tr = t(locale)
  const isBn = locale === 'bn'
  const [cars, opts, settings]: any = await Promise.all([
    getCars(locale, { serviceId: s.id, limit: 6 }),
    formOptions(locale),
    getSettings(locale),
  ])

  const wa = settings?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'
  const waUrl = buildWhatsAppUrl({ phone: wa, locale })

  return (
    <div className={`container page service-detail-page a-${s.accent || 'gold'}`}>
      <Link className="crumb-back-link" href={`/${locale}/services`}>
        ← {isBn ? 'সকল সার্ভিসে ফিরে যান' : 'Back to Services'}
      </Link>

      <div className="svc-hero card p-8 my-6">
        <div className="s-icon big">{s.icon || '🚗'}</div>
        <div className="svc-hero-text">
          <span className="eyebrow">{isBn ? 'বিশেষায়িত প্যাকেজ' : 'SPECIALIZED SERVICE'}</span>
          <h1>{s.title}</h1>
          <p className="lead muted">{s.summary}</p>
          {s.startingPrice && (
            <div className="svc-price-pill">
              <span className="muted small">{isBn ? 'শুরু' : 'Rates'}</span>
              <b>{s.startingPrice}</b>
            </div>
          )}
        </div>
        <div className="svc-hero-action">
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-wa-card">
            💬 {tr('whatsapp_chat')}
          </a>
        </div>
      </div>

      {s.description && (
        <div className="card p-6 my-6">
          <h3 className="section-subheading">{isBn ? 'সার্ভিসের পূর্ণ বিবরণ' : 'Service Overview'}</h3>
          <p className="prose muted">{s.description}</p>
        </div>
      )}

      {s.highlights?.length > 0 && (
        <div className="my-8">
          <h3 className="section-subheading">{tr('highlights')}</h3>
          <ul className="ticks">
            {s.highlights.map((h: any, i: number) => (
              <li key={i}>{h.label}</li>
            ))}
          </ul>
        </div>
      )}

      {(cars as any[]).length > 0 && (
        <section className="service-cars-section section">
          <div className="sec-head">
            <div>
              <span className="eyebrow">{isBn ? 'উপযুক্ত বহর' : 'MATCHING VEHICLES'}</span>
              <h2>{tr('cars_for_service')}</h2>
            </div>
            <Link className="link" href={`/${locale}/fleet`}>
              {tr('view_all')} →
            </Link>
          </div>
          <div className="grid g3">
            {(cars as any[]).map((c) => (
              <CarCard
                key={c.id || c.slug}
                car={c}
                locale={locale}
                whatsappNumber={wa}
              />
            ))}
          </div>
        </section>
      )}

      <div className="service-inquiry-section my-8">
        <div className="sec-head">
          <div>
            <span className="eyebrow">{isBn ? 'বুকিং' : 'RESERVATION'}</span>
            <h2>{tr('inquiry_title')}</h2>
          </div>
        </div>
        <InquiryForm
          services={opts.services}
          cars={opts.cars}
          defaultService={String(s.id)}
          whatsapp={wa}
          labels={formLabels(tr)}
        />
      </div>
    </div>
  )
}
