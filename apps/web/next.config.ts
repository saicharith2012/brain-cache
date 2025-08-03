import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/a/**"), new URL("https://iad.microlink.io/**")]
  }
};

export default nextConfig;
