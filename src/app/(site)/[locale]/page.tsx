import Link from 'next/link'
import { HeroCarousel, type Slide } from '@/components/HeroCarousel'
import { SearchBar } from '@/components/SearchBar'
import { CarCard, FacilityCard, ServiceCard } from '@/components/Cards'
import {
  getCars,
  getFacilities,
  getHome,
  getServices,
  getSettings,
  getTestimonials,
  mediaUrl,
} from '@/lib/payload'
import { fallbackSlides } from '@/lib/fallback'
import { buildWhatsAppUrl, t, type Locale } from '@/lib/i18n'
import { categoryOptions } from '@/lib/categories'

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const isBn = locale === 'bn'

  const [home, services, cars, reviews, facilities, settings] = await Promise.all([
    getHome(locale),
    getServices(locale),
    getCars(locale, { featured: true, limit: 6 }),
    getTestimonials(locale),
    getFacilities(locale),
    getSettings(locale),
  ])

  const h: any = home
  const s: any = settings
  const whatsappNumber = s?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'
  const waUrl = buildWhatsAppUrl({ phone: whatsappNumber, locale })

  const slides: Slide[] = h?.slides?.length
    ? h.slides.map((slide: any) => ({ ...slide, imageUrl: mediaUrl(slide.image) || slide.imageUrl }))
    : fallbackSlides(locale)

  return (
    <>
      {/* ============================================================
          HERO SECTION with automotive background & quick search
          ============================================================ */}
      <HeroCarousel slides={slides} locale={locale}>
        <div className="hero-search-wrapper">
          <div className="search-header-badge">
            <span className="badge-pulse" />
            <span>{isBn ? 'তাৎক্ষণিক গাড়ি অনুসন্ধান' : 'Find Your Perfect Ride'}</span>
          </div>
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
        </div>
      </HeroCarousel>

      {/* ============================================================
          TRUST METRICS & STATS BAR
          ============================================================ */}
      {h?.stats?.length > 0 && (
        <section className="stats-bar-wrapper">
          <div className="container stats-bar">
            {h.stats.map((stat: any, i: number) => (
              <div key={i} className="stat-card">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          FEATURED VEHICLES (Cars from CMS)
          ============================================================ */}
      <section className="container section">
        <div className="sec-head">
          <div>
            <span className="eyebrow">{isBn ? 'প্রিমিয়াম বহর' : 'HAND-PICKED COLLECTION'}</span>
            <h2>{tr('featured_fleet')}</h2>
            <p className="muted lead-sub">{tr('featured_fleet_sub')}</p>
          </div>
          <Link className="btn btn-outline" href={`/${locale}/fleet`}>
            {tr('view_all')} →
          </Link>
        </div>

        <div className="grid g3">
          {(cars as any[]).map((c) => (
            <CarCard
              key={c.id || c.slug}
              car={c}
              locale={locale}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>

        <div className="section-bottom-action">
          <Link className="btn btn-lg btn-gold" href={`/${locale}/fleet`}>
            {isBn ? 'সকল গাড়ি ও মূল্য তালিকা দেখুন' : 'Explore Entire Fleet & Compare Rates'} →
          </Link>
        </div>
      </section>

      {/* ============================================================
          SERVICES SECTION
          ============================================================ */}
      <section className="container section services-section">
        <div className="sec-head">
          <div>
            <span className="eyebrow">{isBn ? 'আমাদের সেবাসমূহ' : 'COMPREHENSIVE MOBILITY'}</span>
            <h2>{tr('our_services')}</h2>
            <p className="muted lead-sub">{tr('our_services_sub')}</p>
          </div>
          <Link className="btn btn-outline" href={`/${locale}/services`}>
            {tr('view_all')} →
          </Link>
        </div>
        <div className="grid g3">
          {(services as any[]).map((s) => (
            <ServiceCard key={s.id || s.slug} s={s} locale={locale} />
          ))}
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS (4 Simple Steps)
          ============================================================ */}
      <section className="how-it-works-bg">
        <div className="container section">
          <div className="text-center sec-center-head">
            <span className="eyebrow">{isBn ? 'সহজ প্রক্রিয়া' : 'SIMPLE 4-STEP BOOKING'}</span>
            <h2>{tr('how_it_works_title')}</h2>
            <p className="muted lead-sub">{tr('how_it_works_sub')}</p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card card">
              <span className="step-num">{tr('step1_num')}</span>
              <div className="step-icon">🚗</div>
              <h3>{tr('step1_title')}</h3>
              <p className="muted small">{tr('step1_desc')}</p>
            </div>

            <div className="how-step-card card">
              <span className="step-num">{tr('step2_num')}</span>
              <div className="step-icon">💬</div>
              <h3>{tr('step2_title')}</h3>
              <p className="muted small">{tr('step2_desc')}</p>
            </div>

            <div className="how-step-card card">
              <span className="step-num">{tr('step3_num')}</span>
              <div className="step-icon">📋</div>
              <h3>{tr('step3_title')}</h3>
              <p className="muted small">{tr('step3_desc')}</p>
            </div>

            <div className="how-step-card card">
              <span className="step-num">{tr('step4_num')}</span>
              <div className="step-icon">✨</div>
              <h3>{tr('step4_title')}</h3>
              <p className="muted small">{tr('step4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY CHOOSE US / ABOUT BAND
          ============================================================ */}
      <section className="container section">
        <div className="about-band">
          <div className="about-content">
            <span className="eyebrow">{h?.about?.eyebrow || tr('why_us')}</span>
            <h2>{h?.about?.title || tr('why_us')}</h2>
            <p className="lead muted">{h?.about?.text}</p>
            <div className="about-badges">
              <div className="about-badge-item">
                <span className="badge-check">✓</span>
                <span>{isBn ? '১০+ বছরের ফ্লিট অভিজ্ঞতা' : '10+ Years Fleet Operator'}</span>
              </div>
              <div className="about-badge-item">
                <span className="badge-check">✓</span>
                <span>{isBn ? 'কোনো গোপন বা অতিরিক্ত চার্জ নেই' : 'No Hidden Fuel or Toll Charges'}</span>
              </div>
              <div className="about-badge-item">
                <span className="badge-check">✓</span>
                <span>{isBn ? '২৪ ঘণ্টা ব্যাকআপ রিপ্লেসমেন্ট কার' : '24/7 Guaranteed Replacement Car'}</span>
              </div>
            </div>
            <div className="about-cta-row">
              <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-wa-card">
                {tr('whatsapp_chat')}
              </a>
              <Link href={`/${locale}/about`} className="btn btn-outline">
                {tr('nav_about')} →
              </Link>
            </div>
          </div>

          <div className="grid g2 why-cards-grid">
            {(h?.whyUs || []).map((w: any, i: number) => (
              <div key={i} className="card why-card">
                <div className="s-icon why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p className="muted small">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FACILITIES / COMFORT STANDARDS
          ============================================================ */}
      {(facilities as any[]).length > 0 && (
        <section className="container section">
          <div className="sec-head">
            <div>
              <span className="eyebrow">{isBn ? 'আরামদায়ক ভ্রমণ' : 'ONBOARD AMENITIES'}</span>
              <h2>{tr('facilities_title')}</h2>
              <p className="muted lead-sub">{tr('facilities_sub')}</p>
            </div>
            <Link className="btn btn-outline" href={`/${locale}/facilities`}>
              {tr('view_all')} →
            </Link>
          </div>
          <div className="grid g3">
            {(facilities as any[]).slice(0, 6).map((f) => (
              <FacilityCard key={f.id || f.title} f={f} />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          TESTIMONIALS (CMS Managed)
          ============================================================ */}
      {(reviews as any[]).length > 0 && (
        <section className="testimonials-bg">
          <div className="container section">
            <div className="text-center sec-center-head">
              <span className="eyebrow">{isBn ? 'ক্লায়েন্ট রিভিউ' : 'CLIENT EXPERIENCES'}</span>
              <h2>{tr('testimonials')}</h2>
              <p className="muted lead-sub">{tr('testimonials_sub')}</p>
            </div>

            <div className="grid g3">
              {(reviews as any[]).slice(0, 3).map((r) => (
                <figure key={r.id || r.name} className="card quote">
                  <div className="stars">
                    {'★'.repeat(r.rating || 5)}
                    <span className="rating-badge">5.0</span>
                  </div>
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption className="quote-author">
                    <div className="author-avatar">{r.name.charAt(0)}</div>
                    <div>
                      <b>{r.name}</b>
                      <span className="muted small">{r.role}</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          CALL TO ACTION (Instant Quote & WhatsApp)
          ============================================================ */}
      <section className="container section">
        <div className="cta-luxury-card">
          <div className="cta-content">
            <span className="cta-chip">24/7 CONCIERGE HOTLINE</span>
            <h2>{tr('cta_title')}</h2>
            <p className="cta-lead">{tr('cta_text')}</p>
            <div className="cta-actions">
              <Link className="btn btn-lg btn-light" href={`/${locale}/contact`}>
                {tr('book_now')} →
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg btn-wa-cta"
              >
                💬 {tr('whatsapp_chat')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
