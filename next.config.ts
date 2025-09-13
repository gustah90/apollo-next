import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
  transpilePackages: ['@apollo/client', '@apollo/experimental-nextjs-app-support'],
  images: {
    domains: ['images2.imgbox.com', 'live.staticflickr.com'],
  },
  swcMinify: false,
}

export default nextConfig
