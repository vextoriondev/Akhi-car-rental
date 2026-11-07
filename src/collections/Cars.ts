import type { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'category', 'pricePerDay', 'available', 'featured'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL part, e.g. toyota-noah-2022' },
    },
    { name: 'brand', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'sedan',
      options: [
        { label: 'Economy', value: 'economy' },
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
        { label: 'Microbus / Van', value: 'microbus' },
        { label: 'Luxury', value: 'luxury' },
        { label: 'Bus / Coaster', value: 'bus' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'year', type: 'number' },
        { name: 'seats', type: 'number', required: true, defaultValue: 4 },
        { name: 'luggage', type: 'number', defaultValue: 2 },
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
        { name: 'color', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'pricePerDay', type: 'number', required: true, admin: { description: 'BDT per day' } },
        { name: 'pricePerMonth', type: 'number', admin: { description: 'BDT per month (monthly rental)' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'withDriver', type: 'checkbox', defaultValue: true },
        { name: 'available', type: 'checkbox', defaultValue: true },
        { name: 'featured', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'accent',
      type: 'select',
      defaultValue: 'violet',
      admin: { description: 'Glow colour used on the card when no photo is set' },
      options: ['violet', 'pink', 'amber', 'cyan', 'lime', 'orange'],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true, localized: true }],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Services this car is offered under' },
    },
  ],
}
