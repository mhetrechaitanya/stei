/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Rewrite admin.stei.pro/* to /admin-portal/*
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.stei.pro',
          },
        ],
        destination: '/admin-portal/:path*',
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
