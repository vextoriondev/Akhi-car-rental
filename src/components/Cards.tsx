import Link from 'next/link'
import Image from 'next/image'
import { CarArt } from './CarArt'
import { cardUrl } from '@/lib/media'
import { buildWhatsAppUrl, t, type Locale, type T } from '@/lib/i18n'
import { getCategoryLabel } from '@/lib/categories'

export function formatPrice(
  n?: number | null,
  locale: Locale = 'en',
  unitKey: 'per_day' | 'per_month' = 'per_day',
  tr?: T,
) {
  if (typeof n === 'number' && n > 0) {
    const formatted = `৳${n.toLocaleString('en-US')}`
    return (
      <span className="price-val">
        <b>{formatted}</b>
        <span className="unit muted small">{tr ? tr(unitKey) : unitKey === 'per_day' ? '/ day' : '/ month'}</span>
      </span>
    )
  }
  return null
}

export function CarCard({
  car,
  locale,
  whatsappNumber,
}: {
  car: any
  locale: Locale
  whatsappNumber?: string
}) {
  const tr = t(locale)
  const img = cardUrl(car.image)
  const isBn = locale === 'bn'
  const categoryLabel = getCategoryLabel(car.category || 'sedan', locale)
  const yearText = car.yearRange || car.year || ''

  const phone = whatsappNumber || '8801625347735'
  const waUrl = buildWhatsAppUrl({
    phone,
    carName: car.name,
    yearOrRange: yearText,
    category: categoryLabel,
    locale,
  })

  // Pricing logic handling daily-only, monthly-only, and on-request
  const hasDaily = typeof car.pricePerDay === 'number' && car.pricePerDay > 0
  const hasMonthly = typeof car.pricePerMonth === 'number' && car.pricePerMonth > 0

  return (
    <div className={`card car-card a-${car.accent || 'gold'}`}>
      <Link href={`/${locale}/fleet/${car.slug}`} className="car-media-link" tabIndex={-1}>
        <div className="car-media">
          {img ? (
            <Image
              src={img}
              alt={car.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
              className="car-img"
            />
          ) : (
            <CarArt />
          )}

          {/* Top badges */}
          <div className="car-badges-top">
            <span className="chip chip-cat">{categoryLabel}</span>
            {car.available === false ? (
              <span className="chip chip-off">{tr('unavailable')}</span>
            ) : (
              <span className="chip chip-available">
                <span className="pulse-dot" />
                {tr('available')}
              </span>
            )}
          </div>

          {/* Brand/Model year overlay tag */}
          {yearText && <span className="chip chip-year">{yearText}</span>}
        </div>
      </Link>

      <div className="card-body">
        <div className="card-header-line">
          <div>
            <span className="car-brand muted small">{car.brand || 'Automotive'}</span>
            <h3 className="car-title">
              <Link href={`/${locale}/fleet/${car.slug}`}>{car.name}</Link>
            </h3>
          </div>
        </div>

        {/* Specs Pill Strip */}
        <div className="car-specs-strip">
          <span className="spec-pill" title={tr('seats')}>
            👥 {car.seats || 4} {tr('seats')}
          </span>
          <span className="spec-pill" title={tr('gearbox')}>
            ⚙️ {car.transmission === 'manual' ? tr('manual') : tr('auto')}
          </span>
          <span className="spec-pill" title={tr('fuel')}>
            ⛽ {car.fuel || 'Octane'}
          </span>
          <span className="spec-pill" title="Chauffeur">
            👨‍✈️ {car.withDriver !== false ? tr('with_driver') : tr('self_drive')}
          </span>
        </div>

        {/* Pricing Box */}
        <div className="car-price-box">
          {hasDaily && (
            <div className="price-item">
              <small className="muted small-label">{isBn ? 'দৈনিক ভাড়া' : 'Daily Rate'}</small>
              <div className="price-amount">
                <b>৳{car.pricePerDay.toLocaleString('en-US')}</b>
                <span className="muted small">{tr('per_day')}</span>
              </div>
            </div>
          )}

          {hasMonthly && (
            <div className="price-item">
              <small className="muted small-label">{isBn ? 'মাসিক প্যাকেজ' : 'Monthly Rate'}</small>
              <div className="price-amount">
                <b>৳{car.pricePerMonth.toLocaleString('en-US')}</b>
                <span className="muted small">{tr('per_month')}</span>
              </div>
            </div>
          )}

          {!hasDaily && hasMonthly && (
            <div className="price-item price-notice">
              <span className="notice-chip">{tr('monthly_only')}</span>
            </div>
          )}

          {hasDaily && !hasMonthly && (
            <div className="price-item price-notice">
              <span className="notice-chip">{tr('daily_only')}</span>
            </div>
          )}

          {!hasDaily && !hasMonthly && (
            <div className="price-item price-item-request">
              <small className="muted small-label">{isBn ? 'ভাড়ার পরিমাণ' : 'Pricing'}</small>
              <span className="price-request-badge">{tr('price_on_request')}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <Link href={`/${locale}/fleet/${car.slug}`} className="btn btn-sm btn-outline">
            {tr('view_details')}
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-wa-card"
            title="Book instantly on WhatsApp"
          >
            <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden>
              <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.8 1.5 5.6 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.4 1.1 1.2-4.2-.3-.4a10 10 0 0 1-1.6-5.4C5.4 9.9 10.1 5.3 16 5.3S26.6 9.9 26.6 15.5 21.9 25.7 16 25.7zm5.8-7.5c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2 2.2 3.4 5.4 4.7c2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.4z" />
            </svg>
            <span>{tr('book_whatsapp')}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export function ServiceCard({ s, locale }: { s: any; locale: Locale }) {
  return (
    <Link href={`/${locale}/services/${s.slug}`} className={`card service-card a-${s.accent || 'gold'}`}>
      <div className="service-top-row">
        <div className="s-icon">{s.icon || '🚗'}</div>
        {s.startingPrice && <span className="s-price-badge">{s.startingPrice}</span>}
      </div>
      <h3 className="s-title">{s.title}</h3>
      <p className="muted s-summary">{s.summary}</p>
      {s.highlights && s.highlights.length > 0 && (
        <ul className="s-mini-highlights">
          {s.highlights.slice(0, 3).map((h: any, i: number) => (
            <li key={i}>✓ {h.label}</li>
          ))}
        </ul>
      )}
      <div className="s-action-row">
        <span className="s-learn-more">{locale === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore Service'}</span>
        <span className="s-arrow">→</span>
      </div>
    </Link>
  )
}

export function FacilityCard({ f }: { f: any }) {
  return (
    <div className={`card facility-card a-${f.accent || 'gold'}`}>
      <div className="s-icon facility-icon">{f.icon || '✨'}</div>
      <h3 className="facility-title">{f.title}</h3>
      <p className="muted small facility-text">{f.text}</p>
    </div>
  )
}
