import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'assets.aceternity.com',
      },
    ],
  },
};

export default nextConfig;
