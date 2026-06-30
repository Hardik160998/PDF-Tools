import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import MergeSplit from "@/components/tools/MergeSplit";
import Link from "next/link";
import {
  Zap,
  Shield,
  ArrowRight,
  HelpCircle,
  Info,
  Star,
  Check,
  ChevronDown,
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
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Merge PDF
      </span>
    </nav>
  );
}

export function generateMetadata() {
  const id = "merge";
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

export default function MergePage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("merge");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("merge")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/merge` },
              ]}
            />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb navigation */}
        <Breadcrumb />

        {/* Interactive PDF Merger Tool */}
        <section aria-label="PDF Merger Application" className="mb-16">
          <MergeSplit id="merge" />
        </section>

        

        <RelatedTools />

        {/* -- RELATED BLOG POSTS -- */}
        <section className="mb-20 text-left">
          <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium uppercase tracking-widest shadow-sm mb-6">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  Latest from Blog
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 text-center">
                  Explore Our PDF Guides
              </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {/* Blog Post 1: How to Merge PDF */}
            <a href="/blog/how-to-merge-pdf" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#f97316] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            How to Merge Multiple PDFs into One File (Free & Easy)
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            3 min read &nbsp; Apr 20, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>

            {/* Blog Post 2: Organizing PDFs */}
            <a href="/blog/ultimate-guide-to-organizing-pdfs" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            The Ultimate Guide to Organizing PDFs — Merge, Split & Rearrange
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            5 min read &nbsp; May 5, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>

            {/* Blog Post 3: Merge vs Split PDF */}
            <a href="/blog/merge-vs-split-pdf" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#f97316] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            Merge vs Split PDF: When to Use Each Tool (2026 Guide)
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            8 min read &nbsp; Jun 17, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Smart Merging",
              desc: "Combine multiple PDF files into one while maintaining high-quality text and images.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)",
            },
            {
              title: "Label Enrichment",
              desc: "Automatically detects Amazon labels and enriches them with SKU information during merge.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)",
            },
            {
              title: "Secure Handling",
              desc: "Your files never leave your computer. Merging is performed 100% locally.",
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
            {/* Background glowing gradient accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Merge PDF Files Online <br />
              <span className="text-orange-500 dark:text-orange-400">
                100% Free & Secure
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Combine multiple PDF documents into a single file in seconds. Work
              with total privacy—your files are processed locally in your
              browser and never uploaded to any server.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Merge Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Merge?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  PDF merging is the process of combining two or more PDF
                  documents into a single, unified file. This is crucial for
                  organizing digital paperwork, archiving records, and
                  assembling reports.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Unlike conventional online services that require you to upload
                  private files to external servers (exposing your sensitive
                  data to security risks), SmartPDFs Pro combines your files{" "}
                  <strong className="text-orange-500 font-bold">
                    100% locally in your web browser
                  </strong>{" "}
                  using native Client-side WebAssembly logic. Your files never
                  touch our servers, guaranteeing complete privacy and instant
                  processing.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                How to combine PDFs in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                {/* Connecting Line (Only visible on desktop/md) */}
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Select Files",
                    desc: "Click 'Choose Files' or drag and drop your PDFs directly into the workspace above.",
                  },
                  {
                    step: "02",
                    title: "Arrange Order",
                    desc: "Drag and drop the files in the list to change the order they will appear in the merged document.",
                  },
                  {
                    step: "03",
                    title: "Merge & Save",
                    desc: "Click 'Merge All' to combine the files. Download your watermark-free output PDF instantly.",
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

            {/* Detailed Benefits and Features */}
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
                    Security is our baseline. Our tool works locally inside your
                    browser sandbox. It reads and merges the PDFs directly in
                    your computer's memory, so your files are never transmitted
                    across the internet.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                    No Watermarks & Instant Execution
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We do not force ads or watermarks onto your final documents.
                    Output files are created in original resolution, preserving
                    layout format, text, and vector resolution instantly.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Amazon Label Enrichment detects barcodes and injects SKU labels dynamically.",
                    "Supports mixing of different page dimensions (A4, Letter, Custom) inside one document.",
                    "Zero signup required — start merging files immediately without creating an account.",
                    "Mobile-friendly layouts that let you combine documents on your phone or tablet.",
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
                    q: "Is this PDF merger tool safe to use with sensitive files?",
                    a: "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF merger performs the entire process 100% locally in your web browser. Your private documents never leave your computer.",
                  },
                  {
                    q: "How many PDF files can I merge at once?",
                    a: "You can add and merge multiple PDF files at once. You can also drag and drop them in the queue to rearrange their order before merging.",
                  },
                  {
                    q: "Is there a limit on the file size of PDFs I can upload?",
                    a: "Because all merging happens client-side in your browser, there is no server-imposed upload limit. It depends only on your local system's memory and CPU.",
                  },
                  {
                    q: "Will merging PDFs add a watermark or degrade quality?",
                    a: "No, our tool does not add any watermarks to your output PDF, and it retains the original high resolution and formatting of your text and images.",
                  },
                  {
                    q: "What is the best free Merge PDF tool online?",
                    a: "SmartPDFPro provides a fast and secure Merge PDF tool that allows users to combine multiple PDF files online for free without software installation.",
                  },

                  {
                    q: "Can I merge PDF files online without signup?",
                    a: "Yes, SmartPDFPro allows users to merge PDF files instantly without creating an account or logging in.",
                  },

                  {
                    q: "How do I combine multiple PDF files into one document?",
                    a: "Upload multiple PDF files, arrange them in your preferred order using drag-and-drop, and click 'Merge PDF' to generate a single combined document.",
                  },

                  {
                    q: "Can I rearrange PDF pages before merging?",
                    a: "Yes, SmartPDFPro allows users to drag and reorder PDF files before merging them into one final document.",
                  },

                  {
                    q: "Does merging PDFs reduce document quality?",
                    a: "No, SmartPDFPro preserves the original text quality, vector graphics, images, hyperlinks, and formatting during the merging process.",
                  },

                  {
                    q: "Can I merge scanned PDF files?",
                    a: "Yes, SmartPDFPro supports merging scanned PDFs, image-based documents, invoices, reports, contracts, and ebooks.",
                  },

                  {
                    q: "Can I merge password-protected PDF files?",
                    a: "Yes, but encrypted PDFs must first be unlocked using the Unlock PDF tool before merging.",
                  },

                  {
                    q: "Can I merge PDFs on mobile devices?",
                    a: "Yes, the Merge PDF tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Adobe Acrobat to merge PDFs?",
                    a: "No, SmartPDFPro works entirely online in your browser and does not require Adobe Acrobat or desktop software.",
                  },

                  {
                    q: "Is SmartPDFPro Merge PDF tool secure?",
                    a: "Yes, SmartPDFPro processes files securely in your browser and does not permanently store uploaded PDF documents.",
                  },

                  {
                    q: "Does SmartPDFPro store merged PDF files?",
                    a: "No, SmartPDFPro does not permanently store uploaded or generated PDF files after processing.",
                  },

                  {
                    q: "Can I merge large PDF files online?",
                    a: "Yes, SmartPDFPro supports merging large PDF documents depending on your browser memory and device performance.",
                  },

                  {
                    q: "Can I combine invoices, reports, and contracts into one PDF?",
                    a: "Yes, SmartPDFPro supports merging invoices, reports, contracts, forms, presentations, and other PDF document types.",
                  },

                  {
                    q: "Will bookmarks and hyperlinks remain after merging PDFs?",
                    a: "Yes, SmartPDFPro preserves original hyperlinks, formatting, vector graphics, and embedded content during PDF merging.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro Merge PDF tool?",
                    a: "Yes, businesses, students, legal professionals, accountants, and office teams use SmartPDFPro to combine PDF documents efficiently.",
                  },

                  {
                    q: "Can I merge PDFs offline?",
                    a: "Many SmartPDFPro PDF tools work directly in the browser after loading, reducing dependency on continuous internet connectivity.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to merged PDFs?",
                    a: "No, SmartPDFPro does not add watermarks or branding to your merged PDF documents.",
                  },

                  {
                    q: "Can I preview PDF files before merging?",
                    a: "Yes, SmartPDFPro provides file ordering and preview functionality before generating the merged PDF.",
                  },

                  {
                    q: "Can I merge unlimited PDF files together?",
                    a: "Yes, users can merge multiple PDF files together depending on local device memory and browser capabilities.",
                  },

                  {
                    q: "Why use SmartPDFPro to merge PDF files?",
                    a: "SmartPDFPro offers fast browser-based PDF merging, secure processing, mobile compatibility, drag-and-drop ordering, and high-quality document preservation in one platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other PDF merger tools?",
                    a: "SmartPDFPro combines privacy-focused browser processing, watermark-free output, high-speed merging, and professional PDF workflows in a simple modern interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based PDF editing?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
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
