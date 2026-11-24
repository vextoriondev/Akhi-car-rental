import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Leads',
    defaultColumns: ['name', 'phone', 'service', 'car', 'status', 'createdAt'],
  },
  access: {
    // Anyone can submit an inquiry; only logged-in admins/editors can read/manage them
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => (req.user as any)?.role === 'superadmin',
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Customer full name' } },
    { name: 'phone', type: 'text', required: true, admin: { description: 'Contact phone / WhatsApp number' } },
    { name: 'email', type: 'email', admin: { description: 'Email address (optional)' } },
    { name: 'service', type: 'relationship', relationTo: 'services', admin: { description: 'Requested service type' } },
    { name: 'car', type: 'relationship', relationTo: 'cars', admin: { description: 'Specific vehicle inquired' } },
    { name: 'pickupDate', type: 'date', admin: { description: 'Requested pickup date' } },
    { name: 'duration', type: 'text', admin: { description: 'Rental duration (e.g. 3 days, 1 month, yearly)' } },
    { name: 'company', type: 'text', admin: { description: 'Company name if corporate booking' } },
    { name: 'message', type: 'textarea', admin: { description: 'Customer message / requirements' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New Lead', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Confirmed / Booked', value: 'confirmed' },
        { label: 'Closed / Cancelled', value: 'closed' },
      ],
      access: { create: ({ req }) => Boolean(req.user) },
    },
  ],
}
