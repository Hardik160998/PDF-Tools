import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import CropPdf from "@/components/tools/CropPdf";
import {
  Upload,
  Crop,
  Download,
  Lock,
  Unlock,
  FileText,
  ImageIcon,
  Merge,
  SplitSquareHorizontal,
  Shield,
  Check,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Info,
  Star,
  Zap,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Crop PDF Online Free",
  url: `${siteUrl}/tool/crop-pdf`,
  image: `${siteUrl}/img/crop-pdf-og.png`,
  description:
    "Crop PDF pages online for free. Adjust page margins, trim borders, and crop individual pages or whole documents instantly.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser sandbox",
    "No file uploads to servers",
    "Set uniform crop area or specify per-page crop areas",
    "Interactive visual crop guides",
    "Free with no registrations or watermarks",
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
      name: "Crop PDF",
      item: `${siteUrl}/tool/crop-pdf`,
    },
  ],
};

const STEPS = [
  {
    icon: Upload,
    title: "Upload Your PDF",
    desc: "Select or drop your PDF file. All processing happens entirely in your browser — your file never leaves your device.",
  },
  {
    icon: Crop,
    title: "Set the Crop Area",
    desc: "Drag the orange handles to define exactly which area to keep. Apply the same crop to all pages or set a different crop per page.",
  },
  {
    icon: Download,
    title: "Download Cropped PDF",
    desc: "Click 'Crop PDF' and instantly download your cropped PDF with all pages trimmed to your selected area.",
  },
];



export function generateMetadata() {
  const id = "crop-pdf";
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

export default function CropPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("crop-pdf");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("crop-pdf")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/crop-pdf` },
              ]}
            />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          <Link
            href="/"
            className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/tool"
            className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
          >
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span
            className="text-slate-600 dark:text-slate-300"
            aria-current="page"
          >
            Crop PDF
          </span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="PDF Crop Application Workspace" className="mb-16">
          <CropPdf id="crop-pdf" />
        </section>

        {/* How It Works Quick View */}
        <section
          aria-label="Tool Steps Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-orange-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                {s.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </section>

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
            {/* Blog Post 1: Crop PDF Guide */}
            <a href="/blog/how-to-crop-pdf" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#f97316] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2v14a2 2 0 0 0 2 2h14"></path>
                                <path d="M18 22V8a2 2 0 0 0-2-2H2"></path>
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            How to Crop PDF Pages Free (Step-by-Step Guide)
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            3 min read &nbsp; May 30, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>
          </div>
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Crop PDF Pages Online <br />
              <span className="text-orange-500 dark:text-orange-400">
                100% Free & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Isolate and trim specific page layouts inside your PDF files.
              Format margins and crop sheets locally in your browser memory for
              absolute file privacy.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Cropper */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF page cropping?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Cropping a PDF involves trimming unnecessary margin borders,
                  headers, or footers to focus on the key contents of a document
                  page. It is highly useful for optimizing slides, adjusting
                  scanner margins, or preparing sheets for specific printer
                  layouts.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Unlike conventional online tools that upload your files to
                  external servers, our PDF cropper performs the entire process
                  {" "}
                  <strong className="text-orange-500 font-bold">
                    100% locally in your web browser
                  </strong>
                  . Your private documents never leave your computer, ensuring
                  complete data confidentiality.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                How to crop PDF in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Select PDF",
                    desc: "Choose your PDF document from your file directory or drag & drop it directly into the workspace above.",
                  },
                  {
                    step: "02",
                    title: "Select Boundary Area",
                    desc: "Drag the orange crop handle margins to outline the specific area to keep. Apply to all pages or configure page-by-page.",
                  },
                  {
                    step: "03",
                    title: "Download Trimmed PDF",
                    desc: "Export your newly formatted, trimmed PDF instantly in original resolution.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-orange-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-300">
                      {s.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        {s.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits & Features */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <Star size={24} />
                </span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Shield size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">
                    100% Client-Side Privacy
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We process documents locally inside your browser memory
                    using client-side JavaScript. No file elements are
                    transmitted over the web.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                    Retains Layout Fidelity
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Adjusts bounding coordinates without re-rendering vector
                    structures, meaning text outlines and visual details remain
                    perfectly crisp.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports cropping all pages together or individually.",
                    "Provides interactive visual drag-and-crop margin frames.",
                    "Highly optimized for mobile screens and phone browsers.",
                    "Free with no conversion limits, accounts, or watermarks.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-orange-500/10 text-orange-600 mt-0.5 shrink-0">
                        <Check size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I crop all pages in a PDF document at the same time?",
                    a: "Yes, our tool allows you to apply the selected crop area uniformly to all pages in your document, or customize the margins on a page-by-page basis.",
                  },
                  {
                    q: "Are my confidential PDFs uploaded to a server?",
                    a: "No. The entire cropping process occurs locally inside your web browser. Your private documents are processed completely offline and are never transmitted to our servers.",
                  },
                  {
                    q: "Will cropping my PDF reduce the quality of text or images?",
                    a: "No, the crop action simply adjusts the page boundary definitions (MediaBox/CropBox parameters) without re-encoding text or compressed image components, preserving original visual details.",
                  },
                  {
                    q: "Is there a limit on the file size of PDFs I can crop?",
                    a: "Since processing happens locally on your computer, there are no artificial server limits. Performance depends entirely on your local system's processor and memory capacity.",
                  },
                  {
                    q: "What is the best free Crop PDF tool online?",
                    a: "SmartPDFPro provides a fast and secure Crop PDF tool that allows users to trim margins, remove white borders, and resize PDF pages online for free.",
                  },

                  {
                    q: "Can I crop PDF pages online without software?",
                    a: "Yes, SmartPDFPro works entirely in your browser and does not require Adobe Acrobat or desktop software installation.",
                  },

                  {
                    q: "How do I crop a PDF file online?",
                    a: "Upload your PDF file, select the crop area visually, apply the crop settings, and download the updated PDF instantly.",
                  },

                  {
                    q: "Can I remove white margins from PDF pages?",
                    a: "Yes, SmartPDFPro allows users to remove unwanted white borders and excess margins from PDF documents cleanly.",
                  },

                  {
                    q: "Can I crop all pages of a PDF at once?",
                    a: "Yes, SmartPDFPro supports applying the same crop dimensions to all PDF pages simultaneously for faster editing workflows.",
                  },

                  {
                    q: "Can I crop scanned PDF documents?",
                    a: "Yes, SmartPDFPro supports cropping scanned PDFs, ebooks, reports, invoices, forms, and image-based documents.",
                  },

                  {
                    q: "Does cropping a PDF reduce image or text quality?",
                    a: "No, SmartPDFPro preserves original text clarity, vector graphics, images, and formatting while adjusting PDF page boundaries.",
                  },

                  {
                    q: "Can I resize PDF pages after cropping?",
                    a: "Yes, cropping can help optimize page layouts, remove unnecessary spaces, and improve PDF readability and printing.",
                  },

                  {
                    q: "Can I crop PDF pages on mobile devices?",
                    a: "Yes, the Crop PDF tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Adobe Acrobat to crop PDFs?",
                    a: "No, SmartPDFPro provides browser-based PDF cropping without requiring Adobe Acrobat or desktop software.",
                  },

                  {
                    q: "Is SmartPDFPro Crop PDF tool secure?",
                    a: "Yes, SmartPDFPro processes PDF files securely in your browser and does not permanently store uploaded documents.",
                  },

                  {
                    q: "Are PDF files uploaded to servers during cropping?",
                    a: "No, many SmartPDFPro editing operations run locally in your browser using modern browser technologies for improved privacy and security.",
                  },

                  {
                    q: "Can I crop confidential business documents safely?",
                    a: "Yes, SmartPDFPro is suitable for cropping contracts, invoices, legal files, reports, and confidential business documents securely.",
                  },

                  {
                    q: "Can businesses and students use Crop PDF tool?",
                    a: "Yes, businesses, students, teachers, accountants, and office professionals use SmartPDFPro to edit PDF page layouts efficiently.",
                  },

                  {
                    q: "Can I crop PDF pages for printing purposes?",
                    a: "Yes, users often crop PDFs to improve printing alignment, remove extra margins, and optimize paper usage.",
                  },

                  {
                    q: "Can I crop PDF pages for ebooks and presentations?",
                    a: "Yes, SmartPDFPro supports cropping ebooks, presentations, lecture notes, scanned books, and slide documents.",
                  },

                  {
                    q: "Will hyperlinks and formatting remain after cropping?",
                    a: "Yes, SmartPDFPro preserves hyperlinks, formatting, fonts, images, and vector graphics after cropping.",
                  },

                  {
                    q: "Can I crop password-protected PDFs?",
                    a: "Yes, but encrypted PDFs must first be unlocked using the Unlock PDF tool before editing.",
                  },

                  {
                    q: "Can I crop PDFs offline?",
                    a: "Many SmartPDFPro tools work directly in the browser after loading, reducing dependency on continuous internet connectivity.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks after cropping PDFs?",
                    a: "No, SmartPDFPro does not add watermarks or branding to cropped PDF documents.",
                  },

                  {
                    q: "Can I visually preview the crop area before downloading?",
                    a: "Yes, SmartPDFPro provides visual crop previews so users can confirm page trimming before generating the final PDF.",
                  },

                  {
                    q: "Can I crop portrait and landscape PDF pages?",
                    a: "Yes, SmartPDFPro supports cropping both portrait and landscape PDF layouts.",
                  },

                  {
                    q: "What types of PDF files can be cropped?",
                    a: "SmartPDFPro supports contracts, invoices, reports, scanned PDFs, ebooks, forms, academic documents, and business files.",
                  },

                  {
                    q: "Why use SmartPDFPro to crop PDF files?",
                    a: "SmartPDFPro offers fast browser-based PDF cropping, secure processing, mobile compatibility, visual editing, and watermark-free downloads in one modern platform.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based PDF editing?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including crop, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-orange-500 shrink-0" />
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                      />
                    </summary>
                    <div className="mx-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </article>
        </section>

        
      </div>
    </main>
  );
}
