import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['pdfjs-dist'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/edit',
        destination: '/tool/edit',
        permanent: true,
      },
      {
        source: '/esign',
        destination: '/tool/esign',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
