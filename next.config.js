/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // i18n handled by next-intl middleware
  output: 'standalone',
};

module.exports = nextConfig;
