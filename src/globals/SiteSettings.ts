import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '../server/access'
import { globalContentHooks } from '../server/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isLoggedIn,
  },
  hooks: globalContentHooks,
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Custom website brand logo' },
    },
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'New Akhi Rent-a-Car',
      admin: { description: 'Main site title' },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      defaultValue: 'Daily and monthly car rental in Dhaka',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          defaultValue: '+880 1625-347735',
          admin: { description: 'Public phone number shown to visitors' },
        },
        {
          name: 'whatsapp',
          type: 'text',
          defaultValue: '8801625347735',
          admin: { description: 'WhatsApp number in digits with country code (e.g. 8801625347735)' },
        },
        {
          name: 'email',
          type: 'email',
          defaultValue: 'akhicarrental77@gmail.com',
          admin: { description: 'Support/Inquiry email address' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'address',
          type: 'text',
          localized: true,
          defaultValue: '63, Mohakhali, Dhaka-1213, Bangladesh',
        },
        {
          name: 'hours',
          type: 'text',
          localized: true,
          admin: { description: 'Opening hours. Hidden on the website while empty.' },
        },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    {
      name: 'footerText',
      type: 'textarea',
      localized: true,
      defaultValue:
        'New Akhi Rent-a-Car offers cars, microbuses, SUVs and pickups on daily and monthly rental from Mohakhali, Dhaka.',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Default SEO Metadata',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
          defaultValue: 'New Akhi Rent-a-Car — Car Rental in Dhaka',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Rent a car in Dhaka from New Akhi Rent-a-Car: Toyota Noah, HiAce, Axio, Prado, Mercedes-Benz, BMW and double cabin pickups at daily and monthly rates.',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
