'use client'
import { useParams } from 'next/navigation'
import { t, toLocale } from '@/lib/i18n'
import { CONTACT_DEFAULTS, telHref, whatsappUrl } from '@/lib/site'

export default function ErrorPage({ retry, reset }: { error: Error; retry?: () => void; reset?: () => void }) {
  const locale = toLocale(String(useParams()?.locale ?? 'en'))
  const tr = t(locale)
  return (
    <section className="container state" role="alert">
      <h1>{tr('err_title')}</h1>
      <p>{tr('err_text')}</p>
      <div className="state-actions">
        <button type="button" className="btn btn-gold" onClick={() => (retry ?? reset)?.()}>{tr('err_retry')}</button>
        <a className="btn btn-outline" href={telHref(CONTACT_DEFAULTS.phone)}>{CONTACT_DEFAULTS.phone}</a>
        <a className="btn btn-wa" href={whatsappUrl(CONTACT_DEFAULTS.whatsapp)}>{tr('whatsapp')}</a>
      </div>
    </section>
  )
}
