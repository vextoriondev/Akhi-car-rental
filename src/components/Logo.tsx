import Image from 'next/image'
import type { Photo } from '@/lib/types'

/** Shows the logo uploaded in Site Settings, or a gold car outline above the site name. */
export function Logo({ siteName, logo }: { siteName: string; logo?: Photo | null }) {
  return (
    <span className={`logo${logo ? ' has-image' : ''}`}>
      {logo ? (
        <Image src={logo.thumb} alt="" width={48} height={42} className="logo-img" />
      ) : (
        <svg className="logo-swoosh" viewBox="0 0 150 30" width="112" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M4 25C20 21 28 20 40 16C54 7 66 3 84 3C101 3 112 8 122 15C133 17 142 20 146 25" strokeWidth="3.2" />
          <path d="M45 17C62 12 94 11 116 15" strokeWidth="1.8" opacity="0.75" />
        </svg>
      )}
      {/* Non-breaking hyphens keep "Rent-a-Car" together when the name wraps. */}
      <span className="logo-name">{siteName.replace(/-/g, String.fromCharCode(0x2011))}</span>
    </span>
  )
}
