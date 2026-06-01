import OrganizeTool from "@/components/tools/OrganizeTool";
import Link from "next/link";
import type { Metadata } from "next";
import {
  LayoutGrid,
  FileText,
  ArrowUpDown,
  Lock,
  RefreshCw,
  Zap,
  Shield,
  ArrowRight,
  HelpCircle,
  Info,
  Star,
  Check,
  ChevronDown,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title:
    "Organize PDF Pages Free - Visual PDF Page Reorder & Rotate | SmartPDFs",
  description:
    "Organize PDF pages online for free. Visual drag and drop to reorder, delete, rotate, or add pages. 100% secure local browser processing, zero uploads.",
  keywords:
    "organize pdf, reorder pdf pages, rotate pdf pages online, sort pdf pages, visual pdf organizer, delete pdf pages, merge and organize pdf, free pdf tool",
  alternates: {
    canonical: `${siteUrl}/tool/organize`,
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
    title:
      "Organize PDF Pages Free - Visual PDF Page Reorder & Rotate | SmartPDFs",
    description:
      "Organize PDF pages online for free. Visual drag and drop to reorder, delete, rotate, or add pages. 100% secure local browser processing.",
    siteName: "SmartPDFs",
    url: `${siteUrl}/tool/organize`,
    images: [
      {
        url: `${siteUrl}/img/organize-pdf-og.png`,
        width: 1200,
        height: 630,
        alt: "Organize PDF Pages Online - SmartPDFs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Organize PDF Pages Free - Visual PDF Page Reorder & Rotate | SmartPDFs",
    description:
      "Organize PDF pages online for free. Visual drag and drop to reorder, delete, rotate, or add pages. 100% secure local browser processing.",
    images: [`${siteUrl}/img/organize-pdf-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Organize PDF Pages Online Free",
  url: `${siteUrl}/tool/organize`,
  image: `${siteUrl}/img/organize-pdf-og.png`,
  description:
    "Organize PDF pages online for free. Visual drag and drop to reorder, delete, rotate, or add pages. 100% secure local browser processing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Visual drag & drop page reordering",
    "Rotate individual or all pages",
    "Delete unwanted pages",
    "Combine and reorder multiple PDFs",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tools",
      item: `${siteUrl}/#tools-grid`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Organize PDF",
      item: `${siteUrl}/tool/organize`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I reorder pages in a PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply upload your PDF files to our tool. You will see a visual grid containing thumbnails of all pages. Drag and drop any page thumbnail to change its order, then click 'Organize & Save' to download your reorganized PDF.",
      },
    },
    {
      "@type": "Question",
      name: "Is my PDF data safe when using your organizer tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Our tool processes everything 100% locally in your web browser. Your files are never uploaded to any remote servers, ensuring complete privacy and data confidentiality.",
      },
    },
    {
      "@type": "Question",
      name: "Can I merge and organize multiple PDF files at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can upload multiple PDF documents. All pages from the uploaded sources will be populated in the visual grid, allowing you to reorder, rotate, or delete pages across all documents before compiling them into a single organized file.",
      },
    },
    {
      "@type": "Question",
      name: "Can I rotate individual pages inside my PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can rotate pages one-by-one by hovering over a page thumbnail and clicking the rotate icon, or you can rotate all pages in the document simultaneously using the 'Rotate All' global action in the sidebar panel.",
      },
    },
  ],
};

export default function OrganizePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic JSON-LD structured script injections for Google Crawler */}
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

      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-10 pb-16">
        {/* Navigation Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <li>
              <Link
                href="/"
                className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link
                href="/#tools-grid"
                className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
              >
                Tools
              </Link>
            </li>
            <li
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
              aria-current="page"
            >
              <span>/</span>
              <span>Organize PDF</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <OrganizeTool id="organize" />
        </div>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="font-outfit text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-orange-950 to-orange-600 dark:from-white dark:via-orange-100 dark:to-orange-400 uppercase">
              Organize PDF Pages Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Arrange pages, rotate vertical pages to horizontal, and remove
              extra pages from your PDF documents. Keep your files neat and
              customized with our visual page organizer, processed completely
              locally in your browser.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                How to Organize PDF Pages Online?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Visual step-by-step guide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload PDFs",
                  desc: "Select or drag & drop one or multiple PDF files into our visual organizer workspace. The pages will render instantly.",
                },
                {
                  step: "02",
                  title: "Drag, Rotate, Delete",
                  desc: "Drag thumbnails to reorder pages. Click rotate on any page to adjust orientation, or click delete to extract/remove pages.",
                },
                {
                  step: "03",
                  title: "Download Document",
                  desc: "Click 'Organize & Save' to build your customized PDF document. Download the print-ready structured PDF in seconds.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-outfit text-4xl font-black text-orange-500/20 group-hover:text-orange-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="font-outfit text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 animate-pulse">
                      <ArrowRight size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Features and Benefits Grid */}
          <section className="bg-gradient-to-tr from-white to-orange-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-orange-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-orange-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/30">
                  <Star size={12} className="fill-orange-500" /> Premium
                  Benefits
                </span>
                <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Why Use Our Visual PDF Organizer?
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md">
                Fast browser-based operations without queues or subscriptions.
                Tailor files instantly and secure privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "No Server Uploads",
                  desc: "Files run directly via WebAssembly in your browser. No internet transfer, no cloud leakage.",
                },
                {
                  title: "Real-Time Visuals",
                  desc: "High-resolution page thumbnails let you see exactly what page you are moving.",
                },
                {
                  title: "Rotate & Crop Alignment",
                  desc: "Align pages properly. Rotate vertical scans to matches the standard horizontal flow.",
                },
                {
                  title: "Multi-Source Merge",
                  desc: "Add more files seamlessly. Drag and order pages from different documents easily.",
                },
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                  <h4 className="font-outfit text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {feat.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Organize PDF FAQs
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How can I reorder pages in a PDF?",
                  a: "Simply upload your PDF files to our tool. You will see a visual grid containing thumbnails of all pages. Drag and drop any page thumbnail to change its order, then click 'Organize & Save' to download your reorganized PDF.",
                },
                {
                  q: "Is my PDF data safe when using your organizer tool?",
                  a: "Absolutely! Our tool processes everything 100% locally in your web browser. Your files are never uploaded to any remote servers, ensuring complete privacy and data confidentiality.",
                },
                {
                  q: "Can I merge and organize multiple PDF files at once?",
                  a: "Yes, you can upload multiple PDF documents. All pages from the uploaded sources will be populated in the visual grid, allowing you to reorder, rotate, or delete pages across all documents before compiling them into a single organized file.",
                },
                {
                  q: "Can I rotate individual pages inside my PDF?",
                  a: "Yes, you can rotate pages one-by-one by hovering over a page thumbnail and clicking the rotate icon, or you can rotate all pages in the document simultaneously using the 'Rotate All' global action in the sidebar panel.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                    <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                      <HelpCircle
                        size={18}
                        className="text-orange-500 shrink-0"
                      />
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                    />
                  </summary>
                  <div className="px-6 pb-6 border-t border-slate-50 dark:border-slate-800 pt-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Internal Links/Related tools */}
          <section className="pt-10 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="font-outfit text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
              Related Document Tools
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Compare PDF",
                  path: "/tool/compare-pdf",
                  desc: "Visual side-by-side diff",
                },
                {
                  name: "Merge PDF",
                  path: "/tool/merge",
                  desc: "Combine files in order",
                },
                {
                  name: "Split PDF",
                  path: "/tool/split",
                  desc: "Extract files pages",
                },
                {
                  name: "Compress PDF",
                  path: "/tool/compress",
                  desc: "Shrink file size locally",
                },
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.path}
                  className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
                >
                  <span className="font-outfit text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">
                    {tool.desc}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
