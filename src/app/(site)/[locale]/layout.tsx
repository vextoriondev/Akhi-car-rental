import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Manrope, Noto_Sans_Bengali, Sora } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { QuickActions } from '@/components/Blocks'
import { JsonLd } from '@/components/JsonLd'
import { Reveal } from '@/components/Reveal'
import { getSettings } from '@/lib/data'
import { isLocale, t, toLocale } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'
import '../globals.css'

const body = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const display = Sora({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const bengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bn', display: 'swap', preload: false })

export const viewport: Viewport = { themeColor: '#080b12', colorScheme: 'dark' }

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const s = await getSettings(locale)
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.metaTitle || s.siteName, template: `%s · ${s.siteName}` },
    description: s.metaDescription || s.tagline || s.siteName,
    applicationName: s.siteName,
  }
}

export default async function SiteLayout({ children, params }: Props & { children: React.ReactNode }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const tr = t(locale)
  const s = await getSettings(locale)

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${body.variable} ${display.variable} ${bengali.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">{tr('skip')}</a>
        <Header locale={locale} siteName={s.siteName} logo={s.logo} phone={s.phone} whatsapp={s.whatsapp} />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer locale={locale} s={s} />
        <QuickActions locale={locale} s={s} />
        <Reveal />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'AutoRental',
            name: s.siteName,
            url: `${SITE_URL}/${locale}`,
            telephone: s.phone,
            email: s.email,
            address: { '@type': 'PostalAddress', streetAddress: s.address, addressCountry: 'BD' },
            ...(s.socials.length ? { sameAs: s.socials.map((x) => x.href) } : {}),
          }}
        />
      </body>
    </html>
  )
}
