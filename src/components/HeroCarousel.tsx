'use client'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

export type Slide = {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  theme?: string | null
  imageUrl?: string | null
}

export function HeroCarousel({
  slides,
  locale,
  children,
}: {
  slides: Slide[]
  locale: string
  children?: React.ReactNode
}) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n])

  useEffect(() => {
    if (paused || n < 2) return
    const id = setInterval(() => go(1), 6500)
    return () => clearInterval(id)
  }, [paused, go, n])

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, idx) => (
        <div key={idx} className={`slide a-${s.theme || 'violet'} ${idx === i ? 'active' : ''}`} aria-hidden={idx !== i}>
          <div className="slide-bg" style={s.imageUrl ? { backgroundImage: `url(${s.imageUrl})` } : undefined} />
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="grid-lines" />
          <div className="container slide-in">
            {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
            <h1>{s.title}</h1>
            {s.subtitle && <p className="lead">{s.subtitle}</p>}
            {s.ctaLabel && (
              <Link className="btn btn-lg" href={`/${locale}${s.ctaLink || '/fleet'}`} tabIndex={idx === i ? 0 : -1}>
                {s.ctaLabel} →
              </Link>
            )}
          </div>
        </div>
      ))}

      {n > 1 && (
        <>
          <button className="arrow-btn left" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
          <button className="arrow-btn right" onClick={() => go(1)} aria-label="Next slide">›</button>
          <div className="dots">
            {slides.map((_, idx) => (
              <button key={idx} className={idx === i ? 'on' : ''} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
        </>
      )}
      <div className="hero-bottom container">{children}</div>
    </section>
  )
}
