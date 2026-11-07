import { InquiryForm } from '@/components/InquiryForm'
import { formLabels, formOptions } from '@/lib/form'
import { getSettings } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export const metadata = { title: 'Contact' }

export default async function Contact({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ service?: string }>
}) {
  const { locale } = await params
  const tr = t(locale)
  const [opts, s]: any = await Promise.all([formOptions(locale), getSettings(locale)])
  return (
    <div className="container page">
      <h1>{tr('contact_title')}</h1>
      <p className="muted">{tr('contact_sub')}</p>
      <div className="contact-grid">
        <div className="card info">
          <p>📞 {s?.phone}</p>
          <p>✉️ {s?.email}</p>
          <p>📍 {s?.address}</p>
          <p>🕒 {s?.hours}</p>
        </div>
        <InquiryForm services={opts.services} cars={opts.cars} whatsapp={opts.whatsapp} labels={formLabels(tr)} />
      </div>
    </div>
  )
}
