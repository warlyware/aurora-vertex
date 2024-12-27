/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@project-serum/anchor'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
