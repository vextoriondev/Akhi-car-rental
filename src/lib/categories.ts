import type { Locale } from './i18n'

const en: Record<string, string> = {
  economy: 'Economy',
  sedan: 'Sedan',
  suv: 'SUV / Jeep',
  microbus: 'Microbus / Van',
  luxury: 'Luxury',
  pickup: 'Pickup',
  bus: 'Bus / Coaster',
}

const bn: Record<string, string> = {
  economy: 'ইকোনমি',
  sedan: 'সেডান',
  suv: 'এসইউভি / জিপ',
  microbus: 'মাইক্রোবাস / ভ্যান',
  luxury: 'লাক্সারি',
  pickup: 'পিকআপ',
  bus: 'বাস / কোস্টার',
}

export const categoryOptions = (locale: Locale) =>
  Object.entries(locale === 'bn' ? bn : en).map(([value, label]) => ({ value, label }))

export const getCategoryLabel = (category: string, locale: Locale) => {
  const dict = locale === 'bn' ? bn : en
  return dict[category] || category
}
