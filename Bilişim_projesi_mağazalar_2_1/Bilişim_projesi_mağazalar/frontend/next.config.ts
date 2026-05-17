import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: ".", 
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "dummyjson.com" },
    ],
  },
};

export default nextConfig;
