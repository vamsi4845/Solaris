import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "coin-images.coingecko.com",
      },
      {
        hostname: "s2.coinmarketcap.com",
      },
    ],
  },
};

export default nextConfig;
