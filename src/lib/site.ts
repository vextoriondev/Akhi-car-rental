export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/**
 * Business contact details used only if Site Settings cannot be read, so visitors
 * can still reach the company during a database outage.
 */
export const CONTACT_DEFAULTS = {
  siteName: 'New Akhi Rent-a-Car',
  phone: '+880 1625-347735',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735',
  email: 'akhicarrental77@gmail.com',
  address: '63, Mohakhali, Dhaka-1213, Bangladesh',
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

export const whatsappUrl = (phone: string, message?: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
