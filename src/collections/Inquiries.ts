import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Leads',
    defaultColumns: ['name', 'phone', 'service', 'car', 'status', 'createdAt'],
  },
  access: {
    // anyone can submit an inquiry; only logged-in admins can read/manage them
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'car', type: 'relationship', relationTo: 'cars' },
    { name: 'pickupDate', type: 'date' },
    { name: 'duration', type: 'text', admin: { description: 'e.g. 3 days / 6 months / 1 year contract' } },
    { name: 'company', type: 'text', admin: { description: 'For corporate inquiries' } },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Closed', value: 'closed' },
      ],
      access: { create: ({ req }) => Boolean(req.user) },
    },
  ],
}
