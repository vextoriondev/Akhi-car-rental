import Link from 'next/link'
import { CarCard } from '@/components/Cards'
import { SearchBar } from '@/components/SearchBar'
import { getCars, getService, getServices } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'
import { categoryOptions } from '@/lib/categories'

export const metadata = { title: 'Fleet' }

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
  const services: any[] = await getServices(locale)
  const svc: any = sp.service ? services.find((s) => s.slug === sp.service) : null
  const cars: any[] = await getCars(locale, { q: sp.q, category: sp.category, serviceId: svc?.id })
  const cats = categoryOptions(locale)

  return (
    <div className="container page">
      <h1>{tr('fleet_title')}</h1>
      <p className="muted">{tr('fleet_sub')}</p>
      <div className="page-search">
        <SearchBar
          key={JSON.stringify(sp)}
          locale={locale}
          services={services.map((s) => ({ value: s.slug, label: s.title }))}
          categories={cats}
          labels={{ placeholder: tr('search_placeholder'), service: tr('search_service'), category: tr('search_category'), btn: tr('search_btn') }}
        />
      </div>
      <div className="pills">
        <Link href={`/${locale}/fleet`} className={!sp.category ? 'on' : ''}>{tr('all')}</Link>
        {cats.map((c) => (
          <Link key={c.value} href={`/${locale}/fleet?category=${c.value}`} className={sp.category === c.value ? 'on' : ''}>
            {c.label}
          </Link>
        ))}
      </div>
      {cars.length ? (
        <div className="grid g3">{cars.map((c) => <CarCard key={c.id} car={c} locale={locale} tr={tr} />)}</div>
      ) : (
        <p className="empty">{tr('no_results')}</p>
      )}
    </div>
  )
}
