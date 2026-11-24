/** Stylised side-view luxury car silhouette, used when a car has no photo yet. */
export function CarArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 170" className={`car-art ${className}`} aria-hidden>
      <defs>
        <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a2d3d" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f7d070" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d070" />
          <stop offset="100%" stopColor="#555" />
        </linearGradient>
      </defs>
      {/* Aerodynamic car profile */}
      <path
        d="M25 120 C25 106 38 100 60 96 L105 66 C120 56 138 50 160 50 H270 C294 50 310 58 325 74 L365 90 C388 96 405 102 405 120 V130 H25 Z"
        fill="url(#carBody)"
        opacity="0.95"
      />
      {/* Windows & roofline */}
      <path
        d="M118 72 L146 60 H205 V92 H102 Z M220 60 H272 C283 60 292 66 300 76 L310 92 H220 Z"
        fill="#0d0e15"
        opacity="0.85"
      />
      {/* Headlight & taillight glow */}
      <path d="M380 94 L404 100 L385 106 Z" fill="#22d3ee" opacity="0.9" style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }} />
      <path d="M26 102 L36 102 L32 110 Z" fill="#ef4444" opacity="0.8" />
      {/* Wheels */}
      <g>
        <circle cx="112" cy="128" r="28" fill="#090a0f" stroke="#333" strokeWidth="2" />
        <circle cx="112" cy="128" r="16" fill="url(#rimGrad)" />
        <circle cx="112" cy="128" r="6" fill="#111" />
      </g>
      <g>
        <circle cx="320" cy="128" r="28" fill="#090a0f" stroke="#333" strokeWidth="2" />
        <circle cx="320" cy="128" r="16" fill="url(#rimGrad)" />
        <circle cx="320" cy="128" r="6" fill="#111" />
      </g>
    </svg>
  )
}
