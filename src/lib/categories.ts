import type { Locale } from './i18n'

const en: Record<string, string> = {
  economy: 'Economy', sedan: 'Sedan', suv: 'SUV', microbus: 'Microbus / Van', luxury: 'Luxury', bus: 'Bus / Coaster',
}
const bn: Record<string, string> = {
  economy: 'ইকোনমি', sedan: 'সেডান', suv: 'এসইউভি', microbus: 'মাইক্রোবাস / ভ্যান', luxury: 'লাক্সারি', bus: 'বাস / কোস্টার',
}
export const categoryOptions = (locale: Locale) =>
  Object.entries(locale === 'bn' ? bn : en).map(([value, label]) => ({ value, label }))
