export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset=".55" stopColor="#ff3d9a" />
          <stop offset="1" stopColor="#ffb020" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0b0b12" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="14.5" fill="none" stroke="url(#lg)" strokeOpacity=".5" strokeWidth="1.5" />
      <path d="M13 47 L32 13 L51 47" fill="none" stroke="url(#lg)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 36 C26 31 40 31 46 36" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".92" />
      <path d="M6 52 H22 M42 52 H58" stroke="url(#lg)" strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
      <circle cx="22" cy="49" r="3.4" fill="#fff" />
      <circle cx="42" cy="49" r="3.4" fill="#fff" />
    </svg>
  )
}

export function Logo({ locale }: { locale: string }) {
  return (
    <span className="logo">
      <LogoMark size={40} />
      <span className="logo-text">
        <b>{locale === 'bn' ? 'আখি' : 'AKHI'}</b>
        <small>{locale === 'bn' ? 'রেন্টাল সলিউশন' : 'RENTAL SOLUTION'}</small>
      </span>
    </span>
  )
}
