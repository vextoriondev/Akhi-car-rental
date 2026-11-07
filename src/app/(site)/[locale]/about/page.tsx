import { getHome } from '@/lib/payload'
import { t, type Locale } from '@/lib/i18n'

export const metadata = { title: 'About' }

export default async function About({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const tr = t(locale)
  const h: any = await getHome(locale)
  return (
    <div className="container page">
      <h1>{h?.about?.title || tr('about_title')}</h1>
      <p className="lead muted prose">{h?.about?.text}</p>
      <h2>{tr('why_us')}</h2>
      <div className="grid g3">
        {(h?.whyUs || []).map((w: any, i: number) => (
          <div key={i} className="card why-card">
            <div className="s-icon">{w.icon}</div>
            <h3>{w.title}</h3>
            <p className="muted small">{w.text}</p>
          </div>
        ))}
      </div>
      {h?.stats?.length > 0 && (
        <section className="stats">
          {h.stats.map((s: any, i: number) => (
            <div key={i}><b className="grad">{s.value}</b><span className="muted">{s.label}</span></div>
          ))}
        </section>
      )}
    </div>
  )
}
