import { getCars, getServices, getSettings } from './payload'
import type { Locale, T } from './i18n'

export async function formOptions(locale: Locale) {
  const [services, cars, settings] = await Promise.all([getServices(locale), getCars(locale, { limit: 200 }), getSettings(locale)])
  return {
    services: (services as any[]).map((s) => ({ value: String(s.id), label: s.title })),
    cars: (cars as any[]).map((c) => ({ value: String(c.id), label: c.name })),
    whatsapp: ((settings as any)?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) as string | undefined,
  }
}

export const formLabels = (tr: T) => ({
  title: tr('inquiry_title'),
  name: tr('f_name'),
  phone: tr('f_phone'),
  email: tr('f_email'),
  company: tr('f_company'),
  service: tr('f_service'),
  car: tr('f_car'),
  date: tr('f_date'),
  duration: tr('f_duration'),
  message: tr('f_message'),
  submit: tr('f_submit'),
  sending: tr('f_sending'),
  success: tr('f_success'),
  whatsapp: tr('f_whatsapp'),
  error: tr('f_error'),
})
