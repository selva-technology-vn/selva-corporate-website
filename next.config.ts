import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production serves repository-managed assets directly. This keeps the
  // zero-billing-risk profile independent from Cloudflare Images.
  images: { unoptimized: true },
};

export default nextConfig;
