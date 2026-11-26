import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { SearchBar } from '@/components/SearchBar'
import { CarCard } from '@/components/CarCard'
import { CtaBand, FeatureCard, HowItWorks, SectionHead, ServiceCard } from '@/components/Blocks'
import { Icon, WhatsAppIcon, type IconName } from '@/components/Icons'
import { getCars, getFacilities, getHome, getServices, getSettings, getTestimonials } from '@/lib/data'
import { t, toLocale } from '@/lib/i18n'
import { categoryOptions } from '@/lib/categories'
import { greetingUrl, money } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const [s, home] = await Promise.all([getSettings(locale), getHome(locale).catch(() => null)])
  return pageMetadata({
    locale,
    path: '',
    description: s.metaDescription || s.tagline,
    image: home?.slides[0]?.photo?.url,
    siteName: s.siteName,
  })
}

export default async function Home({ params }: Props) {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [home, services, cars, facilities, reviews, s] = await Promise.all([
    getHome(locale),
    getServices(locale),
    getCars(locale),
    getFacilities(locale),
    getTestimonials(locale),
    getSettings(locale),
  ])

  const brands = [...new Set(cars.map((c) => c.brand))]
  const featured = cars.filter((c) => c.featured).slice(0, 6)
  const showcase = featured.length ? featured : cars.slice(0, 6)
  const lowest = (key: 'pricePerDay' | 'pricePerMonth') => {
    const values = cars.map((c) => c[key]).filter((v): v is number => v !== null)
    return values.length ? money(Math.min(...values)) : null
  }
  const fromDay = lowest('pricePerDay')
  const fromMonth = lowest('pricePerMonth')
  // Figures come from the live catalogue; staff can replace them with their own in the CMS.
  const cmsIcons: IconName[] = ['shield', 'car', 'calendar', 'clock']
  const strip: { icon: IconName; value: string; label: string }[] = home.stats.length
    ? home.stats.map((x, i) => ({ ...x, icon: cmsIcons[i % cmsIcons.length] }))
    : [
        ...(cars.length
          ? [
              { icon: 'car' as const, value: String(cars.length), label: tr('stat_vehicles') },
              { icon: 'shield' as const, value: String(brands.length), label: tr('stat_brands') },
            ]
          : []),
        { icon: 'calendar', value: tr('strip_plans'), label: tr('strip_plans_label') },
        { icon: 'chat', value: tr('whatsapp'), label: tr('strip_wa_label') },
      ]

  return (
    <>
      {home.slides.length > 0 ? (
        <Hero slides={home.slides} locale={locale} />
      ) : (
        <section className="page-hero">
          <div className="container page-hero-in">
            <h1>{s.siteName}</h1>
            <p className="lead">{s.tagline}</p>
          </div>
        </section>
      )}

      <div className="container search-dock">
        <SearchBar
          locale={locale}
          brands={brands}
          categories={categoryOptions(locale, cars.map((c) => c.category))}
          services={services.map((x) => ({ value: x.slug, label: x.title }))}
        />
      </div>

      {fromDay && (
        <section className="container offer-wrap" aria-label={tr('offer_title')}>
          <div className="offer">
            <p className="offer-seal">
              <span>{tr('offer_badge')}</span>
              <b>{fromDay}</b>
              <span>{tr('per_day')}</span>
            </p>
            <div className="offer-text">
              <h2>{tr('offer_title')}</h2>
              <p>
                {tr('offer_text')} {fromMonth && <b>{fromMonth} {tr('per_month')}</b>}
              </p>
              <small>{tr('fare_note')}</small>
            </div>
            <div className="offer-actions">
              <Link className="btn btn-gold" href={`/${locale}/fleet?view=table`}>{tr('offer_cta')} <Icon name="arrow" /></Link>
              <a className="btn btn-outline" href={greetingUrl(s.whatsapp, locale)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> {tr('whatsapp')}
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="container">
        <ul className="strip">
          {strip.map((x) => (
            <li key={x.label}>
              <Icon name={x.icon} size={40} />
              <b>{x.value}</b>
              <span>{x.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {showcase.length > 0 && (
        <section className="container section">
          <SectionHead
            center
            eyebrow={tr('featured_eyebrow')}
            title={tr('featured_title')}
            text={tr('featured_sub')}
          />
          <div className="car-grid is-swipe">
            {showcase.map((car) => <CarCard key={car.id} car={car} locale={locale} whatsapp={s.whatsapp} />)}
          </div>
          <nav className="brand-strip" aria-label={tr('brands_title')}>
            {brands.map((brand) => {
              const n = cars.filter((c) => c.brand === brand).length
              return (
                <Link key={brand} href={`/${locale}/fleet?brand=${encodeURIComponent(brand)}`}>
                  <b>{brand}</b>
                  <small>{n} {tr(n === 1 ? 'vehicle_one' : 'vehicle_many')}</small>
                </Link>
              )
            })}
          </nav>
          <p className="center-action">
            <Link className="btn btn-gold btn-lg" href={`/${locale}/fleet`}>
              {tr('see_full_fleet')} <Icon name="arrow" />
            </Link>
          </p>
        </section>
      )}

      {services.length > 0 && (
        <section className="band">
          <div className="container section">
            <SectionHead
              eyebrow={tr('services_eyebrow')}
              title={tr('services_title')}
              text={tr('services_sub')}
              action={{ href: `/${locale}/services`, label: tr('view_all') }}
            />
            <div className="card-grid">
              {services.map((x) => <ServiceCard key={x.id} service={x} locale={locale} />)}
            </div>
          </div>
        </section>
      )}

      <section className="container section">
        <div className="how-panel">
          <SectionHead eyebrow={tr('how_eyebrow')} title={tr('how_title')} center />
          <HowItWorks locale={locale} />
        </div>
      </section>

      {(home.about.title || home.whyUs.length > 0) && (
        <section className="container section split">
          <div data-reveal>
            <p className="eyebrow">{home.about.eyebrow || tr('why_eyebrow')}</p>
            <h2>{home.about.title || tr('why_title')}</h2>
            <p className="section-text">{home.about.text}</p>
            <Link href={`/${locale}/about`} className="btn btn-outline">{tr('nav_about')} <Icon name="arrow" /></Link>
          </div>
          <div className="split-cards">
            {home.whyUs.map((w) => <FeatureCard key={w.title} item={w} />)}
          </div>
        </section>
      )}

      {facilities.length > 0 && (
        <section className="band">
          <div className="container section">
            <SectionHead
              eyebrow={tr('facilities_eyebrow')}
              title={tr('facilities_title')}
              text={tr('facilities_sub')}
              action={{ href: `/${locale}/facilities`, label: tr('view_all') }}
            />
            <div className="card-grid">
              {facilities.slice(0, 6).map((f) => <FeatureCard key={f.id} item={f} />)}
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="container section">
          <SectionHead eyebrow={tr('testimonials_eyebrow')} title={tr('testimonials_title')} center />
          <div className="card-grid">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.id} className="feature-card" data-reveal>
                <p className="stars" role="img" aria-label={tr('rating_label', { n: r.rating })}>{'★'.repeat(r.rating)}</p>
                <blockquote>{r.quote}</blockquote>
                <figcaption className="author">
                  <span className="avatar" aria-hidden="true">{r.name.charAt(0)}</span>
                  <span><b>{r.name}</b>{r.role && <small>{r.role}</small>}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <CtaBand locale={locale} s={s} />
    </>
  )
}
