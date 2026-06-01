import DeletePages from "@/components/tools/DeletePages";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  ArrowRight,
  HelpCircle,
  Star,
  Check,
  ChevronDown,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: "Delete PDF Pages Online - Free PDF Page Remover | SmartPDFs",
  description:
    "Delete pages from PDF online for free. Visual page remover lets you select and remove unwanted or blank pages instantly. 100% secure, local browser processing.",
  keywords:
    "delete pdf pages, remove pdf pages online, delete pages from pdf, pdf page remover, crop and delete pdf pages, smartpdfs",
  alternates: {
    canonical: `${siteUrl}/tool/delete-pages`,
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
    title: "Delete PDF Pages Online - Free PDF Page Remover | SmartPDFs",
    description:
      "Delete pages from PDF online for free. Visual page remover lets you select and remove unwanted or blank pages instantly. 100% secure, local browser processing.",
    siteName: "SmartPDFs",
    url: `${siteUrl}/tool/delete-pages`,
    images: [
      {
        url: `${siteUrl}/img/delete-pages-og.png`,
        width: 1200,
        height: 630,
        alt: "Delete PDF Pages Online - SmartPDFs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete PDF Pages Online - Free PDF Page Remover | SmartPDFs",
    description:
      "Delete pages from PDF online for free. Visual page remover lets you select and remove unwanted or blank pages instantly. 100% secure, local browser processing.",
    images: [`${siteUrl}/img/delete-pages-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Delete PDF Pages Online Free",
  url: `${siteUrl}/tool/delete-pages`,
  image: `${siteUrl}/img/delete-pages-og.png`,
  description:
    "Delete pages from PDF online for free. Visual page remover lets you select and remove unwanted or blank pages instantly. 100% secure, local browser processing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Visual thumbnails selection for deletion",
    "Delete individual pages or ranges",
    "Fast processing with no watermarks",
    "Zero file compression loss during removal",
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
      name: "Delete Pages",
      item: `${siteUrl}/tool/delete-pages`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I delete pages from a PDF document?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your PDF document to the page remover tool. Hover over any page thumbnail and click the delete trash icon, or input page numbers/ranges in the sidebar. Click 'Delete Pages' to download your newly trimmed PDF.",
      },
    },
    {
      "@type": "Question",
      name: "Are my documents kept secure and private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely! Page deletion is carried out entirely on your own device using local WebAssembly. We never copy, view, or upload your files to remote cloud storage.",
      },
    },
    {
      "@type": "Question",
      name: "Can I remove blank pages or duplicate pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our tool generates high-quality thumbnails for every page in your document. You can easily spot empty spaces, duplicate files, or layout errors and discard them visually.",
      },
    },
    {
      "@type": "Question",
      name: "Does deleting pages reduce the quality of the remaining pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The pages that you choose to keep remain fully intact, maintaining their original vector graphics, layout styles, compression levels, and text fonts.",
      },
    },
  ],
};

export default function DeletePagesPage() {
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
                className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link
                href="/#tools-grid"
                className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
              >
                Tools
              </Link>
            </li>
            <li
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
              aria-current="page"
            >
              <span>/</span>
              <span>Delete Pages</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <DeletePages id="delete-pages" />
        </div>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="font-outfit text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-red-950 to-red-600 dark:from-white dark:via-red-100 dark:to-red-400 uppercase">
              Delete PDF Pages Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Remove extra, blank, or unwanted pages from your PDF documents
              visually. Trim down file size and custom-clean your PDFs with our
              responsive tool, executing completely in your browser sandbox.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                How to Delete Pages from a PDF?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Visual step-by-step guide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload Document",
                  desc: "Select or drag & drop your PDF file into the page remover workspace. Pages will display instantly.",
                },
                {
                  step: "02",
                  title: "Select for Deletion",
                  desc: "Select unwanted page thumbnails, or specify page ranges (e.g. 2-4) to remove them in batch.",
                },
                {
                  step: "03",
                  title: "Generate PDF",
                  desc: "Click 'Delete Pages' to finalize removal. Download the clean, trimmed PDF file to your local drive.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-outfit text-4xl font-black text-red-500/20 group-hover:text-red-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center font-bold text-sm">
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
          <section className="bg-gradient-to-tr from-white to-red-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-red-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-red-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                  <Star size={12} className="fill-red-500" /> Premium Benefits
                </span>
                <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Visual PDF Deletion Benefits
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
                  title: "Privacy Guaranteed",
                  desc: "No uploads to servers. All operations perform in-browser, securing your data from third parties.",
                },
                {
                  title: "Grid Thumbnail Viewer",
                  desc: "Easily spot layout irregularities, blank slides, or duplicate pages visually before deletion.",
                },
                {
                  title: "Precise Trim Options",
                  desc: "Combine select clicking and text fields to isolate and drop exactly the pages you choose.",
                },
                {
                  title: "No Quality Loss",
                  desc: "Preserves the original dimensions, color profiles, links, and text formatting of the kept pages.",
                },
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/25">
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
                Delete Pages FAQs
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How do I delete pages from a PDF document?",
                  a: "Upload your PDF document to the page remover tool. Hover over any page thumbnail and click the delete trash icon, or input page numbers/ranges in the sidebar. Click 'Delete Pages' to download your newly trimmed PDF.",
                },
                {
                  q: "Are my documents kept secure and private?",
                  a: "Yes, completely! Page deletion is carried out entirely on your own device using local WebAssembly. We never copy, view, or upload your files to remote cloud storage.",
                },
                {
                  q: "Can I remove blank pages or duplicate pages?",
                  a: "Yes. Our tool generates high-quality thumbnails for every page in your document. You can easily spot empty spaces, duplicate files, or layout errors and discard them visually.",
                },
                {
                  q: "Does deleting pages reduce the quality of the remaining pages?",
                  a: "No. The pages that you choose to keep remain fully intact, maintaining their original vector graphics, layout styles, compression levels, and text fonts.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                      <HelpCircle size={18} className="text-red-500 shrink-0" />
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
                  name: "Extract Pages",
                  path: "/tool/extract-pages",
                  desc: "Isolate page numbers",
                },
                {
                  name: "Organize PDF",
                  path: "/tool/organize",
                  desc: "Reorder & rotate pages",
                },
                {
                  name: "Split PDF",
                  path: "/tool/split",
                  desc: "Extract files pages",
                },
                {
                  name: "Merge PDF",
                  path: "/tool/merge",
                  desc: "Combine files in order",
                },
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.path}
                  className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
                >
                  <span className="font-outfit text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
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
