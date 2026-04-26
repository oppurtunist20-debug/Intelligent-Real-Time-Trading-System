import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [""],
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,

  },
};

export default nextConfig;
