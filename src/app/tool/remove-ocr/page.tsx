import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Info,
  ArrowRight,
  Star,
  Check,
  HelpCircle,
  ChevronDown,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";

// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      <Link
        href="/"
        className="hover:text-violet-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-violet-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Remove OCR
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function RemoveOcrSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("remove-ocr");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("remove-ocr")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/remove-ocr` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10">
        <div className="space-y-2 sm:space-y-4 flex flex-col items-center">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-350 font-bold">
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
const RemoveOcr = dynamic(() => import("@/components/tools/RemoveOcr"), {
  loading: () => <RemoveOcrSkeleton />,
});

export function generateMetadata() {
  const id = "remove-ocr";
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

export default function RemoveOcrPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive Remove OCR Tool */}
        <section aria-label="Remove OCR Application" className="mb-16">
          <RemoveOcr id="remove-ocr" />
        </section>

        {/* Premium Banner */}
        <section className="py-6 mb-12" aria-label="Premium Upgrades">
          <div className="relative overflow-hidden rounded-2xl border border-violet-100 dark:border-violet-500/20 shadow-lg bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#e9d5ff]/20 dark:from-[#1e293b] dark:via-[#1e293b] dark:to-[#581c87]/20">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 50%,rgba(139,92,246,0.12) 0%,transparent 70%)",
              }}
            />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-center gap-4 text-left">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]">
                  <Star size={22} className="fill-white/20" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Unlock SmartPDFs Pro — Go Premium
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Batch OCR removal · Unlimited document sizes · Priority
                    rendering · No limits
                  </p>
                </div>
              </div>
              <Link
                href="/premium-plans"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest shadow-md transition-transform hover:scale-105 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]"
              >
                Upgrade Now <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </div>
        </section>

        <RelatedTools />

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Permanent Text Removal",
              desc: "Renders document pages as static images. Selected text, highlights, and fonts are completely erased.",
              gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            },
            {
              title: "High-Resolution Output",
              desc: "Converts pages at a crisp 3x resolution scale to ensure text characters remain sharp and legible.",
              gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            },
            {
              title: "100% Browser Privacy",
              desc: "Your files never leave your computer. All rendering is performed locally in JS.",
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-violet-500/10 dark:bg-violet-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-violet-600 dark:from-white dark:via-slate-200 dark:to-violet-500 bg-clip-text text-transparent">
              Remove OCR from PDF <br />
              <span className="text-violet-500 dark:text-violet-400">
                Flatten text into images
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Convert searchable PDFs to flat scanned PDFs. Erase hidden text
              metadata, layers, and character tables to prevent copying,
              highlight, or selection.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is OCR Removal Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What does it mean to Remove OCR?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Searchable PDFs contain an invisible text overlay matching the
                  visual document. While useful for searching, this layer allows
                  users to copy-paste text and makes confidential files
                  vulnerable to content extraction bots. Removing OCR (or
                  Un-OCR) flattens this text layer, converting the document back
                  into a pure scanned-image PDF format.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Pro processes your documents{" "}
                  <strong className="text-violet-600 font-bold dark:text-violet-450">
                    100% locally in your browser's memory
                  </strong>
                  . No uploads are sent to server folders, which completely
                  eliminates data intercept risks and ensures instant rendering.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                  <ArrowRight size={24} />
                </span>
                How to Remove PDF OCR text in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Select PDF File",
                    desc: "Drag and drop your PDF or click the browse panel to load it locally inside your browser.",
                  },
                  {
                    step: "02",
                    title: "Convert to Images",
                    desc: "Confirm the page rendering parameters. Pages will be converted into high-fidelity image sheets.",
                  },
                  {
                    step: "03",
                    title: "Download Flattened PDF",
                    desc: "Click Apply to render the image layers and download the un-searchable, flat PDF instantly.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-violet-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-violet-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
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
                    Privacy is our baseline. Our tool edits your files inside
                    the browser client memory. Your PDF documents never leave
                    your computer, ensuring absolute safety for business audits.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-violet-500 transition-colors">
                    Prevent Copying & Selection
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Stop readers from extracting text data, copying content
                    blocks, or using screen scrapers. Flattening pages ensures
                    high security.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Stops indexing bots and web crawlers from reading text strings in your files.",
                    "Retains visual font sizes, images, diagrams, and formatting layout details.",
                    "Runs directly inside the browser using HTML5 Canvas APIs for maximum speed.",
                    "No file transfers, completely private processing with no user registration.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-violet-500/10 text-violet-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "How does the Remove OCR tool work?",
                    a: "The tool renders each page of your PDF into a high-resolution image at 3x resolution, then bundles these images back into a new PDF. This completely removes the underlying invisible text layer and any selectable characters, leaving an image-only PDF.",
                  },
                  {
                    q: "Can someone recover the text after using this tool?",
                    a: "No. Once the text layer is removed and converted to flat raster images, the text is permanently gone. The only way to retrieve the text would be to run a new OCR engine on the output document.",
                  },
                  {
                    q: "Does this tool upload my PDF to a server?",
                    a: "Never. The entire rendering and PDF generation process is executed entirely on your local machine using client-side JavaScript. Your confidential files never touch our servers.",
                  },
                  {
                    q: "Will the visual quality of my PDF decrease?",
                    a: "Our tool uses a high-resolution 3x rendering scale to convert pages into images. This maintains crisp, readable text and clear layouts while ensuring the text layer is completely removed.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-violet-500 shrink-0" />
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
