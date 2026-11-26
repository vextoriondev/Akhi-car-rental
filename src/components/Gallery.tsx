'use client'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Icon } from './Icons'
import { t, type Locale } from '@/lib/i18n'
import type { Photo } from '@/lib/types'

export function Gallery({ photos, locale }: { photos: Photo[]; locale: Locale }) {
  const tr = t(locale)
  const [index, setIndex] = useState(0)
  const [viewing, setViewing] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)
  const count = photos.length
  const photo = photos[index] ?? photos[0]
  const go = (step: number) => setIndex((i) => (i + step + count) % count)
  const label = (i: number) => tr('photo_n', { n: i + 1, total: count })

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null || count < 2) return
      const moved = e.changedTouches[0].clientX - touchX.current
      if (Math.abs(moved) > 40) go(moved > 0 ? -1 : 1)
      touchX.current = null
    },
  }

  const arrows = count > 1 && (
    <>
      <button type="button" className="gallery-arrow is-prev" onClick={() => go(-1)} aria-label={tr('gallery_prev')}>
        <Icon name="chevronLeft" size={22} />
      </button>
      <button type="button" className="gallery-arrow is-next" onClick={() => go(1)} aria-label={tr('gallery_next')}>
        <Icon name="chevronRight" size={22} />
      </button>
    </>
  )

  return (
    <div className="gallery" aria-label={tr('gallery_label')} role="group">
      <div className="gallery-stage" {...swipe}>
        {/* Blurred copy fills the frame so portrait photos are never cropped. */}
        <Image src={photo.thumb} alt="" fill sizes="200px" className="gallery-backdrop" />
        <Image
          key={photo.url}
          src={photo.url}
          alt={photo.alt}
          fill
          sizes="(max-width: 1000px) 100vw, 720px"
          className="gallery-photo"
          loading="eager"
          fetchPriority="high"
        />
        <button
          type="button"
          className="gallery-expand"
          onClick={() => {
            setViewing(true)
            dialog.current?.showModal()
          }}
          aria-label={tr('gallery_open')}
        >
          <Icon name="expand" />
        </button>
        {arrows}
        {count > 1 && <span className="gallery-counter">{index + 1} / {count}</span>}
      </div>

      {count > 1 && (
        <div className="gallery-thumbs">
          {photos.map((p, i) => (
            <button key={p.url} type="button" onClick={() => setIndex(i)} aria-label={label(i)} aria-current={i === index ? 'true' : undefined}>
              <Image src={p.thumb} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={tr('gallery_label')}
        onClose={() => setViewing(false)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1)
          if (e.key === 'ArrowRight') go(1)
        }}
      >
        {viewing && (
          <div className="lightbox-in" {...swipe}>
            <Image src={photo.url} alt={photo.alt} fill sizes="100vw" />
          </div>
        )}
        <button type="button" className="lightbox-close" onClick={() => dialog.current?.close()} aria-label={tr('gallery_close')}>
          <Icon name="close" size={22} />
        </button>
        {arrows}
      </dialog>
    </div>
  )
}
