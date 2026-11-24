'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { LangSwitch } from './LangSwitch'
import { buildWhatsAppUrl, t, type Locale } from '@/lib/i18n'

export function Header({
  locale,
  whatsappNumber,
}: {
  locale: Locale
  whatsappNumber?: string
}) {
  const tr = t(locale)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const phone = whatsappNumber || '8801625347735'
  const waUrl = buildWhatsAppUrl({ phone, locale })

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const nav = [
    { href: '', label: tr('nav_home') },
    { href: '/fleet', label: tr('nav_fleet') },
    { href: '/services', label: tr('nav_services') },
    { href: '/facilities', label: tr('nav_facilities') },
    { href: '/about', label: tr('nav_about') },
    { href: '/contact', label: tr('nav_contact') },
  ]

  const isActive = (href: string) => {
    const target = `/${locale}${href}`
    if (href === '') return pathname === `/${locale}` || pathname === `/${locale}/`
    return pathname.startsWith(target)
  }

  return (
    <>
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-in">
          <Link href={`/${locale}`} aria-label="Akhi Car Rental" className="header-logo-link">
            <Logo locale={locale} />
          </Link>

          <nav className="nav" aria-label="Main Navigation">
            {nav.map(({ href, label }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={`/${locale}${href}`}
                  className={`nav-link ${active ? 'nav-link-active' : ''}`}
                >
                  {label}
                  {active && <span className="nav-indicator" />}
                </Link>
              )
            })}
          </nav>

          <div className="header-right">
            <LangSwitch locale={locale} />

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-wa-header"
              aria-label="WhatsApp Booking"
            >
              <span className="wa-pulse-dot" />
              <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden>
                <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.8 1.5 5.6 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.4 1.1 1.2-4.2-.3-.4a10 10 0 0 1-1.6-5.4C5.4 9.9 10.1 5.3 16 5.3S26.6 9.9 26.6 15.5 21.9 25.7 16 25.7zm5.8-7.5c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2 2.2 3.4 5.4 4.7c2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.4z" />
              </svg>
              <span>{tr('whatsapp_chat')}</span>
            </a>

            <Link className="btn btn-sm btn-gold header-cta" href={`/${locale}/contact`}>
              {tr('book_now')}
            </Link>

            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-inner container">
          <nav className="mobile-nav-links">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                className={`mobile-link ${isActive(href) ? 'mobile-link-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="drawer-actions">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-wa-drawer"
              onClick={() => setMenuOpen(false)}
            >
              <span className="wa-pulse-dot" />
              {tr('whatsapp_chat')}
            </a>
            <Link
              className="btn btn-gold btn-block"
              href={`/${locale}/contact`}
              onClick={() => setMenuOpen(false)}
            >
              {tr('book_now')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
