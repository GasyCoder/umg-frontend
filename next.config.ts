import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.mahajanga-univ.mg',
      },
      {
        protocol: 'https',
        hostname: 'back.mahajanga-univ.mg',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
    ],
    // Modern formats for better compression (WebP ~30% smaller, AVIF ~50% smaller)
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for smaller components (thumbnails, icons, etc.)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // Only disable optimization in development for faster dev experience
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Allow dev origins
  allowedDevOrigins: ['http://localhost:8000', 'http://127.0.0.1:8000'],
};

export default nextConfig;
