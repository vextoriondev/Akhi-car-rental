'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

/** Switches language while keeping the current page and its filters. */
export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`
  const query = useSearchParams().toString()
  const href = (to: Locale) => pathname.replace(/^\/(en|bn)(?=\/|$)/, `/${to}`) + (query ? `?${query}` : '')

  return (
    <div className="lang" role="group" aria-label={label}>
      {locales.map((l) => (
        <Link key={l} href={href(l)} lang={l} hrefLang={l} aria-current={l === locale ? 'true' : undefined}>
          {l === 'en' ? 'EN' : 'বাং'}
        </Link>
      ))}
    </div>
  )
}
