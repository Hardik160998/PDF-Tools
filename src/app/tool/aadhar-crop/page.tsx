import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from "next/link";
import type { Metadata } from "next";
import AadharCropper from "@/components/tools/AadharCropper";
import {
  Upload, Crop, Download, Lock, Unlock, Stamp, PenLine, ImageIcon,
  Shield, Check, HelpCircle, ChevronDown, ArrowRight, Info, Star, Zap
} from "lucide-react";


const STEPS = [
  { icon: Upload, title: "Upload E-Aadhar PDF", desc: "Select your e-Aadhar PDF or image. Everything is processed entirely in your browser — your Aadhar data never leaves your device." },
  { icon: Crop, title: "Crop Front & Back", desc: "Use the visual cropper to select the front side of your Aadhar card, then the back side. Zoom and adjust for a perfect crop." },
  { icon: Download, title: "Download Print-Ready PDF", desc: "Download an A4 PDF with both sides formatted to standard ID card dimensions — ready for high-quality printing." },
];


export function generateMetadata() {
  const id = 'aadhar-crop';
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

export default function AadharCropPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("aadhar-crop");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("aadhar-crop")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/aadhar-crop` },
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
            className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/tool"
            className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
          >
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span
            className="text-slate-600 dark:text-slate-300"
            aria-current="page"
          >
            Aadhar Crop
          </span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="Aadhar Card Cropper Application" className="mb-16">
          <AadharCropper id="aadhar-crop" />
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
                <s.icon className="text-red-500" size={24} />
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
            {/* Blog Post 1: Aadhar Crop Guide */}
            <a href="/blog/how-to-crop-aadhar-card" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#ef4444] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2v14a2 2 0 0 0 2 2h14"></path>
                                <path d="M18 22V8a2 2 0 0 0-2-2H2"></path>
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            How to Crop Aadhar Card PDF Online (Fast & Secure)
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-red-500/10 dark:bg-red-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-red-600 dark:from-white dark:via-slate-200 dark:to-red-500 bg-clip-text text-transparent">
              Crop Aadhar Card Online <br />
              <span className="text-red-500 dark:text-red-400">
                100% Secure & Print-Ready
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Format your e-Aadhar PDF front and back panels to precise Indian ID
              card print-ready sizes. The entire process runs 100% inside your
              local browser memory so your personal data is always protected.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Aadhar Crop */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Aadhar Card Cropper?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  When you download your official e-Aadhar card from the UIDAI
                  portal, it comes as a full A4 sheet containing multiple
                  instructions, letters, and guidelines. Cutting it down to
                  pocket size manually for lamination or wallet storage can be a
                  tedious formatting task.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our custom Aadhar Cropper tool allows you to isolate the front
                  and back sections of your card using a visual canvas selector.
                  It automatically merges both sides side-by-side onto a standard
                  A4 sheet in official Indian ID dimensions, prepared for instant
                  high-quality printing.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <ArrowRight size={24} />
                </span>
                How to crop Aadhar Card in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Select E-Aadhar",
                    desc: "Select your e-Aadhar PDF page or card image. Rest assured, your file is loaded completely offline.",
                  },
                  {
                    step: "02",
                    title: "Format Front & Back",
                    desc: "Crop the front side first, then the back side. You can rotate and scale the crop frame easily.",
                  },
                  {
                    step: "03",
                    title: "Save A4 Print PDF",
                    desc: "Export the merged front and back card layout onto a standard A4 PDF sheet for simple printing.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-red-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-red-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
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
                    100% Local Processing
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Because your Aadhar contains highly sensitive personal
                    information, our tool operates entirely client-side. No files
                    are uploaded to any server.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                    Accurate ID Dimensions
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    No more manual resizing. The tool automatically rescales the
                    cropped bounding boxes to standard ID card layouts suitable
                    for quick pocket laminations.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both PDF and raw image formats.",
                    "Provides real-time interactive crop resizing guides.",
                    "Highly responsive and works perfectly on mobile phones.",
                    "Free with no account logins or watermarks.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-red-500/10 text-red-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is my Aadhar Card uploaded to any server?",
                    a: "Never. Privacy is our top priority. The entire cropping process runs locally in your web browser using HTML5 Canvas. Your Aadhar PDF or image files are never uploaded, stored, or transmitted to any server.",
                  },
                  {
                    q: "What is the standard print size for an Aadhar Card?",
                    a: "Our cropper formats both cropped sections to the standard Indian government ID dimensions (approx 8.56 cm x 5.4 cm) and compiles them on a single print-ready A4 PDF page.",
                  },
                  {
                    q: "Does the cropper support e-Aadhar PDFs directly?",
                    a: "Yes. You can upload either standard image files or the digital e-Aadhar PDF document directly to start cropping the ID sections.",
                  },
                  {
                    q: "What should I do if my Aadhar PDF is password protected?",
                    a: "If your e-Aadhar PDF requires a password, please use our Unlock PDF tool first to remove the security encryption before cropping.",
                  },
                  {
                    q: "What is an Aadhar Card Cropper tool?",
                    a: "An Aadhar Card Cropper is an online utility that helps users crop and format Aadhaar card sections into standard print-ready dimensions for PVC card printing and document management.",
                  },

                  {
                    q: "Can I crop Aadhaar Card online for free?",
                    a: "Yes, SmartPDFPro provides a completely free online Aadhaar Card Cropper that works directly in your browser without requiring registration or software installation.",
                  },

                  {
                    q: "Is SmartPDFPro Aadhar Cropper secure?",
                    a: "Yes. SmartPDFPro processes Aadhaar files locally in your browser using client-side technology. Your Aadhaar files are never stored or uploaded to external servers.",
                  },

                  {
                    q: "Can I print my cropped Aadhaar Card on A4 paper?",
                    a: "Yes, SmartPDFPro automatically generates a print-ready A4 PDF layout optimized for Aadhaar card printing and lamination.",
                  },

                  {
                    q: "Does the Aadhar Cropper support PVC card printing?",
                    a: "Yes, the cropped Aadhaar output follows standard ID card dimensions suitable for PVC card printing and wallet-size formatting.",
                  },

                  {
                    q: "Can I crop both front and back sides of Aadhaar Card?",
                    a: "Yes, SmartPDFPro allows users to crop both the front and back sections of the Aadhaar Card and place them together on a single print-ready page.",
                  },

                  {
                    q: "Can I use SmartPDFPro Aadhaar Cropper on mobile devices?",
                    a: "Yes, the Aadhaar Cropper works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
                  },

                  {
                    q: "Does the Aadhaar Cropper require internet after loading?",
                    a: "Most Aadhaar cropping operations work directly in the browser after the page loads, helping improve privacy and offline usability.",
                  },

                  {
                    q: "Can I crop scanned Aadhaar Card images?",
                    a: "Yes, SmartPDFPro supports Aadhaar PDFs, scanned images, JPG, JPEG, and PNG files for cropping and formatting.",
                  },

                  {
                    q: "How do I print Aadhaar Card in original size?",
                    a: "SmartPDFPro automatically formats Aadhaar sections into the proper government ID card dimensions for accurate printing.",
                  },

                  {
                    q: "Can I remove white borders while cropping Aadhaar Card?",
                    a: "Yes, SmartPDFPro helps users crop unnecessary white borders and extra spacing for clean Aadhaar card printing.",
                  },

                  {
                    q: "Does SmartPDFPro support UIDAI e-Aadhaar PDFs?",
                    a: "Yes, SmartPDFPro supports official UIDAI e-Aadhaar PDF documents for secure cropping and print formatting.",
                  },

                  {
                    q: "Can I crop masked Aadhaar Cards?",
                    a: "Yes, both regular and masked Aadhaar Card PDFs can be cropped using SmartPDFPro.",
                  },

                  {
                    q: "What is the best online Aadhaar Card cropper?",
                    a: "SmartPDFPro is a fast, secure, and browser-based Aadhaar Card Cropper designed for instant cropping, print-ready formatting, and privacy-focused processing.",
                  },

                  {
                    q: "Do I need Photoshop or software to crop Aadhaar Card?",
                    a: "No, SmartPDFPro works entirely online in your browser and does not require Photoshop, apps, or software installation.",
                  },

                  {
                    q: "Can I resize Aadhaar Card for lamination printing?",
                    a: "Yes, SmartPDFPro automatically resizes Aadhaar cards into standard ID dimensions suitable for lamination and PVC printing.",
                  },

                  {
                    q: "Does SmartPDFPro store Aadhaar details?",
                    a: "No, SmartPDFPro does not permanently store Aadhaar files, personal information, or cropped documents.",
                  },

                  {
                    q: "Can I create multiple Aadhaar print copies on one page?",
                    a: "Yes, SmartPDFPro can generate properly aligned Aadhaar card layouts optimized for efficient multi-copy printing.",
                  },

                  {
                    q: "Is Aadhaar Card cropping legal?",
                    a: "Cropping and formatting Aadhaar Cards for personal printing and identification purposes is commonly used. Users should always follow UIDAI guidelines and applicable regulations.",
                  },

                  {
                    q: "Why use SmartPDFPro for Aadhaar Card cropping?",
                    a: "SmartPDFPro offers fast processing, privacy-focused browser-based cropping, print-ready formatting, mobile support, and secure Aadhaar document handling in one simple tool.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-red-500 shrink-0" />
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
