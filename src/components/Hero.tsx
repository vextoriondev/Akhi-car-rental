'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { HeadingAccent } from './HeadingAccent'
import { t, type Locale } from '@/lib/i18n'
import type { Slide } from '@/lib/types'

const INTERVAL = 6000
const SWIPE_DISTANCE = 50

/**
 * Sliding carousel. Only the current and the outgoing slide are ever visible, and
 * they travel side by side, so one slide can never be drawn over another's text.
 */
export function Hero({ slides, locale }: { slides: Slide[]; locale: Locale }) {
  const tr = t(locale)
  const count = slides.length
  const [{ index, leaving, direction }, setState] = useState({ index: 0, leaving: -1, direction: 1 })
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [touching, setTouching] = useState(false)
  const [pageHidden, setPageHidden] = useState(false)
  const [mounted, setMounted] = useState(false) // other photos start loading after the first
  const touch = useRef<{ x: number; y: number } | null>(null)
  const running = playing && !hovered && !focused && !touching && !pageHidden && count > 1

  const goTo = useCallback((next: number, dir: number) => {
    setState((s) => {
      const target = (next + count) % count
      return target === s.index ? s : { index: target, leaving: s.index, direction: dir }
    })
  }, [count])
  const step = useCallback((dir: number) => {
    setState((s) => ({ index: (s.index + dir + count) % count, leaving: s.index, direction: dir }))
  }, [count])

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false)
    const onVisibility = () => setPageHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // The progress bar on the active dot restarts with this timer, so the two stay in step.
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => step(1), INTERVAL)
    return () => clearTimeout(timer)
  }, [running, index, step])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') step(-1)
    if (e.key === 'ArrowRight') step(1)
  }
  function onTouchStart(e: React.TouchEvent) {
    setTouching(true)
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    setTouching(false)
    const start = touch.current
    touch.current = null
    if (!start || count < 2) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    // Mostly-vertical gestures are page scrolling, not a swipe.
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1)
  }

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label={slides[0]?.title}
      data-direction={direction > 0 ? 'next' : 'prev'}
      onKeyDown={onKeyDown}
      // Hover pauses for a mouse only: a tap must not leave the carousel paused for good.
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
      onFocus={(e) => setFocused((e.target as HTMLElement).matches(':focus-visible'))}
      onBlur={() => setFocused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => setTouching(false)}
    >
      <div className="hero-slides" aria-live={running ? 'off' : 'polite'}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide${i === index ? ' is-active' : ''}${i === leaving && i !== index ? ' is-leaving' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            inert={i !== index}
          >
            <div className="hero-photo">
              {slide.photo && (i === 0 || mounted) && (
                <Image
                  src={slide.photo.url}
                  alt={slide.photo.alt}
                  fill
                  sizes="(max-width: 960px) 100vw, 68vw"
                  loading="eager"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  draggable={false}
                />
              )}
            </div>
            <div className="container hero-in">
              <div className="hero-copy">
                {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
                {i === 0 ? (
                  <h1><HeadingAccent text={slide.title} /></h1>
                ) : (
                  <p className="hero-title"><HeadingAccent text={slide.title} /></p>
                )}
                {slide.subtitle && <p className="lead">{slide.subtitle}</p>}
                <div className="hero-buttons">
                  {slide.ctaLabel && (
                    <Link className="btn btn-gold btn-lg" href={`/${locale}${slide.ctaLink.replace(/^\/(en|bn)(?=\/)/, '')}`}>
                      {slide.ctaLabel} <Icon name="arrow" />
                    </Link>
                  )}
                  <Link className="btn btn-outline btn-lg" href={`/${locale}/contact`}>{tr('book_now')}</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button type="button" className="hero-arrow is-prev" onClick={() => step(-1)} aria-label={tr('hero_prev')}>
            <Icon name="chevronLeft" size={22} />
          </button>
          <button type="button" className="hero-arrow is-next" onClick={() => step(1)} aria-label={tr('hero_next')}>
            <Icon name="chevronRight" size={22} />
          </button>
          <div className="hero-controls">
            <div className="hero-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`${tr('hero_goto')} ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                >
                  <span>
                    {i === index && (
                      <i key={`${index}-${running}`} className={running ? 'is-running' : ''} style={{ animationDuration: `${INTERVAL}ms` }} />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <button type="button" className="hero-play" onClick={() => setPlaying((p) => !p)} aria-label={tr(playing ? 'hero_pause' : 'hero_play')}>
              <Icon name={playing ? 'pause' : 'play'} size={16} />
            </button>
          </div>
        </>
      )}
    </section>
  )
}
