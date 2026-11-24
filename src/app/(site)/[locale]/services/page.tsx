import type { Metadata } from 'next'
import { ServiceCard } from '@/components/Cards'
import { getServices } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isBn = locale === 'bn'
  return {
    title: isBn ? 'আমাদের সার্ভিসের তালিকা' : 'Our Rental Services & Packages',
    description: isBn
      ? 'দৈনিক ও মাসিক কার রেন্টাল, কর্পোরেট চুক্তি, এয়ারপোর্ট ট্রান্সফার, ওয়েডিং ও ট্যুর সার্ভিস।'
      : 'Explore specialized chauffeur services: airport transfers, corporate fleet contracts, monthly rentals, and outstation tours.',
  }
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const isBn = locale === 'bn'
  const services: any[] = await getServices(locale)

  return (
    <div className="container page services-page">
      <div className="page-header">
        <span className="eyebrow">{isBn ? 'বিশেষায়িত সেবা' : 'TAILORED CHAUFFEUR PACKAGES'}</span>
        <h1>{tr('services_title')}</h1>
        <p className="lead muted">{tr('our_services_sub')}</p>
      </div>

      <div className="grid g3 services-full-grid">
        {services.map((s) => (
          <ServiceCard key={s.id || s.slug} s={s} locale={locale} />
        ))}
      </div>
    </div>
  )
}
