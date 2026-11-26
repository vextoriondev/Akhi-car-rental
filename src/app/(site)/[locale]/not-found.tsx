'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { t, toLocale } from '@/lib/i18n'

export default function NotFound() {
  const locale = toLocale(String(useParams()?.locale ?? 'en'))
  const tr = t(locale)
  return (
    <section className="container state">
      <p className="state-code" aria-hidden="true">404</p>
      <h1>{tr('nf_title')}</h1>
      <p>{tr('nf_text')}</p>
      <div className="state-actions">
        <Link className="btn btn-gold" href={`/${locale}`}>{tr('nf_home')}</Link>
        <Link className="btn btn-outline" href={`/${locale}/fleet`}>{tr('explore_fleet')}</Link>
      </div>
    </section>
  )
}
