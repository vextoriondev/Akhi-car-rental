import { notFound } from 'next/navigation'

/** Sends unknown addresses to the translated 404 page, inside the normal layout. */
export default function CatchAll() {
  notFound()
}
