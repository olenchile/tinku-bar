import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  output: "export",        // Static export → genera carpeta /out para S3
  trailingSlash: true,     // Requerido para S3 static hosting
  images: {
    unoptimized: true,     // Requerido para static export (sin servidor de imágenes)
  },
  turbopack: {},
};

export default withSerwist(nextConfig);
