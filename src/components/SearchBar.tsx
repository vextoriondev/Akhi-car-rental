'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Opt = { value: string; label: string }

export function SearchBar({
  locale,
  services,
  categories,
  labels,
}: {
  locale: string
  services: Opt[]
  categories: Opt[]
  labels: { placeholder: string; service: string; category: string; btn: string }
}) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [service, setService] = useState('')
  const [category, setCategory] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (service) p.set('service', service)
    if (category) p.set('category', category)
    router.push(`/${locale}/fleet${p.size ? `?${p}` : ''}`)
  }

  return (
    <form className="searchbar" onSubmit={submit} role="search">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.placeholder} aria-label={labels.placeholder} />
      <select value={service} onChange={(e) => setService(e.target.value)} aria-label={labels.service}>
        <option value="">{labels.service}</option>
        {services.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label={labels.category}>
        <option value="">{labels.category}</option>
        {categories.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button className="btn" type="submit">{labels.btn}</button>
    </form>
  )
}
