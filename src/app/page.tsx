import { Metadata } from "next";
import HomeClient from "./HomeClient";
import WebSiteSchema from "@/components/seo/WebSiteSchema";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import { getAllTools, getCategories } from "@/lib/supabase";
import { Sparkles, Users, FileText, Globe, Star } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SmartPDFs Pro | Free Online PDF Tools",
  description:
    "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    type: "website",
    title: "SmartPDFs Pro | Free Online PDF Tools",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
    url: `${siteUrl}/`,

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

                  {/* Social Proof Stats Bar (Desktop Only) */}
                  <div className="hidden md:grid grid-cols-4 gap-6 max-w-5xl mx-auto mt-12 p-8 rounded-3xl bg-white/70 dark:bg-slate-800/40 backdrop-blur-md border border-slate-100 dark:border-slate-850 shadow-xl relative z-20">
                      <div className="flex flex-col items-center justify-center p-2 text-center border-r border-slate-200/60 dark:border-slate-700/50">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 transition-transform hover:scale-110 duration-300">
                              <Users size={20} />
                          </div>
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">50,000+</span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Trusted Users</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 text-center border-r border-slate-200/60 dark:border-slate-700/50">
                          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-3 transition-transform hover:scale-110 duration-300">
                              <FileText size={20} />
                          </div>
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">2.5M+</span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Files Processed</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 text-center border-r border-slate-200/60 dark:border-slate-700/50">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 transition-transform hover:scale-110 duration-300">
                              <Globe size={20} />
                          </div>
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">120+</span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Countries Served</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mb-3 transition-transform hover:scale-110 duration-300">
                              <Star size={20} className="fill-amber-500" />
                          </div>
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">4.9/5</span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Average Rating</span>
                      </div>
                  </div>
              </div>
          </section>

          {/* Client Component (Interactivity and Tools Grid + Marketing) */}
          <HomeClient initialTools={allTools} initialCategories={categories} />
      </div>
    </>
  );
}
