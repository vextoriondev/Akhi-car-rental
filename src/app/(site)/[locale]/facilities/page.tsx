import type { Metadata } from 'next'
import Link from 'next/link'
import { FacilityCard } from '@/components/Cards'
import { getFacilities } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isBn = locale === 'bn'
  return {
    title: isBn ? 'সুবিধাসমূহ ও স্ট্যান্ডার্ড' : 'Onboard Amenities & Standards',
    description: isBn
      ? 'আখি কার রেন্টালের প্রতিটি গাড়িতে দেওয়া সুযোগ-সুবিধা: ওয়াই-ফাই, ব্যাকআপ কার, জিপিএস ও সার্বক্ষণিক সাপোর্ট।'
      : 'Every Akhi Car Rental ride is backed by GPS monitoring, certified chauffeurs, Wi-Fi, and 24/7 roadside assistance.',
  }
}

export default async function FacilitiesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const isBn = locale === 'bn'
  const items: any[] = await getFacilities(locale)

  return (
    <div className="container page facilities-page">
      <div className="page-header">
        <span className="eyebrow">{isBn ? 'সর্বোচ্চ আরাম' : 'EXECUTIVE COMFORT STANDARDS'}</span>
        <h1>{tr('facilities_title')}</h1>
        <p className="lead muted">{tr('facilities_sub')}</p>
      </div>

      <div className="grid g3 my-8">
        {items.map((f) => (
          <FacilityCard key={f.id || f.title} f={f} />
        ))}
      </div>

      <div className="facilities-action-card card my-8 text-center p-8">
        <h3>{isBn ? 'আপনার যাত্রার আরাম আমাদের দায়িত্ব' : 'Experience the Extraordinary Journey'}</h3>
        <p className="muted small max-w-xl mx-auto my-4">
          {isBn
            ? 'পরিবার বা অফিসের জন্য বেছে নিন নিরাপদ ও আরামদায়ক পরিবহন। আমরা নিশ্চিত করি সেরা অভিজ্ঞতা।'
            : 'From individual VIP transfers to comprehensive enterprise fleets, our standards never waver.'}
        </p>
        <div className="facilities-cta-buttons">
          <Link className="btn btn-gold btn-lg" href={`/${locale}/fleet`}>
            {tr('explore_fleet')} →
          </Link>
          <Link className="btn btn-outline btn-lg" href={`/${locale}/contact`}>
            {tr('book_now')}
          </Link>
        </div>
      </div>
    </div>
  )
}
