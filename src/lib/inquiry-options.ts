import 'server-only'
import { getCars, getServices } from './data'
import { carTitle } from './format'
import type { Locale } from './i18n'

export async function inquiryOptions(locale: Locale) {
  const [services, cars] = await Promise.all([getServices(locale), getCars(locale)])
  return {
    services: services.map((s) => ({ value: String(s.id), label: s.title })),
    cars: cars.map((c) => ({ value: String(c.id), label: carTitle(c) })),
    today: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date()),
  }
}
