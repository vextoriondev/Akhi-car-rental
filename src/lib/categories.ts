import type { Locale } from './i18n'

const labels: Record<string, Record<Locale, string>> = {
  economy: { en: 'Economy', bn: 'ইকোনমি' },
  sedan: { en: 'Sedan', bn: 'সেডান' },
  suv: { en: 'SUV / Jeep', bn: 'এসইউভি / জিপ' },
  microbus: { en: 'Microbus / Van', bn: 'মাইক্রোবাস / ভ্যান' },
  luxury: { en: 'Luxury', bn: 'লাক্সারি' },
  pickup: { en: 'Pickup', bn: 'পিকআপ' },
  bus: { en: 'Bus / Coaster', bn: 'বাস / কোস্টার' },
}

export const getCategoryLabel = (category: string, locale: Locale) => labels[category]?.[locale] ?? category

/** Only the categories that actually have vehicles, in the order defined above. */
export const categoryOptions = (locale: Locale, present: string[]) =>
  Object.keys(labels)
    .filter((value) => present.includes(value))
    .map((value) => ({ value, label: labels[value][locale] }))
