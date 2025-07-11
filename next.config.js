/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/word-count' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/word-count/' : '',
}

module.exports = nextConfig