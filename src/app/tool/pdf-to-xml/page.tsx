import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ExtractText from "@/components/tools/ExtractText";
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


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Convert PDF to XML Online Free",
  url: `${siteUrl}/tool/pdf-to-xml`,
  image: `${siteUrl}/img/pdf-to-xml-og.png`,
  description:
    "Convert PDF files to structured XML data online for free. Deep-scan text blocks, paragraphs, and page attributes, and download clean XML instantly. 100% secure.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser sandbox",
    "No file uploads to servers",
    "Transforms text blocks into hierarchical XML tags",
    "Built-in code editor for instant review",
    "Cleans and escapes XML variables automatically",
    "Fast processing with zero server queues",
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
      name: "PDF to XML",
      item: `${siteUrl}/tool/pdf-to-xml`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I convert a PDF to an XML file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply upload your PDF file to the converter. The parser extracts layout segments, lines, and text content locally. Review the generated XML structured schema in the editor and click copy or download to save the XML file.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when converting to XML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely! The conversion process is completed entirely on your local device. We never upload or save your documents to any external servers, maintaining total security.",
      },
    },
    {
      "@type": "Question",
      name: "Does the XML parser support tables and columns?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our parser identifies page layout coordinates to structure columns and paragraphs into clear tags, making it easy to map database attributes or parse schemas.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a file size limit for PDF to XML conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Since files are analyzed entirely within your web browser, size limits depend mostly on your computer's memory. We optimize memory usage so you can convert large documents smoothly.",
      },
    },
  ],
};


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

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="font-outfit text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-950 to-blue-600 dark:from-white dark:via-blue-100 dark:to-blue-400 uppercase">
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
              <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
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
                      <span className="font-outfit text-4xl font-black text-blue-500/20 group-hover:text-blue-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center font-bold text-sm">
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
          <section className="bg-gradient-to-tr from-white to-blue-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-blue-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-blue-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                  <Star size={12} className="fill-blue-500" /> Premium Benefits
                </span>
                <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
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
                PDF to XML FAQs
              </p>
            </div>

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
                    <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                      <HelpCircle
                        size={18}
                        className="text-blue-500 shrink-0"
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
                  name: "Extract Text",
                  path: "/tool/extract-text",
                  desc: "Copy raw text blocks",
                },
                {
                  name: "OCR PDF",
                  path: "/tool/ocr-pdf",
                  desc: "Convert scans to text",
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
                  <span className="font-outfit text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
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
