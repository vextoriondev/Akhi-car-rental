import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import { publicContent } from '../server/access'
import { contentHooks } from '../server/revalidate'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'filesize', 'createdAt'],
  },
  access: publicContent,
  hooks: contentHooks,
  upload: {
    // Used when Vercel Blob is not configured; Blob replaces local storage when it is.
    staticDir: path.resolve(dirname, '../../public/media'),
    // No SVG: uploaded SVG files can carry scripts.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    adminThumbnail: 'thumb',
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480, height: 320, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 960, height: 640, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Descriptive text for accessibility and SEO' },
    },
  ],
}
