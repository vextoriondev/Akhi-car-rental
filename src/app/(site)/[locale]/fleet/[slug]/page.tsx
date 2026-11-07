import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CarArt } from '@/components/CarArt'
import { InquiryForm } from '@/components/InquiryForm'
import { formLabels, formOptions } from '@/lib/form'
import { getCar, mediaUrl } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  const car: any = await getCar(locale, slug)
  return { title: car?.name ?? 'Car' }
}

export default async function CarPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  const car: any = await getCar(locale, slug)
  if (!car) notFound()
  const tr = t(locale)
  const { services, cars, whatsapp } = await formOptions(locale)
  const imgs = [car.image, ...(car.gallery || []).map((g: any) => g.image)].map(mediaUrl).filter(Boolean) as string[]
  const fmt = (n?: number) => (n ? `৳${n.toLocaleString('en-US')}` : '—')

  return (
    <div className={`container page a-${car.accent || 'violet'}`}>
      <Link className="link" href={`/${locale}/fleet`}>← {tr('back')}</Link>
      <div className="detail">
        <div>
          <div className="detail-media">
            {imgs[0] ? <Image src={imgs[0]} alt={car.name} fill priority sizes="(max-width:900px) 100vw, 640px" /> : <CarArt />}
          </div>
          {imgs.length > 1 && (
            <div className="thumbs">
              {imgs.slice(1).map((u) => (
                <div key={u} className="thumb"><Image src={u} alt="" fill sizes="160px" /></div>
              ))}
            </div>
          )}
        </div>
        <div>
          <span className="chip">{car.category}</span>
          <h1>{car.name}</h1>
          <p className="muted">{car.description}</p>
          <div className="price big">
            <b>{fmt(car.pricePerDay)}</b> <span className="muted">{tr('per_day')}</span>
            {car.pricePerMonth ? <> · <b>{fmt(car.pricePerMonth)}</b> <span className="muted">{tr('per_month')}</span></> : null}
          </div>
          <ul className="specs">
            <li><span>{tr('seats')}</span><b>{car.seats}</b></li>
            <li><span>{tr('bags')}</span><b>{car.luggage ?? '—'}</b></li>
            <li><span>{tr('gearbox')}</span><b>{car.transmission === 'manual' ? tr('manual') : tr('auto')}</b></li>
            <li><span>{tr('fuel')}</span><b>{car.fuel}</b></li>
            {car.year && <li><span>{tr('year')}</span><b>{car.year}</b></li>}
            <li><span>{car.available ? tr('available') : tr('unavailable')}</span><b>{car.withDriver ? tr('with_driver') : tr('self_drive')}</b></li>
          </ul>
          {car.features?.length > 0 && (
            <>
              <h3>{tr('features')}</h3>
              <div className="pills static">{car.features.map((f: any, i: number) => <span key={i}>{f.label}</span>)}</div>
            </>
          )}
        </div>
      </div>
      <InquiryForm services={services} cars={cars} defaultCar={String(car.id)} whatsapp={whatsapp} labels={formLabels(tr)} />
    </div>
  )
}
