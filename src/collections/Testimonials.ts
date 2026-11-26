import type { CollectionConfig } from 'payload'
import { publicContent } from '../server/access'
import { contentHooks } from '../server/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name', group: 'Content' },
  access: publicContent,
  hooks: contentHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
  ],
}
