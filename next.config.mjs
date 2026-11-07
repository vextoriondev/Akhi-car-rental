import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.public.blob.vercel-storage.com' }] },
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
