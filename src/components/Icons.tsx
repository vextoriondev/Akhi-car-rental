import type { SVGProps } from 'react'

const paths = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  close: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  phone: 'M6.5 4h3l1.5 4-2 1.5a11 11 0 005.5 5.5l1.5-2 4 1.5v3a2 2 0 01-2 2A15.5 15.5 0 014.5 6a2 2 0 012-2z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pin: 'M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0113 0c0 5.2-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  seat: 'M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5 20a7 7 0 0114 0',
  gear: 'M6 5v14M12 5v14M18 5v7H6',
  fuel: 'M5 20V5a1 1 0 011-1h7a1 1 0 011 1v15M4 20h11M5 10h9M14 8h2l2 2v7a1.5 1.5 0 003 0V9l-3-3',
  wheel: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3.5 10.5l6 1.5M20.5 10.5l-6 1.5M12 14.500V21',
  bag: 'M5 8h14v12H5zM9 8V5h6v3',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  palette: 'M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2-.6-1.300.3-2.500 1.8-2.500H18a3 3 0 003-3C21 7.5 17 3 12 3zM7.500 11.500h.01M10 7.500h.01M15 7.500h.01',
  grid: 'M4 4h6.5v6.500H4zM13.500 4H20v6.500h-6.500zM4 13.500h6.500V20H4zM13.500 13.500H20V20h-6.500z',
  rows: 'M4 6h16M4 12h16M4 18h16',
  filter: 'M4 6h16M7 12h10M10 18h4',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  pause: 'M9 5v14M15 5v14',
  play: 'M8 5l11 7-11 7z',
  camera: 'M4 8h4l1.500-2.500h5L16 8h4v11H4zM12 16.500a3.500 3.500 0 100-7 3.500 3.500 0 000 7z',
  car: 'M3 17v-4.500l2-1 2-5a2 2 0 011.9-1.300h6.200a2 2 0 011.9 1.300l2 5 2 1V17h-2.500M3 17h2.500M9.500 17h5M5 11.500h14M7.500 19a2 2 0 100-4 2 2 0 000 4zM16.500 19a2 2 0 100-4 2 2 0 000 4z',
  key: 'M8 20a5 5 0 100-10 5 5 0 000 10zM11.500 11.500L20 3M16 7l3 3M13.500 9.500l2 2',
  shield: 'M12 3l7.500 3v5.500c0 4.500-3.200 8-7.500 9.500-4.300-1.500-7.500-5-7.500-9.500V6zM8.800 11.800l2.300 2.300 4.300-4.400',
  tag: 'M4 12.500V4h8.500l7.500 7.500-8.500 8.500zM8.500 8.500h.01',
  chat: 'M4 5h16v11H10l-5 4v-4H4zM8 9.500h8M8 12.500h5',
  clipboard: 'M9 4h6v3H9zM9 5.500H6V21h12V5.500h-3M9 11h6M9 15h6',
  circleCheck: 'M12 21a9 9 0 100-18 9 9 0 000 18zM8 12.500l3 3 5.500-6',
  flower: 'M12 14a3 3 0 100-6 3 3 0 000 6zM12 8c-1-5 5-5 3 0M15 11c5-1 5 5 0 3M12 14c1 5-5 5-3 0M9 11c-5 1-5-5 0-3M12 17v4',
  plane: 'M21 4L3 11l7 2.500L12.500 21zM10 13.500L21 4',
  building: 'M5 21V4h9v17M14 9h5v12M3 21h18M8 8h3M8 12h3M8 16h3',
  map: 'M9 4L3 6.500V20l6-2.500 6 2.500 6-2.500V4l-6 2.500zM9 4v13.500M15 6.500V20',
} as const

/** CMS entries store an emoji; known ones are drawn as matching line icons. */
const EMOJI: Record<string, keyof typeof paths> = {
  '🚗': 'car', '🚙': 'car', '🚘': 'car', '📅': 'calendar', '🏢': 'building', '✈️': 'plane', '💍': 'flower', '💐': 'flower',
  '🏞️': 'map', '💳': 'tag', '🧾': 'clipboard', '💬': 'chat', '📲': 'phone', '📝': 'clipboard', '🤝': 'shield', '🛡️': 'shield', '🕒': 'clock',
}

export type IconName = keyof typeof paths

export function Icon({ name, size = 18, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  )
}

/** Any emoji an editor picks still shows, even without a matching icon. */
export function CmsIcon({ emoji, size = 28 }: { emoji: string; size?: number }) {
  const name = EMOJI[emoji]
  return name ? <Icon name={name} size={size} /> : <>{emoji}</>
}

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.8 1.5 5.6 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.4 1.1 1.2-4.2-.3-.4a10 10 0 0 1-1.6-5.4C5.4 9.9 10.1 5.3 16 5.3S26.6 9.9 26.6 15.5 21.9 25.7 16 25.7zm5.8-7.5c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2 2.2 3.4 5.4 4.7c2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.4z" />
    </svg>
  )
}
