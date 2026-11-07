import Link from 'next/link'
import Image from 'next/image'
import { CarArt } from './CarArt'
import { cardUrl } from '@/lib/payload'
import type { Locale, T } from '@/lib/i18n'

const fmt = (n?: number | null) => (n ? `৳${n.toLocaleString('en-US')}` : '')

export function CarCard({ car, locale, tr }: { car: any; locale: Locale; tr: T }) {
  const img = cardUrl(car.image)
  return (
    <Link href={`/${locale}/fleet/${car.slug}`} className={`card car-card a-${car.accent || 'violet'}`}>
      <div className="car-media">
        {img ? <Image src={img} alt={car.name} fill sizes="(max-width:700px) 100vw, 360px" /> : <CarArt />}
        <span className="chip">{car.category}</span>
        {!car.available && <span className="chip chip-off">{tr('unavailable')}</span>}
      </div>
      <div className="card-body">
        <h3>{car.name}</h3>
        <p className="muted small">
          {car.seats} {tr('seats')} · {car.transmission === 'manual' ? tr('manual') : tr('auto')} ·{' '}
          {car.withDriver ? tr('with_driver') : tr('self_drive')}
        </p>
        <div className="price">
          <b>{fmt(car.pricePerDay)}</b>
          <span className="muted small">{tr('per_day')}</span>
          {car.pricePerMonth ? (
            <span className="muted small"> · {fmt(car.pricePerMonth)} {tr('per_month')}</span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export function ServiceCard({ s, locale }: { s: any; locale: Locale }) {
  return (
    <Link href={`/${locale}/services/${s.slug}`} className={`card service-card a-${s.accent || 'violet'}`}>
      <div className="s-icon">{s.icon || '🚗'}</div>
      <h3>{s.title}</h3>
      <p className="muted">{s.summary}</p>
      {s.startingPrice && <p className="s-price">{s.startingPrice}</p>}
      <span className="arrow">→</span>
    </Link>
  )
}
