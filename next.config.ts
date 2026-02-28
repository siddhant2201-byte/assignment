import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // Replace 'Hero_assignment' with your exact repo name if different
  basePath: isProd ? '/Hero_assignment' : '',
  assetPrefix: isProd ? '/Hero_assignment/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
