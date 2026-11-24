'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CarArt } from './CarArt'

export function CarDetailGallery({
  images,
  carName,
  accent = 'gold',
}: {
  images: string[]
  carName: string
  accent?: string
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={`detail-media-container a-${accent}`}>
        <div className="detail-media-main">
          <CarArt />
        </div>
      </div>
    )
  }

  const activeImage = images[selectedIndex] || images[0]

  return (
    <div className={`detail-gallery a-${accent}`}>
      {/* Main Large Visual Display */}
      <div className="detail-media-main">
        <Image
          key={activeImage}
          src={activeImage}
          alt={carName}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 700px"
          className="detail-main-img"
        />
        <div className="media-overlay-glow" />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="detail-thumbs-strip" role="tablist" aria-label="Photo Gallery Thumbnails">
          {images.map((imgUrl, idx) => {
            const isSelected = idx === selectedIndex
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isSelected}
                className={`detail-thumb-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Photo ${idx + 1} of ${images.length}`}
              >
                <Image src={imgUrl} alt={`${carName} thumbnail ${idx + 1}`} fill sizes="140px" className="object-cover" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
