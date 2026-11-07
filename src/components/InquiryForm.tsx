'use client'
import { useActionState } from 'react'
import { submitInquiry, type InquiryState } from '@/app/actions'

type Opt = { value: string; label: string }
export type FormLabels = Record<
  | 'title' | 'name' | 'phone' | 'email' | 'company' | 'service' | 'car' | 'date' | 'duration'
  | 'message' | 'submit' | 'sending' | 'success' | 'whatsapp' | 'error',
  string
>

export function InquiryForm({
  services,
  cars,
  defaultService,
  defaultCar,
  whatsapp,
  labels,
}: {
  services: Opt[]
  cars: Opt[]
  defaultService?: string
  defaultCar?: string
  whatsapp?: string
  labels: FormLabels
}) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: 'idle' })

  if (state.status === 'ok') {
    const wa = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(state.waText || '')}` : null
    return (
      <div className="card form-ok">
        <div className="s-icon">✅</div>
        <p>{labels.success}</p>
        {wa && (
          <a className="btn" href={wa} target="_blank" rel="noreferrer">
            {labels.whatsapp}
          </a>
        )}
      </div>
    )
  }

  return (
    <form action={action} className="card form">
      <h2>{labels.title}</h2>
      <div className="form-grid">
        <label>{labels.name}<input name="name" required /></label>
        <label>{labels.phone}<input name="phone" required inputMode="tel" /></label>
        <label>{labels.email}<input name="email" type="email" /></label>
        <label>{labels.company}<input name="company" /></label>
        <label>
          {labels.service}
          <select name="service" defaultValue={defaultService || ''}>
            <option value="">—</option>
            {services.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label>
          {labels.car}
          <select name="car" defaultValue={defaultCar || ''}>
            <option value="">—</option>
            {cars.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label>{labels.date}<input name="pickupDate" type="date" /></label>
        <label>{labels.duration}<input name="duration" /></label>
      </div>
      <label>{labels.message}<textarea name="message" rows={4} /></label>
      {/* honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      {state.status === 'error' && <p className="err">{labels.error}</p>}
      <button className="btn btn-lg" disabled={pending}>{pending ? labels.sending : labels.submit}</button>
    </form>
  )
}
