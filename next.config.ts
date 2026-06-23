import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseOrigin = supabaseUrl
  ? new URL(supabaseUrl).origin
  : "";

const supabaseWs = supabaseOrigin.replace(/^https:/, "wss:");

const cspHeader = `
  default-src 'self';

  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://pagead2.googlesyndication.com
    https://partner.googleadservices.com
    https://googleads.g.doubleclick.net
    https://checkout.razorpay.com
    https://cdn.razorpay.com
    https://va.vercel-scripts.com
    https://*.adtrafficquality.google;

  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com;

  font-src 'self'
    https://fonts.gstatic.com
    data:;

  img-src 'self'
    data:
    blob:
    https:
    *.googleusercontent.com
    *.gstatic.com
    *.razorpay.com;

  connect-src 'self'
    https://www.google-analytics.com
    https://analytics.google.com
    https://www.googletagmanager.com
    https://pagead2.googlesyndication.com
    https://googleads.g.doubleclick.net
    https://checkout.razorpay.com
    https://api.razorpay.com
    https://lumberjack.razorpay.com
    https://*.adtrafficquality.google
    https://va.vercel-scripts.com
    ${supabaseOrigin}
    ${supabaseWs};

  frame-src 'self'
    https://checkout.razorpay.com
    https://api.razorpay.com
    https://googleads.g.doubleclick.net
    https://tpc.googlesyndication.com
    https://pagead2.googlesyndication.com
    https://*.adtrafficquality.google
    https://www.google.com;

  worker-src 'self'
    blob:
    https://cdn.jsdelivr.net;

  child-src 'self'
    blob:
    https://checkout.razorpay.com;

  media-src 'self' blob: data:;

  object-src 'none';
  base-uri 'self';

  form-action 'self'
    https://api.razorpay.com
    https://checkout.razorpay.com;

  frame-ancestors 'self';

  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  compress: true,

  serverExternalPackages: ["pdfjs-dist"],

  experimental: {
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  async redirects() {
    return [
      {
        source: "/edit",
        destination: "/tool/edit",
        permanent: true,
      },
      {
        source: "/esign",
        destination: "/tool/esign",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;