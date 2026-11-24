import type { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'category', 'pricePerDay', 'pricePerMonth', 'available', 'featured', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Vehicle name (e.g., Toyota Noah, Toyota Prado, Hiace Super GL)' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL slug, e.g. toyota-noah-2022' },
    },
    {
      name: 'brand',
      type: 'text',
      required: true,
      admin: { description: 'Brand or make (e.g. Toyota, Mitsubishi, Mercedes-Benz, Hyundai)' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'sedan',
      options: [
        { label: 'Economy', value: 'economy' },
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV / Jeep', value: 'suv' },
        { label: 'Microbus / Van', value: 'microbus' },
        { label: 'Luxury', value: 'luxury' },
        { label: 'Pickup', value: 'pickup' },
        { label: 'Bus / Coaster', value: 'bus' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'number',
          admin: { description: 'Specific model year, e.g. 2022' },
        },
        {
          name: 'yearRange',
          type: 'text',
          admin: { description: 'Model year or span (e.g. 2010–2012, 2018–2022)' },
        },
        {
          name: 'seats',
          type: 'number',
          required: true,
          defaultValue: 4,
          admin: { description: 'Passenger seating capacity' },
        },
        {
          name: 'luggage',
          type: 'number',
          defaultValue: 2,
          admin: { description: 'Luggage bags capacity' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'transmission',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Automatic', value: 'auto' },
            { label: 'Manual', value: 'manual' },
          ],
        },
        {
          name: 'fuel',
          type: 'select',
          defaultValue: 'octane',
          options: [
            { label: 'Octane', value: 'octane' },
            { label: 'Petrol', value: 'petrol' },
            { label: 'Diesel', value: 'diesel' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'CNG', value: 'cng' },
            { label: 'Electric', value: 'electric' },
          ],
        },
        { name: 'color', type: 'text', admin: { description: 'Color (e.g. Pearl White, Jet Black, Silver)' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'pricePerDay',
          type: 'number',
          required: false,
          admin: { description: 'BDT per day (leave blank for On Request or monthly-only vehicles)' },
        },
        {
          name: 'pricePerMonth',
          type: 'number',
          required: false,
          admin: { description: 'BDT per month (leave blank for On Request or daily-only vehicles)' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'published',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
          ],
        },
        { name: 'available', type: 'checkbox', defaultValue: true },
        { name: 'featured', type: 'checkbox', defaultValue: false },
        { name: 'withDriver', type: 'checkbox', defaultValue: true },
        {
          name: 'order',
          type: 'number',
          defaultValue: 10,
          admin: { description: 'Display priority (lower numbers appear first)' },
        },
      ],
    },
    {
      name: 'accent',
      type: 'select',
      defaultValue: 'gold',
      admin: { description: 'Accent tone styling used on card badges and glows' },
      options: ['gold', 'violet', 'pink', 'amber', 'cyan', 'lime', 'orange'],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Main hero photo of the vehicle' },
    },
    {
      name: 'gallery',
      type: 'array',
      admin: { description: 'Additional interior & exterior photos' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Full description of the vehicle condition, ideal use-cases, and features' },
    },
    {
      name: 'features',
      type: 'array',
      admin: { description: 'Key amenities (e.g. Dual AC, Push Start, Leather Seats, Android Audio)' },
      fields: [{ name: 'label', type: 'text', required: true, localized: true }],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Services this car is offered under (e.g. Airport Transfer, Monthly Rental)' },
    },
  ],
}
