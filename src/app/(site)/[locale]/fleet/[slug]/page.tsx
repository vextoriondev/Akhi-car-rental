import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Gallery } from '@/components/Gallery'
import { CarCard, Fares, NoPhoto } from '@/components/CarCard'
import { InquiryForm } from '@/components/InquiryForm'
import { SectionHead } from '@/components/Blocks'
import { Icon, WhatsAppIcon, type IconName } from '@/components/Icons'
import { JsonLd } from '@/components/JsonLd'
import { getCar, getSettings, getSimilarCars } from '@/lib/data'
import { inquiryOptions } from '@/lib/inquiry-options'
import { t, toLocale } from '@/lib/i18n'
import { getCategoryLabel } from '@/lib/categories'
import { carTitle, carWhatsAppUrl, fuelLabel, money } from '@/lib/format'
import { SITE_URL, telHref } from '@/lib/site'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, ...rest } = await params
  const locale = toLocale(rest.locale)
  const tr = t(locale)
  const [car, s] = await Promise.all([getCar(locale, slug), getSettings(locale)])
  if (!car) notFound()
  const fares = [
    car.pricePerDay ? `${tr('daily_fare')} ${money(car.pricePerDay)}` : '',
    car.pricePerMonth ? `${tr('monthly_fare')} ${money(car.pricePerMonth)}` : '',
  ].filter(Boolean)
  return pageMetadata({
    locale,
    path: `/fleet/${car.slug}`,
    title: carTitle(car),
    description: [car.description, ...fares].filter(Boolean).join(' · ') || carTitle(car),
    image: car.photo?.url,
    siteName: s.siteName,
  })
}

export default async function CarPage({ params }: Props) {
  const { slug, ...rest } = await params
  const locale = toLocale(rest.locale)
  const tr = t(locale)
  const car = await getCar(locale, slug)
  if (!car) notFound()
  const [similar, options, s] = await Promise.all([
    getSimilarCars(locale, car),
    inquiryOptions(locale),
    getSettings(locale),
  ])
  const category = getCategoryLabel(car.category, locale)
  const waUrl = carWhatsAppUrl(s.whatsapp, car, locale)

  const specs = ([
    ['seat', tr('seats_label'), String(car.seats)],
    ['calendar', tr('model_year'), car.years],
    ['bag', tr('bags'), car.luggage ? String(car.luggage) : ''],
    ['gear', tr('gearbox'), car.transmission ? tr(car.transmission === 'manual' ? 'manual' : 'auto') : ''],
    ['fuel', tr('fuel'), car.fuel ? fuelLabel(car.fuel, tr) : ''],
    ['palette', tr('color'), car.color ?? ''],
    ['wheel', tr('driver_label'), tr(car.withDriver ? 'with_driver' : 'self_drive')],
  ] as [IconName, string, string][]).filter(([, , value]) => value)

  const offers = [
    car.pricePerDay && { price: car.pricePerDay, unitText: 'DAY' },
    car.pricePerMonth && { price: car.pricePerMonth, unitText: 'MONTH' },
  ].filter(Boolean) as { price: number; unitText: string }[]

  return (
    <div className="container detail">
      <nav className="breadcrumbs" aria-label={tr('breadcrumb')}>
        <ol>
          <li><Link href={`/${locale}`}>{tr('nav_home')}</Link></li>
          <li><Link href={`/${locale}/fleet`}>{tr('nav_fleet')}</Link></li>
          <li aria-current="page">{carTitle(car)}</li>
        </ol>
      </nav>

      <div className="detail-grid">
        <div className="detail-media">
          {car.gallery.length ? (
            <Gallery photos={car.gallery} locale={locale} />
          ) : (
            <div className="gallery-stage"><NoPhoto brand={car.brand} label={tr('photo_on_request')} /></div>
          )}
        </div>

        <div className="detail-info">
          <div className="detail-tags">
            <span className="tag">{category}</span>
            <span className={`tag ${car.available ? 'tag-ok' : 'tag-off'}`}>
              {car.available ? tr('available') : tr('unavailable')}
            </span>
          </div>
          <p className="car-brand">{car.brand}{car.years && <span>{car.years}</span>}</p>
          <h1>{car.name}</h1>

          <div className="price-panel">
            <Fares car={car} locale={locale} />
            {car.pricePerDay && <p className="muted small">{tr('fare_note')}</p>}
            <div className="price-actions">
              <a className="btn btn-wa btn-lg" href={waUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> {tr('book_whatsapp')}
              </a>
              <a className="btn btn-gold btn-lg" href="#reserve">{tr('inquiry_title')}</a>
            </div>
            <a className="text-link" href={telHref(s.phone)}><Icon name="phone" /> {s.phone}</a>
          </div>

          <h2 className="subheading">{tr('specs_title')}</h2>
          <dl className="spec-grid">
            {specs.map(([icon, label, value]) => (
              <div key={label}>
                <dt><Icon name={icon} /> {label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {car.description && (
            <>
              <h2 className="subheading">{tr('about_vehicle')}</h2>
              <p className="muted prose">{car.description}</p>
            </>
          )}

          {car.features.length > 0 && (
            <>
              <h2 className="subheading">{tr('features_title')}</h2>
              <ul className="ticks">
                {car.features.map((f) => <li key={f}><Icon name="check" /> {f}</li>)}
              </ul>
            </>
          )}

          <div className="note">
            <h2>{tr('terms_title')}</h2>
            <p>{tr('terms_confirm')}</p>
          </div>
        </div>
      </div>

      <section id="reserve" className="section reserve">
        <SectionHead eyebrow={tr('reserve_eyebrow')} title={tr('reserve_title')} text={tr('reserve_sub')} center />
        <InquiryForm
          locale={locale}
          {...options}
          whatsapp={s.whatsapp}
          defaultCar={String(car.id)}
        />
      </section>

      {similar.length > 0 && (
        <section className="section">
          <SectionHead title={tr('similar_title')} action={{ href: `/${locale}/fleet`, label: tr('view_all') }} />
          <div className="car-grid">
            {similar.map((c) => <CarCard key={c.id} car={c} locale={locale} whatsapp={s.whatsapp} />)}
          </div>
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: carTitle(car),
          brand: { '@type': 'Brand', name: car.brand },
          category,
          description: car.description || undefined,
          image: car.gallery.map((p) => new URL(p.url, SITE_URL).href),
          url: `${SITE_URL}/${locale}/fleet/${car.slug}`,
          ...(offers.length
            ? {
                offers: offers.map((o) => ({
                  '@type': 'Offer',
                  priceCurrency: 'BDT',
                  price: o.price,
                  businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
                  priceSpecification: { '@type': 'UnitPriceSpecification', price: o.price, priceCurrency: 'BDT', unitText: o.unitText },
                  availability: car.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                })),
              }
            : {}),
        }}
      />
    </div>
  )
}
