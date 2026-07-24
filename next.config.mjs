/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["canvas", "pdfjs-dist"],
  // Expose R2_PUBLIC_URL to both server and client (browser)
  env: {
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || "https://cdn.webly.biz.id/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Firebase Storage — covers both default and custom buckets
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        // Supabase Storage
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        // Cloudinary
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Cloudflare R2 CDN
        protocol: "https",
        hostname: "cdn.webly.biz.id",
      },
    ],
  },
};

export default nextConfig;

