import Link from 'next/link'
import { HeroCarousel, type Slide } from '@/components/HeroCarousel'
import { SearchBar } from '@/components/SearchBar'
import { CarCard, FacilityCard, ServiceCard } from '@/components/Cards'
import { getCars, getFacilities, getHome, getServices, getTestimonials, mediaUrl } from '@/lib/payload'
import { fallbackSlides } from '@/lib/fallback'
import { t, type Locale } from '@/lib/i18n'
import { categoryOptions } from '@/lib/categories'

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const [home, services, cars, reviews, facilities] = await Promise.all([
    getHome(locale),
    getServices(locale),
    getCars(locale, { featured: true, limit: 6 }),
    getTestimonials(locale),
    getFacilities(locale),
  ])
  const h: any = home
  const slides: Slide[] = h?.slides?.length
    ? h.slides.map((s: any) => ({ ...s, imageUrl: mediaUrl(s.image) }))
    : fallbackSlides(locale)

  return (
    <>
      <HeroCarousel slides={slides} locale={locale}>
        <SearchBar
          locale={locale}
          services={(services as any[]).map((s) => ({ value: s.slug, label: s.title }))}
          categories={categoryOptions(locale)}
          labels={{
            placeholder: tr('search_placeholder'),
            service: tr('search_service'),
            category: tr('search_category'),
            btn: tr('search_btn'),
          }}
        />
      </HeroCarousel>

      {h?.stats?.length > 0 && (
        <section className="stats container">
          {h.stats.map((s: any, i: number) => (
            <div key={i}>
              <b className="grad">{s.value}</b>
              <span className="muted">{s.label}</span>
            </div>
          ))}
        </section>
      )}

      <section className="container section">
        <div className="sec-head">
          <div>
            <h2>{tr('our_services')}</h2>
            <p className="muted">{tr('our_services_sub')}</p>
          </div>
          <Link className="link" href={`/${locale}/services`}>{tr('view_all')} →</Link>
        </div>
        <div className="grid g3">
          {(services as any[]).map((s) => <ServiceCard key={s.id} s={s} locale={locale} />)}
        </div>
      </section>

      <section className="container section">
        <div className="sec-head">
          <div>
            <h2>{tr('featured_fleet')}</h2>
            <p className="muted">{tr('featured_fleet_sub')}</p>
          </div>
          <Link className="link" href={`/${locale}/fleet`}>{tr('view_all')} →</Link>
        </div>
        <div className="grid g3">
          {(cars as any[]).map((c) => <CarCard key={c.id} car={c} locale={locale} tr={tr} />)}
        </div>
      </section>

      {(facilities as any[]).length > 0 && (
        <section className="container section">
          <div className="sec-head">
            <div>
              <h2>{tr('facilities_title')}</h2>
              <p className="muted">{tr('facilities_sub')}</p>
            </div>
            <Link className="link" href={`/${locale}/facilities`}>{tr('view_all')} →</Link>
          </div>
          <div className="grid g3">
            {(facilities as any[]).slice(0, 6).map((f) => <FacilityCard key={f.id} f={f} />)}
          </div>
        </section>
      )}

      {h?.about?.title && (
        <section className="container section about-band">
          <div>
            {h.about.eyebrow && <span className="eyebrow">{h.about.eyebrow}</span>}
            <h2>{h.about.title}</h2>
            <p className="lead muted">{h.about.text}</p>
          </div>
          <div className="grid g2 why">
            {(h.whyUs || []).map((w: any, i: number) => (
              <div key={i} className="card why-card">
                <div className="s-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p className="muted small">{w.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(reviews as any[]).length > 0 && (
        <section className="container section">
          <div className="sec-head"><h2>{tr('testimonials')}</h2></div>
          <div className="grid g3">
            {(reviews as any[]).slice(0, 3).map((r) => (
              <figure key={r.id} className="card quote">
                <div className="stars">{'★'.repeat(r.rating || 5)}</div>
                <blockquote>“{r.quote}”</blockquote>
                <figcaption><b>{r.name}</b> <span className="muted small">{r.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="cta">
          <h2>{tr('cta_title')}</h2>
          <p>{tr('cta_text')}</p>
          <Link className="btn btn-lg btn-light" href={`/${locale}/contact`}>{tr('book_now')} →</Link>
        </div>
      </section>
    </>
  )
}
