import type { GlobalConfig } from 'payload'

const themeOptions = ['gold', 'violet', 'pink', 'amber', 'cyan', 'lime', 'orange']

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Hero carousel slides (full-page background)',
      minRows: 1,
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true },
        { name: 'ctaLink', type: 'text', defaultValue: '/fleet' },
        { name: 'theme', type: 'select', defaultValue: 'gold', options: themeOptions },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional full-page background photo. Without it, an animated gradient is used.' },
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'title', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'whyUs',
      type: 'array',
      fields: [
        { name: 'icon', type: 'text', defaultValue: '✨' },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
  ],
}
