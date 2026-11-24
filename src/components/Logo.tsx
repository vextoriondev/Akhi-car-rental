export function LogoMark({ size = 42 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
      className="logo-mark"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d070" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#aa7c11" />
        </linearGradient>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(247, 208, 112, 0.6)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
          <stop offset="100%" stopColor="rgba(170, 124, 17, 0.4)" />
        </linearGradient>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#161822" />
          <stop offset="100%" stopColor="#0a0b10" />
        </linearGradient>
      </defs>
      {/* Outer shield frame */}
      <polygon
        points="32,4 58,14 58,38 32,58 6,38 6,14"
        fill="url(#shieldBg)"
        stroke="url(#borderGrad)"
        strokeWidth="1.75"
      />
      {/* Inner crest contour */}
      <polygon
        points="32,9 53,17 53,36 32,52 11,36 11,17"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      {/* Sleek Automotive 'A' Emblem */}
      <path
        d="M32 15 L45 44 L37.5 44 L34 35.5 L30 35.5 L26.5 44 L19 44 Z M32 23.5 L30.8 30.5 L33.2 30.5 Z"
        fill="url(#goldGrad)"
      />
      {/* Horizontal wing accent lines */}
      <path
        d="M17 38 C 24 33, 40 33, 47 38"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Star / diamond pinnacle */}
      <polygon points="32,7 33.5,10.5 37,12 33.5,13.5 32,17 30.5,13.5 27,12 30.5,10.5" fill="#f7d070" />
    </svg>
  )
}

export function Logo({ locale }: { locale: string }) {
  const isBn = locale === 'bn'
  return (
    <span className="logo">
      <LogoMark size={42} />
      <span className="logo-text">
        <b className="logo-brand">{isBn ? 'আখি কার রেন্টাল' : 'AKHI CAR RENTAL'}</b>
        <small className="logo-sub">{isBn ? 'প্রিমিয়াম অটোমোটিভ সলিউশন' : 'LUXURY FLEET & CHAUFFEUR'}</small>
      </span>
    </span>
  )
}
