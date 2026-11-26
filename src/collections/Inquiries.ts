import type { CollectionConfig } from 'payload'
import { isLoggedIn, isSuperAdmin } from '../server/access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Leads',
    defaultColumns: ['name', 'phone', 'service', 'car', 'status', 'createdAt'],
  },
  access: {
    // Visitors submit through the website's server action, which validates and
    // rate-limits. The public REST API can neither create nor read leads.
    create: isLoggedIn,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isSuperAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120, admin: { description: 'Customer full name' } },
    { name: 'phone', type: 'text', required: true, index: true, maxLength: 40, admin: { description: 'Contact phone / WhatsApp number' } },
    { name: 'email', type: 'email', admin: { description: 'Email address (optional)' } },
    { name: 'service', type: 'relationship', relationTo: 'services', admin: { description: 'Requested service type' } },
    { name: 'car', label: 'Vehicle', type: 'relationship', relationTo: 'cars', admin: { description: 'Specific vehicle inquired' } },
    { name: 'pickupDate', type: 'date', admin: { description: 'Requested pickup date' } },
    { name: 'duration', type: 'text', maxLength: 120, admin: { description: 'Rental duration (e.g. 3 days, 1 month, yearly)' } },
    { name: 'company', type: 'text', maxLength: 160, admin: { description: 'Company name if corporate booking' } },
    { name: 'message', type: 'textarea', maxLength: 2500, admin: { description: 'Customer message / requirements' } },
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
      admin: { position: 'sidebar' },
    },
  ],
}
