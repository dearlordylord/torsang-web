/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', process.env.NEXT_IMAGE_DOMAIN],
  },
  i18n: {
    locales: ['en', 'th'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
