import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co'
      },
      {
        protocol: 'https',
        hostname: '**.cdn-docs-ck.com'
      }
    ]
  }
}

export default nextConfig
