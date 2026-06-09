import { Metadata } from "next";
import HomeClient from "./HomeClient";
import WebSiteSchema from "@/components/seo/WebSiteSchema";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import { getAllTools, getCategories } from "@/lib/supabase";
import { Sparkles } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SmartPDFs Pro | Free Online PDF Tools",
  description:
    "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "SmartPDFs Pro | Free Online PDF Tools",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
    url: "/",
    siteName: "SmartPDFs Pro",
    images: [
      { url: `${siteUrl}/img/snapdeal-label.png`, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPDFs Pro | Free Online PDF Tools",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
};

export const dynamic = 'force-static';

export default async function Page() {
  const [allTools, categories] = await Promise.all([
    getAllTools(),
    getCategories(),
  ]);

  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
      <div className="min-h-screen relative overflow-hidden">
          <div className="bg-mesh-premium" />

          {/* -- HERO (Server Component) -- */}
          <section className="container mx-auto px-4 pt-24 pb-8 text-center relative z-10">
              <div className="max-w-6xl mx-auto space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium uppercase tracking-widest shadow-sm mb-4">
                      <Sparkles size={14} className="fill-red-500" />
                      100% Free &amp; Secure PDF Tools
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-outfit font-black leading-[1.1] tracking-tighter lg:whitespace-nowrap">
                      <span className="hero-gradient-text">PDF Tools Simplified.</span>{' '}
                      <span className="text-slate-900 dark:text-white">Built for Efficiency.</span>
                  </h1>
                  <p className="text-xl font-medium text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                      The most powerful web-based PDF platform. Merge, split, compress, and convert documents in seconds with advanced security and premium speed.
                  </p>
              </div>

              {/* Client Component (Interactivity only) */}
              <HomeClient initialTools={allTools} initialCategories={categories} />
          </section>
      </div>
    </>
  );
}
