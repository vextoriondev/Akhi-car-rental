import type { Locale, T } from './i18n'
import type { Car } from './types'
import { whatsappUrl } from './site'

/** Lakh grouping (৳2,50,000), matching the company's own quotation sheet. */
export const money = (n: number) => `৳${n.toLocaleString('en-IN')}`

export const carTitle = (car: Pick<Car, 'name' | 'years'>) => (car.years ? `${car.name} (${car.years})` : car.name)

export const fuelLabel = (fuel: string, tr: T) => tr(`fuel_${fuel}` as Parameters<T>[0])

export function carWhatsAppUrl(phone: string, car: Pick<Car, 'name' | 'years'>, locale: Locale) {
  const title = carTitle(car)
  return whatsappUrl(
    phone,
    locale === 'bn'
      ? `আসসালামু আলাইকুম, আমি "${title}" ভাড়া নিতে চাই। প্রাপ্যতা ও ভাড়া জানাবেন।`
      : `Hello New Akhi Rent-a-Car, I would like to rent the ${title}. Please share availability and the fare.`,
  )
}

export const greetingUrl = (phone: string, locale: Locale) =>
  whatsappUrl(
    phone,
    locale === 'bn'
      ? 'আসসালামু আলাইকুম, আমি গাড়ি ভাড়া নেওয়ার বিষয়ে জানতে চাই।'
      : 'Hello New Akhi Rent-a-Car, I would like to ask about renting a vehicle.',
  )
