'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { LangSwitch } from './LangSwitch'
import { Icon, WhatsAppIcon } from './Icons'
import { t, type Locale } from '@/lib/i18n'
import { telHref } from '@/lib/site'
import { greetingUrl } from '@/lib/format'
import type { Photo } from '@/lib/types'

export function Header({
  locale,
  siteName,
  logo,
  phone,
  whatsapp,
}: {
  locale: Locale
  siteName: string
  logo: Photo | null
  phone: string
  whatsapp: string
}) {
  const tr = t(locale)
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  // While the drawer is open: lock the page behind it, close on Escape or on a wide screen.
  useEffect(() => {
    if (!open) return
    const wide = window.matchMedia('(min-width: 1101px)')
    const close = () => setOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      close()
      toggle.current?.focus()
    }
    document.body.classList.add('no-scroll')
    document.getElementById('main-content')?.setAttribute('inert', '')
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', close)
    return () => {
      document.body.classList.remove('no-scroll')
      document.getElementById('main-content')?.removeAttribute('inert')
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', close)
    }
  }, [open])

  const nav = [
    { href: '', label: tr('nav_home') },
    { href: '/fleet', label: tr('nav_fleet') },
    { href: '/services', label: tr('nav_services') },
    { href: '/facilities', label: tr('nav_facilities') },
    { href: '/about', label: tr('nav_about') },
    { href: '/contact', label: tr('nav_contact') },
  ]
  const isActive = (href: string) =>
    href === '' ? pathname === `/${locale}` : pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`)

  const links = nav.map(({ href, label }) => (
    <Link
      key={href}
      href={`/${locale}${href}`}
      aria-current={isActive(href) ? 'page' : undefined}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  ))

  return (
    <>
      <header className={`header${scrolled || open ? ' is-solid' : ''}`}>
        <div className="container header-in">
          <Link href={`/${locale}`} className="header-logo" aria-label={siteName}>
            <Logo siteName={siteName} logo={logo} />
          </Link>

          <nav className="nav" aria-label={tr('nav_main')}>
            {links}
          </nav>

          <div className="header-actions">
              <LangSwitch locale={locale} label={tr('language')} />
            <a className="header-phone" href={telHref(phone)} aria-label={`${tr('call_now')} ${phone}`}>
              <Icon name="phone" />
            </a>
            <Link className="btn btn-gold btn-sm header-cta" href={`/${locale}/contact`}>
              {tr('book_now')}
            </Link>
            <button
              ref={toggle}
              type="button"
              className="menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? tr('menu_close') : tr('menu_open')}
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`drawer${open ? ' is-open' : ''}`} inert={!open}>
        <nav className="container drawer-nav" aria-label={tr('nav_main')}>
          {links}
        </nav>
        <div className="container drawer-actions">
          <a className="btn btn-wa" href={greetingUrl(whatsapp, locale)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> {tr('whatsapp_chat')}
          </a>
          <a className="btn btn-outline" href={telHref(phone)}>
            <Icon name="phone" /> {phone}
          </a>
        </div>
      </div>
    </>
  )
}
