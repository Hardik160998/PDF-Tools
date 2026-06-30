import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import OptimizePdf from "@/components/tools/OptimizePdf";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  HelpCircle,
  Star,
  Check,
  ChevronDown,
  Clock,
} from "lucide-react";
export function generateMetadata() {
  const id = 'optimize-pdf';
  const meta = getToolMeta(id);
  if (!meta) return { title: 'PDF Tool | SmartPDFPro' };

  const url = getToolUrl(id);
  return {
    title: `${meta.title} | SmartPDFPro`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
      url,
      siteName: 'SmartPDFPro',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  };
}

export default function OptimizePdfPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('optimize-pdf');
        return meta ? (
          <>
            <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('optimize-pdf')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/optimize-pdf` }]} />
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
              <span>Optimize PDF</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <OptimizePdf id="optimize-pdf" />
        </div>

        <RelatedTools />

        {/* -- RELATED BLOG POSTS -- */}
        <section className="mb-20 text-left mt-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium uppercase tracking-widest shadow-sm mb-6">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              Latest from Blog
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 text-center">
              Explore Our PDF Guides
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[
              {
                slug: "reduce-pdf-size-without-losing-quality",
                title: "Reduce PDF File Size Without Losing Quality (2026 Guide)",
                excerpt: "Learn how to reduce PDF file size without losing quality. Discover the best methods, online PDF compressors, and tips for optimizing PDFs efficiently.",
                label: "Optimize",
                icon: Zap,
                iconBg: "bg-teal-500",
                readTime: "8 min read",
                date: "Jun 17, 2026",
                image: "/img/compress-pdf.png",
              },
              {
                slug: "compress-pdf-without-losing-quality",
                title: "How to Compress a PDF Without Losing Quality",
                excerpt: "Reduce your PDF file size by up to 80% while keeping text sharp and images clear. A complete guide to PDF compression techniques.",
                label: "Optimize",
                icon: Zap,
                iconBg: "bg-green-500",
                readTime: "4 min read",
                date: "Apr 18, 2026",
                image: "/img/compress-pdf.png",
              },
              {
                slug: "ultimate-pdf-optimization-guide",
                title: "The Ultimate Guide to PDF Optimization — Size, Speed & Repair",
                excerpt: "Are your PDF files too large or corrupted? Learn how to compress, repair, and clean up your PDFs with our all-in-one guide.",
                label: "Optimize",
                icon: Zap,
                iconBg: "bg-amber-500",
                readTime: "5 min read",
                date: "May 4, 2026",
                image: "/img/pdf-optimization.png",
              }
            ].map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full"
              >
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 ${post.iconBg} rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5`}
                    >
                      <post.icon size={16} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-[15px] leading-snug group-hover:text-red-500 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                      <span>{post.date}</span>
                    </div>
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-600 dark:from-white dark:via-emerald-100 dark:to-emerald-400 uppercase">
              Optimize PDF Files Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Compress images and clean document streams to reduce your PDF file
              size. Tailor compression levels with local browser execution to
              ensure maximum safety.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                How to Optimize a PDF Document?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Step-by-step optimization guide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload Document",
                  desc: "Select or drag & drop your PDF file into our optimizer workspace. The file loads instantly in your browser.",
                },
                {
                  step: "02",
                  title: "Select Optimization Level",
                  desc: "Choose from Extreme, Recommended, or Low compression levels depending on your quality needs.",
                },
                {
                  step: "03",
                  title: "Download Optimized PDF",
                  desc: "Click 'Optimize PDF' to run. Instantly download the smaller, compressed PDF to your local drive.",
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
                  In-Browser PDF Optimization Features
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
                  title: "Variable Compression",
                  desc: "Balance file size and visual fidelity by selecting from multiple levels.",
                },
                {
                  title: "Image Downsampling",
                  desc: "Downsamples embedded images to 72-150 DPI to reduce size without sacrificing legibility.",
                },
                {
                  title: "Clean object streams",
                  desc: "Clears metadata nodes and structures layout streams to standard PDF formats.",
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
          <section>
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {[
                  {
                    q: "How can I optimize and compress a PDF file?",
                    a: "Upload your PDF. Select your desired compression level (Extreme, Recommended, or Low). Click 'Optimize PDF' to run the scanner and download the optimized PDF instantly.",
                  },
                  {
                    q: "Is my data secure when using the PDF optimizer?",
                    a: "Yes, absolutely! The optimization runs 100% locally in your web browser. No files are uploaded to remote servers, securing your confidential documents completely.",
                  },
                  {
                    q: "What is the difference between Compress PDF and Optimize PDF?",
                    a: "Compress PDF optimizes index data and stream layouts without changing image quality (lossless). Optimize PDF downsamples and re-compresses embedded images (lossy), yielding much smaller files for graphic-heavy documents.",
                  },
                  {
                    q: "Is this tool free to use?",
                    a: "Yes, our PDF optimizer is 100% free with no watermarks or email signups required.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
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
          </section>


        </article>
      </div>
    </div>
  );
}
