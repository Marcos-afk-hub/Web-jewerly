import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Toda la fotografía se sirve desde `public/`, así que no hace falta
    // permitir dominios externos. Si más adelante se agrega una fuente remota,
    // se registra aquí su hostname.
    remotePatterns: [],
    // Formatos livianos y compatibles con todos los navegadores objetivo.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
