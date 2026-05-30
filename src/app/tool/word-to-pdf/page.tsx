import OfficeTools from "@/components/tools/OfficeTools";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText, Upload, Sparkles, Download, FileSpreadsheet, Presentation, Globe, ImageIcon,
  Lock, Unlock, Zap, Shield, ArrowRight, HelpCircle, Info, Star, Check, ChevronDown
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'SITE_OFFICIAL_DOMAIN';

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: 'Convert Word to PDF Online - Free DOCX to PDF | SmartPDFs',
  description: 'Convert Microsoft Word documents (.docx & .doc) to PDF online for free. High-quality conversion preserving all fonts, layouts, and images securely.',
  keywords: 'word to pdf, docx to pdf, convert docx to pdf online, free word to pdf converter, doc to pdf converter, smartpdfs',
  alternates: {
    canonical: `${siteUrl}/tool/word-to-pdf`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    title: 'Convert Word to PDF Online - Free DOCX to PDF | SmartPDFs',
    description: 'Convert Microsoft Word documents (.docx & .doc) to PDF online for free. High-quality conversion preserving all fonts, layouts, and images securely.',
    siteName: 'SmartPDFs',
    url: `${siteUrl}/tool/word-to-pdf`,
    images: [
      {
        url: `${siteUrl}/img/word-to-pdf-og.png`,
        width: 1200,
        height: 630,
        alt: 'Convert Word to PDF Online Free - SmartPDFs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert Word to PDF Online - Free DOCX to PDF | SmartPDFs',
    description: 'Convert Microsoft Word documents (.docx & .doc) to PDF online for free. High-quality conversion preserving all fonts, layouts, and images securely.',
    images: [`${siteUrl}/img/word-to-pdf-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Convert Word to PDF Online",
  "url": `${siteUrl}/tool/word-to-pdf`,
  "image": `${siteUrl}/img/word-to-pdf-og.png`,
  "description": "Convert Microsoft Word documents (.docx & .doc) to PDF online for free. High-quality conversion preserving all fonts, layouts, and images securely.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "Secure HTTPS file uploads",
    "Precise formatting preservation",
    "Conversions completed in seconds",
    "Automatic file deletion within 1 hour",
    "Free with no watermarks"
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
      "name": "Word to PDF",
      "item": `${siteUrl}/tool/word-to-pdf`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is converting Word to PDF secure on your website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, completely. Your files are uploaded over a highly secure HTTPS connection. The document is converted in a secure cloud environment and is permanently deleted from our servers within 1 hour of processing."
      }
    },
    {
      "@type": "Question",
      "name": "Will the PDF preserve my document's formatting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Our conversion engine is optimized to accurately preserve all fonts, layout structures, page margins, tables, alignments, and images from your original Microsoft Word file."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to sign up or pay to use this tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No registration or payment is required. You can convert your .doc or .docx files to PDF completely free, without any watermarks or page limits."
      }
    },
    {
      "@type": "Question",
      "name": "Are both .doc and .docx Word files supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our converter fully supports both the older Microsoft Word formats (.doc) and the newer XML-based Word documents (.docx)."
      }
    }
  ]
};

const RELATED = [
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDF back into an editable DOCX file with high accuracy.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'excel-to-pdf', title: 'Excel to PDF', description: 'Convert XLSX spreadsheets to PDF with all tables and data intact.', icon: FileSpreadsheet, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Convert' },
  { id: 'ppt-to-pdf', title: 'PowerPoint to PDF', description: 'Convert PPTX presentations to PDF keeping all slides and visuals.', icon: Presentation, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Convert' },
  { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert JPG or PNG images into a PDF document instantly.', icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)', tag: 'Convert' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one unified document easily.', icon: FileText, gradient: 'linear-gradient(135deg, #f97316, #ea580c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Organize' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your converted PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      <Link href="/" className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link href="/tool" className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">Word to PDF</span>
    </nav>
  );
}

export default function WordToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
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
        <Breadcrumb />

        <section aria-label="Word to PDF Converter Application" className="mb-16">
          <OfficeTools id="word-to-pdf" />
        </section>

        {/* Feature Cards Grid (How it Works) */}
        <section aria-label="Tool Steps Overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Upload,
              title: 'Upload Word File',
              desc: 'Select your .doc or .docx file. It is securely uploaded over HTTPS for cloud conversion.'
            },
            {
              icon: Sparkles,
              title: 'Convert to PDF',
              desc: 'Our conversion engine preserves all fonts, images, tables, and formatting from your Word document.'
            },
            {
              icon: Download,
              title: 'Download PDF',
              desc: 'Your converted PDF is ready instantly. Download it and your file is permanently deleted within 1 hour.'
            },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <s.icon size={24} aria-hidden="true" />
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* SEO Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-blue-600 dark:from-white dark:via-slate-200 dark:to-blue-500 bg-clip-text text-transparent">
              Convert Word to PDF Online <br />
              <span className="text-blue-500 dark:text-blue-400">100% Free & Secure</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Convert your Microsoft Word documents into standard, professional PDF files. Enjoy fast conversions, precise formatting preservation, and strict file privacy.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Word to PDF Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Word to PDF Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Converting Microsoft Word documents (.docx or .doc) to PDF ensures that your document will render exactly the same on any device or operating system. PDFs prevent fonts, formatting, images, and alignments from shifting when viewed or printed.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs uses a high-performance rendering engine that parses Word documents to compile clean vector graphics layouts. All files are uploaded via highly secure HTTPS channels, and our automated server protocols ensure that <strong className="text-blue-600 dark:text-blue-400 font-black">all uploaded and converted files are permanently deleted within 1 hour</strong>.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500"><ArrowRight size={24} /></span>
                How to convert Word to PDF in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  { step: "01", title: "Upload DOC/DOCX", desc: "Select your Microsoft Word document by clicking the file selector or dropping it in." },
                  { step: "02", title: "Automatic Processing", desc: "Our secure cloud converter processes the document instantly, maintaining layout margins and embedded tables." },
                  { step: "03", title: "Download PDF", desc: "Click the download button to save your formatted, watermark-free PDF. Your files will be wiped within an hour." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-blue-600 dark:text-blue-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
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

            {/* Detailed Benefits and Features */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Shield size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">Strict Server Clean-Up</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Privacy is core to SmartPDFs. All connections are encrypted via TLS/HTTPS, and all uploaded Word files and converted PDFs are deleted automatically from our cloud servers within 1 hour.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">Layout & Quality Preservation</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    No broken tables or skewed text. Our high-fidelity conversion maintains original formatting, keeping your documents ready for professional printing or business distribution.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both DOCX and older DOC formats.",
                    "Quick conversion times — usually completed within 5 seconds.",
                    "No watermarks, no registration, and no daily file limit thresholds.",
                    "Optimized responsive layout works seamlessly on laptops, iPads, and mobile devices."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-blue-500/10 text-blue-600 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is converting Word to PDF secure on your website?",
                    a: "Yes, completely. Your files are uploaded over a highly secure HTTPS connection. The document is converted in a secure cloud environment and is permanently deleted from our servers within 1 hour of processing."
                  },
                  {
                    q: "Will the PDF preserve my document's formatting?",
                    a: "Yes. Our conversion engine is optimized to accurately preserve all fonts, layout structures, page margins, tables, alignments, and images from your original Microsoft Word file."
                  },
                  {
                    q: "Do I need to sign up or pay to use this tool?",
                    a: "No registration or payment is required. You can convert your .doc or .docx files to PDF completely free, without any watermarks or page limits."
                  },
                  {
                    q: "Are both .doc and .docx Word files supported?",
                    a: "Yes, our converter fully supports both the older Microsoft Word formats (.doc) and the newer XML-based Word documents (.docx)."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-blue-500">
                        <ChevronDown size={18} />
                      </span>
                    </summary>
                    <div className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 pt-3">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* RELATED TOOLS */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
            Explore More Convert Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED.map(t => (
              <Link
                key={t.id}
                href={`/tool/${t.id}`}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool <span aria-hidden="true">&#8594;</span></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
