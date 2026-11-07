export function WhatsAppButton({ number }: { number?: string | null }) {
  if (!number) return null
  return (
    <a className="wa-fab" href={`https://wa.me/${number.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff" aria-hidden>
        <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.8 1.5 5.6 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.4 1.1 1.2-4.2-.3-.4a10 10 0 0 1-1.6-5.4C5.4 9.9 10.1 5.3 16 5.3S26.6 9.9 26.6 15.5 21.9 25.7 16 25.7zm5.8-7.5c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2 2.2 3.4 5.4 4.7c2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.4z" />
      </svg>
    </a>
  )
}
