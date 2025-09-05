import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // TODO: This is a temporary workaround for the cross-origin issue.
  // In a future major version of Next.js, you will need to explicitly
  // configure "allowedDevOrigins" in next.config to allow this.
  // Read more: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    // In newer versions of Next.js, allowedDevOrigins would be here.
  },
  allowedDevOrigins: ["**"],
};

export default nextConfig;
