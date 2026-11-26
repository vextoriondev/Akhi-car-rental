import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const hasDb = Boolean(
  process.env.POSTGRES_URL &&
    !process.env.POSTGRES_URL.includes('user:password@host') &&
    process.env.POSTGRES_URL.trim() !== '',
)

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => {
  if (!hasDb) {
    return Promise.resolve({ title: 'Database Connection Required — New Akhi Rent-a-Car Admin' })
  }
  return generatePageMetadata({ config, params, searchParams })
}

const Page = ({ params, searchParams }: Args) => {
  if (!hasDb) {
    return (
      <div style={{ maxWidth: 560, margin: '20vh auto', padding: 24, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Database connection required</h1>
        <p>Set POSTGRES_URL in your environment, then restart the server to use the admin panel.</p>
        <p><a href="/en" style={{ color: '#e8c877' }}>Back to the website</a></p>
      </div>
    )
  }

  return RootPage({ config, params, searchParams, importMap })
}

export default Page
