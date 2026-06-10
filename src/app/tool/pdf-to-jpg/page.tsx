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
  name: "Convert PDF to JPG Online",
  url: `${siteUrl}/tool/pdf-to-jpg`,
  image: `${siteUrl}/img/pdf-to-jpg-og.png`,
  description:
    "Convert PDF files to high-quality JPG images online for free. Extract images or convert entire PDF pages to JPG locally and securely in your browser.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "High-resolution JPG rendering",
    "Batch export all pages as a ZIP",
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
      name: "PDF to JPG",
      item: `${siteUrl}/tool/pdf-to-jpg`,
    },
  ],
};

const RELATED = [
  {
    id: "merge",
    title: "Merge PDF",
    description: "Combine multiple PDF documents into one unified file easily.",
    icon: FileText,
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    shadow: "rgba(249,115,22,0.3)",
    tag: "Organize",
  },
  {
    id: "split",
    title: "Split PDF",
    description: "Split a PDF into individual pages or custom page ranges.",
    icon: SplitSquareHorizontal,
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    shadow: "rgba(249,115,22,0.3)",
    tag: "Organize",
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert images like JPG, PNG, and TIFF into a PDF document.",
    icon: ImageIcon,
    gradient: "linear-gradient(135deg, #eab308, #a16207)",
    shadow: "rgba(234,179,8,0.3)",
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
    id: "protect",
    title: "Protect PDF",
    description: "Encrypt your PDF with a password to keep it secure.",
    icon: Lock,
    gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
    shadow: "rgba(239,68,68,0.3)",
    tag: "Security",
  },
  {
    id: "unlock",
    title: "Unlock PDF",
    description: "Remove password protection from a PDF instantly.",
    icon: Unlock,
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    shadow: "rgba(139,92,246,0.3)",
    tag: "Security",
  },
];

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
        PDF to JPG
      </span>
    </nav>
  );
}

export function generateMetadata() {
  const id = "pdf-to-jpg";
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

export default function PdfToJpgPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("pdf-to-jpg");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("pdf-to-jpg")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/pdf-to-jpg` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        <Breadcrumb />

        <section
          aria-label="PDF to JPG Converter Application"
          className="mb-16"
        >
          <ImageConverter id="pdf-to-jpg" />
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Pixel Perfect",
              desc: "Render PDF pages into high-resolution JPG images with crisp text and vibrant colors.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)",
            },
            {
              title: "Batch Export",
              desc: "Convert every page of your document in one go and download them as a clean ZIP archive.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)",
            },
            {
              title: "Private Rendering",
              desc: "All image generation occurs in your browser sandbox. Your data never leaves your device.",
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
              Convert PDF to JPG Online <br />
              <span className="text-yellow-500 dark:text-yellow-400">
                100% Free & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Convert PDF pages into high-quality JPG image files in seconds.
              Extract images with total privacy—all file rendering happens
              locally on your computer.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF to JPG Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF to JPG Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Converting PDF to JPG allows you to turn pages of a PDF
                  document into standard JPEG image files. This makes it easy to
                  share pages on social platforms, use them in presentations, or
                  view them without a PDF reader.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs, this conversion process runs{" "}
                  <strong className="text-yellow-600 dark:text-yellow-400 font-bold">
                    entirely in your local browser sandbox
                  </strong>
                  . Since your files are never uploaded to any server, your
                  sensitive data is 100% safe. This client-side approach ensures
                  instantaneous processing times with absolutely zero file
                  queues.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                  <ArrowRight size={24} />
                </span>
                How to convert PDF to JPG in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Select PDF",
                    desc: "Drag and drop your PDF file or click 'Choose File' to select it from your device.",
                  },
                  {
                    step: "02",
                    title: "Adjust Quality",
                    desc: "Configure settings such as image rendering density (DPI) to get the exact output detail you need.",
                  },
                  {
                    step: "03",
                    title: "Convert & Download",
                    desc: "Click 'Convert' and save your generated JPG files. Multi-page PDFs are saved as a neat ZIP archive.",
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
                    100% Client-Side Security
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Your files never reach any server. PDF-to-image conversion
                    happens within your browser using client-side WebAssembly,
                    ensuring high-speed processing without compromising your
                    document's privacy.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">
                    Batch Processing & High Quality
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Whether your PDF has one page or one hundred, our batch
                    processing lets you export them in one click. Our parser
                    ensures layouts, vectors, and font graphics are preserved
                    cleanly.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Zero registrations or accounts needed — start converting instantly.",
                    "Supports large PDF files since processing capacity depends on your own system's RAM.",
                    "Download every page neatly packed as a standard ZIP file.",
                    "Responsive layouts allow seamless PDF to JPG conversion on mobile devices and tablets.",
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
                    q: "Is converting PDF to JPG secure on your website?",
                    a: "Yes, absolutely. Our converter works 100% locally in your web browser using HTML5 and client-side processing. Your PDF documents and generated JPG images never leave your device, ensuring complete privacy.",
                  },
                  {
                    q: "Does the conversion process add any watermarks?",
                    a: "No, our PDF to JPG converter is completely free and does not insert any watermarks onto your images. You will get clean, high-resolution JPG files.",
                  },
                  {
                    q: "How can I download the converted JPG images?",
                    a: "For single-page PDFs, you can download the JPG directly. For multi-page PDFs, the converter compiles all pages into a single ZIP archive, which you can download and extract on your device.",
                  },
                  {
                    q: "Is there a limit on the PDF file size I can upload?",
                    a: "Since the rendering and conversion are performed locally in your web browser, there are no file size limits imposed by our servers. The only limit is what your computer or phone's memory can handle.",
                  },
                  {
                    q: "What is the best free PDF to JPG converter online?",
                    a: "SmartPDFPro provides a fast and secure PDF to JPG converter that transforms PDF pages into high-quality JPG images online for free.",
                  },

                  {
                    q: "Can I convert PDF to JPG online without software?",
                    a: "Yes, SmartPDFPro works entirely in your browser and does not require Adobe Acrobat or desktop software installation.",
                  },

                  {
                    q: "How do I convert a PDF file to JPG images?",
                    a: "Upload your PDF document, start the conversion process, and download the generated JPG images instantly.",
                  },

                  {
                    q: "Can I convert multi-page PDFs into separate JPG files?",
                    a: "Yes, SmartPDFPro converts every PDF page into separate JPG images and packages them into a downloadable ZIP archive.",
                  },

                  {
                    q: "Does PDF to JPG conversion preserve image quality?",
                    a: "Yes, SmartPDFPro generates high-resolution JPG images while preserving text clarity, graphics, colors, and layout quality.",
                  },

                  {
                    q: "Can I convert scanned PDFs into JPG images?",
                    a: "Yes, SmartPDFPro supports scanned PDFs, image-based documents, ebooks, reports, invoices, and forms.",
                  },

                  {
                    q: "Can I convert PDF files on mobile devices?",
                    a: "Yes, the PDF to JPG converter works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Adobe Acrobat to convert PDF to JPG?",
                    a: "No, SmartPDFPro converts PDF files into JPG images directly in your browser without requiring Adobe Acrobat.",
                  },

                  {
                    q: "Is SmartPDFPro PDF to JPG tool secure?",
                    a: "Yes, SmartPDFPro processes files securely in your browser and does not permanently store uploaded PDF documents.",
                  },

                  {
                    q: "Are PDF files uploaded to servers during conversion?",
                    a: "No, many PDF to JPG operations run locally in your browser using client-side technologies for improved privacy and security.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro PDF to JPG converter?",
                    a: "Yes, businesses, students, teachers, designers, legal professionals, and office teams use SmartPDFPro for image conversion workflows.",
                  },

                  {
                    q: "Can I convert PDF invoices, reports, and presentations into JPG images?",
                    a: "Yes, SmartPDFPro supports converting invoices, reports, presentations, forms, ebooks, resumes, and business documents into JPG files.",
                  },

                  {
                    q: "Will fonts and colors remain after conversion?",
                    a: "Yes, SmartPDFPro preserves fonts, colors, graphics, images, and layouts during PDF to JPG conversion.",
                  },

                  {
                    q: "Can I extract images from PDF documents?",
                    a: "Yes, converting PDF pages into JPG images allows users to extract visual page content for presentations, sharing, and design workflows.",
                  },

                  {
                    q: "Can I use PDF to JPG converter without registration?",
                    a: "Yes, SmartPDFPro allows users to convert PDF files instantly without account creation or login.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to JPG images?",
                    a: "No, SmartPDFPro does not add watermarks or branding to converted JPG files.",
                  },

                  {
                    q: "Can I convert PDFs for social media or presentations?",
                    a: "Yes, JPG output is useful for presentations, social media sharing, image previews, printing, and visual document workflows.",
                  },

                  {
                    q: "Can I convert PDFs offline?",
                    a: "Many SmartPDFPro tools work directly in the browser after loading, reducing dependency on continuous internet connectivity.",
                  },

                  {
                    q: "Can students use SmartPDFPro PDF to JPG tool?",
                    a: "Yes, students and teachers use SmartPDFPro to convert notes, slides, assignments, diagrams, and study materials into image files.",
                  },

                  {
                    q: "What types of PDF files are supported?",
                    a: "SmartPDFPro supports invoices, reports, contracts, forms, scanned PDFs, ebooks, resumes, presentations, and business documents.",
                  },

                  {
                    q: "Can I generate high-resolution JPG images from PDFs?",
                    a: "Yes, SmartPDFPro generates clean high-resolution JPG files optimized for printing and digital viewing.",
                  },

                  {
                    q: "Why use SmartPDFPro to convert PDF to JPG?",
                    a: "SmartPDFPro offers fast browser-based conversion, secure processing, mobile compatibility, high-quality image generation, and watermark-free downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other PDF to JPG converters?",
                    a: "SmartPDFPro combines privacy-focused browser processing, high-resolution rendering, fast conversion, and user-friendly workflows in a simple interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based PDF conversion?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including PDF to JPG, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle
                          size={18}
                          className="text-yellow-500 shrink-0"
                        />
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                      />
                    </summary>
                    <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
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

        {/* RELATED TOOLS */}
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
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none"
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-yellow-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-yellow-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
