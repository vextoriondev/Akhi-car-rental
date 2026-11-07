/** Stylised side-view car silhouette, used when a car has no photo yet. */
export function CarArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 160" className={`car-art ${className}`} aria-hidden>
      <defs>
        <linearGradient id="ca" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--c1)" />
          <stop offset="1" stopColor="var(--c2)" />
        </linearGradient>
      </defs>
      <path
        d="M20 112 C20 98 32 92 52 88 L96 60 C108 52 124 48 142 48 H250 C272 48 286 56 300 70 L338 84 C362 90 380 96 380 112 V120 H20 Z"
        fill="url(#ca)"
        opacity=".95"
      />
      <path d="M108 66 L134 56 H190 V86 H92 Z M204 56 H252 C262 56 270 62 278 72 L286 86 H204 Z" fill="#0b0b12" opacity=".55" />
      <circle cx="104" cy="120" r="26" fill="#0b0b12" />
      <circle cx="104" cy="120" r="12" fill="url(#ca)" />
      <circle cx="304" cy="120" r="26" fill="#0b0b12" />
      <circle cx="304" cy="120" r="12" fill="url(#ca)" />
    </svg>
  )
}
