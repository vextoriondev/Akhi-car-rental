import Image from 'next/image'
import Link from 'next/link'
import { Icon, WhatsAppIcon } from './Icons'
import { t, type Locale } from '@/lib/i18n'
import { getCategoryLabel } from '@/lib/categories'
import { carTitle, carWhatsAppUrl, fuelLabel, money } from '@/lib/format'
import type { Car } from '@/lib/types'

/** Honest stand-in for vehicles the company has not photographed yet. */
export function NoPhoto({ brand, label, compact = false }: { brand: string; label: string; compact?: boolean }) {
  return (
    <div className={`no-photo${compact ? ' is-compact' : ''}`} role="img" aria-label={`${brand} — ${label}`}>
      <span className="no-photo-brand" aria-hidden="true">{brand}</span>
      {!compact && (
        <span className="no-photo-label" aria-hidden="true">
          <Icon name="camera" size={16} /> {label}
        </span>
      )}
    </div>
  )
}

export function Fares({ car, locale }: { car: Car; locale: Locale }) {
  const tr = t(locale)
  if (!car.pricePerDay && !car.pricePerMonth) {
    return (
      <div className="fares">
        <p className="fare-request">{tr('price_on_request')}</p>
      </div>
    )
  }
  return (
    <dl className="fares">
      <div>
        <dt>{tr('daily_fare')}</dt>
        <dd>
          {car.pricePerDay ? (
            <><b>{money(car.pricePerDay)}</b> <small>{tr('per_day')}</small></>
          ) : (
            <span className="fare-na">{tr('monthly_only')}</span>
          )}
        </dd>
      </div>
      <div>
        <dt>{tr('monthly_fare')}</dt>
        <dd>
          {car.pricePerMonth ? (
            <><b>{money(car.pricePerMonth)}</b> <small>{tr('per_month')}</small></>
          ) : (
            <span className="fare-na">{tr('daily_only')}</span>
          )}
        </dd>
      </div>
    </dl>
  )
}

export function CarCard({
  car,
  locale,
  whatsapp,
  eager = false,
}: {
  car: Car
  locale: Locale
  whatsapp: string
  eager?: boolean
}) {
  const tr = t(locale)
  const href = `/${locale}/fleet/${car.slug}`

  return (
    <article className="car-card">
      <Link href={href} className="car-media" tabIndex={-1} aria-hidden="true">
        {car.photo ? (
          <Image
            src={car.photo.card}
            alt=""
            fill
            sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 400px"
            loading={eager ? 'eager' : 'lazy'}
          />
        ) : (
          <NoPhoto brand={car.brand} label={tr('photo_on_request')} />
        )}
      </Link>
      <div className="car-flags">
        {car.featured ? <span className="ribbon">{tr('featured_tag')}</span> : <span />}
        <span className={`tag ${car.available ? 'tag-ok' : 'tag-off'}`}>
          {car.available ? tr('available') : tr('unavailable')}
        </span>
      </div>

      <div className="car-body">
        <p className="car-brand">
          {car.brand} · {getCategoryLabel(car.category, locale)}
          {car.years && <span>{car.years}</span>}
        </p>
        <h3 className="car-name">
          <Link href={href}>{car.name}</Link>
        </h3>
        <ul className="car-specs">
          <li><Icon name="seat" size={15} /> {car.seats} {tr('seats')}</li>
          {car.transmission && <li><Icon name="gear" size={15} /> {tr(car.transmission === 'manual' ? 'manual' : 'auto')}</li>}
          {car.fuel && <li><Icon name="fuel" size={15} /> {fuelLabel(car.fuel, tr)}</li>}
          <li><Icon name="wheel" size={15} /> {tr(car.withDriver ? 'with_driver' : 'self_drive')}</li>
        </ul>
        <Fares car={car} locale={locale} />
        <div className="car-actions">
          <a
            href={carWhatsAppUrl(whatsapp, car, locale)}
            className="btn btn-gold btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={16} /> {tr('book_whatsapp')}
            <span className="sr-only">: {carTitle(car)}</span>
          </a>
          <Link href={href} className="car-more">
            {tr('view_details')}
            <span className="sr-only">: {carTitle(car)}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
