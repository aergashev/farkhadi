import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Admin-uploaded product images live in Vercel Blob.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
