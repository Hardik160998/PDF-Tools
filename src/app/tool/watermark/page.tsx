import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Stamp,
  Upload,
  Type,
  Download,
  Hash,
  Settings,
  Lock,
  Unlock,
  PenLine,
  Combine,
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
  Globe,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Watermark PDF Online Free",
  url: `${siteUrl}/tool/watermark`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Stamp image or text watermarks onto PDF pages online for free. Custom spacing, rotation, transparency, and 100% secure local browser processing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Add text watermarks with custom fonts",
    "Add image/logo watermarks",
    "Adjust opacity, scale, and rotation angles",
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
      name: "Watermark PDF",
      item: `${siteUrl}/tool/watermark`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the watermarking tool secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF watermark tool performs the entire process 100% locally in your web browser. Your private documents never leave your computer.",
      },
    },
    {
      "@type": "Question",
      name: "Can I adjust the transparency and angle of the watermark?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The editor provides slider controls to set custom transparency, rotate stamps to any angle, and scale font sizes.",
      },
    },
    {
      "@type": "Question",
      name: "Can I stamp watermarks on specific pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can specify individual page ranges or stamp the watermark across all pages in the PDF document.",
      },
    },
    {
      "@type": "Question",
      name: "Will watermarking add extra file sizes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our system inserts lightweight overlay vectors, ensuring output file sizes remain small.",
      },
    },
  ],
};

// 8. Internal links configuration


// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      <Link
        href="/"
        className="hover:text-purple-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-purple-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Watermark PDF
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function EditToolsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("watermark");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("watermark")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/watermark` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5 sm:space-y-10">
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
const EditTools = dynamic(() => import("@/components/tools/EditTools"), {
  loading: () => <EditToolsSkeleton />,
});

export function generateMetadata() {
  const id = "watermark";
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

export default function WatermarkPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive Watermarking Tool */}
        <section aria-label="PDF Watermarking Application" className="mb-16">
          <EditTools id="watermark" />
        </section>

        <RelatedTools />

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in"
        >
          {[
            {
              title: "Text & Images",
              desc: "Type custom labels (like DRAFT) or upload image/logo watermarks to stamp PDF pages.",
              icon: Stamp,
            },
            {
              title: "100% Offline",
              desc: "Watermarking is executed client-side in browser JS. Your files never touch a server.",
              icon: Shield,
            },
            {
              title: "Flexible Styling",
              desc: "Fidelity is fully preserved. Fine-tune opacity, scale, page margins, and stamp rotation.",
              icon: Settings,
            },
            {
              title: "Works Everywhere",
              desc: "No software to install. Works on any device — Windows, Mac, Linux, iOS, or Android.",
              icon: Globe,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-center flex flex-col items-center gap-3"
            >
              <div className="inline-flex p-4 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                <item.icon size={26} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-purple-500/10 dark:bg-purple-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-purple-600 dark:from-white dark:via-slate-200 dark:to-purple-500 bg-clip-text text-transparent">
              Watermark PDF Online <br />
              <span className="text-purple-600 dark:text-purple-450">
                Free, Fast & Secure
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Stamp custom text or graphic images onto your PDF documents in
              seconds. Process everything inside your web browser — no files are
              uploaded to any server.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Watermarking Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Watermark?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  A PDF watermark is an overlay image, logo, or text (such as
                  "CONFIDENTIAL", "SAMPLE", or a company branding logo) stamped
                  onto the document pages. Watermarks are crucial for protecting
                  intellectual property, demarcating draft versions, preventing
                  document fraud, and enforcing copyrights.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs Pro, your watermarking is executed{" "}
                  <strong className="text-purple-550 font-bold">
                    100% locally in your web browser
                  </strong>
                  {" "}
                  using native JavaScript libraries. Your files never touch our
                  servers, guaranteeing complete document privacy and instant
                  offline stamp execution.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <ArrowRight size={24} />
                </span>
                How to Watermark PDFs in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Select PDF File",
                    desc: "Drag and drop your document or click the upload panel to choose a PDF from your computer or mobile device.",
                  },
                  {
                    step: "02",
                    title: "Apply Watermark",
                    desc: "Type custom text labels or upload a branding image, then adjust rotation angle, transparency, and size.",
                  },
                  {
                    step: "03",
                    title: "Download Result",
                    desc: "Click Apply Watermark and download your stamped PDF document instantly. Free from watermarks.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-purple-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
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
                    browser sandbox. It reads and stamps the PDFs directly in
                    your computer's memory, so your files are never transmitted
                    across the internet.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-purple-500 transition-colors">
                    Flexible Styling Stamp
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Adjust watermark opacity, angles, scale font sizes, and
                    select page bounds to place your stamps exactly where they
                    are needed.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both text stamping and visual image/logo overlays.",
                    "Quick transparency sliders to ensure background text remains readable.",
                    "Zero signup required — start watermarking immediately without accounts.",
                    "Mobile-friendly layouts that let you stamp documents on your phone.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-purple-500/10 text-purple-650 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is the watermarking tool secure?",
                    a: "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF watermark tool performs the entire process 100% locally in your web browser. Your private documents never leave your computer.",
                  },
                  {
                    q: "Can I adjust the transparency and angle of the watermark?",
                    a: "Yes. The editor provides slider controls to set custom transparency, rotate stamps to any angle, and scale font sizes.",
                  },
                  {
                    q: "Can I stamp watermarks on specific pages?",
                    a: "Yes, you can specify individual page ranges or stamp the watermark across all pages in the PDF document.",
                  },
                  {
                    q: "Will watermarking add extra file sizes?",
                    a: "Our system inserts lightweight overlay vectors, ensuring output file sizes remain small.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-purple-500 shrink-0" />
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
