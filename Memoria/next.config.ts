import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos de producto y categoría provienen de Pexels (CDN).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
    // Formatos livianos y compatibles con todos los navegadores objetivo.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
