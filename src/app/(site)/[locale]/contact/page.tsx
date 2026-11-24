import type { Metadata } from 'next'
import { InquiryForm } from '@/components/InquiryForm'
import { formLabels, formOptions } from '@/lib/form'
import { getSettings } from '@/lib/payload'
import { buildWhatsAppUrl, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isBn = locale === 'bn'
  return {
    title: isBn ? 'যোগাযোগ ও বুকিং' : 'Contact & Instant Booking',
    description: isBn
      ? 'আখি কার রেন্টাল উত্তরা, ঢাকা। ২৪/৭ কল ও হোয়াটসঅ্যাপ হটলাইন। তাৎক্ষণিক গাড়ি বুকিং।'
      : 'Contact Akhi Car Rental Dhaka. 24/7 hotline and instant WhatsApp support for all vehicle bookings.',
  }
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: Locale }>
  searchParams?: Promise<{ service?: string }>
}) {
  const { locale } = await params
  const tr = t(locale)
  const isBn = locale === 'bn'
  const [opts, s]: any = await Promise.all([formOptions(locale), getSettings(locale)])
  const wa = s?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'
  const waUrl = buildWhatsAppUrl({ phone: wa, locale })

  return (
    <div className="container page contact-page">
      <div className="page-header">
        <span className="eyebrow">{isBn ? '২৪/৭ সার্বক্ষণিক যোগাযোগ' : 'ALWAYS AT YOUR SERVICE'}</span>
        <h1>{tr('contact_title')}</h1>
        <p className="lead muted">{tr('contact_sub')}</p>
      </div>

      <div className="contact-grid">
        {/* Left: Contact Info Cards */}
        <div className="contact-info-column">
          <div className="card info-box">
            <h3>{isBn ? 'সরাসরি হটলাইন' : 'Direct Dispatch Hotline'}</h3>
            <p className="muted small">
              {isBn
                ? 'যেকোনো বুকিং, জিজ্ঞাসা বা সহায়তার জন্য সরাসরি কল অথবা হোয়াটসঅ্যাপ করুন।'
                : 'For immediate vehicle dispatch, rate inquiries, and corporate fleet consultations.'}
            </p>

            <div className="info-items-list">
              <a href={`tel:${(s?.phone || '+8801625347735').replace(/\s/g, '')}`} className="info-item-row">
                <span className="info-icon">📞</span>
                <div>
                  <small className="muted">{isBn ? '২৪/৭ ফোন হেল্পলাইন' : 'Phone Helpline'}</small>
                  <strong>{s?.phone || '+880 1625-347735'}</strong>
                </div>
              </a>

              <a href={waUrl} target="_blank" rel="noreferrer" className="info-item-row wa-row">
                <span className="info-icon wa-icon">💬</span>
                <div>
                  <small className="muted">{isBn ? 'তাৎক্ষণিক হোয়াটসঅ্যাপ' : 'Instant WhatsApp'}</small>
                  <strong>+{wa}</strong>
                </div>
              </a>

              <a href={`mailto:${s?.email || 'akhicarrental77@gmail.com'}`} className="info-item-row">
                <span className="info-icon">✉️</span>
                <div>
                  <small className="muted">{isBn ? 'অফিসিয়াল ইমেইল' : 'Inquiry Email'}</small>
                  <strong>{s?.email || 'akhicarrental77@gmail.com'}</strong>
                </div>
              </a>

              <div className="info-item-row">
                <span className="info-icon">📍</span>
                <div>
                  <small className="muted">{isBn ? 'অফিস ও গ্যারেজের ঠিকানা' : 'Office & Dispatch Depot'}</small>
                  <span>{s?.address || 'House 12, Road 4, Sector 3, Uttara, Dhaka, Bangladesh'}</span>
                </div>
              </div>

              <div className="info-item-row">
                <span className="info-icon">🕒</span>
                <div>
                  <small className="muted">{isBn ? 'কার্যকাল' : 'Operating Hours'}</small>
                  <span>{s?.hours || '24 Hours / 7 Days a Week'}</span>
                </div>
              </div>
            </div>

            <div className="wa-quick-card">
              <h4>{isBn ? 'দ্রুত সমাধান চান?' : 'Need an Instant Answer?'}</h4>
              <p className="small muted">
                {isBn
                  ? 'হোয়াটসঅ্যাপে আমাদের সাথে সরাসরি চ্যাট করুন, আমরা ২ মিনিটের মধ্যেই সাড়া দেব।'
                  : 'Message us directly on WhatsApp. Our dispatch manager responds within 2 minutes.'}
              </p>
              <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-wa-block">
                💬 {tr('whatsapp_chat')}
              </a>
            </div>
          </div>
        </div>

        {/* Right: Booking Inquiry Form */}
        <div className="contact-form-column">
          <div className="card form-container-card">
            <h3 className="form-head-title">{tr('inquiry_title')}</h3>
            <p className="muted small form-head-sub">
              {isBn
                ? 'আপনার ভ্রমণের তথ্য দিন, আমরা সেরা কোটেশন নিয়ে যোগাযোগ করব।'
                : 'Fill in your itinerary details and receive a customized quote promptly.'}
            </p>
            <InquiryForm
              services={opts.services}
              cars={opts.cars}
              whatsapp={opts.whatsapp}
              labels={formLabels(tr)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
