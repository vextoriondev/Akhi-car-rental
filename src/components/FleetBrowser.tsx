'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CarCard, NoPhoto } from './CarCard'
import { Icon, WhatsAppIcon } from './Icons'
import { t, type Locale } from '@/lib/i18n'
import { getCategoryLabel } from '@/lib/categories'
import { carTitle, greetingUrl, money } from '@/lib/format'
import type { Car } from '@/lib/types'

type Opt = { value: string; label: string }
const SORTS = ['featured', 'price-asc', 'price-desc', 'name'] as const

/** Filters live in the address bar, so results can be shared, bookmarked and linked to. */
export function FleetBrowser({
  cars,
  locale,
  categories,
  services,
  whatsapp,
}: {
  cars: Car[]
  locale: Locale
  categories: Opt[]
  services: Opt[]
  whatsapp: string
}) {
  const tr = t(locale)
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const brand = params.get('brand') ?? ''
  const category = params.get('category') ?? ''
  const service = params.get('service') ?? ''
  const sort = SORTS.find((s) => s === params.get('sort')) ?? 'featured'
  const view = params.get('view') === 'table' ? 'table' : 'cards'

  const [text, setText] = useState(q)
  const [filtersOpen, setFiltersOpen] = useState(false)
  useEffect(() => setText((current) => (current.trim() === q ? current : q)), [q])

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    window.history.replaceState(null, '', `${window.location.pathname}${next.size ? `?${next}` : ''}`)
  }
  const reset = () => {
    setText('')
    update({ q: '', brand: '', category: '', service: '', sort: '' })
  }

  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const results = cars.filter((c) => {
    if (brand && c.brand !== brand) return false
    if (category && c.category !== category) return false
    if (service && !c.serviceSlugs.includes(service)) return false
    const haystack =
      `${c.name} ${c.brand} ${c.years} ${c.category} ${getCategoryLabel(c.category, locale)} ${c.slug.replace(/-/g, ' ')}`.toLowerCase()
    return words.every((w) => haystack.includes(w))
  })
  if (sort === 'name') results.sort((a, b) => carTitle(a).localeCompare(carTitle(b), locale))
  else if (sort === 'price-asc' || sort === 'price-desc') {
    const dir = sort === 'price-asc' ? 1 : -1
    // Vehicles without a daily fare always go last.
    results.sort((a, b) => {
      if (!a.pricePerDay || !b.pricePerDay) return Number(!a.pricePerDay) - Number(!b.pricePerDay)
      return (a.pricePerDay - b.pricePerDay) * dir
    })
  }

  const brands = [...new Set(cars.map((c) => c.brand))]
  const filtered = Boolean(q || brand || category || service)
  const activeCount = [brand, category, service].filter(Boolean).length

  const select = (key: string, label: string, value: string, options: Opt[], all?: string) => (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => update({ [key]: e.target.value })}>
        {all !== undefined && <option value="">{all}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )

  return (
    <div className="fleet">
      <div className="fleet-controls">
        <div className="fleet-top">
          <div className="fleet-search">
            <Icon name="search" />
            <input
              type="search"
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                update({ q: e.target.value.trim() })
              }}
              placeholder={tr('search_placeholder')}
              aria-label={tr('search_label')}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline filter-toggle"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="fleet-filters"
          >
            <Icon name="filter" /> {tr('filters')}
            {activeCount > 0 && <span className="count">{activeCount}</span>}
          </button>
          <div className="view-switch" role="group" aria-label={tr('view_mode')}>
            <button type="button" aria-pressed={view === 'cards'} onClick={() => update({ view: '' })}>
              <Icon name="grid" /> {tr('view_cards')}
            </button>
            <button type="button" aria-pressed={view === 'table'} onClick={() => update({ view: 'table' })}>
              <Icon name="rows" /> {tr('view_table')}
            </button>
          </div>
        </div>

        <div id="fleet-filters" className={`fleet-filters${filtersOpen ? ' is-open' : ''}`}>
          <div className="chips" role="group" aria-label={tr('brand_label')}>
            {['', ...brands].map((b) => (
              <button key={b || 'all'} type="button" className="chip" aria-pressed={brand === b} onClick={() => update({ brand: b })}>
                {b || tr('all_brands')}
                <span className="count">{b ? cars.filter((c) => c.brand === b).length : cars.length}</span>
              </button>
            ))}
          </div>
          <div className="fleet-selects">
            {select('category', tr('category_label'), category, categories, tr('all_categories'))}
            {select('service', tr('f_service'), service, services, tr('all_services'))}
            {select('sort', tr('sort_by'), sort === 'featured' ? '' : sort, [
              { value: '', label: tr('sort_featured') },
              { value: 'price-asc', label: tr('sort_price_low') },
              { value: 'price-desc', label: tr('sort_price_high') },
              { value: 'name', label: tr('sort_name') },
            ])}
          </div>
        </div>
      </div>

      <div className="fleet-status">
        <p aria-live="polite">{tr('showing', { n: results.length, total: cars.length })}</p>
        {filtered && <button type="button" className="text-link" onClick={reset}>{tr('reset')}</button>}
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <h2>{cars.length ? tr('no_results') : tr('empty_fleet')}</h2>
          {cars.length > 0 && <p>{tr('no_results_sub')}</p>}
          <div className="empty-actions">
            {filtered && <button type="button" className="btn btn-gold" onClick={reset}>{tr('reset')}</button>}
            <a className="btn btn-wa" href={greetingUrl(whatsapp, locale)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> {tr('whatsapp_chat')}
            </a>
          </div>
        </div>
      ) : view === 'cards' ? (
        <>
          <h2 className="sr-only">{tr('nav_fleet')}</h2>
          <div className="car-grid">
            {results.map((car, i) => (
              <CarCard key={car.id} car={car} locale={locale} whatsapp={whatsapp} eager={i < 3} />
            ))}
          </div>
        </>
      ) : (
        <div className="table-wrap">
          <table className="fare-table">
            <caption className="sr-only">{tr('table_caption')}</caption>
            <thead>
              <tr>
                <th scope="col">{tr('table_vehicle')}</th>
                <th scope="col">{tr('model_year')}</th>
                <th scope="col">{tr('category_label')}</th>
                <th scope="col">{tr('seats_label')}</th>
                <th scope="col">{tr('daily_fare')}</th>
                <th scope="col">{tr('monthly_fare')}</th>
                <th scope="col"><span className="sr-only">{tr('table_action')}</span></th>
              </tr>
            </thead>
            <tbody>
              {results.map((car) => (
                <tr key={car.id}>
                  <th scope="row">
                    <span className="table-thumb">
                      {car.photo ? <Image src={car.photo.thumb} alt="" fill sizes="72px" /> : <NoPhoto brand={car.brand} label={tr('photo_on_request')} compact />}
                    </span>
                    <span>
                      <Link href={`/${locale}/fleet/${car.slug}`}>{car.name}</Link>
                      <small>{car.brand} · {car.available ? tr('available') : tr('unavailable')}</small>
                    </span>
                  </th>
                  <td data-label={tr('model_year')}>{car.years || '—'}</td>
                  <td data-label={tr('category_label')}>{getCategoryLabel(car.category, locale)}</td>
                  <td data-label={tr('seats_label')}>{car.seats}</td>
                  <td data-label={tr('daily_fare')}>{car.pricePerDay ? <b>{money(car.pricePerDay)}</b> : tr('price_on_request')}</td>
                  <td data-label={tr('monthly_fare')}>{car.pricePerMonth ? <b>{money(car.pricePerMonth)}</b> : tr('price_on_request')}</td>
                  <td>
                    <Link className="btn btn-outline btn-sm" href={`/${locale}/fleet/${car.slug}`}>
                      {tr('view_details')}<span className="sr-only">: {carTitle(car)}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="fare-note">{tr('fare_note')}</p>
    </div>
  )
}
