import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every value actually passed to next/image must be listed here, or Next
    // refuses to optimise at that quality. 90/92 are the food close-ups.
    qualities: [75, 80, 82, 88, 90, 92],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560],
    imageSizes: [64, 96, 128, 200, 256, 320, 384, 512],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
