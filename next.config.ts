import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // CRITICAL: This allows GitHub to serve your site without a server
  images: {
    unoptimized: true, // Required because GitHub Pages doesn't support Next.js image optimization
  },
  // Optional: Only add these if your URL has a subfolder (e.g., username.github.io/my-repo/)
  // basePath: '/your-repo-name',
};

export default nextConfig;
