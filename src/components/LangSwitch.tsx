'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`
  const swap = (to: Locale) => pathname.replace(/^\/(en|bn)/, `/${to}`)
  return (
    <div className="lang">
      <Link href={swap('en')} className={locale === 'en' ? 'on' : ''}>EN</Link>
      <Link href={swap('bn')} className={locale === 'bn' ? 'on' : ''}>বাং</Link>
    </div>
  )
}
