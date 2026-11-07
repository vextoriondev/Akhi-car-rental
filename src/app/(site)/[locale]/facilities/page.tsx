import Link from 'next/link'
import { FacilityCard } from '@/components/Cards'
import { getFacilities } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export const metadata = { title: 'Facilities' }

export default async function Facilities({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const items: any[] = await getFacilities(locale)
  return (
    <div className="container page">
      <h1>{tr('facilities_title')}</h1>
      <p className="muted">{tr('facilities_sub')}</p>
      <div className="grid g3" style={{ marginBlock: '1.5rem 2.5rem' }}>
        {items.map((f) => <FacilityCard key={f.id} f={f} />)}
      </div>
      <Link className="btn btn-lg" href={`/${locale}/contact`}>{tr('book_now')} →</Link>
    </div>
  )
}
