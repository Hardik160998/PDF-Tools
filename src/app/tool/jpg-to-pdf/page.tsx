import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ImageConverter from "@/components/tools/ImageConverter";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SplitSquareHorizontal,
  FileText,
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
  name: "Convert JPG to PDF Online",
  url: `${siteUrl}/tool/jpg-to-pdf`,
  image: `${siteUrl}/img/jpg-to-pdf-og.png`,
  description:
    "Convert JPG, PNG, and TIFF images to PDF online for free. Combine multiple photos into a single PDF document locally and securely in your web browser.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Combine multiple images into one PDF",
    "High-resolution PDF output",
    "Free with no watermark",
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
      name: "JPG to PDF",
      item: `${siteUrl}/tool/jpg-to-pdf`,
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
        className="hover:text-yellow-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-yellow-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        JPG to PDF
      </span>
    </nav>
  );
}

export function generateMetadata() {
  const id = "jpg-to-pdf";
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

export default function JpgToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("jpg-to-pdf");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("jpg-to-pdf")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/jpg-to-pdf` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        <Breadcrumb />

        <section
          aria-label="JPG to PDF Converter Application"
          className="mb-16"
        >
          <ImageConverter id="jpg-to-pdf" />
        </section>

        <RelatedTools />

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Instant Conversion",
              desc: "Convert multiple JPG, PNG, or TIFF images into a single professional PDF document.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)",
            },
            {
              title: "High Fidelity",
              desc: "Maintains original image resolution and color profiles for high-quality printing and sharing.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)",
            },
            {
              title: "Private Processing",
              desc: "All image-to-PDF merging occurs locally in your browser. No files are uploaded to our servers.",
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

        {/* SEO Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-yellow-500/10 dark:bg-yellow-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-yellow-600 dark:from-white dark:via-slate-200 dark:to-yellow-500 bg-clip-text text-transparent">
              Convert JPG to PDF Online <br />
              <span className="text-yellow-500 dark:text-yellow-400">
                100% Free & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Combine multiple images into a single professional PDF document in
              seconds. Work with absolute security—all conversion occurs
              directly on your local device.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is JPG to PDF Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-650 dark:text-yellow-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is JPG to PDF Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  JPG to PDF conversion is the process of importing one or more
                  image files (such as JPG, PNG, WebP) and compiling them into a
                  unified PDF document. This is highly useful for scanning
                  documents with your phone camera, compiling photo portfolios,
                  or submitting multi-page image documents.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs, you can build a PDF from images{" "}
                  <strong className="text-yellow-650 dark:text-yellow-400 font-bold">
                    without uploading your private photos to external servers
                  </strong>
                  . Using advanced HTML5 and web capabilities, your browser
                  handles the formatting and rendering locally. This guarantees
                  absolute data confidentiality.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                  <ArrowRight size={24} />
                </span>
                How to convert JPG to PDF in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Select Images",
                    desc: "Drag and drop your images or click the choose button to select JPG, PNG, or TIFF files.",
                  },
                  {
                    step: "02",
                    title: "Arrange Sequence",
                    desc: "Drag and reorder your image previews to customize which order they appear as pages inside your PDF.",
                  },
                  {
                    step: "03",
                    title: "Convert & Save",
                    desc: "Click the conversion button. Download your watermark-free PDF document instantly.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-yellow-600 dark:text-yellow-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-yellow-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
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
                    Complete Privacy Sandbox
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Your photos and documents contain private data. By
                    converting locally in your browser, your files never touch
                    external servers, keeping you safe from internet security
                    breaches.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">
                    Lossless Formatting Preservation
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    The rendering engine embeds your images into the PDF
                    document in their original resolution and color structure,
                    ensuring they print and display beautifully on any screen.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports multiple formats (JPG, PNG, WebP, TIFF) concurrently.",
                    "Interactive drag-and-drop workspace for easy slide reordering.",
                    "No file upload restrictions, no delays, and no watermark stamps.",
                    "100% responsive and optimized for mobile, tablet, and desktop viewports.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-yellow-500/10 text-yellow-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is converting JPG to PDF secure on your website?",
                    a: "Yes, absolutely. Our converter works 100% locally in your web browser using HTML5 and client-side processing. Your image files and generated PDF documents never leave your device, ensuring complete privacy.",
                  },
                  {
                    q: "Can I combine multiple images into a single PDF?",
                    a: "Yes, you can upload multiple JPG, PNG, or TIFF files at once, drag them around to arrange the page sequence, and compile them all into a single, organized PDF document.",
                  },
                  {
                    q: "What image formats are supported?",
                    a: "Our converter supports standard web image formats including JPG, JPEG, PNG, WebP, and TIFF, rendering them cleanly into PDF pages.",
                  },
                  {
                    q: "Will there be a watermark or ads in the output PDF?",
                    a: "No, our JPG to PDF tool does not add any watermark or alter your original files. You get clean, professional PDF files for free.",
                  },
                  {
                    q: "What is the best free JPG to PDF converter online?",
                    a: "SmartPDFPro provides a fast and secure JPG to PDF converter that transforms images into professional PDF documents online for free.",
                  },

                  {
                    q: "Can I convert JPG to PDF online without software?",
                    a: "Yes, SmartPDFPro works entirely in your browser and does not require Adobe Acrobat or desktop software installation.",
                  },

                  {
                    q: "How do I convert JPG images into PDF files?",
                    a: "Upload one or multiple JPG images, arrange them in the desired order, and click 'Convert to PDF' to generate the final document.",
                  },

                  {
                    q: "Can I combine multiple images into one PDF document?",
                    a: "Yes, SmartPDFPro supports combining multiple JPG, PNG, WebP, JPEG, and TIFF images into a single PDF file.",
                  },

                  {
                    q: "What image formats are supported by SmartPDFPro?",
                    a: "SmartPDFPro supports JPG, JPEG, PNG, WebP, TIFF, and other commonly used image formats for PDF conversion.",
                  },

                  {
                    q: "Can I rearrange image order before creating the PDF?",
                    a: "Yes, users can drag and reorder uploaded images before generating the final PDF document.",
                  },

                  {
                    q: "Does JPG to PDF conversion reduce image quality?",
                    a: "No, SmartPDFPro preserves image clarity, colors, resolution, and formatting while generating the PDF.",
                  },

                  {
                    q: "Can I convert scanned photos into PDF documents?",
                    a: "Yes, SmartPDFPro supports converting scanned photos, receipts, forms, notes, invoices, and documents into PDF files.",
                  },

                  {
                    q: "Can I convert images to PDF on mobile devices?",
                    a: "Yes, the JPG to PDF converter works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Adobe Acrobat to convert JPG to PDF?",
                    a: "No, SmartPDFPro converts images into PDFs directly in your browser without requiring Adobe Acrobat.",
                  },

                  {
                    q: "Is SmartPDFPro JPG to PDF tool secure?",
                    a: "Yes, SmartPDFPro processes image files securely in your browser and does not permanently store uploaded documents.",
                  },

                  {
                    q: "Are uploaded images stored permanently?",
                    a: "No, uploaded image files are processed securely and automatically removed after conversion.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro JPG to PDF converter?",
                    a: "Yes, businesses, students, teachers, designers, accountants, and office teams use SmartPDFPro for document conversion workflows.",
                  },

                  {
                    q: "Can I convert screenshots into PDF files?",
                    a: "Yes, SmartPDFPro supports converting screenshots, scanned pages, mobile photos, and digital images into PDF documents.",
                  },

                  {
                    q: "Can I create print-ready PDFs from images?",
                    a: "Yes, SmartPDFPro generates clean print-ready PDF documents suitable for reports, presentations, and document sharing.",
                  },

                  {
                    q: "Can I use JPG to PDF converter without registration?",
                    a: "Yes, SmartPDFPro allows users to convert images into PDFs instantly without account creation or login.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to generated PDFs?",
                    a: "No, SmartPDFPro does not add watermarks or branding to converted PDF documents.",
                  },

                  {
                    q: "Can I convert PNG images into PDF files?",
                    a: "Yes, SmartPDFPro supports PNG to PDF conversion alongside JPG, JPEG, WebP, and TIFF image formats.",
                  },

                  {
                    q: "Can students use SmartPDFPro JPG to PDF tool?",
                    a: "Yes, students and teachers use SmartPDFPro to convert notes, assignments, scanned pages, and diagrams into PDF files.",
                  },

                  {
                    q: "Can I create PDF portfolios from photos?",
                    a: "Yes, SmartPDFPro can combine multiple images into organized PDF portfolios, albums, reports, or printable documents.",
                  },

                  {
                    q: "Can I convert images into PDFs offline?",
                    a: "Many SmartPDFPro tools work directly in the browser after loading, reducing dependency on continuous internet connectivity.",
                  },

                  {
                    q: "What types of images can be converted into PDF?",
                    a: "SmartPDFPro supports photos, scanned documents, invoices, receipts, forms, screenshots, artwork, diagrams, and presentation images.",
                  },

                  {
                    q: "Why use SmartPDFPro to convert JPG to PDF?",
                    a: "SmartPDFPro offers fast browser-based conversion, secure processing, mobile compatibility, image ordering, and watermark-free PDF downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other JPG to PDF converters?",
                    a: "SmartPDFPro combines privacy-focused browser processing, high-quality PDF generation, fast conversion, and user-friendly workflows in a simple interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based document conversion?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including JPG to PDF, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-yellow-500 shrink-0" />
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
