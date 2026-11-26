import type { Metadata } from 'next'
import { InquiryForm } from '@/components/InquiryForm'
import { PageHero } from '@/components/Blocks'
import { Icon, WhatsAppIcon } from '@/components/Icons'
import { getSettings } from '@/lib/data'
import { inquiryOptions } from '@/lib/inquiry-options'
import { t, toLocale } from '@/lib/i18n'
import { greetingUrl } from '@/lib/format'
import { telHref } from '@/lib/site'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const s = await getSettings(locale)
  return pageMetadata({ locale, path: '/contact', title: tr('contact_title'), description: `${tr('contact_sub')} ${s.phone} · ${s.address}`, siteName: s.siteName })
}

export default async function Contact({ params }: Props) {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [options, s] = await Promise.all([inquiryOptions(locale), getSettings(locale)])

  return (
    <>
      <PageHero eyebrow={tr('contact_eyebrow')} title={tr('contact_title')} text={tr('contact_sub')} />
      <section className="container page-body contact-grid">
        <div className="contact-list">
          <h2 className="sr-only">{tr('footer_contact')}</h2>
          <a href={telHref(s.phone)}>
            <Icon name="phone" size={22} />
            <span><small>{tr('contact_phone')}</small><b>{s.phone}</b></span>
          </a>
          <a href={greetingUrl(s.whatsapp, locale)} target="_blank" rel="noopener noreferrer" className="is-wa">
            <WhatsAppIcon size={22} />
            <span><small>{tr('whatsapp')}</small><b>{tr('whatsapp_chat')}</b></span>
          </a>
          <a href={`mailto:${s.email}`}>
            <Icon name="mail" size={22} />
            <span><small>{tr('contact_email')}</small><b>{s.email}</b></span>
          </a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`} target="_blank" rel="noopener noreferrer">
            <Icon name="pin" size={22} />
            <span><small>{tr('contact_address')}</small><b>{s.address}</b><small>{tr('open_map')} →</small></span>
          </a>
          {s.hours && (
            <div>
              <Icon name="clock" size={22} />
              <span><small>{tr('contact_hours')}</small><b>{s.hours}</b></span>
            </div>
          )}
        </div>
        <div>
          <h2 className="form-heading">{tr('inquiry_title')}</h2>
          <InquiryForm locale={locale} {...options} whatsapp={s.whatsapp} />
        </div>
      </section>
    </>
  )
}
