import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSettings } from '@/lib/payload'
import { isLocale, t } from '@/lib/i18n'
import '../globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Akhi Rental Solution — Premium Car Rental', template: '%s · Akhi Rental Solution' },
  description:
    'Daily, monthly and corporate car rental in Bangladesh. Browse the Akhi fleet and request a quote in minutes.',
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const tr = t(locale)
  const s: any = await getSettings(locale)
  const wa = s?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} tr={tr} />
        <main>{children}</main>
        <Footer locale={locale} tr={tr} s={s} />
        <WhatsAppButton number={wa} />
      </body>
    </html>
  )
}
