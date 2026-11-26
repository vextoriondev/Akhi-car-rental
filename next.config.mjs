import { withPayload } from '@payloadcms/next/withPayload'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.120', 'localhost', '127.0.0.1'],
  poweredByHeader: false,
  images: {
    // WebP only: AVIF encodes several times slower on first request.
    formats: ['image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.public.blob.vercel-storage.com' }],
  },
  // Photos kept on local storage must ship with the API function on serverless hosts.
  outputFileTracingIncludes: { '/api/[...slug]': ['./public/media/**'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
