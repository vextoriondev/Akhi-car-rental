'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { submitInquiry, type InquiryField, type InquiryState } from '@/app/actions'
import { Icon, WhatsAppIcon } from './Icons'
import { t, type Locale } from '@/lib/i18n'
import { whatsappUrl } from '@/lib/site'

type Opt = { value: string; label: string }
type Props = {
  locale: Locale
  services: Opt[]
  cars: Opt[]
  whatsapp: string
  /** yyyy-mm-dd in Dhaka, the earliest pickup date offered */
  today: string
  defaultService?: string
  defaultCar?: string
}

export function InquiryForm(props: Props) {
  // A new key gives a completely fresh form after a successful request.
  const [round, setRound] = useState(0)
  return <Form key={round} {...props} onAgain={() => setRound((r) => r + 1)} />
}

function Form({ locale, services, cars, whatsapp, today, defaultService, defaultCar, onAgain }: Props & { onAgain: () => void }) {
  const tr = t(locale)
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: 'idle' })
  const root = useRef<HTMLDivElement>(null)
  const failed = state.status === 'error' ? state : null

  useEffect(() => {
    if (state.status === 'idle') return
    const target = root.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"], [role="status"]')
    target?.focus()
  }, [state])

  if (state.status === 'ok') {
    return (
      <div className="form form-done" ref={root}>
        <div role="status" tabIndex={-1}>
          <span className="done-mark"><Icon name="check" size={28} /></span>
          <h3>{tr('f_success_title')}</h3>
          <p>{tr('f_success')}</p>
        </div>
        <div className="form-done-actions">
          {state.waText && (
            <a className="btn btn-wa" href={whatsappUrl(whatsapp, state.waText)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> {tr('f_whatsapp')}
            </a>
          )}
          <button type="button" className="btn btn-outline" onClick={onAgain}>{tr('f_again')}</button>
        </div>
      </div>
    )
  }

  const value = (k: keyof NonNullable<typeof failed>['values'], fallback = '') => failed?.values[k] ?? fallback
  const invalid = (k: InquiryField) =>
    failed?.errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `err-${k}` } : {}
  const errorText = (k: InquiryField) =>
    failed?.errors[k] ? <small className="field-error" id={`err-${k}`}>{tr(failed.errors[k]!)}</small> : null
  const optional = <em> ({tr('f_optional')})</em>

  return (
    <div ref={root}>
      {/* The key re-applies the submitted values after React resets the form. */}
      <form key={failed?.attempt ?? 0} action={action} className="form">
        {failed && <p className="form-alert" role="alert" tabIndex={-1}>{tr(failed.message)}</p>}
        <div className="form-grid">
          <label className="field">
            <span>{tr('f_name')}</span>
            <input name="name" required minLength={2} maxLength={120} autoComplete="name" defaultValue={value('name')} {...invalid('name')} />
            {errorText('name')}
          </label>
          <label className="field">
            <span>{tr('f_phone')}</span>
            <input name="phone" type="tel" required maxLength={40} autoComplete="tel" placeholder="01XXXXXXXXX" defaultValue={value('phone')} {...invalid('phone')} />
            {errorText('phone')}
          </label>
          <label className="field">
            <span>{tr('f_email')}{optional}</span>
            <input name="email" type="email" maxLength={160} autoComplete="email" defaultValue={value('email')} {...invalid('email')} />
            {errorText('email')}
          </label>
          <label className="field">
            <span>{tr('f_company')}{optional}</span>
            <input name="company" maxLength={160} autoComplete="organization" defaultValue={value('company')} />
          </label>
          <label className="field">
            <span>{tr('f_service')}</span>
            <select name="service" defaultValue={value('service', defaultService)}>
              <option value="">{tr('f_any')}</option>
              {services.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span>{tr('f_car')}</span>
            <select name="car" defaultValue={value('car', defaultCar)}>
              <option value="">{tr('f_any')}</option>
              {cars.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span>{tr('f_date')}{optional}</span>
            <input name="pickupDate" type="date" min={today} defaultValue={value('pickupDate')} {...invalid('pickupDate')} />
            {errorText('pickupDate')}
          </label>
          <label className="field">
            <span>{tr('f_duration')}{optional}</span>
            <input name="duration" maxLength={120} placeholder={tr('f_duration_hint')} defaultValue={value('duration')} />
          </label>
          <label className="field is-wide">
            <span>{tr('f_message')}{optional}</span>
            <textarea name="message" rows={4} maxLength={2000} defaultValue={value('message')} />
          </label>
        </div>
        {/* Spam trap, hidden from people and assistive technology. */}
        <div className="hp" aria-hidden="true">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <button className="btn btn-gold btn-lg" type="submit" disabled={pending}>
          {pending ? tr('f_sending') : tr('f_submit')}
        </button>
      </form>
    </div>
  )
}
