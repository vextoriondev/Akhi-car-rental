'use server'
import { getClient } from '@/lib/payload'

export type InquiryState = { status: 'idle' | 'ok' | 'error'; waText?: string }

const s = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '')

export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  if (s(form.get('website'))) return { status: 'ok' } // bot
  const name = s(form.get('name')).slice(0, 120)
  const phone = s(form.get('phone')).slice(0, 40)
  if (!name || !phone) return { status: 'error' }

  const rel = (k: string) => {
    const v = s(form.get(k))
    return v ? Number(v) || v : undefined
  }
  try {
    const payload = await getClient()
    const data: Record<string, unknown> = {
      name,
      phone,
      email: s(form.get('email')) || undefined,
      company: s(form.get('company')).slice(0, 160) || undefined,
      service: rel('service'),
      car: rel('car'),
      pickupDate: s(form.get('pickupDate')) || undefined,
      duration: s(form.get('duration')).slice(0, 120) || undefined,
      message: s(form.get('message')).slice(0, 2000) || undefined,
    }
    await payload.create({ collection: 'inquiries', data: data as any, overrideAccess: true })
    const lines = [
      `Hello Akhi Rental! I'm ${name} (${phone}).`,
      data.duration ? `Duration: ${data.duration}` : '',
      data.message ? `${data.message}` : '',
    ].filter(Boolean)
    return { status: 'ok', waText: lines.join('\n') }
  } catch (e) {
    console.error('[inquiry]', (e as Error).message)
    return { status: 'error' }
  }
}
