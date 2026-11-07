import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', group: 'Catalog', defaultColumns: ['title', 'type', 'order'] },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'daily',
      options: [
        { label: 'Daily / Hourly Rental', value: 'daily' },
        { label: 'Monthly Rental', value: 'monthly' },
        { label: 'Corporate Contract', value: 'corporate' },
        { label: 'Airport Transfer', value: 'airport' },
        { label: 'Wedding & Events', value: 'wedding' },
        { label: 'Tours & Outstation', value: 'tour' },
      ],
    },
    { name: 'icon', type: 'text', defaultValue: '🚗', admin: { description: 'An emoji shown on the card' } },
    {
      name: 'accent',
      type: 'select',
      defaultValue: 'violet',
      options: ['violet', 'pink', 'amber', 'cyan', 'lime', 'orange'],
    },
    { name: 'order', type: 'number', defaultValue: 10 },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'startingPrice', type: 'text', localized: true, admin: { description: 'e.g. From ৳3,500 / day' } },
    {
      name: 'highlights',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true, localized: true }],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
