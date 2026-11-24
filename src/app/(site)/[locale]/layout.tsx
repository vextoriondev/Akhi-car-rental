import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSettings } from '@/lib/payload'
import { isLocale, t } from '@/lib/i18n'
import '../globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isBn = locale === 'bn'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhi-car-rental.vercel.app'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: isBn
        ? 'আখি কার রেন্টাল — প্রিমিয়াম কার রেন্টাল ও শোফার সার্ভিস'
        : 'Akhi Car Rental — Luxury Fleet & Chauffeur Service in Bangladesh',
      template: `%s · ${isBn ? 'আখি কার রেন্টাল' : 'Akhi Car Rental'}`,
    },
    description: isBn
      ? 'ঢাকা ও সারাদেশে নির্ভরযোগ্য ও বিলাসবহুল কার রেন্টাল। দৈনিক, মাসিক ও কর্পোরেট ফ্লিট ভাড়ার জন্য প্রশিক্ষিত ড্রাইভারসহ আধুনিক গাড়ি।'
      : 'Daily, monthly, and corporate luxury car rental in Dhaka, Bangladesh. Premium sedans, Toyota Noah microbuses, Prado SUVs, and executive coaches with verified chauffeurs.',
    keywords: [
      'Car rental Dhaka',
      'Akhi car rental',
      'Rent a car Bangladesh',
      'Toyota Noah rental',
      'Prado rental Dhaka',
      'Airport transfer Dhaka',
      'Corporate car rental Bangladesh',
      'Chauffeur service Dhaka',
      'গাড়ি ভাড়া ঢাকা',
      'আখি কার রেন্টাল',
    ],
    openGraph: {
      title: isBn
        ? 'আখি কার রেন্টাল — শ্রেষ্ঠত্বের সাথে ভ্রমণ করুন'
        : 'Akhi Car Rental — Drive Excellence in Bangladesh',
      description: isBn
        ? 'দৈনিক, মাসিক ও কর্পোরেট রেন্টাল সমাধান। ২৪/৭ সার্বক্ষণিক সেবা ও দ্রুত বুকিং।'
        : 'Premier luxury, executive, and corporate car rental service with verified professional drivers.',
      url: `${siteUrl}/${locale}`,
      siteName: isBn ? 'আখি কার রেন্টাল' : 'Akhi Car Rental',
      locale: isBn ? 'bn_BD' : 'en_US',
      type: 'website',
    },
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        bn: `${siteUrl}/bn`,
      },
    },
  }
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
  const wa = s?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header locale={locale} whatsappNumber={wa} />
        <main id="main-content">{children}</main>
        <Footer locale={locale} s={s} />
        <WhatsAppButton number={wa} />
      </body>
    </html>
  )
}
