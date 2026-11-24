import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
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
      defaultValue: 'Akhi Car Rental',
      admin: { description: 'Main site title' },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      defaultValue: 'Premium Car Rental & Chauffeur Service in Bangladesh',
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
          defaultValue: 'Sector 3, Uttara, Dhaka, Bangladesh',
        },
        {
          name: 'hours',
          type: 'text',
          localized: true,
          defaultValue: '24/7 Available (Open 24 Hours)',
        },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text', defaultValue: 'https://facebook.com/akhicarrental' },
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
        'Akhi Car Rental is a premier luxury and corporate car rental service provider in Bangladesh. Experience world-class reliability, courteous professional chauffeurs, and competitive transparent pricing.',
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
          defaultValue: 'Akhi Car Rental — Premium Car Rental & Chauffeur Solution',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Rent luxury sedans, premium SUVs, Hiace microbuses, and executive coaches across Dhaka and Bangladesh. 24/7 airport transfer, daily and monthly car rental with professional drivers.',
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
