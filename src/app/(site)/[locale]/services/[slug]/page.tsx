import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CarCard } from '@/components/Cards'
import { InquiryForm } from '@/components/InquiryForm'
import { formLabels, formOptions } from '@/lib/form'
import { getCars, getService } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  const s: any = await getService(locale, slug)
  return { title: s?.title ?? 'Service' }
}

export default async function ServicePage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  const s: any = await getService(locale, slug)
  if (!s) notFound()
  const tr = t(locale)
  const [cars, opts] = await Promise.all([getCars(locale, { serviceId: s.id, limit: 6 }), formOptions(locale)])
  return (
    <div className={`container page a-${s.accent || 'violet'}`}>
      <Link className="link" href={`/${locale}/services`}>← {tr('back')}</Link>
      <div className="svc-hero">
        <div className="s-icon big">{s.icon}</div>
        <div>
          <h1>{s.title}</h1>
          <p className="lead muted">{s.summary}</p>
          {s.startingPrice && <p className="s-price">{s.startingPrice}</p>}
        </div>
      </div>
      {s.description && <p className="prose">{s.description}</p>}
      {s.highlights?.length > 0 && (
        <>
          <h3>{tr('highlights')}</h3>
          <ul className="ticks">{s.highlights.map((h: any, i: number) => <li key={i}>{h.label}</li>)}</ul>
        </>
      )}
      {(cars as any[]).length > 0 && (
        <>
          <h2>{tr('cars_for_service')}</h2>
          <div className="grid g3">{(cars as any[]).map((c) => <CarCard key={c.id} car={c} locale={locale} tr={tr} />)}</div>
        </>
      )}
      <InquiryForm services={opts.services} cars={opts.cars} defaultService={String(s.id)} whatsapp={opts.whatsapp} labels={formLabels(tr)} />
    </div>
  )
}
