'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from './Icons'
import { t, type Locale } from '@/lib/i18n'

type Opt = { value: string; label: string }

export function SearchBar({
  locale,
  brands,
  categories,
  services,
}: {
  locale: Locale
  brands: string[]
  categories: Opt[]
  services: Opt[]
}) {
  const tr = t(locale)
  const router = useRouter()
  const [form, setForm] = useState({ q: '', brand: '', category: '', service: '' })
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(Object.entries(form).filter(([, v]) => v.trim()))
    router.push(`/${locale}/fleet${params.size ? `?${params}` : ''}`)
  }

  const select = (key: 'brand' | 'category' | 'service', label: string, all: string, options: Opt[]) => (
    <label>
      <span>{label}</span>
      <select value={form[key]} onChange={set(key)}>
        <option value="">{all}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )

  return (
    <form className="searchbar" onSubmit={submit} role="search" aria-label={tr('search_title')}>
      <label>
        <span>{tr('search_label')}</span>
        <input type="search" value={form.q} onChange={set('q')} placeholder={tr('search_placeholder')} />
      </label>
      {select('brand', tr('brand_label'), tr('all_brands'), brands.map((b) => ({ value: b, label: b })))}
      {select('category', tr('category_label'), tr('all_categories'), categories)}
      {select('service', tr('f_service'), tr('all_services'), services)}
      <button className="btn btn-gold" type="submit"><Icon name="search" /> {tr('search_btn')}</button>
    </form>
  )
}
