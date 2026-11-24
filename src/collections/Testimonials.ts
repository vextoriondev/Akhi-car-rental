import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name', group: 'Content' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
  ],
}
