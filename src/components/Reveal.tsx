'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Fades [data-reveal] elements in as they scroll into view. Content is only hidden
 * once this script runs, and never for visitors who prefer reduced motion.
 */
export function Reveal() {
  const pathname = usePathname()
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -6% 0px' },
    )
    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => {
      // Anything already on screen stays put, so nothing flashes on load.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
      el.classList.add('will-reveal')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname])
  return null
}
