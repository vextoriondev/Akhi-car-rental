import Link from 'next/link'
import { Logo } from './Logo'
import type { Locale, T } from '@/lib/i18n'

export function Footer({ locale, tr, s }: { locale: Locale; tr: T; s: any }) {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <div>
          <Logo locale={locale} />
          <p className="muted">{s?.tagline}</p>
        </div>
        <div className="muted">
          <p>📞 {s?.phone}</p>
          <p>✉️ {s?.email}</p>
          <p>📍 {s?.address}</p>
          <p>🕒 {s?.hours}</p>
        </div>
        <div className="foot-links">
          <Link href={`/${locale}/fleet`}>{tr('nav_fleet')}</Link>
          <Link href={`/${locale}/services`}>{tr('nav_services')}</Link>
          <Link href={`/${locale}/facilities`}>{tr('nav_facilities')}</Link>
          <Link href={`/${locale}/contact`}>{tr('nav_contact')}</Link>
          {s?.facebook && <a href={s.facebook} target="_blank" rel="noreferrer">Facebook</a>}
          {s?.instagram && <a href={s.instagram} target="_blank" rel="noreferrer">Instagram</a>}
        </div>
      </div>
      <div className="container copy muted">
        © {new Date().getFullYear()} {tr('brand')}. {tr('footer_rights')}
      </div>
    </footer>
  )
}
