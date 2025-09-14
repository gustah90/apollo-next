import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    optimizeCss: false,
  },
  transpilePackages: ['@apollo/client', '@apollo/experimental-nextjs-app-support'],
  images: {
    domains: ['images2.imgbox.com', 'live.staticflickr.com'],
  },
}

export default nextConfig
