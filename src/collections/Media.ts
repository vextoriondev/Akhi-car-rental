import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: () => true },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 480, height: 320, position: 'centre' },
      { name: 'card', width: 960, height: 640, position: 'centre' },
      { name: 'hero', width: 2000, position: 'centre' },
    ],
  },
  fields: [{ name: 'alt', type: 'text', localized: true }],
}
