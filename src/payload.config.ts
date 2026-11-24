import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cars } from './collections/Cars'
import { Services } from './collections/Services'
import { Facilities } from './collections/Facilities'
import { Testimonials } from './collections/Testimonials'
import { Inquiries } from './collections/Inquiries'
import { SiteSettings } from './globals/SiteSettings'
import { Home } from './globals/Home'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dbUrl = process.env.POSTGRES_URL || ''

const hasDb = Boolean(
  dbUrl &&
    !dbUrl.includes('user:password@host') &&
    dbUrl.trim() !== '',
)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Akhi Car Rental Admin' },
  },
  collections: [Cars, Services, Facilities, Testimonials, Inquiries, Media, Users],
  globals: [Home, SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'বাংলা', code: 'bn' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-change-me',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: vercelPostgresAdapter({
    pool: { connectionString: hasDb ? dbUrl : '' },
    // Only push schema when a valid database connection string is provided
    push: hasDb && (process.env.NODE_ENV !== 'production' || process.env.PAYLOAD_PUSH === 'true'),
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  sharp,
})
