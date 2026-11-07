import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: { read: () => true },
  fields: [
    { name: 'phone', type: 'text', defaultValue: '+880 1000 000000' },
    { name: 'whatsapp', type: 'text', admin: { description: 'Digits only with country code, e.g. 8801XXXXXXXXX' } },
    { name: 'email', type: 'email', defaultValue: 'hello@akhirental.com' },
    { name: 'address', type: 'text', localized: true, defaultValue: 'Dhaka, Bangladesh' },
    { name: 'hours', type: 'text', localized: true, defaultValue: 'Open 24/7' },
    { name: 'facebook', type: 'text' },
    { name: 'instagram', type: 'text' },
    { name: 'tagline', type: 'text', localized: true, defaultValue: 'Drive the extraordinary' },
  ],
}
