import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CarDetailGallery } from '@/components/CarDetailGallery'
import { CarCard } from '@/components/Cards'
import { InquiryForm } from '@/components/InquiryForm'
import { formLabels, formOptions } from '@/lib/form'
import { getCar, getSimilarCars, getSettings, mediaUrl } from '@/lib/payload'
import { buildWhatsAppUrl, t, type Locale } from '@/lib/i18n'
import { getCategoryLabel } from '@/lib/categories'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const car: any = await getCar(locale, slug)
  if (!car) return { title: 'Vehicle Not Found' }
  const isBn = locale === 'bn'
  return {
    title: `${car.name} (${car.yearRange || car.year || ''})`,
    description:
      car.description ||
      (isBn
        ? `${car.name} ভাড়া নিন আখি কার রেন্টাল থেকে। সেরা মূল্যে পেশাদার ড্রাইভারসহ দৈনিক ও মাসিক রেন্টাল।`
        : `Rent ${car.name} in Dhaka with verified chauffeur. Daily & monthly packages from Akhi Car Rental.`),
  }
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const car: any = await getCar(locale, slug)
  if (!car) notFound()

  const tr = t(locale)
  const isBn = locale === 'bn'
  const categoryLabel = getCategoryLabel(car.category || 'sedan', locale)
  const yearText = car.yearRange || car.year || ''

  const [formOpts, similarCars, settings]: any = await Promise.all([
    formOptions(locale),
    getSimilarCars(locale, car.category, car.slug),
    getSettings(locale),
  ])

  const whatsappNumber = settings?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'
  const waUrl = buildWhatsAppUrl({
    phone: whatsappNumber,
    carName: car.name,
    yearOrRange: yearText,
    category: categoryLabel,
    locale,
  })

  // Extract images
  const imgs: string[] = [car.image, ...(car.gallery || []).map((g: any) => g.image)]
    .map(mediaUrl)
    .filter(Boolean) as string[]

  const hasDaily = typeof car.pricePerDay === 'number' && car.pricePerDay > 0
  const hasMonthly = typeof car.pricePerMonth === 'number' && car.pricePerMonth > 0

  return (
    <div className={`container page car-detail-page a-${car.accent || 'gold'}`}>
      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="crumb-link">
          {tr('nav_home')}
        </Link>
        <span className="crumb-sep">/</span>
        <Link href={`/${locale}/fleet`} className="crumb-link">
          {tr('nav_fleet')}
        </Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{car.name}</span>
      </nav>

      {/* Main Detail Grid: Left (Gallery) & Right (Vehicle Info & Booking) */}
      <div className="detail-layout">
        {/* Left: Gallery */}
        <div className="detail-gallery-column">
          <CarDetailGallery images={imgs} carName={car.name} accent={car.accent || 'gold'} />
        </div>

        {/* Right: Info & Pricing */}
        <div className="detail-info-column">
          <div className="detail-header-badges">
            <span className="chip chip-cat">{categoryLabel}</span>
            {car.available === false ? (
              <span className="chip chip-off">{tr('unavailable')}</span>
            ) : (
              <span className="chip chip-available">
                <span className="pulse-dot" />
                {tr('available')}
              </span>
            )}
            {yearText && <span className="chip chip-year">{yearText}</span>}
          </div>

          <h1 className="detail-car-title">{car.name}</h1>
          <p className="detail-car-brand muted">{car.brand || 'Automotive'}</p>

          {/* Pricing Highlight Card */}
          <div className="detail-price-card">
            <div className="detail-price-grid">
              {hasDaily && (
                <div className="detail-price-item">
                  <span className="muted small">{isBn ? 'দৈনিক রেট' : 'Daily Rental'}</span>
                  <div className="detail-price-val">
                    <b>৳{car.pricePerDay.toLocaleString('en-US')}</b>
                    <span className="muted small">{tr('per_day')}</span>
                  </div>
                </div>
              )}

              {hasMonthly && (
                <div className="detail-price-item">
                  <span className="muted small">{isBn ? 'মাসিক প্যাকেজ' : 'Monthly Dedicated'}</span>
                  <div className="detail-price-val">
                    <b>৳{car.pricePerMonth.toLocaleString('en-US')}</b>
                    <span className="muted small">{tr('per_month')}</span>
                  </div>
                </div>
              )}

              {!hasDaily && hasMonthly && (
                <div className="detail-price-item">
                  <span className="price-notice-pill">{tr('monthly_only')}</span>
                </div>
              )}

              {hasDaily && !hasMonthly && (
                <div className="detail-price-item">
                  <span className="price-notice-pill">{tr('daily_only')}</span>
                </div>
              )}

              {!hasDaily && !hasMonthly && (
                <div className="detail-price-item">
                  <span className="muted small">{isBn ? 'ভাড়ার পরিমাণ' : 'Rental Rates'}</span>
                  <div className="detail-price-val">
                    <b>{tr('price_on_request')}</b>
                  </div>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="detail-wa-action">
              <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-wa-block">
                <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden>
                  <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.8 1.5 5.6 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.4 1.1 1.2-4.2-.3-.4a10 10 0 0 1-1.6-5.4C5.4 9.9 10.1 5.3 16 5.3S26.6 9.9 26.6 15.5 21.9 25.7 16 25.7zm5.8-7.5c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2 2.2 3.4 5.4 4.7c2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.4z" />
                </svg>
                <span>{tr('book_whatsapp')}</span>
              </a>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="detail-specs-section">
            <h3 className="section-subheading">{isBn ? 'গাড়ির স্পেসিফিকেশন' : 'Technical Specifications'}</h3>
            <ul className="detail-specs-grid">
              <li>
                <span className="spec-label muted">{tr('seats')}</span>
                <strong className="spec-value">👥 {car.seats || 4} Passengers</strong>
              </li>
              <li>
                <span className="spec-label muted">{tr('bags')}</span>
                <strong className="spec-value">🧳 {car.luggage ?? 2} Luggage Bags</strong>
              </li>
              <li>
                <span className="spec-label muted">{tr('gearbox')}</span>
                <strong className="spec-value">⚙️ {car.transmission === 'manual' ? tr('manual') : tr('auto')}</strong>
              </li>
              <li>
                <span className="spec-label muted">{tr('fuel')}</span>
                <strong className="spec-value">⛽ {car.fuel || 'Octane'}</strong>
              </li>
              {yearText && (
                <li>
                  <span className="spec-label muted">{tr('year')}</span>
                  <strong className="spec-value">📅 {yearText}</strong>
                </li>
              )}
              {car.color && (
                <li>
                  <span className="spec-label muted">{isBn ? 'রং' : 'Color'}</span>
                  <strong className="spec-value">🎨 {car.color}</strong>
                </li>
              )}
              <li>
                <span className="spec-label muted">{isBn ? 'ড্রাইভার সুবিধা' : 'Driver Service'}</span>
                <strong className="spec-value">👨‍✈️ {car.withDriver !== false ? tr('with_driver') : tr('self_drive')}</strong>
              </li>
            </ul>
          </div>

          {/* Description */}
          {car.description && (
            <div className="detail-desc-section">
              <h3 className="section-subheading">{isBn ? 'গাড়ির বিবরণ' : 'Vehicle Description'}</h3>
              <p className="detail-desc-text prose muted">{car.description}</p>
            </div>
          )}

          {/* Features Checklist */}
          {car.features && car.features.length > 0 && (
            <div className="detail-features-section">
              <h3 className="section-subheading">{tr('features')}</h3>
              <div className="detail-features-pills">
                {car.features.map((f: any, i: number) => (
                  <span key={i} className="feature-pill">
                    ✓ {f.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Booking Terms Callout */}
          <div className="booking-terms-box card">
            <h4>📋 {isBn ? 'বুকিং ও ভাড়ার তথ্যাদি' : 'Booking Terms & Inclusions'}</h4>
            <ul className="terms-list small muted">
              <li>• {isBn ? 'অভিজ্ঞ ও ইউনিফর্মধারী পেশাদার ড্রাইভার অন্তর্ভুক্ত' : 'Professional, verified chauffeur included'}</li>
              <li>• {isBn ? 'জ্বালানি (তেল/গ্যাস) আলোচনা সাপেক্ষে নির্ধারিত হয়' : 'Fuel costs arranged based on route & trip duration'}</li>
              <li>• {isBn ? 'ব্রিজ টোল ও পার্কিং ফি গ্রাহক বহন করবেন' : 'Bridge tolls & parking fees payable on actuals'}</li>
              <li>• {isBn ? 'সার্ভিসিং বা যেকোনো জরুরি প্রয়োজনে ব্যাকআপ রিপ্লেসমেন্ট কার' : 'Immediate backup vehicle provided if needed'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Inquiry Form */}
      <section className="detail-inquiry-section">
        <div className="inquiry-header text-center">
          <span className="eyebrow">{isBn ? 'অনলাইন কোটেশন' : 'INSTANT RESERVATION'}</span>
          <h2>{tr('inquiry_title')}</h2>
          <p className="muted lead-sub">
            {isBn
              ? `"${car.name}" বুকিংয়ের জন্য নিচের ফর্মটি পূরণ করুন বা হোয়াটসঅ্যাপে কথা বলুন।`
              : `Submit your itinerary for "${car.name}" and our fleet manager will confirm rates within 15 minutes.`}
          </p>
        </div>

        <InquiryForm
          services={formOpts.services}
          cars={formOpts.cars}
          defaultCar={String(car.id)}
          whatsapp={whatsappNumber}
          labels={formLabels(tr)}
        />
      </section>

      {/* Similar Vehicles in Fleet */}
      {similarCars && similarCars.length > 0 && (
        <section className="similar-cars-section section">
          <div className="sec-head">
            <div>
              <span className="eyebrow">{categoryLabel}</span>
              <h2>{tr('similar_vehicles')}</h2>
            </div>
            <Link className="link" href={`/${locale}/fleet?category=${car.category}`}>
              {tr('view_all')} →
            </Link>
          </div>
          <div className="grid g3">
            {similarCars.map((simCar: any) => (
              <CarCard
                key={simCar.id || simCar.slug}
                car={simCar}
                locale={locale}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
