import type { CollectionConfig, FieldHook } from 'payload'
import { isLoggedIn, publishedOrLoggedIn } from '../server/access'
import { contentHooks } from '../server/revalidate'

const slugify = (v: string) =>
  v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** Keeps URLs clean, and builds one from the name + model year when left empty. */
const formatSlug: FieldHook = ({ value, data }) => {
  const source = value || [data?.name, data?.yearRange || data?.year].filter(Boolean).join(' ')
  return source ? slugify(String(source)) : value
}

export const Cars: CollectionConfig = {
  slug: 'cars',
  labels: { singular: 'Vehicle', plural: 'Vehicles' },
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['image', 'name', 'yearRange', 'brand', 'pricePerDay', 'pricePerMonth', 'available', 'status'],
    listSearchableFields: ['name', 'brand', 'slug', 'yearRange'],
    pagination: { defaultLimit: 50 },
  },
  access: {
    read: publishedOrLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: contentHooks,
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Vehicle name without the year, e.g. Toyota X-Noah' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [formatSlug] },
      admin: { description: 'Web address. Leave empty to create it from the name and model year.' },
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
          min: 0,
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
          options: [
            { label: 'Automatic', value: 'auto' },
            { label: 'Manual', value: 'manual' },
          ],
        },
        {
          name: 'fuel',
          type: 'select',
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
          label: 'Daily fare (BDT)',
          min: 0,
          admin: { description: 'Leave empty to hide. With both fares empty the site shows "Price on Request".' },
        },
        {
          name: 'pricePerMonth',
          type: 'number',
          label: 'Monthly fare (BDT)',
          min: 0,
          admin: { description: 'Leave empty for daily-only vehicles.' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      index: true,
      options: [
        { label: 'Published (visible on website)', value: 'published' },
        { label: 'Draft (hidden)', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'available',
      label: 'Available for booking',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Untick to show the vehicle as "Booked".' },
    },
    { name: 'featured', label: 'Show on home page', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'withDriver', label: 'Offered with driver', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first' },
    },
    {
      name: 'accent',
      type: 'select',
      defaultValue: 'gold',
      admin: { hidden: true },
      options: ['gold', 'violet', 'pink', 'amber', 'cyan', 'lime', 'orange'],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Main photo',
      admin: { description: 'Without a photo the site shows "Photos on request".' },
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
      admin: { description: 'Confirmed amenities only' },
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
