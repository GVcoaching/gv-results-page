import type { NextConfig } from "next";

const LIBRARY_OPT_IN = "https://go.gvcoaching.co.uk/dental-performance-library";

const nextConfig: NextConfig = {
  // Clean share links for The Dental Performance Library (hosted in GHL).
  // Temporary redirects so they can be changed later without browsers caching them.
  async redirects() {
    return [
      { source: "/dental-performance-library", destination: LIBRARY_OPT_IN, permanent: false },
      { source: "/library", destination: LIBRARY_OPT_IN, permanent: false },
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
