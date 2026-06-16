import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import SnapdealCropperWrapper, { SnapdealCropperSkeleton } from "@/components/tools/SnapdealCropperWrapper";
import CreditGate from "@/components/credits/CreditGate";
import {
  ShoppingBag,
  Upload,
  Download,
  Wand2,
  Crop,
  Combine,
  Zap,
  Info,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Star,
  Check,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Snapdeal Label Cropper",
  url: `${siteUrl}/tool/snapdeal-cropper`,
  image: `${siteUrl}/img/snapdeal-cropper-og.png`,
  description:
    "Crop Snapdeal shipping label PDFs online for free. Automatically detects outer borders, highlights barcodes, quantities & addresses.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% browser-local processing for file privacy",
    "Smart border detection identifies outer barcode guides",
    "Highlights barcodes and buyer address boundaries",
    "Supports multiple PDF document batch uploads",
    "Clean export to PDF or single-page label segments",
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
      name: "Snapdeal Label Cropper",
      item: `${siteUrl}/tool/snapdeal-cropper`,
    },
  ],
};

const STEPS = [
  {
    icon: Upload,
    title: "Upload Snapdeal Label",
    desc: "Drop one or multiple Snapdeal shipping label PDFs. Processing happens instantly in your browser.",
  },
  {
    icon: Wand2,
    title: "Smart Border Detection",
    desc: "Automatically detects the outer borders of the label, protecting barcodes, addresses, and quantity sections.",
  },
  {
    icon: Download,
    title: "Download Perfect Crop",
    desc: "Get perfectly sized PDF labels ready for thermal or A4 printing without any cut-off text.",
  },
];



export function generateMetadata() {
  const id = "snapdeal-cropper";
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

export default function SnapdealCropperPage() {
  const ACCENT = "#E40046";

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("snapdeal-cropper");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("snapdeal-cropper")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/snapdeal-cropper` },
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
            Snapdeal Cropper
          </span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="Snapdeal Label Cropper Workspace" className="mb-16">
          <CreditGate toolName="snapdeal-cropper" showCounter={false} fallback={<SnapdealCropperSkeleton />}>
            <SnapdealCropperWrapper id="snapdeal-cropper" />
          </CreditGate>
        </section>

        {/* How It Works Quick View */}
        <section
          aria-label="Tool Steps Overview"
          className="py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-20 animate-in fade-in duration-500"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center"
                >
                  <div
                    className="inline-flex p-4 rounded-2xl mb-4 text-white"
                    style={{ background: `${ACCENT}22`, color: ACCENT }}
                  >
                    <s.icon size={28} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detection Logic Overview */}
        <section
          aria-label="Detection Logic"
          className="py-16 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-20"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">
              Snapdeal Detection Logic
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Top Anchor",
                  value: "Snapdeal Logo / Header",
                  color: "#e40046",
                  desc: "Crop includes logo with safe white margin",
                },
                {
                  label: "Bottom Anchor",
                  value: "Reference Barcode",
                  color: "#10b981",
                  desc: "Crop extends safely below the bottom reference barcode",
                },
                {
                  label: "Left Anchor",
                  value: "Shipped From",
                  color: "#3b82f6",
                  desc: "Crop starts safely to the left of the address border",
                },
                {
                  label: "Right Anchor",
                  value: "Total Items",
                  color: "#f59e0b",
                  desc: "Crop includes the quantity number & right border",
                },
              ].map((a) => (
                <div
                  key={a.label}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md text-xs font-bold"
                    style={{ background: a.color }}
                  >
                    {a.label.split(" ")[0][0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                      {a.label}
                    </h3>
                    <code
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: `${a.color}18`, color: a.color }}
                    >
                      {a.value}
                    </code>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                      {a.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                ⚡ Safe Padding: The engine adds 10-25px of safe white margin
                around all detected borders to ensure zero text cut-off during
                printing.
              </p>
            </div>
          </div>
        </section>

        <RelatedTools />

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Snapdeal Shipping Label Cropper <br />
              <span className="text-orange-500 dark:text-orange-400">
                100% Free &amp; Offline
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Extract printable shipping labels from Snapdeal PDF invoices.
              Detect outer barcode boundaries and crop sheets locally in your
              browser memory for absolute privacy.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Snapdeal Cropper */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is the Snapdeal Label Cropper?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  When fulfilling orders on Snapdeal, downloaded PDF packets
                  include large invoices along with the thermal-sized labels.
                  Processing these directly wastes ink and sticker space. The
                  Snapdeal Label Cropper automatically scans the PDF, locates
                  borders such as logo graphics and tracking barcodes, and trims
                  the exact logistics layout.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our algorithm processes everything{" "}
                  <strong className="text-orange-500 font-bold">
                    locally inside your browser engine
                  </strong>
                  . No file uploads or internet transmissions occur, keeping
                  customer data completely private.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                How to Crop Snapdeal Labels in 3 Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Upload PDF",
                    desc: "Drag and drop your Snapdeal PDF documents into the crop canvas above.",
                  },
                  {
                    step: "02",
                    title: "Auto Border Detection",
                    desc: "The engine automatically locates the barcodes, logo, and address boundaries.",
                  },
                  {
                    step: "03",
                    title: "Download",
                    desc: "Click Crop PDF. Get a printable, clean PDF document instantly.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col items-center text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center shadow-lg shadow-orange-500/20">
                      {s.step}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase">
                      {s.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Does this cropper handle multiple PDFs at once?",
                    a: "Yes! You can upload multiple PDFs or multi-page files. The border detection parses and crops them all in batch mode.",
                  },
                  {
                    q: "Is there any padding added to the crop areas?",
                    a: "Yes. The engine automatically adds standard white padding (10-25px) around borders to ensure zero scanner clipping when printing.",
                  },
                  {
                    q: "Does this tool work offline?",
                    a: "Yes. Since the processing runs entirely client-side using JavaScript, you can keep the web application tab open and crop files even without an active internet connection.",
                  },
                  {
                    q: "What is Snapdeal Label Cropper?",
                    a: "Snapdeal Label Cropper is a warehouse automation tool by SmartPDFPro that extracts Snapdeal shipping labels, removes unnecessary invoice areas, and creates print-ready layouts for ecommerce sellers.",
                  },

                  {
                    q: "Can I crop Snapdeal shipping labels online for free?",
                    a: "Yes, SmartPDFPro provides a free browser-based Snapdeal label cropper that works without software installation or account registration.",
                  },

                  {
                    q: "Does Snapdeal Label Cropper support bulk PDF processing?",
                    a: "Yes, users can upload multiple Snapdeal PDFs or process large multi-page shipment files in batch mode.",
                  },

                  {
                    q: "Can I sort Snapdeal labels by courier service?",
                    a: "Yes, SmartPDFPro supports courier-wise sorting and grouping for faster warehouse dispatch workflows.",
                  },

                  {
                    q: "Can I separate COD and prepaid orders automatically?",
                    a: "Yes, the tool supports COD vs prepaid order sorting to simplify warehouse packing and shipment organization.",
                  },

                  {
                    q: "Can I sort Snapdeal labels by seller name?",
                    a: "Yes, seller-wise grouping and sorting are supported for multi-seller warehouse operations.",
                  },

                  {
                    q: "Does the cropper support SKU sorting?",
                    a: "Yes, SmartPDFPro supports SKU-based grouping and sorting for efficient packing verification and inventory handling.",
                  },

                  {
                    q: "Can I sort labels by packed date?",
                    a: "Yes, the platform supports packed-date sorting to help warehouse teams prioritize dispatch operations.",
                  },

                  {
                    q: "Can I sort shipment labels by quantity?",
                    a: "Yes, quantity-based sorting is supported for bulk ecommerce order processing and warehouse management.",
                  },

                  {
                    q: "Can I generate print-ready A4 label layouts?",
                    a: "Yes, SmartPDFPro automatically formats extracted Snapdeal labels into clean A4 warehouse printing layouts.",
                  },

                  {
                    q: "Can I print Snapdeal labels on thermal 4x6 printers?",
                    a: "Yes, extracted labels can be optimized for thermal printer compatible 4x6 shipping label printing.",
                  },

                  {
                    q: "Does SmartPDFPro preserve barcode quality after cropping?",
                    a: "Yes, SmartPDFPro preserves original vector barcodes, QR codes, and courier routing information to maintain scanner readability.",
                  },

                  {
                    q: "Will cropping affect courier barcode scanning?",
                    a: "No, SmartPDFPro crops only page boundaries and whitespace while preserving barcode sharpness and shipping label accuracy.",
                  },

                  {
                    q: "Can I crop scanned Snapdeal shipment documents?",
                    a: "Yes, the tool supports scanned PDFs and uses smart border detection for accurate shipping label extraction.",
                  },

                  {
                    q: "Can I use Snapdeal Label Cropper on mobile devices?",
                    a: "Yes, the tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Adobe Acrobat to crop Snapdeal labels?",
                    a: "No, SmartPDFPro works entirely online in your browser and does not require Adobe Acrobat or desktop software.",
                  },

                  {
                    q: "Does SmartPDFPro store uploaded Snapdeal shipment PDFs?",
                    a: "No, uploaded files are processed securely and are not permanently stored on SmartPDFPro servers.",
                  },

                  {
                    q: "Can I process hundreds of Snapdeal labels together?",
                    a: "Yes, SmartPDFPro is optimized for large-scale ecommerce warehouse operations and high-volume shipment processing.",
                  },

                  {
                    q: "Can fulfillment centers use SmartPDFPro for Snapdeal shipments?",
                    a: "Yes, SmartPDFPro is designed for ecommerce sellers, fulfillment centers, warehouse teams, and logistics operations handling Snapdeal orders.",
                  },

                  {
                    q: "Can I export cropped Snapdeal labels as PNG images?",
                    a: "Yes, SmartPDFPro supports PNG export for shipping labels alongside downloadable PDF layouts.",
                  },

                  {
                    q: "What is the best free Snapdeal shipping label cropper?",
                    a: "SmartPDFPro provides a fast and secure Snapdeal Label Cropper with courier sorting, SKU grouping, barcode-safe extraction, and warehouse automation features.",
                  },

                  {
                    q: "Can I automate Snapdeal warehouse dispatch workflows?",
                    a: "Yes, SmartPDFPro supports shipment label extraction, batch processing, courier grouping, seller sorting, and print-ready dispatch workflows.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based warehouse automation?",
                    a: "Yes, SmartPDFPro provides browser-based ecommerce warehouse automation tools without requiring desktop software installation.",
                  },

                  {
                    q: "Why use SmartPDFPro Snapdeal Label Cropper?",
                    a: "SmartPDFPro combines smart border detection, courier grouping, SKU sorting, COD filtering, barcode-safe extraction, and print-ready warehouse layouts into one modern ecommerce automation platform.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-orange-500 shrink-0" />
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

            
          </article>
        </section>
      </div>
    </main>
  );
}
