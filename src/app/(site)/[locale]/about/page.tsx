import type { Metadata } from 'next'
import Link from 'next/link'
import { getHome, getSettings } from '@/lib/payload'
import { buildWhatsAppUrl, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isBn = locale === 'bn'
  return {
    title: isBn ? 'আমাদের সম্পর্কে' : 'About Akhi Car Rental',
    description: isBn
      ? 'আখি কার রেন্টালের ইতিহাস, নির্ভরযোগ্যতা ও প্রতিশ্রুতি। এক দশকের বিশ্বস্ত কার রেন্টাল সেবা।'
      : 'Learn about Akhi Car Rental Dhaka. Premier fleet operator serving corporate entities, embassies, and families.',
  }
}

export default async function About({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const isBn = locale === 'bn'
  const [h, s]: any = await Promise.all([getHome(locale), getSettings(locale)])
  const wa = s?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'
  const waUrl = buildWhatsAppUrl({ phone: wa, locale })

  return (
    <div className="container page about-page">
      <div className="page-header">
        <span className="eyebrow">{isBn ? 'আমাদের প্রতিশ্রুতি' : 'OUR HERITAGE & MISSION'}</span>
        <h1>{h?.about?.title || tr('about_title')}</h1>
        <p className="lead muted">{h?.about?.text}</p>
      </div>

      {/* Trust stats */}
      {h?.stats?.length > 0 && (
        <section className="stats-bar-wrapper my-8">
          <div className="stats-bar">
            {h.stats.map((stat: any, i: number) => (
              <div key={i} className="stat-card">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="about-values section">
        <div className="sec-head">
          <div>
            <span className="eyebrow">{isBn ? 'আমাদের শক্তি' : 'CORE ADVANTAGES'}</span>
            <h2>{tr('why_us')}</h2>
          </div>
        </div>
        <div className="grid g3">
          {(h?.whyUs || []).map((w: any, i: number) => (
            <div key={i} className="card why-card">
              <div className="s-icon why-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p className="muted small">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company story narrative card */}
      <section className="card story-card my-8 p-8">
        <div className="story-content">
          <h3>{isBn ? 'বিশ্বস্ততার এক দশক' : 'A Decade of Uncompromising Quality'}</h3>
          <p className="muted">
            {isBn
              ? 'আখি কার রেন্টালের যাত্রা শুরু হয়েছিল একটি সহজ অঙ্গীকার নিয়ে — গাড়ি ভাড়া হবে স্বচ্ছ, পেশাদার এবং নির্ভরযোগ্য। আজ আমরা গর্বিত যে শীর্ষস্থানীয় বহুজাতিক কোম্পানি, দূতাবাস, বিদেশি মেহমান এবং হাজারো সম্মানিত পরিবার তাদের দৈনন্দিন ও বিশেষ সফরের দায়িত্ব আমাদের ওপর অর্পণ করেন।'
              : 'Akhi Car Rental was founded with one clear vision: renting a vehicle in Bangladesh should be professional, transparent, and completely stress-free. Today, we proudly maintain one of Dhaka’s most reliable automotive fleets, backed by certified chauffeurs and strict safety standards.'}
          </p>
          <div className="story-actions">
            <Link className="btn btn-gold" href={`/${locale}/fleet`}>
              {tr('explore_fleet')} →
            </Link>
            <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-wa-card">
              💬 {tr('whatsapp_chat')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
