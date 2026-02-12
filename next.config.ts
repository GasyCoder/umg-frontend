import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ========================================
  // REQUIS POUR CLOUDFLARE PAGES
  // ========================================
  output: 'export', // Export statique HTML
  
  images: {
    // IMPORTANT : Cloudflare Pages ne supporte pas l'optimisation Next.js
    unoptimized: true,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
    ],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  
  // Variables d'environnement
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.mahajanga-univ.mg',
  },
};

export default nextConfig;