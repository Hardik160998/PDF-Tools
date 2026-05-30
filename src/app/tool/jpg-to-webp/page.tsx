import Link from "next/link";
import type { Metadata } from "next";
import ImageConverter from "@/components/tools/ImageConverter";
import {
  ImageIcon, Upload, SlidersHorizontal, Download, Zap, Lock, FileText,
  Shield, Check, HelpCircle, ChevronDown, ArrowRight, Info, Star
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "SITE_OFFICIAL_DOMAIN";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)
export const metadata: Metadata = {
  title: "Convert JPG to WebP Online Free | Optimize Images for Web",
  description: "Convert JPG and JPEG images to WebP format online for free. Reduce file size up to 30% while retaining lossless visual details. 100% private in-browser conversion.",
  keywords: "jpg to webp, convert jpg to webp, jpeg to webp converter, free image optimizer, convert image to webp, online webp converter, local image conversion, smartpdfs",
  alternates: {
    canonical: `${siteUrl}/tool/jpg-to-webp`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    title: "Convert JPG to WebP Online Free | Optimize Images for Web",
    description: "Convert JPG and JPEG images to WebP format online for free. Reduce file size up to 30% while retaining lossless visual details. 100% private in-browser conversion.",
    siteName: "SmartPDFs Plus",
    url: `${siteUrl}/tool/jpg-to-webp`,
    images: [
      {
        url: `${siteUrl}/img/jpg-to-webp-og.png`,
        width: 1200,
        height: 630,
        alt: "Convert JPG to WebP Online - SmartPDFs Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert JPG to WebP Online Free | Optimize Images for Web",
    description: "Convert JPG and JPEG images to WebP format online for free. Reduce file size up to 30% while retaining lossless visual details. 100% private in-browser conversion.",
    images: [`${siteUrl}/img/jpg-to-webp-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "JPG to WebP Converter",
  "url": `${siteUrl}/tool/jpg-to-webp`,
  "image": `${siteUrl}/img/jpg-to-webp-og.png`,
  "description": "Convert JPG and JPEG images to WebP format online for free. Reduce file size up to 30% while retaining lossless visual details.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser sandbox",
    "No file uploads to servers",
    "Reduces file sizes by up to 30% relative to JPG",
    "Batch processing for multiple images",
    "Free with no registrations or watermarks"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": `${siteUrl}/#tools-grid`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "JPG to WebP",
      "item": `${siteUrl}/tool/jpg-to-webp`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why should I convert my JPG images to WebP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WebP is a modern next-generation image format that provides superior lossy and lossless compression for web images. Converting JPG to WebP can compress files up to 30% smaller, accelerating your site load times."
      }
    },
    {
      "@type": "Question",
      "name": "Do you upload my JPG files to any server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The entire conversion process occurs within your local web browser using client-side JavaScript. Your files are processed entirely offline and are never stored or transmitted to our servers."
      }
    },
    {
      "@type": "Question",
      "name": "Are WebP files supported by all modern web browsers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, WebP is fully supported by all modern browsers, including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge."
      }
    },
    {
      "@type": "Question",
      "name": "Can I convert multiple images in a batch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Simply upload multiple files into the workspace. The tool converts them all in parallel, and you can download them at once as a single ZIP archive."
      }
    }
  ]
};

const STEPS = [
  { icon: Upload, title: "Upload JPG", desc: "Select any JPG or JPEG image from your device." },
  { icon: SlidersHorizontal, title: "Auto Convert", desc: "Your image is converted to modern WebP format instantly in your browser." },
  { icon: Download, title: "Download WebP", desc: "Download the converted WebP file immediately — smaller and web-optimized." },
];

const RELATED = [
  { id: "webp-to-jpg", title: "WebP to JPG", description: "Convert WebP images back to universally compatible JPG format.", icon: ImageIcon, gradient: "linear-gradient(135deg, #ec4899, #be185d)", shadow: "rgba(236,72,153,0.3)", tag: "Image Convert" },
  { id: "png-to-webp", title: "PNG to WebP", description: "Convert PNG images to WebP for smaller sizes without quality loss.", icon: ImageIcon, gradient: "linear-gradient(135deg, #06b6d4, #0e7490)", shadow: "rgba(6,182,212,0.3)", tag: "Image Convert" },
  { id: "jpg-to-png", title: "JPG to PNG", description: "Convert JPG images to lossless PNG format instantly.", icon: ImageIcon, gradient: "linear-gradient(135deg, #22c55e, #15803d)", shadow: "rgba(34,197,94,0.3)", tag: "Image Convert" },
  { id: "png-to-jpg", title: "PNG to JPG", description: "Convert PNG images to JPG for smaller file sizes.", icon: ImageIcon, gradient: "linear-gradient(135deg, #f59e0b, #b45309)", shadow: "rgba(245,158,11,0.3)", tag: "Image Convert" },
  { id: "jpg-to-pdf", title: "JPG to PDF", description: "Turn one or multiple JPG images into a single PDF document.", icon: ImageIcon, gradient: "linear-gradient(135deg, #eab308, #a16207)", shadow: "rgba(234,179,8,0.3)", tag: "Convert" },
  { id: "compress", title: "Compress PDF", description: "Reduce PDF file size while keeping quality sharp and text crisp.", icon: Zap, gradient: "linear-gradient(135deg, #22c55e, #15803d)", shadow: "rgba(34,197,94,0.3)", tag: "Optimize" },
];

export default function JpgToWebpPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <Link href="/" className="hover:text-cyan-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-1">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tool" className="hover:text-cyan-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-1">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-600 dark:text-slate-300" aria-current="page">JPG to WebP</span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="JPG to WebP Image Converter Application" className="mb-16">
          <ImageConverter id="jpg-to-webp" />
        </section>

        {/* Dynamic visual statistics element */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border border-cyan-100 dark:border-cyan-800/60 rounded-3xl p-8">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 text-center uppercase tracking-tight">Why Convert to WebP?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[
                  { stat: "~30%", label: "Smaller than JPG", sub: "Same visual quality" },
                  { stat: "~25%", label: "Smaller than PNG", sub: "With transparency support" },
                  { stat: "100%", label: "Browser Support", sub: "All modern browsers" },
                ].map(({ stat, label, sub }) => (
                  <div key={label} className="space-y-1">
                    <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{stat}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Quick View */}
        <section aria-label="Tool Steps Overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-cyan-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">

          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-600 dark:from-white dark:via-slate-200 dark:to-cyan-500 bg-clip-text text-transparent">
              Convert JPG to WebP Online <br />
              <span className="text-cyan-500 dark:text-cyan-400">100% Free & Secure</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Convert JPEG photographs to optimized next-generation WebP images. Enhance Core Web Vitals and reduce bundle load weights with our 100% local browser converter tool.
            </p>
          </div>

          <article className="space-y-16">

            {/* What is JPG to WebP */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is JPG to WebP format optimization?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  WebP is a modern image standard created by Google that delivers superior compression compared to legacy JPEG/JPG structures. It features lossy and lossless algorithms that produce files up to 30% smaller without sacrificing perceived fidelity, dramatically improving website page loading speed.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Converting standard JPG images to WebP helps you achieve high performance scores on Google Lighthouse. Since our tool executes <strong className="text-cyan-500 font-black">100% client-side inside your browser</strong>, your proprietary graphs, charts, and digital photo layouts are protected locally on your device hardware.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500"><ArrowRight size={24} /></span>
                How to convert JPG to WebP in 3 Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  { step: "01", title: "Select JPGs", desc: "Drag and drop your JPG or JPEG images into the optimization converter block above." },
                  { step: "02", title: "Compress Instantly", desc: "Our engine optimizes the character byte map to produce highly efficient WebP files in seconds." },
                  { step: "03", title: "Save and Optimize", desc: "Download the converted WebP images individually, or export them altogether as a ZIP package." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-cyan-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
                      {s.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits & Features */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Shield size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">Total Privacy Shield</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Security is central to our features. Conversions occur in the local browser context; your files are never transmitted to external servers.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-cyan-500 transition-colors">Accelerate Page Load Speeds</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    WebP helps websites render up to 3 times faster by reducing image transfer payloads without degrading visually perceptible quality.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Compresses images while maintaining lossless colors.",
                    "Batch optimize dozens of pictures concurrently with zip pack downloads.",
                    "Fully mobile-responsive layout designed for touch gestures.",
                    "Free with no registrations, daily limits, or watermarks."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-cyan-500/10 text-cyan-600 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Why should I convert my JPG images to WebP?",
                    a: "WebP is a modern next-generation image format that provides superior lossy and lossless compression for web images. Converting JPG to WebP can compress files up to 30% smaller, accelerating your site load times."
                  },
                  {
                    q: "Do you upload my JPG files to any server?",
                    a: "No. The entire conversion process occurs within your local web browser using client-side JavaScript. Your files are processed entirely offline and are never stored or transmitted to our servers."
                  },
                  {
                    q: "Are WebP files supported by all modern web browsers?",
                    a: "Yes, WebP is fully supported by all modern browsers, including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge."
                  },
                  {
                    q: "Can I convert multiple images in a batch?",
                    a: "Yes. Simply upload multiple files into the workspace. The tool converts them all in parallel, and you can download them at once as a single ZIP archive."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-cyan-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-cyan-500">
                        <ChevronDown size={18} />
                      </span>
                    </summary>
                    <div className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium border-t border-slate-105 dark:border-slate-800 pt-3">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </article>
        </section>

        {/* Related Document & Image Tools (Internal Links) */}
        <section aria-label="Related tools" className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
            Explore More Image & PDF Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED.map(t => (
              <Link
                key={t.id}
                href={`/tool/${t.id}`}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-cyan-500 transition-colors">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-cyan-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool <span aria-hidden="true">&#8594;</span></div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
