/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["canvas", "pdfjs-dist"],
};

export default nextConfig;
