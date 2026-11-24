'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CarCard } from './Cards'
import { CarArt } from './CarArt'
import { cardUrl } from '@/lib/media'
import { buildWhatsAppUrl, t, type Locale } from '@/lib/i18n'
import { getCategoryLabel } from '@/lib/categories'

export function FleetBrowser({
  initialCars,
  locale,
  categories,
  initialCategory = '',
  initialQuery = '',
  whatsappNumber,
}: {
  initialCars: any[]
  locale: Locale
  categories: { value: string; label: string }[]
  initialCategory?: string
  initialQuery?: string
  whatsappNumber?: string
}) {
  const tr = t(locale)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [sortBy, setSortBy] = useState<string>('featured')

  const phone = whatsappNumber || '8801625347735'
  const isBn = locale === 'bn'

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let result = [...initialCars]

    // Category filter
    if (activeCategory) {
      result = result.filter((c) => c.category === activeCategory)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.brand?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q),
      )
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const pA = a.pricePerDay || a.pricePerMonth ? (a.pricePerDay || a.pricePerMonth / 30) : 999999
        const pB = b.pricePerDay || b.pricePerMonth ? (b.pricePerDay || b.pricePerMonth / 30) : 999999
        return pA - pB
      })
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const pA = a.pricePerDay || a.pricePerMonth ? (a.pricePerDay || a.pricePerMonth / 30) : 0
        const pB = b.pricePerDay || b.pricePerMonth ? (b.pricePerDay || b.pricePerMonth / 30) : 0
        return pB - pA
      })
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else {
      // featured
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return (a.order || 10) - (b.order || 10)
      })
    }

    return result
  }, [initialCars, activeCategory, searchQuery, sortBy])

  const resetFilters = () => {
    setActiveCategory('')
    setSearchQuery('')
    setSortBy('featured')
  }

  return (
    <div className="fleet-browser">
      {/* Controls Bar: Search, Category Pills, View Mode Switch, Sort */}
      <div className="fleet-controls-card">
        {/* Top row: Search input + View switcher + Sort dropdown */}
        <div className="fleet-search-sort-row">
          <div className="fleet-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr('search_placeholder')}
              className="fleet-search-input"
              aria-label={tr('search_placeholder')}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                aria-label="Clear"
              >
                ✕
              </button>
            )}
          </div>

          <div className="fleet-view-sort-group">
            {/* View Mode Switcher */}
            <div className="view-switch-tabs" role="tablist" aria-label="View Mode">
              <button
                role="tab"
                aria-selected={viewMode === 'cards'}
                className={`view-tab-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                title={tr('view_mode_cards')}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span className="tab-label">{tr('view_mode_cards')}</span>
              </button>

              <button
                role="tab"
                aria-selected={viewMode === 'table'}
                className={`view-tab-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title={tr('view_mode_table')}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                </svg>
                <span className="tab-label">{tr('view_mode_table')}</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="sort-box">
              <label htmlFor="fleet-sort-select" className="sr-only">
                {tr('sort_by')}
              </label>
              <select
                id="fleet-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="fleet-sort-select"
              >
                <option value="featured">{tr('sort_featured')}</option>
                <option value="price-asc">{tr('sort_price_low')}</option>
                <option value="price-desc">{tr('sort_price_high')}</option>
                <option value="name">{tr('sort_name')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="fleet-category-scroll">
          <button
            className={`cat-pill ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            {tr('all')}
            <span className="pill-count">{initialCars.length}</span>
          </button>

          {categories.map((c) => {
            const count = initialCars.filter((car) => car.category === c.value).length
            return (
              <button
                key={c.value}
                className={`cat-pill ${activeCategory === c.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.value)}
              >
                {c.label}
                {count > 0 && <span className="pill-count">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="fleet-results-info">
        <span className="results-count muted">
          {isBn
            ? `মোট ${filteredCars.length}টি গাড়ি প্রদর্শিত হচ্ছে`
            : `Showing ${filteredCars.length} vehicle${filteredCars.length === 1 ? '' : 's'}`}
          {activeCategory && ` in ${getCategoryLabel(activeCategory, locale)}`}
        </span>
        {(activeCategory || searchQuery) && (
          <button onClick={resetFilters} className="btn-link-reset small">
            {isBn ? 'ফিল্টার রিসেট করুন ↺' : 'Reset Filters ↺'}
          </button>
        )}
      </div>

      {/* Results View */}
      {filteredCars.length === 0 ? (
        <div className="fleet-empty-state card">
          <span className="empty-icon">🚗</span>
          <h3>{tr('no_results')}</h3>
          <p className="muted small">
            {isBn
              ? 'অনুগ্রহ করে অনুসন্ধানের শব্দ পরিবর্তন করুন অথবা সরাসরি আমাদের সাথে হোয়াটসঅ্যাপে কথা বলুন।'
              : 'Try clearing your filters or message our 24/7 concierge for customized vehicle sourcing.'}
          </p>
          <div className="empty-actions">
            <button className="btn btn-sm btn-gold" onClick={resetFilters}>
              {isBn ? 'সব গাড়ি দেখুন' : 'View All Vehicles'}
            </button>
            <a
              href={buildWhatsAppUrl({ phone, locale })}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-wa-card"
            >
              {tr('whatsapp_chat')}
            </a>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Photo Cards View */
        <div className="grid g3 fleet-cards-grid">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id || car.slug}
              car={car}
              locale={locale}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      ) : (
        /* Comparison Table View */
        <div className="fleet-table-wrapper card">
          <table className="fleet-table" aria-label="Vehicle Comparison Table">
            <thead>
              <tr>
                <th scope="col">{tr('table_vehicle')}</th>
                <th scope="col">{tr('table_model')}</th>
                <th scope="col">{tr('table_category')}</th>
                <th scope="col">{tr('table_specs')}</th>
                <th scope="col">{tr('table_daily')}</th>
                <th scope="col">{tr('table_monthly')}</th>
                <th scope="col" className="text-right">
                  {tr('table_action')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => {
                const img = cardUrl(car.image)
                const categoryLabel = getCategoryLabel(car.category || 'sedan', locale)
                const yearText = car.yearRange || car.year || '—'
                const waUrl = buildWhatsAppUrl({
                  phone,
                  carName: car.name,
                  yearOrRange: yearText,
                  category: categoryLabel,
                  locale,
                })

                const hasDaily = typeof car.pricePerDay === 'number' && car.pricePerDay > 0
                const hasMonthly = typeof car.pricePerMonth === 'number' && car.pricePerMonth > 0

                return (
                  <tr key={car.id || car.slug} className="fleet-table-row">
                    {/* Vehicle Photo + Title */}
                    <td className="td-vehicle">
                      <div className="table-car-cell">
                        <div className="table-car-thumb">
                          {img ? (
                            <Image src={img} alt={car.name} fill sizes="80px" className="object-cover" />
                          ) : (
                            <CarArt className="table-thumb-art" />
                          )}
                        </div>
                        <div className="table-car-info">
                          <Link href={`/${locale}/fleet/${car.slug}`} className="table-car-name">
                            {car.name}
                          </Link>
                          <span className="table-car-brand muted small">{car.brand || 'Automotive'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Model Year or Range */}
                    <td className="td-model">
                      <span className="badge-model">{yearText}</span>
                    </td>

                    {/* Category */}
                    <td className="td-category">
                      <span className="chip chip-table">{categoryLabel}</span>
                    </td>

                    {/* Key Specs */}
                    <td className="td-specs">
                      <div className="table-specs-list">
                        <span>👥 {car.seats || 4}</span>
                        <span>⚙️ {car.transmission === 'manual' ? tr('manual') : tr('auto')}</span>
                        <span>⛽ {car.fuel || 'Octane'}</span>
                      </div>
                    </td>

                    {/* Daily Rate */}
                    <td className="td-daily">
                      {hasDaily ? (
                        <div className="price-tag">
                          <b>৳{car.pricePerDay.toLocaleString('en-US')}</b>
                          <small className="muted">{tr('per_day')}</small>
                        </div>
                      ) : (
                        <span className="price-notice-pill">{hasMonthly ? tr('monthly_only') : tr('price_on_request')}</span>
                      )}
                    </td>

                    {/* Monthly Rate */}
                    <td className="td-monthly">
                      {hasMonthly ? (
                        <div className="price-tag">
                          <b>৳{car.pricePerMonth.toLocaleString('en-US')}</b>
                          <small className="muted">{tr('per_month')}</small>
                        </div>
                      ) : (
                        <span className="price-notice-pill">{hasDaily ? tr('daily_only') : tr('price_on_request')}</span>
                      )}
                    </td>

                    {/* Booking Action */}
                    <td className="td-action text-right">
                      <div className="table-actions-cell">
                        <Link
                          href={`/${locale}/fleet/${car.slug}`}
                          className="btn btn-xs btn-outline"
                          title="View Vehicle Details"
                        >
                          {tr('view_details')}
                        </Link>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-xs btn-wa-table"
                          title="Book on WhatsApp"
                        >
                          <svg viewBox="0 0 32 32" width="14" height="14" fill="currentColor" aria-hidden>
                            <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.8 1.5 5.6 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.4 1.1 1.2-4.2-.3-.4a10 10 0 0 1-1.6-5.4C5.4 9.9 10.1 5.3 16 5.3S26.6 9.9 26.6 15.5 21.9 25.7 16 25.7zm5.8-7.5c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2 2.2 3.4 5.4 4.7c2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.4z" />
                          </svg>
                          <span className="wa-text-hide">WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
