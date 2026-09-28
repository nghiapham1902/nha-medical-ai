import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
  },
};
// Keep development and production artifacts separate when both servers run.
export default function nextConfig(phase: string): NextConfig {
  return {
    ...config,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next-build",
  };
}
