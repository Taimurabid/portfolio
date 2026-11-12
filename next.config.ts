import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the project root: a lockfile in a parent folder would otherwise make
  // Next.js guess the wrong workspace root when tracing server files.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
