import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
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

const secret = process.env.PAYLOAD_SECRET || ''
if (process.env.NODE_ENV === 'production' && hasDb && (!secret || secret === 'change-me')) {
  throw new Error('PAYLOAD_SECRET must be set to a long random value in production.')
}

export default buildConfig({
  // No serverURL on purpose: relative API and media URLs work on any host or port.
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — New Akhi Rent-a-Car Admin' },
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
  secret: secret || 'local-development-only-secret',
  graphQL: { disable: true },
  upload: { limits: { fileSize: 8 * 1024 * 1024 } },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: vercelPostgresAdapter({
    pool: { connectionString: hasDb ? dbUrl : '' },
    // Payload only ever pushes the schema outside production. Production databases
    // are set up with migrations (`npm run db:migrate`).
    push: hasDb && process.env.PAYLOAD_PUSH !== 'false',
    migrationDir: path.resolve(dirname, 'migrations'),
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
