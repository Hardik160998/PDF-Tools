import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import MergeSplit from "@/components/tools/MergeSplit";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Scissors,
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

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Split PDF Online Free",
  url: `${siteUrl}/tool/split`,
  image: `${siteUrl}/img/split-pdf-og.png`,
  description:
    "Split PDF files online for free. Extract specific page ranges or split every page into separate PDF documents instantly. 100% secure, local browser processing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Split PDF by page ranges or extract all pages",
    "Visual thumbnails preview",
    "Fast processing with no watermarks",
    "Download result as separate files or unified ZIP",
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
      name: "Split PDF",
      item: `${siteUrl}/tool/split`,
    },
  ],
};


export function generateMetadata() {
  const id = "split";
  const meta = getToolMeta(id);
  if (!meta) return { title: "PDF Tool | SmartPDFPro" };

  const url = getToolUrl(id);
  return {
    title: `${meta.title} | SmartPDFPro`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
      url,
      siteName: "SmartPDFPro",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

export default function SplitPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("split");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("split")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/split` },
              ]}
            />
          </>
        ) : null;
      })()}

      {/* Dynamic JSON-LD structured script injections for Google Crawler */}

      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-10 pb-16">
        {/* Navigation Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <li>
              <Link
                href="/"
                className="hover:text-violet-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-1"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link
                href="/#tools-grid"
                className="hover:text-violet-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-1"
              >
                Tools
              </Link>
            </li>
            <li
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
              aria-current="page"
            >
              <span>/</span>
              <span>Split PDF</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <MergeSplit id="split" />
        </div>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-violet-950 to-violet-600 dark:from-white dark:via-violet-100 dark:to-violet-400 uppercase">
              Split PDF Online Free — 100% Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Separate your PDF pages into individual documents or extract
              custom page ranges instantly. Fast and secure local processing
              ensures your files never leave your device.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                How to Split PDF Pages Online?
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
                  desc: "Select or drag & drop your PDF file into the splitter workspace. The file loads instantly in your browser.",
                },
                {
                  step: "02",
                  title: "Choose Split Settings",
                  desc: "Select splitting modes: split into custom parts, or define exact page ranges to extract from the source.",
                },
                {
                  step: "03",
                  title: "Download Results",
                  desc: "Click 'Split All' to process. Save your split documents immediately as separate PDFs or a single ZIP.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-violet-500/20 group-hover:text-violet-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-500 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">
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
          <section className="bg-gradient-to-tr from-white to-violet-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-violet-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-violet-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100/50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-widest border border-violet-100 dark:border-violet-900/30">
                  <Star size={12} className="fill-violet-500" /> Premium
                  Benefits
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Visual PDF Splitter Benefits
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
                  title: "No Server Access",
                  desc: "Your PDF is processed inside your browser tab. Zero data uploads, zero security concerns.",
                },
                {
                  title: "Custom Splitting",
                  desc: "Divide documents into equal parts or extract specific page ranges as desired.",
                },
                {
                  title: "High-Quality Preserved",
                  desc: "Maintains all fonts, forms, vector graphics, and images from original files.",
                },
                {
                  title: "Dynamic ZIP Packaging",
                  desc: "Save multiple split files together in a clean ZIP bundle for organized downloading.",
                },
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
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
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                <HelpCircle size={24} />
              </span>
              Frequently Asked Questions
            </h2>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Split PDF FAQs
            </p>

            <div className="space-y-4">
              {[
                {
                  q: "How can I split a PDF file?",
                  a: "Upload your PDF file. Choose between two splitting modes: split into custom parts or extract specific page ranges. Specify your options in the settings panel and click 'Split All' to download the processed files.",
                },
                {
                  q: "Is my PDF data safe when splitting files?",
                  a: "Yes, absolutely! The splitting process is completed entirely on your local device. We never upload or save your documents to any external servers, maintaining total security.",
                },
                {
                  q: "Can I download the split pages separately or in a single file?",
                  a: "You can download all split pages grouped inside a single unified ZIP archive, or save individual parts directly using the respective download buttons next to each split thumbnail.",
                },
                {
                  q: "Does splitting a PDF reduce the layout quality?",
                  a: "No. The splitting engine extracts original pages directly from the source PDF. All text elements, vector graphics, hyperlinked actions, and embedded images maintain 100% of their original quality.",
                },
                {
                  q: "Can I split PDF pages online for free?",
                  a: "Yes, SmartPDFPro allows users to split PDF files online for free directly in the browser without software installation or registration.",
                },

                {
                  q: "What is the best free Split PDF tool?",
                  a: "SmartPDFPro provides a fast and secure Split PDF tool that can divide PDF files, extract pages, and create custom page ranges instantly.",
                },

                {
                  q: "Can I extract specific pages from a PDF?",
                  a: "Yes, you can select custom page ranges or extract individual pages from any PDF document using SmartPDFPro.",
                },

                {
                  q: "Can I split large PDF documents into smaller files?",
                  a: "Yes, SmartPDFPro supports splitting large PDF files into smaller parts for easier sharing, printing, and storage.",
                },

                {
                  q: "Does splitting a PDF affect document quality?",
                  a: "No, SmartPDFPro preserves original PDF quality including text, vector graphics, images, hyperlinks, and formatting.",
                },

                {
                  q: "Can I split scanned PDF files?",
                  a: "Yes, SmartPDFPro supports both digitally created PDFs and scanned PDF documents.",
                },

                {
                  q: "Can I split password-protected PDFs?",
                  a: "Yes, but you must first unlock the protected PDF using the Unlock PDF tool before splitting pages.",
                },

                {
                  q: "Can I split PDF files on mobile devices?",
                  a: "Yes, the Split PDF tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                },

                {
                  q: "Do I need Adobe Acrobat to split PDFs?",
                  a: "No, SmartPDFPro works entirely online in your browser without requiring Adobe Acrobat or desktop software.",
                },

                {
                  q: "Can I divide PDF files into equal parts?",
                  a: "Yes, SmartPDFPro allows users to split PDFs into equal sections such as 2 parts, 3 parts, or multiple custom divisions.",
                },

                {
                  q: "Can I separate every PDF page into individual files?",
                  a: "Yes, the Extract All Pages feature creates separate PDF files for every page in the document.",
                },

                {
                  q: "How can I split PDF by page range?",
                  a: "Upload your PDF, select custom page ranges such as 1-5 or 10-20, and SmartPDFPro will generate separate PDF files automatically.",
                },

                {
                  q: "Can I preview PDF pages before splitting?",
                  a: "Yes, SmartPDFPro provides PDF page previews and page thumbnails before generating split documents.",
                },

                {
                  q: "Is SmartPDFPro Split PDF tool secure?",
                  a: "Yes, SmartPDFPro processes PDF files securely in your browser and does not permanently store uploaded documents.",
                },

                {
                  q: "Does SmartPDFPro store split PDF files?",
                  a: "No, SmartPDFPro does not permanently store uploaded or generated PDF files after processing.",
                },

                {
                  q: "Can I split PDFs offline?",
                  a: "Many SmartPDFPro PDF tools work directly in the browser after loading, reducing the need for continuous internet access.",
                },

                {
                  q: "Can businesses use SmartPDFPro Split PDF tool?",
                  a: "Yes, the Split PDF tool is widely used by businesses, students, legal professionals, accountants, and office teams handling document workflows.",
                },

                {
                  q: "Can I split invoices, reports, or contracts into separate PDFs?",
                  a: "Yes, SmartPDFPro supports splitting invoices, reports, contracts, ebooks, forms, and other PDF document types.",
                },

                {
                  q: "Will hyperlinks and formatting remain after splitting?",
                  a: "Yes, SmartPDFPro preserves hyperlinks, formatting, fonts, images, and vector graphics during PDF splitting.",
                },

                {
                  q: "Can I download all split PDF parts together?",
                  a: "Yes, SmartPDFPro can generate a ZIP archive containing all separated PDF files for convenient downloading.",
                },

                {
                  q: "Can I use Split PDF tool without signup?",
                  a: "Yes, SmartPDFPro allows users to split PDF files instantly without account creation or login.",
                },

                {
                  q: "Why use SmartPDFPro to split PDF files?",
                  a: "SmartPDFPro offers fast browser-based PDF splitting, secure processing, mobile compatibility, page extraction, and high-quality document preservation in one simple platform.",
                },

                {
                  q: "Does SmartPDFPro support browser-based PDF editing?",
                  a: "Yes, SmartPDFPro provides browser-based PDF tools including split, merge, compress, organize, convert, and protect PDF workflows.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                      <HelpCircle size={22} className="text-violet-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                    />
                  </summary>
                  <div className="mx-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Internal Links/Related tools */}
          <section className="pt-10 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
              Related Document Tools
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Merge PDF",
                  path: "/tool/merge",
                  desc: "Combine files in order",
                },
                {
                  name: "Organize PDF",
                  path: "/tool/organize",
                  desc: "Reorder & rotate pages",
                },
                {
                  name: "Extract Pages",
                  path: "/tool/extract-pages",
                  desc: "Isolate page numbers",
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
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-violet-500 transition-colors">
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
