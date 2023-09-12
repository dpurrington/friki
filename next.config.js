/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    data: '/home/dave/sources/friki/data',
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
