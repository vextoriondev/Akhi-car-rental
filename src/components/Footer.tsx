import Link from 'next/link'
import { Logo } from './Logo'
import { Icon, WhatsAppIcon } from './Icons'
import { t, type Locale } from '@/lib/i18n'
import { telHref } from '@/lib/site'
import { greetingUrl } from '@/lib/format'
import { getCars, getServices } from '@/lib/data'
import { categoryOptions } from '@/lib/categories'
import type { Settings } from '@/lib/types'

export async function Footer({ locale, s }: { locale: Locale; s: Settings }) {
  const tr = t(locale)
  // The footer must render even if the catalogue cannot be read.
  const [services, cars] = await Promise.all([
    getServices(locale).catch(() => []),
    getCars(locale).catch(() => []),
  ])
  const types = categoryOptions(locale, cars.map((c) => c.category))

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href={`/${locale}`} aria-label={s.siteName}>
            <Logo siteName={s.siteName} logo={s.logo} />
          </Link>
          {s.tagline && <p className="footer-tagline">{s.tagline}</p>}
          {s.footerText && <p className="muted">{s.footerText}</p>}
          {s.socials.length > 0 && (
            <ul className="footer-social">
              {s.socials.map((x) => (
                <li key={x.label}>
                  <a href={x.href} target="_blank" rel="noopener noreferrer">
                    {x.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label={tr('footer_explore')}>
          <h2 className="footer-title">{tr('footer_explore')}</h2>
          <ul>
            <li><Link href={`/${locale}/fleet`}>{tr('nav_fleet')}</Link></li>
            {services.slice(0, 4).map((x) => (
              <li key={x.slug}><Link href={`/${locale}/services/${x.slug}`}>{x.title}</Link></li>
            ))}
            <li><Link href={`/${locale}/facilities`}>{tr('nav_facilities')}</Link></li>
            <li><Link href={`/${locale}/about`}>{tr('nav_about')}</Link></li>
          </ul>
        </nav>

        {types.length > 0 && (
          <nav aria-label={tr('footer_types')}>
            <h2 className="footer-title">{tr('footer_types')}</h2>
            <ul>
              {types.map((c) => (
                <li key={c.value}><Link href={`/${locale}/fleet?category=${c.value}`}>{c.label}</Link></li>
              ))}
            </ul>
          </nav>
        )}

        <div>
          <h2 className="footer-title">{tr('footer_contact')}</h2>
          <address>
            <a href={telHref(s.phone)}><Icon name="phone" /> {s.phone}</a>
            <a href={greetingUrl(s.whatsapp, locale)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> {tr('whatsapp')}
            </a>
            <a href={`mailto:${s.email}`}><Icon name="mail" /> {s.email}</a>
            <span><Icon name="pin" /> {s.address}</span>
            {s.hours && <span><Icon name="clock" /> {s.hours}</span>}
          </address>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {s.siteName}. {tr('footer_rights')}
      </div>
    </footer>
  )
}
