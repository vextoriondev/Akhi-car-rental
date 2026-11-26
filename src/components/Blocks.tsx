import Image from 'next/image'
import Link from 'next/link'
import { CmsIcon, Icon, WhatsAppIcon, type IconName } from './Icons'
import { getHome } from '@/lib/data'
import { t, type Locale } from '@/lib/i18n'
import { telHref } from '@/lib/site'
import { greetingUrl } from '@/lib/format'
import type { Facility, Photo, Service, Settings } from '@/lib/types'

export function SectionHead({
  eyebrow,
  title,
  text,
  action,
  center = false,
}: {
  eyebrow?: string
  title: string
  text?: string
  action?: { href: string; label: string }
  center?: boolean
}) {
  return (
    <div className={`section-head${center ? ' is-center' : ''}`} data-reveal>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {text && <p className="section-text">{text}</p>}
      </div>
      {action && (
        <Link className="text-link" href={action.href}>
          {action.label} <Icon name="arrow" />
        </Link>
      )}
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  text,
  photo,
  children,
}: {
  eyebrow: string
  title: string
  text?: string
  photo?: Photo | null
  children?: React.ReactNode
}) {
  return (
    <section className={`page-hero${photo ? ' has-photo' : ''}`}>
      {photo && <Image src={photo.url} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" />}
      <div className="container page-hero-in">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {text && <p className="lead">{text}</p>}
        {children}
      </div>
    </section>
  )
}

export function ServiceCard({ service, locale }: { service: Service; locale: Locale }) {
  const tr = t(locale)
  return (
    <article className="service-card" data-reveal>
      <div className="service-media">
        {service.photo && (
          <Image src={service.photo.card} alt="" fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 400px" />
        )}
        <span className="service-icon" aria-hidden="true"><CmsIcon emoji={service.icon} /></span>
      </div>
      <div className="service-body">
        <h3>
          <Link href={`/${locale}/services/${service.slug}`} className="stretched">{service.title}</Link>
        </h3>
        <p>{service.summary}</p>
        {service.startingPrice && <p className="service-price">{service.startingPrice}</p>}
        <span className="text-link" aria-hidden="true">{tr('service_more')} <Icon name="arrow" /></span>
      </div>
    </article>
  )
}

export function FeatureCard({ item }: { item: Pick<Facility, 'icon' | 'title' | 'text'> }) {
  return (
    <article className="feature-card" data-reveal>
      {item.icon && <span className="feature-icon" aria-hidden="true"><CmsIcon emoji={item.icon} /></span>}
      <h3>{item.title}</h3>
      {item.text && <p>{item.text}</p>}
    </article>
  )
}

export function HowItWorks({ locale }: { locale: Locale }) {
  const tr = t(locale)
  const steps = [1, 2, 3, 4] as const
  const icons: IconName[] = ['search', 'clipboard', 'circleCheck', 'key']
  return (
    <ol className="steps">
      {steps.map((n) => (
        <li key={n} data-reveal>
          <span className="step-icon" aria-hidden="true"><Icon name={icons[n - 1]} size={30} /></span>
          <div>
            <h3><span aria-hidden="true">{n.toLocaleString(locale === 'bn' ? 'bn-BD' : 'en-US')}. </span>{tr(`step${n}_title`)}</h3>
            <p>{tr(`step${n}_desc`)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export async function CtaBand({ locale, s }: { locale: Locale; s: Settings }) {
  const tr = t(locale)
  // One of the CMS slide photos decorates the band; without one it is text only.
  const home = await getHome(locale).catch(() => null)
  const photo = home?.slides[1]?.photo ?? home?.slides[0]?.photo

  return (
    <section className="container section">
      <div className={`cta${photo ? ' has-photo' : ''}`} data-reveal>
        {photo && (
          <div className="cta-photo">
            <Image src={photo.card} alt="" fill sizes="(max-width: 900px) 100vw, 440px" />
          </div>
        )}
        <div className="cta-body">
          <h2>{tr('cta_title')}</h2>
          <p>{tr('cta_text')}</p>
          <div className="cta-actions">
            <a className="btn btn-dark" href={greetingUrl(s.whatsapp, locale)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> {tr('whatsapp_chat')}
            </a>
            <Link className="btn btn-ink" href={`/${locale}/contact`}>{tr('book_now')} <Icon name="arrow" /></Link>
            <a className="btn btn-ink" href={telHref(s.phone)}><Icon name="phone" /> {s.phone}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Call and WhatsApp stay one tap away: a bottom bar on phones, a floating button on larger screens. */
export function QuickActions({ locale, s }: { locale: Locale; s: Settings }) {
  const tr = t(locale)
  const wa = greetingUrl(s.whatsapp, locale)
  return (
    <>
      <nav className="action-bar" aria-label={tr('footer_contact')}>
        <a href={telHref(s.phone)}><Icon name="phone" /> {tr('call_now')}</a>
        <a href={wa} className="is-wa" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> {tr('whatsapp')}</a>
        <Link href={`/${locale}/contact`} className="is-gold"><Icon name="calendar" /> {tr('book_now')}</Link>
      </nav>
      <a className="wa-fab" href={wa} target="_blank" rel="noopener noreferrer" aria-label={tr('whatsapp_chat')}>
        <WhatsAppIcon size={28} />
      </a>
    </>
  )
}
