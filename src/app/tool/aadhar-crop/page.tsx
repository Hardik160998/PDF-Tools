import Link from "next/link";
import type { Metadata } from "next";
import AadharCropper from "@/components/tools/AadharCropper";
import {
  Upload, Crop, Download, Lock, Unlock, Stamp, PenLine, ImageIcon,
  Shield, Check, HelpCircle, ChevronDown, ArrowRight, Info, Star, Zap
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://smartpdfpro.com/";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)
export const metadata: Metadata = {
  title: "Aadhar Card Cropper Online Free | Standard ID Card Sizes",
  description: "Crop your e-Aadhar card PDF or image online for free. Adjust and crop the front and back sides to standard ID dimensions ready for print. 100% private.",
  keywords: "aadhar crop, crop aadhar card, online aadhar cropper, e-aadhar cropper, print ready aadhar card, crop id card online, local image conversion, smartpdfs",
  alternates: {
    canonical: `${siteUrl}/tool/aadhar-crop`,
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
    title: "Aadhar Card Cropper Online Free | Standard ID Card Sizes",
    description: "Crop your e-Aadhar card PDF or image online for free. Adjust and crop the front and back sides to standard ID dimensions ready for print. 100% private.",
    siteName: "SmartPDFs Plus",
    url: `${siteUrl}/tool/aadhar-crop`,
    images: [
      {
        url: `${siteUrl}/img/aadhar-crop-og.png`,
        width: 1200,
        height: 630,
        alt: "Aadhar Card Cropper Online - SmartPDFs Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aadhar Card Cropper Online Free | Standard ID Card Sizes",
    description: "Crop your e-Aadhar card PDF or image online for free. Adjust and crop the front and back sides to standard ID dimensions ready for print. 100% private.",
    images: [`${siteUrl}/img/aadhar-crop-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Aadhar Card Cropper",
  "url": `${siteUrl}/tool/aadhar-crop`,
  "image": `${siteUrl}/img/aadhar-crop-og.png`,
  "description": "Crop your e-Aadhar card PDF or image online for free. Adjust and crop the front and back sides to standard ID dimensions ready for print.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser sandbox",
    "No file uploads to servers",
    "Predefined ID card dimensions for easy print formatting",
    "Supports both PDF and image inputs",
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
      "name": "Aadhar Crop",
      "item": `${siteUrl}/tool/aadhar-crop`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is my Aadhar Card uploaded to any server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Never. Privacy is our top priority. The entire cropping process runs locally in your web browser using HTML5 Canvas. Your Aadhar PDF or image files are never uploaded, stored, or transmitted to any server."
      }
    },
    {
      "@type": "Question",
      "name": "What is the standard print size for an Aadhar Card?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our cropper formats both cropped sections to the standard Indian government ID dimensions (approx 8.56 cm x 5.4 cm) and compiles them on a single print-ready A4 PDF page."
      }
    },
    {
      "@type": "Question",
      "name": "Does the cropper support e-Aadhar PDFs directly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can upload either standard image files or the digital e-Aadhar PDF document directly to start cropping the ID sections."
      }
    },
    {
      "@type": "Question",
      "name": "What should I do if my Aadhar PDF is password protected?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If your e-Aadhar PDF requires a password, please use our Unlock PDF tool first to remove the security encryption before cropping."
      }
    }
  ]
};

const STEPS = [
  { icon: Upload, title: "Upload E-Aadhar PDF", desc: "Select your e-Aadhar PDF or image. Everything is processed entirely in your browser — your Aadhar data never leaves your device." },
  { icon: Crop, title: "Crop Front & Back", desc: "Use the visual cropper to select the front side of your Aadhar card, then the back side. Zoom and adjust for a perfect crop." },
  { icon: Download, title: "Download Print-Ready PDF", desc: "Download an A4 PDF with both sides formatted to standard ID card dimensions — ready for high-quality printing." },
];

const RELATED = [
  { id: "pdf-to-jpg", title: "PDF to JPG", description: "Convert every PDF page into a high-quality JPG image instantly.", icon: ImageIcon, gradient: "linear-gradient(135deg, #eab308, #a16207)", shadow: "rgba(234,179,8,0.3)", tag: "Convert", href: "/tool/pdf-to-jpg" },
  { id: "jpg-to-pdf", title: "JPG to PDF", description: "Convert JPG or PNG images into a PDF document instantly.", icon: ImageIcon, gradient: "linear-gradient(135deg, #eab308, #a16207)", shadow: "rgba(234,179,8,0.3)", tag: "Convert", href: "/tool/jpg-to-pdf" },
  { id: "protect", title: "Protect PDF", description: "Encrypt your PDF with a password to keep sensitive documents secure.", icon: Lock, gradient: "linear-gradient(135deg, #ef4444, #b91c1c)", shadow: "rgba(239,68,68,0.3)", tag: "Security", href: "/tool/protect" },
  { id: "unlock", title: "Unlock PDF", description: "Remove password protection from a PDF and restore full access.", icon: Unlock, gradient: "linear-gradient(135deg, #f97316, #c2410c)", shadow: "rgba(249,115,22,0.3)", tag: "Security", href: "/tool/unlock" },
  { id: "watermark", title: "Watermark PDF", description: "Stamp a text or image watermark over every page of your PDF.", icon: Stamp, gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", shadow: "rgba(139,92,246,0.3)", tag: "Edit", href: "/tool/watermark" },
  { id: "esign", title: "E-Sign PDF", description: "Draw or type your signature and place it anywhere on a PDF instantly.", icon: PenLine, gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)", shadow: "rgba(139,92,246,0.3)", tag: "Sign", href: "/esign" },
];

export default function AadharCropPage() {
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
          <Link href="/" className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tool" className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-600 dark:text-slate-300" aria-current="page">Aadhar Crop</span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="Aadhar Card Cropper Application" className="mb-16">
          <AadharCropper id="aadhar-crop" />
        </section>

        {/* How It Works Quick View */}
        <section aria-label="Tool Steps Overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">

          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-red-500/10 dark:bg-red-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-red-600 dark:from-white dark:via-slate-200 dark:to-red-500 bg-clip-text text-transparent">
              Crop Aadhar Card Online <br />
              <span className="text-red-500 dark:text-red-400">100% Secure & Print-Ready</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Format your e-Aadhar PDF front and back panels to precise Indian ID card print-ready sizes. The entire process runs 100% inside your local browser memory so your personal data is always protected.
            </p>
          </div>

          <article className="space-y-16">

            {/* What is Aadhar Crop */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Aadhar Card Cropper?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  When you download your official e-Aadhar card from the UIDAI portal, it comes as a full A4 sheet containing multiple instructions, letters, and guidelines. Cutting it down to pocket size manually for lamination or wallet storage can be a tedious formatting task.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our custom Aadhar Cropper tool allows you to isolate the front and back sections of your card using a visual canvas selector. It automatically merges both sides side-by-side onto a standard A4 sheet in official Indian ID dimensions, prepared for instant high-quality printing.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><ArrowRight size={24} /></span>
                How to crop Aadhar Card in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  { step: "01", title: "Select E-Aadhar", desc: "Select your e-Aadhar PDF page or card image. Rest assured, your file is loaded completely offline." },
                  { step: "02", title: "Format Front & Back", desc: "Crop the front side first, then the back side. You can rotate and scale the crop frame easily." },
                  { step: "03", title: "Save A4 Print PDF", desc: "Export the merged front and back card layout onto a standard A4 PDF sheet for simple printing." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-red-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-red-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Shield size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">100% Local Processing</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Because your Aadhar contains highly sensitive personal information, our tool operates entirely client-side. No files are uploaded to any server.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">Accurate ID Dimensions</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    No more manual resizing. The tool automatically rescales the cropped bounding boxes to standard ID card layouts suitable for quick pocket laminations.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both PDF and raw image formats.",
                    "Provides real-time interactive crop resizing guides.",
                    "Highly responsive and works perfectly on mobile phones.",
                    "Free with no account logins or watermarks."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-red-500/10 text-red-600 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is my Aadhar Card uploaded to any server?",
                    a: "Never. Privacy is our top priority. The entire cropping process runs locally in your web browser using HTML5 Canvas. Your Aadhar PDF or image files are never uploaded, stored, or transmitted to any server."
                  },
                  {
                    q: "What is the standard print size for an Aadhar Card?",
                    a: "Our cropper formats both cropped sections to the standard Indian government ID dimensions (approx 8.56 cm x 5.4 cm) and compiles them on a single print-ready A4 PDF page."
                  },
                  {
                    q: "Does the cropper support e-Aadhar PDFs directly?",
                    a: "Yes. You can upload either standard image files or the digital e-Aadhar PDF document directly to start cropping the ID sections."
                  },
                  {
                    q: "What should I do if my Aadhar PDF is password protected?",
                    a: "If your e-Aadhar PDF requires a password, please use our Unlock PDF tool first to remove the security encryption before cropping."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-red-500">
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
                href={t.href}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-red-500 transition-colors">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool <span aria-hidden="true">&#8594;</span></div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
