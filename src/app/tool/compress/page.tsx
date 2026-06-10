import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Compressor from "@/components/tools/Compressor";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Zap,
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
  name: "Compress PDF Online Free",
  url: `${siteUrl}/tool/compress`,
  image: `${siteUrl}/img/compress-pdf-og.png`,
  description:
    "Compress PDF files online for free. Reduce PDF document size while maintaining high quality. 100% secure local browser processing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Smart metadata and layout streams optimization",
    "Selectable compression levels",
    "Zero quality loss for vector graphics and text",
    "Incredibly fast browser execution",
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
      name: "Compress PDF",
      item: `${siteUrl}/tool/compress`,
    },
  ],
};

export function generateMetadata() {
  const id = "compress";
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

export default function CompressPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("compress");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("compress")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/compress` },
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
                className="hover:text-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link
                href="/#tools-grid"
                className="hover:text-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                Tools
              </Link>
            </li>
            <li
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
              aria-current="page"
            >
              <span>/</span>
              <span>Compress PDF</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <Compressor id="compress" />
        </div>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-600 dark:from-white dark:via-emerald-100 dark:to-emerald-400 uppercase">
              Compress PDF Files Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Shrink the size of your PDF files without losing readability or
              vector structure. Fast and secure local processing ensures your
              files never leave your device.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                How to Compress a PDF Online?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Step-by-step optimization guide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload PDF",
                  desc: "Select or drag & drop your PDF file into our compressor workspace. The file loads instantly in your browser.",
                },
                {
                  step: "02",
                  title: "Auto-Optimize Layout",
                  desc: "The compressor scans and optimizes internal object streams, metadata, and cross-reference streams locally.",
                },
                {
                  step: "03",
                  title: "Download Compressed File",
                  desc: "Click 'Compress PDF' to run. Instantly download your optimized, smaller PDF to your local drive.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-emerald-500/20 group-hover:text-emerald-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
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
          <section className="bg-gradient-to-tr from-white to-emerald-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-emerald-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-emerald-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                  <Star size={12} className="fill-emerald-500" /> Premium
                  Benefits
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  In-Browser PDF Compression Features
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
                  title: "Stream Optimization",
                  desc: "Removes duplicate structures and formats object layout streams to reduce weight.",
                },
                {
                  title: "Preserves Font Vectors",
                  desc: "Preserves text vector layouts and font embeddings perfectly for crisp readability.",
                },
                {
                  title: "Optimize PDF Sister",
                  desc: "Easily adjust compression settings for visual-heavy documents using our sister tool.",
                },
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <HelpCircle size={24} />
              </span>
              Frequently Asked Questions
            </h2>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Compress PDF FAQs
            </p>

            <div className="space-y-4">
              {[
                {
                  q: "How can I reduce my PDF file size online?",
                  a: "Simply upload your PDF file to our tool. The tool runs an optimization algorithm locally in your web browser. Once finished, click 'Download PDF' to save your compressed file.",
                },
                {
                  q: "Are my files uploaded to any servers during compression?",
                  a: "No! All compression and optimization occur entirely on your own device using WebAssembly. Your files are never uploaded to any remote servers, offering 100% privacy.",
                },
                {
                  q: "Will the text or image quality be reduced after compression?",
                  a: "Our smart compressor reduces file sizes by removing duplicate metadata and optimizing PDF internal object streams, preserving vector graphics and text quality cleanly. For extreme image compression, you can use our Optimize PDF tool.",
                },
                {
                  q: "What is the maximum file size I can compress?",
                  a: "Since compression is done locally in your browser tab, there is no server limit on file sizes. It relies purely on your device's memory, allowing you to process large files smoothly.",
                },
                {
                  q: "What is the best free Compress PDF tool online?",
                  a: "SmartPDFPro provides a fast and secure Compress PDF tool that reduces PDF file size online without software installation or signup.",
                },

                {
                  q: "Can I compress PDF files online for free?",
                  a: "Yes, SmartPDFPro allows users to compress PDF documents online for free directly in their browser.",
                },

                {
                  q: "How can I reduce PDF file size without losing quality?",
                  a: "SmartPDFPro uses intelligent PDF optimization techniques that reduce file size while preserving text clarity, vector graphics, hyperlinks, and document formatting.",
                },

                {
                  q: "Does PDF compression affect image quality?",
                  a: "Standard compression preserves most image quality while reducing unnecessary PDF metadata and optimizing internal object streams. For stronger image optimization, users can use advanced PDF optimization tools.",
                },

                {
                  q: "Can I compress large PDF files?",
                  a: "Yes, SmartPDFPro supports large PDF files depending on your browser memory and local device performance.",
                },

                {
                  q: "Can I compress scanned PDF documents?",
                  a: "Yes, SmartPDFPro supports scanned PDFs, invoices, reports, ebooks, forms, presentations, and image-heavy PDF files.",
                },

                {
                  q: "Can I compress PDFs on mobile devices?",
                  a: "Yes, the Compress PDF tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                },

                {
                  q: "Do I need Adobe Acrobat to compress PDF files?",
                  a: "No, SmartPDFPro works entirely online in your browser without requiring Adobe Acrobat or desktop software.",
                },

                {
                  q: "Is SmartPDFPro Compress PDF tool secure?",
                  a: "Yes, SmartPDFPro processes files securely in your browser and does not permanently store uploaded PDF documents.",
                },

                {
                  q: "Does SmartPDFPro upload PDF files to servers during compression?",
                  a: "No, many compression operations run locally in your browser using modern browser technologies, helping improve privacy and security.",
                },

                {
                  q: "Can I compress PDFs for email attachments?",
                  a: "Yes, SmartPDFPro helps reduce PDF size for email sharing, website uploads, online forms, and cloud storage.",
                },

                {
                  q: "Will hyperlinks and formatting remain after compression?",
                  a: "Yes, SmartPDFPro preserves original hyperlinks, fonts, formatting, vector graphics, and document structure during compression.",
                },

                {
                  q: "Can businesses use SmartPDFPro Compress PDF tool?",
                  a: "Yes, businesses, students, legal professionals, accountants, and office teams use SmartPDFPro to optimize PDF documents efficiently.",
                },

                {
                  q: "Can I compress multiple PDF files together?",
                  a: "Depending on workflow support, users can process multiple PDF files individually for optimized storage and sharing.",
                },

                {
                  q: "Does SmartPDFPro add watermarks to compressed PDFs?",
                  a: "No, SmartPDFPro does not add watermarks or branding to compressed PDF documents.",
                },

                {
                  q: "Can I compress PDFs offline?",
                  a: "Many SmartPDFPro tools work directly in the browser after loading, reducing dependency on continuous internet connectivity.",
                },

                {
                  q: "Can I optimize PDFs for faster website loading?",
                  a: "Yes, compressed PDFs load faster on websites, improve download speed, and reduce bandwidth usage.",
                },

                {
                  q: "What types of PDF files can be compressed?",
                  a: "SmartPDFPro supports contracts, invoices, reports, scanned PDFs, ebooks, forms, presentations, academic files, and business documents.",
                },

                {
                  q: "Why use SmartPDFPro to compress PDF files?",
                  a: "SmartPDFPro offers fast browser-based PDF compression, secure processing, mobile compatibility, high-quality optimization, and watermark-free downloads in one platform.",
                },

                {
                  q: "What makes SmartPDFPro different from other PDF compressor tools?",
                  a: "SmartPDFPro combines privacy-focused browser processing, intelligent optimization, high-speed compression, and modern PDF workflows in a simple user-friendly interface.",
                },

                {
                  q: "Does SmartPDFPro support browser-based PDF optimization?",
                  a: "Yes, SmartPDFPro provides browser-based PDF tools including compress, merge, split, organize, convert, protect, and ecommerce warehouse automation workflows.",
                },

                {
                  q: "Can I reduce PDF size for WhatsApp or online uploads?",
                  a: "Yes, SmartPDFPro helps users reduce PDF size for WhatsApp sharing, online applications, email attachments, and cloud uploads.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                      <HelpCircle
                        size={18}
                        className="text-emerald-500 shrink-0"
                      />
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
                  name: "Optimize PDF",
                  path: "/tool/optimize-pdf",
                  desc: "Select compression levels",
                },
                {
                  name: "Repair PDF",
                  path: "/tool/repair-pdf",
                  desc: "Fix corrupted PDF files",
                },
                {
                  name: "Split PDF",
                  path: "/tool/split",
                  desc: "Separate documents",
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
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
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
