import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import OfficeTools from "@/components/tools/OfficeTools";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  FileSpreadsheet,
  Presentation,
  Globe,
  ImageIcon,
  Lock,
  Unlock,
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

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Convert Word to PDF Online",
  url: `${siteUrl}/tool/word-to-pdf`,
  image: `${siteUrl}/img/word-to-pdf-og.png`,
  description:
    "Convert Microsoft Word documents (.docx & .doc) to PDF online for free. High-quality conversion preserving all fonts, layouts, and images securely.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "Secure HTTPS file uploads",
    "Precise formatting preservation",
    "Conversions completed in seconds",
    "Automatic file deletion within 1 hour",
    "Free with no watermarks",
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
      name: "Word to PDF",
      item: `${siteUrl}/tool/word-to-pdf`,
    },
  ],
};



function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      <Link
        href="/"
        className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Word to PDF
      </span>
    </nav>
  );
}

export function generateMetadata() {
  const id = "word-to-pdf";
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

export default function WordToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("word-to-pdf");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("word-to-pdf")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/word-to-pdf` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        <Breadcrumb />

        <section
          aria-label="Word to PDF Converter Application"
          className="mb-16"
        >
          <OfficeTools id="word-to-pdf" />
        </section>

        <RelatedTools />

        {/* Feature Cards Grid (How it Works) */}
        <section
          aria-label="Tool Steps Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              icon: Upload,
              title: "Upload Word File",
              desc: "Select your .doc or .docx file. It is securely uploaded over HTTPS for cloud conversion.",
            },
            {
              icon: Sparkles,
              title: "Convert to PDF",
              desc: "Our conversion engine preserves all fonts, images, tables, and formatting from your Word document.",
            },
            {
              icon: Download,
              title: "Download PDF",
              desc: "Your converted PDF is ready instantly. Download it and your file is permanently deleted within 1 hour.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <s.icon size={24} aria-hidden="true" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Step {i + 1}
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

        {/* SEO Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-blue-600 dark:from-white dark:via-slate-200 dark:to-blue-500 bg-clip-text text-transparent">
              Convert Word to PDF Online <br />
              <span className="text-blue-500 dark:text-blue-400">
                100% Free & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Convert your Microsoft Word documents into standard, professional
              PDF files. Enjoy fast conversions, precise formatting
              preservation, and strict file privacy.
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
                  Converting Microsoft Word documents (.docx or .doc) to PDF
                  ensures that your document will render exactly the same on any
                  device or operating system. PDFs prevent fonts, formatting,
                  images, and alignments from shifting when viewed or printed.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs uses a high-performance rendering engine that parses
                  Word documents to compile clean vector graphics layouts. All
                  files are uploaded via highly secure HTTPS channels, and our
                  automated server protocols ensure that{" "}
                  <strong className="text-blue-600 dark:text-blue-400 font-bold">
                    all uploaded and converted files are permanently deleted
                    within 1 hour
                  </strong>
                  .
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500">
                  <ArrowRight size={24} />
                </span>
                How to convert Word to PDF in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Upload DOC/DOCX",
                    desc: "Select your Microsoft Word document by clicking the file selector or dropping it in.",
                  },
                  {
                    step: "02",
                    title: "Automatic Processing",
                    desc: "Our secure cloud converter processes the document instantly, maintaining layout margins and embedded tables.",
                  },
                  {
                    step: "03",
                    title: "Download PDF",
                    desc: "Click the download button to save your formatted, watermark-free PDF. Your files will be wiped within an hour.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-blue-600 dark:text-blue-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
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

            {/* Detailed Benefits and Features */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500">
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
                    Strict Server Clean-Up
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Privacy is core to SmartPDFs. All connections are encrypted
                    via TLS/HTTPS, and all uploaded Word files and converted
                    PDFs are deleted automatically from our cloud servers within
                    1 hour.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                    Layout & Quality Preservation
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    No broken tables or skewed text. Our high-fidelity
                    conversion maintains original formatting, keeping your
                    documents ready for professional printing or business
                    distribution.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both DOCX and older DOC formats.",
                    "Quick conversion times — usually completed within 5 seconds.",
                    "No watermarks, no registration, and no daily file limit thresholds.",
                    "Optimized responsive layout works seamlessly on laptops, iPads, and mobile devices.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-blue-500/10 text-blue-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is converting Word to PDF secure on your website?",
                    a: "Yes, completely. Your files are uploaded over a highly secure HTTPS connection. The document is converted in a secure cloud environment and is permanently deleted from our servers within 1 hour of processing.",
                  },
                  {
                    q: "Will the PDF preserve my document's formatting?",
                    a: "Yes. Our conversion engine is optimized to accurately preserve all fonts, layout structures, page margins, tables, alignments, and images from your original Microsoft Word file.",
                  },
                  {
                    q: "Do I need to sign up or pay to use this tool?",
                    a: "No registration or payment is required. You can convert your .doc or .docx files to PDF completely free, without any watermarks or page limits.",
                  },
                  {
                    q: "Are both .doc and .docx Word files supported?",
                    a: "Yes, our converter fully supports both the older Microsoft Word formats (.doc) and the newer XML-based Word documents (.docx).",
                  },
                  {
                    q: "What is the best free Word to PDF converter online?",
                    a: "SmartPDFPro provides a fast and secure Word to PDF converter that transforms DOC and DOCX files into professional PDF documents online for free.",
                  },

                  {
                    q: "Can I convert Word to PDF online without software?",
                    a: "Yes, SmartPDFPro works entirely online and does not require Microsoft Word, Adobe Acrobat, or desktop software installation.",
                  },

                  {
                    q: "How do I convert a Word document to PDF?",
                    a: "Upload your DOC or DOCX file, click the convert button, and download the generated PDF instantly.",
                  },

                  {
                    q: "Can I convert DOCX files to PDF for free?",
                    a: "Yes, SmartPDFPro supports free DOCX to PDF conversion without signup or account registration.",
                  },

                  {
                    q: "Does Word to PDF conversion preserve formatting?",
                    a: "Yes, SmartPDFPro preserves fonts, layouts, tables, margins, images, alignments, and document formatting during conversion.",
                  },

                  {
                    q: "Can I convert DOC files to PDF?",
                    a: "Yes, SmartPDFPro supports both older DOC files and modern DOCX Word document formats.",
                  },

                  {
                    q: "Can I convert Word files on mobile devices?",
                    a: "Yes, the Word to PDF tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Microsoft Word to convert documents to PDF?",
                    a: "No, SmartPDFPro converts Word documents online without requiring Microsoft Office or Word software.",
                  },

                  {
                    q: "Is SmartPDFPro Word to PDF tool secure?",
                    a: "Yes, SmartPDFPro uses secure encrypted connections and automatically deletes uploaded documents after processing.",
                  },

                  {
                    q: "Are uploaded Word files stored permanently?",
                    a: "No, uploaded documents are processed securely and automatically removed after conversion.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro Word to PDF converter?",
                    a: "Yes, businesses, students, teachers, legal professionals, accountants, and office teams use SmartPDFPro for secure document conversion workflows.",
                  },

                  {
                    q: "Can I convert resumes and contracts from Word to PDF?",
                    a: "Yes, SmartPDFPro supports converting resumes, contracts, reports, invoices, forms, academic documents, and business files into PDFs.",
                  },

                  {
                    q: "Will images and tables remain after conversion?",
                    a: "Yes, SmartPDFPro preserves embedded images, tables, charts, formatting, and page structures during conversion.",
                  },

                  {
                    q: "Can I convert multiple Word documents to PDF?",
                    a: "Depending on workflow support, users can process multiple Word documents for faster office productivity.",
                  },

                  {
                    q: "Can I use Word to PDF converter without registration?",
                    a: "Yes, SmartPDFPro allows users to convert Word files to PDF instantly without account creation or login.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to converted PDFs?",
                    a: "No, SmartPDFPro does not add watermarks or branding to generated PDF documents.",
                  },

                  {
                    q: "Can I convert Word to PDF for printing purposes?",
                    a: "Yes, PDF conversion is commonly used for professional printing, sharing, document protection, and consistent formatting.",
                  },

                  {
                    q: "Can I convert Word documents offline?",
                    a: "Some SmartPDFPro tools work directly in the browser, while document conversion tools may require internet connectivity for cloud processing.",
                  },

                  {
                    q: "Can students use SmartPDFPro Word to PDF tool?",
                    a: "Yes, students and teachers use SmartPDFPro to convert assignments, projects, notes, resumes, and academic documents into PDFs.",
                  },

                  {
                    q: "What types of Word documents are supported?",
                    a: "SmartPDFPro supports resumes, reports, invoices, contracts, proposals, forms, academic files, letters, and business documents.",
                  },

                  {
                    q: "Why use SmartPDFPro to convert Word to PDF?",
                    a: "SmartPDFPro offers fast document conversion, secure processing, mobile compatibility, formatting preservation, and watermark-free PDF downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other Word to PDF converters?",
                    a: "SmartPDFPro combines secure cloud conversion, formatting accuracy, fast processing, and user-friendly browser workflows in a simple interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based document conversion?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including Word to PDF, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-blue-500 shrink-0" />
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
