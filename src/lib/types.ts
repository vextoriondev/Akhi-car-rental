/** Slim, serialisable shapes the website works with (also what reaches client components). */
export type Photo = { url: string; card: string; thumb: string; alt: string }

export type Car = {
  id: number
  slug: string
  name: string
  brand: string
  category: string
  years: string
  seats: number
  luggage: number | null
  transmission: string | null
  fuel: string | null
  color: string | null
  pricePerDay: number | null
  pricePerMonth: number | null
  available: boolean
  featured: boolean
  withDriver: boolean
  description: string
  features: string[]
  serviceSlugs: string[]
  photo: Photo | null
  gallery: Photo[]
  updatedAt: string
}

export type Service = {
  id: number
  slug: string
  type: string
  title: string
  icon: string
  summary: string
  description: string
  startingPrice: string
  highlights: string[]
  photo: Photo | null
}

export type Facility = { id: number; title: string; text: string; icon: string }
export type Testimonial = { id: number; name: string; role: string; quote: string; rating: number }

export type Slide = {
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaLink: string
  photo: Photo | null
}

export type HomeContent = {
  slides: Slide[]
  about: { eyebrow: string; title: string; text: string }
  stats: { value: string; label: string }[]
  whyUs: { icon: string; title: string; text: string }[]
}

export type Settings = {
  siteName: string
  tagline: string
  phone: string
  whatsapp: string
  email: string
  address: string
  hours: string
  footerText: string
  metaTitle: string
  metaDescription: string
  socials: { label: string; href: string }[]
  logo: Photo | null
}
