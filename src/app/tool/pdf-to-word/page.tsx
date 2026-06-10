import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  FileSpreadsheet,
  Presentation,
  Type,
  ImageIcon,
  Lock,
  CheckCircle,
  Shield,
  Zap,
  Info,
  ArrowRight,
  Star,
  Check,
  HelpCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF to Word Converter Online Free",
  url: `${siteUrl}/tool/pdf-to-word`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Convert PDF documents to editable Microsoft Word files online for free. Highly accurate PDF to Word converter preserving fonts, tables, and layouts.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "High-fidelity layout preservation",
    "Secure cloud-based conversion",
    "Automatic file cleanup in 1 hour",
    "Generates editable DOCX files",
    "Free with no software installations required",
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
      name: "PDF to Word Converter",
      item: `${siteUrl}/tool/pdf-to-word`,
    },
  ],
};

// 8. Internal links configuration
const RELATED = [
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    description:
      "Convert DOCX files back to PDF with formatting perfectly preserved.",
    icon: FileText,
    gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    shadow: "rgba(49,130,206,0.3)",
    tag: "Convert",
  },
  {
    id: "compress",
    title: "Compress PDF",
    description: "Reduce PDF file size without losing visible quality.",
    icon: Zap,
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    shadow: "rgba(34,197,94,0.3)",
    tag: "Optimize",
  },
  {
    id: "split",
    title: "Split PDF",
    description: "Split a PDF into individual pages or custom page ranges.",
    icon: Presentation,
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    shadow: "rgba(249,115,22,0.3)",
    tag: "Organize",
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert every PDF page into a high-quality JPG image.",
    icon: ImageIcon,
    gradient: "linear-gradient(135deg, #eab308, #a16207)",
    shadow: "rgba(234,179,8,0.3)",
    tag: "Convert",
  },
  {
    id: "protect",
    title: "Protect PDF",
    description: "Encrypt your PDF with a password to keep it secure.",
    icon: Lock,
    gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
    shadow: "rgba(239,68,68,0.3)",
    tag: "Security",
  },
  {
    id: "pdf-to-docx",
    title: "PDF to DOCX",
    description:
      "Convert your PDF back into an editable DOCX file with high accuracy.",
    icon: FileText,
    gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    shadow: "rgba(49,130,206,0.3)",
    tag: "Convert",
  },
];

// 12. Breadcrumb Navigation Component
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
        PDF to Word
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function OfficeToolsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("pdf-to-word");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("pdf-to-word")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/pdf-to-word` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5 sm:space-y-10">
        <div className="space-y-2 sm:space-y-4 flex flex-col items-center">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-350">
            <Loader2 className="w-6 h-6 sm:w-10 sm:h-10 animate-spin text-slate-400 dark:text-slate-600" />
          </div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
        </div>
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-3xl p-6 sm:p-20 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center gap-4">
          <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl inline-block">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
}

// Dynamic Import of Client Component
const OfficeTools = dynamic(() => import("@/components/tools/OfficeTools"), {
  loading: () => <OfficeToolsSkeleton />,
});

export function generateMetadata() {
  const id = "pdf-to-word";
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

export default function PdfToWordPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive PDF to Word Converter Tool */}
        <section aria-label="PDF to Word Application" className="mb-16">
          <OfficeTools id="pdf-to-word" />
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Editable Word Output",
              desc: "Easily modify all text, fonts, tables, and layouts in standard DOCX format.",
              gradient: "linear-gradient(135deg,#3182ce,#1e3a8a)",
            },
            {
              title: "Safe & Secure Servers",
              desc: "Files are transferred over HTTPS and permanently deleted within 1 hour after conversion.",
              gradient: "linear-gradient(135deg,#3182ce,#1e3a8a)",
            },
            {
              title: "Fidelity Preservation",
              desc: "Our layout analyzer ensures that paragraphs, fonts, images, and sheets stay intact.",
              gradient: "linear-gradient(135deg,#22c55e,#15803d)",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{ background: feat.gradient }}
              >
                <div className="text-white font-bold" aria-hidden="true">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                {feat.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-blue-600 dark:from-white dark:via-slate-200 dark:to-blue-500 bg-clip-text text-transparent">
              Convert PDF to Word Online <br />
              <span className="text-blue-600 dark:text-blue-450">
                100% Free & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform your non-editable PDF documents into fully customizable
              Microsoft Word (.docx) documents in seconds. 100% secure
              processing with automatic files deletion.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF to Word Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF to Word Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  PDF (Portable Document Format) is designed to look identical
                  across all computers, which makes it extremely hard to edit.
                  PDF to Word conversion solves this by extracting textual
                  structures, layout parameters, fonts, and inline tables from
                  the PDF and converting them into an editable `.docx` Word
                  file.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs Pro, your conversion is executed on our
                  isolated cloud servers via HTTPS. Your uploads are stored
                  securely, handled by top-tier parser scripts to guarantee
                  layout accuracy, and{" "}
                  <strong className="text-blue-500 font-bold">
                    permanently wiped from our servers within 1 hour
                  </strong>
                  . You get a perfect editable layout without compromising your
                  information privacy.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <ArrowRight size={24} />
                </span>
                How to convert PDFs to DOCX in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                {/* Connecting Line (Only visible on desktop/md) */}
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Select PDF File",
                    desc: "Drag and drop your document or click the upload panel to choose a PDF from your computer or mobile device.",
                  },
                  {
                    step: "02",
                    title: "Wait for Conversion",
                    desc: "Our high-speed cloud engine extracts the text styling, columns, table bounds, and graphics in seconds.",
                  },
                  {
                    step: "03",
                    title: "Download Word File",
                    desc: "Save the generated editable DOCX file immediately. No watermark, fully compatible with MS Word.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-blue-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
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
                    Complete Data Protection
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We use military-grade HTTPS protocols to secure your files
                    during upload and download. To keep your information clean
                    and private, our system wipes your input and output files
                    permanently after 1 hour.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                    Unmatched Layout Preservation
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Our analyzer correctly recognizes paragraph structures,
                    headers, lists, columns, and tables, saving you from tedious
                    manual layout rebuilding in Microsoft Word.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both modern .docx (Word 2007+) and legacy formats flawlessly.",
                    "Clean and legible text conversion preserving native alignment, headers, and footers.",
                    "No watermarks added, leaving your converted files completely professional and ready.",
                    "Works across iOS, Android, macOS, and Windows browsers without installing apps.",
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
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is my PDF to Word conversion secure?",
                    a: "Yes, all file transfers are encrypted using SSL/TLS (HTTPS). Your files are processed securely in our isolated cloud conversion server and are permanently deleted within 1 hour. We respect your data privacy entirely.",
                  },
                  {
                    q: "Will the layout and formatting of my PDF remain intact?",
                    a: "Yes. Our advanced conversion engine reconstructs paragraph flows, tables, list items, headers, footers, and font styling inside the editable DOCX file for a seamless editing experience.",
                  },
                  {
                    q: "Is there a limit on the file size of PDFs I can convert?",
                    a: "We support free conversions for PDF files up to 50MB, allowing most reports, eBooks, and documents to convert instantly without limits.",
                  },
                  {
                    q: "Can I convert scanned PDF files into editable Word documents?",
                    a: "Yes, we support conversions of scanned PDFs. However, standard scans will be placed as images in the Word document. For fully editable text from scanned pages, we recommend our specialized OCR tool.",
                  },
                  {
                    q: "What is the best free PDF to Word converter online?",
                    a: "SmartPDFPro provides a fast and secure PDF to Word converter that transforms PDF documents into editable DOCX files online for free.",
                  },

                  {
                    q: "Can I convert PDF to Word online without software?",
                    a: "Yes, SmartPDFPro works entirely online and does not require Microsoft Word, Adobe Acrobat, or desktop software installation.",
                  },

                  {
                    q: "How do I convert a PDF file to Word?",
                    a: "Upload your PDF document, click the convert button, and download the editable Word DOCX file instantly.",
                  },

                  {
                    q: "Can I convert PDF to editable Word documents for free?",
                    a: "Yes, SmartPDFPro supports free PDF to Word conversion without signup or account registration.",
                  },

                  {
                    q: "Will formatting remain after converting PDF to Word?",
                    a: "Yes, SmartPDFPro preserves layouts, fonts, tables, images, paragraphs, alignments, headers, and formatting during conversion.",
                  },

                  {
                    q: "Can I convert scanned PDFs into editable Word files?",
                    a: "Yes, SmartPDFPro supports scanned PDF conversion. OCR-based processing may help extract editable text from scanned pages.",
                  },

                  {
                    q: "Can I convert PDF files on mobile devices?",
                    a: "Yes, the PDF to Word converter works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Microsoft Word to convert PDFs?",
                    a: "No, SmartPDFPro converts PDF files online without requiring Microsoft Office or Word software.",
                  },

                  {
                    q: "Is SmartPDFPro PDF to Word tool secure?",
                    a: "Yes, SmartPDFPro uses encrypted HTTPS connections and automatically deletes uploaded documents after processing.",
                  },

                  {
                    q: "Are uploaded PDF files stored permanently?",
                    a: "No, uploaded files are processed securely and automatically removed after conversion.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro PDF to Word converter?",
                    a: "Yes, businesses, students, teachers, legal professionals, accountants, and office teams use SmartPDFPro for editable document workflows.",
                  },

                  {
                    q: "Can I convert contracts, reports, and invoices from PDF to Word?",
                    a: "Yes, SmartPDFPro supports converting contracts, invoices, resumes, reports, forms, proposals, and business documents into editable Word files.",
                  },

                  {
                    q: "Will tables and images remain after conversion?",
                    a: "Yes, SmartPDFPro preserves embedded images, tables, formatting, and page structures during PDF to Word conversion.",
                  },

                  {
                    q: "Can I edit the converted Word document?",
                    a: "Yes, the generated DOCX file is fully editable in Microsoft Word, Google Docs, and compatible office applications.",
                  },

                  {
                    q: "Can I convert large PDF files to Word?",
                    a: "Yes, SmartPDFPro supports converting large PDF documents depending on file size limitations and processing capacity.",
                  },

                  {
                    q: "Can I use PDF to Word converter without registration?",
                    a: "Yes, SmartPDFPro allows users to convert PDF files instantly without account creation or login.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to converted Word documents?",
                    a: "No, SmartPDFPro does not add watermarks or branding to generated DOCX files.",
                  },

                  {
                    q: "Can students use SmartPDFPro PDF to Word tool?",
                    a: "Yes, students and teachers use SmartPDFPro to convert notes, assignments, research papers, ebooks, and academic documents into editable Word files.",
                  },

                  {
                    q: "Can I convert PDF resumes into editable DOCX files?",
                    a: "Yes, SmartPDFPro supports converting resumes and CVs from PDF format into editable Word documents.",
                  },

                  {
                    q: "What types of PDF files are supported?",
                    a: "SmartPDFPro supports invoices, reports, contracts, forms, presentations, scanned PDFs, resumes, academic documents, and business files.",
                  },

                  {
                    q: "Can I convert PDFs offline?",
                    a: "PDF to Word conversion may require internet connectivity because cloud-based conversion engines are used for accurate formatting reconstruction.",
                  },

                  {
                    q: "Why use SmartPDFPro to convert PDF to Word?",
                    a: "SmartPDFPro offers fast conversion, secure processing, mobile compatibility, formatting preservation, editable DOCX output, and watermark-free downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other PDF to Word converters?",
                    a: "SmartPDFPro combines secure cloud conversion, formatting accuracy, OCR support, fast processing, and user-friendly browser workflows in a simple interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based document conversion?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including PDF to Word, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle
                          size={18}
                          className="text-blue-500 shrink-0"
                        />
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

        {/* 8. Internal Linking Section with Accessibility improvements */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
            Explore More PDF Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED.map((t) => (
              <Link
                key={t.id}
                href={`/tool/${t.id}`}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{
                      background: t.gradient,
                      boxShadow: `0 8px 20px -4px ${t.shadow}`,
                    }}
                  >
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                    {t.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool <span aria-hidden="true">&#8594;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
