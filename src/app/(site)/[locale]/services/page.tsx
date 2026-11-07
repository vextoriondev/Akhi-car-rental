import { ServiceCard } from '@/components/Cards'
import { getServices } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export const metadata = { title: 'Services' }

export default async function Services({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const services: any[] = await getServices(locale)
  return (
    <div className="container page">
      <h1>{tr('services_title')}</h1>
      <p className="muted">{tr('our_services_sub')}</p>
      <div className="grid g3">{services.map((s) => <ServiceCard key={s.id} s={s} locale={locale} />)}</div>
    </div>
  )
}
