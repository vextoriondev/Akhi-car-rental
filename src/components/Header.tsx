import Link from 'next/link'
import { Logo } from './Logo'
import { LangSwitch } from './LangSwitch'
import type { Locale, T } from '@/lib/i18n'

export function Header({ locale, tr }: { locale: Locale; tr: T }) {
  const nav = [
    ['', tr('nav_home')],
    ['/fleet', tr('nav_fleet')],
    ['/services', tr('nav_services')],
    ['/about', tr('nav_about')],
    ['/contact', tr('nav_contact')],
  ]
  return (
    <header className="header">
      <div className="container header-in">
        <Link href={`/${locale}`} aria-label="Akhi Rental Solution">
          <Logo locale={locale} />
        </Link>
        <nav className="nav">
          {nav.map(([href, label]) => (
            <Link key={href} href={`/${locale}${href}`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-right">
          <LangSwitch locale={locale} />
          <Link className="btn btn-sm" href={`/${locale}/contact`}>
            {tr('book_now')}
          </Link>
        </div>
      </div>
      <nav className="nav-mobile container">
        {nav.map(([href, label]) => (
          <Link key={href} href={`/${locale}${href}`}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
