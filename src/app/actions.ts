'use server'
import { getClient, isDbConfigured } from '@/lib/data'
import { carTitle } from '@/lib/format'
import type { Key } from '@/lib/i18n'

export type InquiryField = 'name' | 'phone' | 'email' | 'pickupDate'
export type InquiryValues = Partial<
  Record<'name' | 'phone' | 'email' | 'company' | 'service' | 'car' | 'pickupDate' | 'duration' | 'message', string>
>
export type InquiryState =
  | { status: 'idle' }
  | { status: 'ok'; waText: string }
  | { status: 'error'; message: Key; errors: Partial<Record<InquiryField, Key>>; values: InquiryValues; attempt: number }

const LIMITS = { name: 120, phone: 40, email: 160, company: 160, service: 12, car: 12, pickupDate: 10, duration: 120, message: 2000 }

/** Today in Bangladesh as yyyy-mm-dd. */
const todayInDhaka = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())

export async function submitInquiry(prev: InquiryState, form: FormData): Promise<InquiryState> {
  // Honeypot: humans never see this field.
  if (String(form.get('website') ?? '').trim()) return { status: 'ok', waText: '' }

  const values = Object.fromEntries(
    (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).map((k) => {
      const raw = form.get(k)
      return [k, typeof raw === 'string' ? raw.trim().slice(0, LIMITS[k]) : '']
    }),
  ) as Required<InquiryValues>

  const attempt = prev.status === 'error' ? prev.attempt + 1 : 1
  const fail = (message: Key, errors: Partial<Record<InquiryField, Key>> = {}): InquiryState => ({
    status: 'error',
    message,
    errors,
    values,
    attempt,
  })

  const errors: Partial<Record<InquiryField, Key>> = {}
  const digits = values.phone.replace(/\D/g, '')
  if (values.name.length < 2) errors.name = 'e_name'
  if (!/^[+\d\s()-]+$/.test(values.phone) || digits.length < 10 || digits.length > 15) errors.phone = 'e_phone'
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = 'e_email'
  if (values.pickupDate && (!/^\d{4}-\d{2}-\d{2}$/.test(values.pickupDate) || values.pickupDate < todayInDhaka())) {
    errors.pickupDate = 'e_date'
  }
  if (Object.keys(errors).length) return fail('f_error_fields', errors)

  if (!isDbConfigured()) return fail('f_error')

  try {
    const payload = await getClient()
    const since = (ms: number) => ({ createdAt: { greater_than: new Date(Date.now() - ms).toISOString() } })

    // Per-number limit, plus a site-wide ceiling against scripted floods.
    const [mine, everyone] = await Promise.all([
      payload.count({ collection: 'inquiries', where: { and: [{ phone: { equals: values.phone } }, since(10 * 60_000)] } }),
      payload.count({ collection: 'inquiries', where: since(10 * 60_000) }),
    ])
    if (mine.totalDocs >= 3 || everyone.totalDocs >= 60) return fail('f_error_rate')

    // Only keep selections that still exist and are visible to visitors.
    const serviceId = Number(values.service) || undefined
    const carId = Number(values.car) || undefined
    const [services, cars] = await Promise.all([
      serviceId
        ? payload.find({ collection: 'services', where: { id: { equals: serviceId } }, limit: 1, depth: 0 })
        : null,
      carId
        ? payload.find({
            collection: 'cars',
            where: { and: [{ id: { equals: carId } }, { status: { equals: 'published' } }] },
            limit: 1,
            depth: 0,
          })
        : null,
    ])
    const service = services?.docs[0]
    const car = cars?.docs[0]

    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        company: values.company || undefined,
        service: service?.id,
        car: car?.id,
        pickupDate: values.pickupDate ? `${values.pickupDate}T12:00:00.000Z` : undefined,
        duration: values.duration || undefined,
        message: values.message || undefined,
        status: 'new',
      },
    })

    const waText = [
      `Hello New Akhi Rent-a-Car, I'm ${values.name} (${values.phone}).`,
      car ? `Vehicle: ${carTitle({ name: car.name, years: car.yearRange || String(car.year || '') })}` : '',
      service ? `Service: ${service.title}` : '',
      values.pickupDate ? `Pickup date: ${values.pickupDate}` : '',
      values.duration ? `Duration: ${values.duration}` : '',
      values.message ? `Notes: ${values.message}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    return { status: 'ok', waText }
  } catch (e) {
    console.error('[inquiry]', (e as Error).message)
    return fail('f_error')
  }
}
