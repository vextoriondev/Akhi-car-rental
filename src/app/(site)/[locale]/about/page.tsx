import type { Metadata } from 'next'
import { CtaBand, FeatureCard, HowItWorks, PageHero, SectionHead } from '@/components/Blocks'
import { getHome, getSettings } from '@/lib/data'
import { t, toLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [s, home] = await Promise.all([getSettings(locale), getHome(locale).catch(() => null)])
  return pageMetadata({
    locale,
    path: '/about',
    title: tr('nav_about'),
    description: home?.about.text || s.metaDescription || s.tagline,
    siteName: s.siteName,
  })
}

export default async function About({ params }: Props) {
  const locale = toLocale((await params).locale)
  const tr = t(locale)
  const [home, s] = await Promise.all([getHome(locale), getSettings(locale)])

  return (
    <>
      <PageHero
        eyebrow={home.about.eyebrow || tr('about_eyebrow')}
        title={home.about.title || s.siteName}
        text={home.about.text}
        photo={home.slides[0]?.photo}
      />
      {home.whyUs.length > 0 && (
        <section className="container section">
          <SectionHead eyebrow={tr('why_eyebrow')} title={tr('why_title')} />
          <div className="card-grid is-four">
            {home.whyUs.map((w) => <FeatureCard key={w.title} item={w} />)}
          </div>
        </section>
      )}
      <section className="container section">
        <SectionHead eyebrow={tr('how_eyebrow')} title={tr('how_title')} center />
        <HowItWorks locale={locale} />
      </section>
      <CtaBand locale={locale} s={s} />
    </>
  )
}
