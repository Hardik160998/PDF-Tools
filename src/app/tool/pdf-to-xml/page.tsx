import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ExtractText from "@/components/tools/ExtractText";
import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  Star,
  Check,
  ChevronDown,
} from "lucide-react";

export function generateMetadata() {
  const id = 'pdf-to-xml';
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

export default function PdfToXmlPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('pdf-to-xml');
        return meta ? (
          <>
            <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('pdf-to-xml')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/pdf-to-xml` }]} />
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
                className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link
                href="/#tools-grid"
                className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
              >
                Tools
              </Link>
            </li>
            <li
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
              aria-current="page"
            >
              <span>/</span>
              <span>PDF to XML</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <ExtractText id="pdf-to-xml" />
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

          <div className="max-w-xl mx-auto mb-12">
            {/* Blog Post 1: PDF to Word Guide */}
            <a href="/blog/pdf-to-word-conversion-guide" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-1 gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                    The Ultimate PDF to Word Conversion Guide
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    4 min read &nbsp; May 25, 2026
                  </div>
                  <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-950 to-blue-600 dark:from-white dark:via-blue-100 dark:to-blue-400 uppercase">
              Convert PDF to XML Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Transform unstructured PDF document characters into organized,
              structured XML tag hierarchies. Edit, preview, and download clean
              XML schema files instantly, processed 100% locally.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                How to Convert PDF to XML Online?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Step-by-step conversion guide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload PDF File",
                  desc: "Select or drag & drop your PDF file into our XML converter. The file loads instantly in your browser.",
                },
                {
                  step: "02",
                  title: "Hierarchical Parsing",
                  desc: "Our parser reads character coordinates to map headers, paragraphs, and list lines into structured tags.",
                },
                {
                  step: "03",
                  title: "Verify & Export",
                  desc: "Examine parsed XML blocks inside the code editor. Copy tags to your clipboard or download the XML file.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-blue-500/20 group-hover:text-blue-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center font-bold text-sm">
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
          <section className="bg-gradient-to-tr from-white to-blue-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-blue-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-blue-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                  <Star size={12} className="fill-blue-500" /> Premium Benefits
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  In-Browser PDF to XML Features
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
                  title: "Hierarchical XML Tags",
                  desc: "Generates tags describing pages, sections, coordinates, and text content.",
                },
                {
                  title: "Built-In XML Editor",
                  desc: "Review structural alignment directly inside the built-in dark code preview panel.",
                },
                {
                  title: "Extract Text Sister",
                  desc: "Need raw characters only? Use our Extract Text tool to parse text without tags.",
                },
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
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
                <span className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {[
                  {
                    q: "How can I convert a PDF to an XML file?",
                    a: "Simply upload your PDF file to the converter. The parser extracts layout segments, lines, and text content locally. Review the generated XML structured schema in the editor and click copy or download to save the XML file.",
                  },
                  {
                    q: "Is my data secure when converting to XML?",
                    a: "Yes, absolutely! The conversion process is completed entirely on your local device. We never upload or save your documents to any external servers, maintaining total security.",
                  },
                  {
                    q: "Does the XML parser support tables and columns?",
                    a: "Yes, our parser identifies page layout coordinates to structure columns and paragraphs into clear tags, making it easy to map database attributes or parse schemas.",
                  },
                  {
                    q: "Is there a file size limit for PDF to XML conversion?",
                    a: "Since files are analyzed entirely within your web browser, size limits depend mostly on your computer's memory. We optimize memory usage so you can convert large documents smoothly.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={18} className="text-blue-500 dark:text-blue-400 shrink-0" />
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
