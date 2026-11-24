import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import Link from 'next/link'

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
    return Promise.resolve({ title: 'Database Connection Required — Akhi Car Rental Admin' })
  }
  return generatePageMetadata({ config, params, searchParams })
}

const Page = ({ params, searchParams }: Args) => {
  if (!hasDb) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a0d14',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '620px',
            width: '100%',
            backgroundColor: '#111827',
            border: '1px solid #1f293d',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⚡</span>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Akhi Car Rental — Admin Setup
              </h1>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                PostgreSQL Database Connection Required
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#1e293b',
              borderLeft: '4px solid #f59e0b',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              color: '#e2e8f0',
              lineHeight: 1.6,
            }}
          >
            The public car rental website is currently running smoothly with built-in preview data. To log in and manage the fleet, services, and inquiries in this CMS admin panel, provide your PostgreSQL connection string in <strong>.env.local</strong>.
          </div>

          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.75rem' }}>
            Quick Setup Steps:
          </h2>
          <ol
            style={{
              paddingLeft: '1.25rem',
              color: '#94a3b8',
              fontSize: '0.88rem',
              lineHeight: 1.8,
              marginBottom: '1.5rem',
            }}
          >
            <li>
              Open <code style={{ color: '#38bdf8', backgroundColor: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>.env.local</code> in your project folder.
            </li>
            <li>
              Uncomment line 3 and paste your Neon or PostgreSQL URL:
              <pre
                style={{
                  backgroundColor: '#050811',
                  border: '1px solid #1e293b',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  color: '#4ade80',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
POSTGRES_URL=postgres://user:password@ep-xyz.neon.tech/neondb?sslmode=require
              </pre>
              <small style={{ color: '#64748b' }}>
                Tip: If deployed on Vercel, run <code style={{ color: '#cbd5e1' }}>npx vercel env pull .env.local</code> or copy it from your Vercel Storage settings.
              </small>
            </li>
            <li>Restart your dev server (<strong>npm run dev</strong>).</li>
            <li>
              Log in with your pre-configured credentials:
              <div style={{ marginTop: '0.5rem', color: '#f8fafc' }}>
                Email: <strong style={{ color: '#fbbf24' }}>admin@akhicarrental.com</strong>
                <br />
                Password: <strong style={{ color: '#fbbf24' }}>AkhiRentalAdmin2026!</strong>
              </div>
            </li>
          </ol>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link
              href="/en"
              style={{
                backgroundColor: '#f59e0b',
                color: '#000',
                fontWeight: 600,
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return RootPage({ config, params, searchParams, importMap })
}

export default Page
