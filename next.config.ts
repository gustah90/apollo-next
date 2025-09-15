import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    optimizeCss: false,
  },
  transpilePackages: ['@apollo/client', '@apollo/client-integration-nextjs'],
  images: {
    domains: [
      // Flickr
      'live.staticflickr.com',
      'farm1.staticflickr.com',
      'farm2.staticflickr.com',
      'farm3.staticflickr.com',
      'farm4.staticflickr.com',
      'farm5.staticflickr.com',
      'farm6.staticflickr.com',
      'farm7.staticflickr.com',
      'farm8.staticflickr.com',
      'farm9.staticflickr.com',

      // ImgBox / Imgur
      'images2.imgbox.com',
      'i.imgur.com',

      // YouTube thumbnails
      'i.ytimg.com',
      'img.youtube.com',
    ],
  },
}

export default nextConfig
