import type { CollectionConfig } from 'payload'
import { publicContent } from '../server/access'
import { contentHooks } from '../server/revalidate'

export const Facilities: CollectionConfig = {
  slug: 'facilities',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'icon', 'order'] },
  access: publicContent,
  hooks: contentHooks,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'icon', type: 'text', defaultValue: '✨', admin: { description: 'An emoji shown on the card' } },
    { name: 'text', type: 'textarea', localized: true },
    {
      name: 'accent',
      type: 'select',
      defaultValue: 'gold',
      options: ['gold', 'violet', 'pink', 'amber', 'cyan', 'lime', 'orange'],
    },
    { name: 'order', type: 'number', defaultValue: 10 },
  ],
}
