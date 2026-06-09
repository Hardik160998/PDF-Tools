import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from "next/link";
import type { Metadata } from "next";
import MeeshoCropLabel from "@/components/tools/MeeshoCropLabel";
import MeeshoTitleSync from "@/components/tools/MeeshoTitleSync";
import CreditGate from "@/components/credits/CreditGate";
import {
  ShoppingBag,
  Upload,
  Scissors,
  Download,
  Zap,
  FileText,
  Wand2,
  Crop,
  Combine,
  Lock,
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
  name: "Meesho Label Crop (Without Invoice)",
  url: `${siteUrl}/tool/meshocrop`,
  image: `${siteUrl}/img/meshocrop-og.png`,
  description:
    "Crop Meesho shipping label PDFs online for free. Strip invoice details and prepare labels for standard 4-per-page A4 sticker printing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "Processes files 100% locally in browser WebAssembly sandbox",
    "Auto detects 'TAX INVOICE' text to crop and strip invoice info",
    "Options to organize output into a 2x2 grid layout (4 labels per A4 page)",
    "Sort labels by Quantity, SKU ID, or Courier partner",
    "Download order metadata CSV instantly",
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
      name: "Meesho Label Crop without Invoice",
      item: `${siteUrl}/tool/meshocrop`,
    },
  ],
};

const STEPS = [
  {
    icon: Upload,
    title: "Upload Meesho Labels",
    desc: "Drop one or multiple Meesho shipping label PDFs. Everything runs in your browser — no uploads to any server.",
  },
  {
    icon: Scissors,
    title: "Auto Crop TAX INVOICE",
    desc: 'The tool scans each page, finds "TAX INVOICE" text and crops everything from top to just above that line.',
  },
  {
    icon: Download,
    title: "Download Clean Labels",
    desc: "All cropped labels with only shipping info, return address & barcodes are merged into one PDF.",
  },
];

const RELATED_TOOLS = [
  {
    id: "meesho-cropper",
    title: "Meesho Invoice Cropper",
    description:
      'Remove invoice section below "Total" from Meesho labels. Complementary to this tool.',
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Ecommerce",
  },
  {
    id: "flipkart-cropper",
    title: "Flipkart Cropper",
    description:
      "Perfectly crop Flipkart label PDFs using smart OCR detection anchors.",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f7941d, #c2410c)",
    shadow: "rgba(247,148,29,0.3)",
    tag: "Ecommerce",
  },
  {
    id: "aadhar-crop",
    title: "Aadhar Cropper",
    description:
      "Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.",
    icon: Wand2,
    gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    shadow: "rgba(239,68,68,0.3)",
    tag: "Special",
  },
  {
    id: "crop-pdf",
    title: "Crop PDF",
    description:
      "Trim margins and crop any pages of your PDF with custom margin controls.",
    icon: Crop,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Special",
  },
  {
    id: "merge",
    title: "Merge PDF",
    description:
      "Combine multiple PDF files into one document in the order you choose.",
    icon: Combine,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Organize",
  },
  {
    id: "compress",
    title: "Compress PDF",
    description:
      "Reduce PDF file size while keeping text sharp and content intact.",
    icon: Zap,
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    shadow: "rgba(34,197,94,0.3)",
    tag: "Optimize",
  },
];


export function generateMetadata() {
  const id = 'meshocrop';
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

export default function MeeshoCropPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("meshocrop");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("meshocrop")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/meshocrop` },
              ]}
            />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}

      <MeeshoTitleSync />

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
            Meesho Crop without Invoice
          </span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section
          aria-label="Meesho Crop Label without Invoice Workspace"
          className="mb-16"
        >
          <CreditGate toolName="meshocrop" showCounter={false}>
            <MeeshoCropLabel id="meshocrop" />
          </CreditGate>
        </section>

        {/* How It Works Quick View */}
        <section
          aria-label="Tool Steps Overview"
          className="py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-20"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center"
                >
                  <div className="inline-flex p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 mb-4">
                    <step.icon size={28} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Use This Tool */}
        <section
          aria-label="Tool Features"
          className="py-16 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-20"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">
              Why Use This Tool
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Zap,
                  color: "#f26522",
                  title: "Instant Processing",
                  desc: "All processing happens in your browser using JavaScript — no server, no waiting, instant results.",
                },
                {
                  icon: FileText,
                  color: "#22c55e",
                  title: "100% Private",
                  desc: "Your PDF files never leave your device. Zero data collection, fully secure and offline-capable.",
                },
                {
                  icon: FileText,
                  color: "#3182ce",
                  title: "Batch PDF Support",
                  desc: "Upload multiple Meesho label PDFs at once and process them all in a single click.",
                },
                {
                  icon: Scissors,
                  color: "#8b5cf6",
                  title: "Smart Auto-Crop",
                  desc: 'Automatically detects "TAX INVOICE" text on each page — no manual selection or configuration needed.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md animate-pulse"
                    style={{ background: f.color }}
                  >
                    <f.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      {f.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Meesho Crop Shipping Labels <br />
              <span className="text-orange-500 dark:text-orange-400">
                Without Tax Invoice Details
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Quickly strip the invoice layout from your downloads. Generate pure
              shipping labels and output them in standard grids or single sheets
              for instant printing.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Meesho Crop */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Meesho Crop (Without Invoice)?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Normally, Meesho downloads bundle the customer shipping details
                  together with detailed tax invoice sheets. For compact thermal
                  printing, or to print multiple labels on a single A4 sticker
                  sheet in a 2x2 grid, you need to extract only the address
                  barcode sections. This cropper tool searches the PDF vectors
                  for the TAX INVOICE header, crops everything below it, and
                  exports clean logistics templates.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  The processing occurs{""}
                  <strong className="text-orange-500 font-bold">
                    entirely locally in WebAssembly code
                  </strong>
                  {""}
                  inside your browser frame. No merchant data, customer
                  credentials, or barcode lists are sent over the network,
                  providing ultimate enterprise-grade privacy.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                How to Crop &amp; Print 4 Labels on A4 Sheet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Drop Files",
                    desc: "Upload your Meesho PDF shipping label sheets into the dashed area above.",
                  },
                  {
                    step: "02",
                    title: "Select 4 per A4",
                    desc: "Enable the '4 Labels per A4 page (2x2 Grid)' box in the settings menu.",
                  },
                  {
                    step: "03",
                    title: "Print Layout",
                    desc: "Process and download. The tool aligns your labels into standard A4 sheets automatically.",
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

            {/* FAQ Section */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I split thermal labels by Courier partner?",
                    a: "Yes! If you select the 'Split by Courier' option in settings, the engine automatically clusters your labels into distinct PDF files for Delhivery, Xpressbees, Shadowfax, Valmo, etc.",
                  },
                  {
                    q: "Does this tool work on mobile devices?",
                    a: "Yes. Our responsive mobile layout runs fast on tablets and smartphones, allowing you to crop labels on-the-go from any browser.",
                  },
                  {
                    q: "What barcode formats are preserved?",
                    a: "The tool preserves all vector bar tags, QR codes, and E-commerce routing IDs at native quality without rasterization blur, keeping scan tools functional.",
                  },
                  {
                    q: "What is Meesho Label Crop (Without Invoice)?",
                    a: "Meesho Label Crop (Without Invoice) is a warehouse automation tool by SmartPDFPro that extracts only shipping labels from Meesho PDFs while removing TAX INVOICE and billing sections automatically.",
                  },

                  {
                    q: "Can I remove TAX INVOICE pages from Meesho labels automatically?",
                    a: "Yes, SmartPDFPro automatically removes invoice and billing information while preserving shipping addresses, return addresses, barcodes, and courier routing data.",
                  },

                  {
                    q: "Does the tool support bulk Meesho PDF processing?",
                    a: "Yes, users can upload multiple Meesho shipment PDFs or process large multi-page label documents in a single batch.",
                  },

                  {
                    q: "Can I sort Meesho labels by SKU ID?",
                    a: "Yes, SmartPDFPro supports SKU-based grouping and sorting to help warehouse staff organize identical products efficiently.",
                  },

                  {
                    q: "Can I sort Meesho labels by quantity?",
                    a: "Yes, the cropper supports quantity-wise sorting to streamline bulk order packing and warehouse workflows.",
                  },

                  {
                    q: "Can I split labels by courier automatically?",
                    a: "Yes, SmartPDFPro can automatically separate Meesho labels into courier-specific PDF groups such as Delhivery, Xpressbees, Shadowfax, Valmo, and other logistics providers.",
                  },

                  {
                    q: "Does SmartPDFPro support courier-wise grouping?",
                    a: "Yes, users can organize shipment labels by courier partner for faster dispatch and warehouse management.",
                  },

                  {
                    q: "Can I highlight SKU IDs for packing verification?",
                    a: "Yes, SmartPDFPro includes visible SKU highlight boxes to help warehouse staff verify products during packing and shipment preparation.",
                  },

                  {
                    q: "Can I export Meesho order metadata as CSV?",
                    a: "Yes, the platform supports metadata CSV export for order management, inventory tracking, and warehouse reporting workflows.",
                  },

                  {
                    q: "Does the tool support 4 labels per A4 page?",
                    a: "Yes, SmartPDFPro can automatically generate optimized 2x2 A4 layouts with 4 labels per page for efficient warehouse printing.",
                  },

                  {
                    q: "Can I print labels in thermal 4x6 format?",
                    a: "Yes, Meesho labels can be scaled and formatted for thermal printer compatible 4x6 shipping label printing.",
                  },

                  {
                    q: "Will barcode quality remain sharp after cropping?",
                    a: "Yes, SmartPDFPro preserves vector barcode quality, QR codes, routing IDs, and courier tracking information without rasterization or blur.",
                  },

                  {
                    q: "Does SmartPDFPro affect courier barcode scannability?",
                    a: "No, all barcode elements remain fully scannable because the system crops layout boundaries without modifying barcode vectors.",
                  },

                  {
                    q: "Can I process hundreds of Meesho labels together?",
                    a: "Yes, the platform is optimized for high-volume ecommerce operations and bulk warehouse processing.",
                  },

                  {
                    q: "Can fulfillment centers use SmartPDFPro for Meesho shipments?",
                    a: "Yes, SmartPDFPro is designed for ecommerce sellers, fulfillment centers, logistics companies, and warehouse teams handling large shipment volumes.",
                  },

                  {
                    q: "Can I use Meesho Label Cropper on mobile devices?",
                    a: "Yes, the tool works on Android, iPhone, tablets, Windows, and Mac browsers without software installation.",
                  },

                  {
                    q: "Does SmartPDFPro store uploaded Meesho PDFs?",
                    a: "No, uploaded shipment files are processed securely and are not permanently stored on SmartPDFPro servers.",
                  },

                  {
                    q: "Can I crop Meesho labels online without installing software?",
                    a: "Yes, SmartPDFPro is fully browser-based and works online without Adobe Acrobat or desktop software.",
                  },

                  {
                    q: "What is the best online Meesho label cropper?",
                    a: "SmartPDFPro provides a fast and secure Meesho label cropper with invoice removal, SKU sorting, courier grouping, thermal printing support, and warehouse automation features.",
                  },

                  {
                    q: "Why use SmartPDFPro for Meesho shipping label automation?",
                    a: "SmartPDFPro combines automatic invoice removal, bulk processing, barcode-safe extraction, courier sorting, CSV export, and print-ready warehouse layouts into one modern ecommerce automation platform.",
                  },

                  {
                    q: "Can I organize Meesho labels by seller name?",
                    a: "Yes, SmartPDFPro supports seller-wise grouping and sorting for multi-seller ecommerce warehouse workflows.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based warehouse automation?",
                    a: "Yes, SmartPDFPro provides browser-based ecommerce warehouse automation tools for label extraction, order processing, and shipment organization.",
                  },

                  {
                    q: "Can I create print-ready warehouse label sheets instantly?",
                    a: "Yes, the tool automatically generates clean print-ready PDF layouts optimized for warehouse packing and shipping operations.",
                  },

                  {
                    q: "Is SmartPDFPro suitable for ecommerce dispatch operations?",
                    a: "Yes, SmartPDFPro is built specifically for modern ecommerce dispatch workflows, courier sorting, label extraction, and fulfillment center automation.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white  tracking-tight flex items-center gap-3">
                        <HelpCircle
                          size={18}
                          className="text-orange-500 shrink-0"
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
            </div>

            {/* Related Tools Section */}
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
                Related Ecommerce &amp; PDF Tools
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {RELATED_TOOLS.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={`/tool/${tool.id}`}
                    className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                      {tool.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">
                      {tool.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
