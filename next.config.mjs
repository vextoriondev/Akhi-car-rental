import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.120', 'localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
