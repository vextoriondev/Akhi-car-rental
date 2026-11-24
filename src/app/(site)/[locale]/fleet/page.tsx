import type { Metadata } from 'next'
import { FleetBrowser } from '@/components/FleetBrowser'
import { getCars, getSettings } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'
import { categoryOptions } from '@/lib/categories'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isBn = locale === 'bn'
  return {
    title: isBn ? 'গাড়ি বহর ও মূল্য তালিকা' : 'Our Fleet & Price Comparison',
    description: isBn
      ? 'আখি কার রেন্টালের সমস্ত গাড়ির তালিকা, দৈনিক ও মাসিক ভাড়া এবং তুলনা। নোয়া, প্রাডো, হায়েস, অ্যাক্সিও ও লাক্সারি গাড়ি।'
      : 'Browse Akhi Car Rental fleet in Dhaka. Compare daily & monthly rental prices for Toyota Noah, Prado SUV, Hiace Super GL, Axio, and luxury sedans.',
  }
}

export default async function Fleet({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ q?: string; category?: string; service?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const tr = t(locale)
  const isBn = locale === 'bn'

  const [cars, settings] = await Promise.all([
    getCars(locale, { limit: 100 }),
    getSettings(locale),
  ])

  const s: any = settings
  const whatsappNumber = s?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'
  const cats = categoryOptions(locale)

  return (
    <div className="container page fleet-page">
      <div className="fleet-header">
        <span className="eyebrow">{isBn ? 'সম্পূর্ণ ক্যাটালগ' : 'PREMIUM SELECTION'}</span>
        <h1>{tr('fleet_title')}</h1>
        <p className="lead muted">{tr('fleet_sub')}</p>
      </div>

      <FleetBrowser
        initialCars={cars}
        locale={locale}
        categories={cats}
        initialCategory={sp.category || ''}
        initialQuery={sp.q || ''}
        whatsappNumber={whatsappNumber}
      />
    </div>
  )
}
