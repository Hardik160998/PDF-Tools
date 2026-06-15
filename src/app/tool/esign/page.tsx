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
  FileDigit,
  Settings,
  Lock,
  Unlock,
  PenLine,
  ShieldCheck,
  FileSignature,
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

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sign PDF Online Free",
  url: `${siteUrl}/esign`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Sign PDF documents online for free. Draw, type, or upload an image of your signature to sign your PDF files in seconds with 100% local browser security.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local browser processing",
    "Draw signature with mouse or touch",
    "Type signature using elegant cursive scripts",
    "Upload signature image with transparency keying",
    "Fast, free, and no watermarks added",
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
      name: "Sign PDF",
      item: `${siteUrl}/esign`,
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
        Sign PDF
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function ESignSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("esign");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("esign")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/esign` },
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
const ESignTool = dynamic(() => import("@/components/tools/ESignTool"), {
  loading: () => <ESignSkeleton />,
});

export function generateMetadata() {
  const id = "esign";
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

export default function ESignPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive ESign Tool */}
        <section
          aria-label="Electronic Signature Application"
          className="mb-16"
        >
          <ESignTool id="esign" />
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
                    Custom layout templates · Digital cryptographic signatures ·
                    Unlimited page sizes · Priority processing
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
              title: "Draw, Type, or Upload",
              desc: "Draw with touch/mouse, type your name using beautiful cursive fonts, or scan your physical signature.",
              gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            },
            {
              title: "Multi-page Annotations",
              desc: "Easily navigate through pages and place your signature, initials, date stamps, or initials.",
              gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            },
            {
              title: "100% Secure & Private",
              desc: "Your documents never touch a server. All canvas drawing and merging run locally on your device.",
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
              Sign PDF Online Free <br />
              <span className="text-violet-500 dark:text-violet-400">
                Secure Electronic Signatures
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Create, place, and embed electronic signatures on your PDF
              agreements, invoices, and contracts. Complete the entire signature
              flow safely inside your browser.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is E-Signing Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Online PDF Signing?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Online PDF signing lets you add visual electronic signatures
                  directly onto your PDF pages. By avoiding the printing,
                  signing with a pen, and scanning cycle, you save significant
                  time. Our tool provides full drawing canvases, typing
                  controls, and signature scaling options to fit your signature
                  neatly into contract blocks.
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
                How to Sign PDF Documents in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Upload PDF",
                    desc: "Select your PDF document or image file. The file is opened instantly in your browser workspace.",
                  },
                  {
                    step: "02",
                    title: "Add Custom Signature",
                    desc: "Draw your signature, type it, or upload a PNG image, then drag it to your target page position.",
                  },
                  {
                    step: "03",
                    title: "Download Signed File",
                    desc: "Place it, scale it, and download your updated PDF immediately without watermark overlays.",
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
                    100% Private local edit
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Because we execute the canvas composition locally on your
                    computer, your signatures and sensitive contracts are never
                    exposed to external cloud servers.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-violet-500 transition-colors">
                    Multiple signature formats
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Freely switch between typing cursive script names, drawing
                    custom shapes, or uploading scanned signature files. Set
                    exact colors and size constraints.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports adding text labels like signing dates, names, titles, and locations.",
                    "Smooth signature layout placement with quick mouse dragging or touch drag inputs.",
                    "Complies with PDF specification tags, compatible with global PDF reader catalogs.",
                    "Completely free, no watermarks, and no sign-up registration is required.",
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
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is my electronic signature legally binding?",
                    a: "Yes. Electronic signatures are legally recognized in most jurisdictions (including the US ESIGN Act and European Union eIDAS regulations) for most business and personal agreements.",
                  },
                  {
                    q: "Are my signatures and documents secure?",
                    a: "Absolutely. Our tool operates completely in your web browser. Neither your PDF document nor the signature you draw or upload is ever transmitted to a server. Everything remains local on your device.",
                  },
                  {
                    q: "Can I sign multiple pages in the same PDF?",
                    a: "Yes. The editor allows you to navigate through pages and place multiple instances of your signature, date, initials, or custom text boxes on any page.",
                  },
                  {
                    q: "Can I type my signature instead of drawing it?",
                    a: "Yes. You can draw your signature, type it using elegant cursive fonts, or upload a scanned image of your physical signature.",
                  },
                  {
                    q: "What is an eSign PDF tool?",
                    a: "An eSign PDF tool allows users to electronically sign PDF documents online using drawn signatures, typed signatures, or uploaded signature images.",
                  },

                  {
                    q: "Can I sign PDF documents online for free?",
                    a: "Yes, SmartPDFPro provides a free online PDF signing tool that works directly in your browser without software installation.",
                  },

                  {
                    q: "How do I electronically sign a PDF online?",
                    a: "Upload your PDF document, create or upload your signature, place it on the desired page, and download the signed PDF instantly.",
                  },

                  {
                    q: "Can I draw my signature digitally?",
                    a: "Yes, SmartPDFPro allows users to draw signatures using a mouse, touchscreen, stylus, or trackpad.",
                  },

                  {
                    q: "Can I upload an image of my handwritten signature?",
                    a: "Yes, users can upload PNG, JPG, or transparent signature images and place them anywhere inside the PDF document.",
                  },

                  {
                    q: "Can I type a signature instead of drawing one?",
                    a: "Yes, SmartPDFPro supports typed electronic signatures using elegant signature-style fonts.",
                  },

                  {
                    q: "Can I add initials, dates, or text fields to PDFs?",
                    a: "Yes, SmartPDFPro allows users to add initials, signing dates, names, and custom text boxes inside PDF documents.",
                  },

                  {
                    q: "Can I sign multiple pages in the same PDF?",
                    a: "Yes, users can place signatures, initials, and text fields across multiple PDF pages in a single session.",
                  },

                  {
                    q: "Is SmartPDFPro eSign tool secure?",
                    a: "Yes, SmartPDFPro processes PDF signing securely in your browser and does not permanently store uploaded documents or signatures.",
                  },

                  {
                    q: "Are signed PDF documents uploaded to servers?",
                    a: "No, many SmartPDFPro editing operations run locally in your browser using modern browser technologies for improved privacy and security.",
                  },

                  {
                    q: "Can I sign confidential business contracts online?",
                    a: "Yes, SmartPDFPro is suitable for signing contracts, agreements, invoices, NDAs, legal documents, and business forms securely.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro eSign PDF tool?",
                    a: "Yes, businesses, freelancers, legal professionals, accountants, students, and office teams use SmartPDFPro for digital document signing workflows.",
                  },

                  {
                    q: "Does electronic signing affect PDF quality?",
                    a: "No, SmartPDFPro preserves the original PDF quality, text clarity, vector graphics, images, and formatting after signing.",
                  },

                  {
                    q: "Can I sign password-protected PDF documents?",
                    a: "Yes, but encrypted PDFs may first need to be unlocked using the Unlock PDF tool before signing.",
                  },

                  {
                    q: "Can I sign PDF files on mobile devices?",
                    a: "Yes, the eSign PDF tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Adobe Acrobat to sign PDFs?",
                    a: "No, SmartPDFPro works entirely online in your browser without requiring Adobe Acrobat or desktop software.",
                  },

                  {
                    q: "Can I use eSign PDF tool without registration?",
                    a: "Yes, SmartPDFPro allows users to sign PDF documents instantly without account creation or login.",
                  },

                  {
                    q: "Can I sign PDFs offline?",
                    a: "Many SmartPDFPro tools work directly in the browser after loading, reducing dependency on continuous internet connectivity.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to signed PDFs?",
                    a: "No, SmartPDFPro does not add watermarks or branding to electronically signed PDF documents.",
                  },

                  {
                    q: "Can I place signatures anywhere inside the PDF?",
                    a: "Yes, SmartPDFPro provides drag-and-drop signature placement for flexible positioning anywhere on PDF pages.",
                  },

                  {
                    q: "Can I electronically sign invoices, forms, and agreements?",
                    a: "Yes, SmartPDFPro supports signing invoices, contracts, agreements, forms, reports, applications, and other PDF documents.",
                  },

                  {
                    q: "Are electronic signatures legally accepted?",
                    a: "Electronic signatures are legally recognized in many countries and business workflows, including agreements covered by eSign and eIDAS regulations.",
                  },

                  {
                    q: "What types of signatures does SmartPDFPro support?",
                    a: "SmartPDFPro supports drawn signatures, typed signatures, uploaded image signatures, initials, and custom text annotations.",
                  },

                  {
                    q: "Why use SmartPDFPro to sign PDF files?",
                    a: "SmartPDFPro offers fast browser-based PDF signing, secure processing, mobile compatibility, drag-and-drop placement, and watermark-free downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other eSign tools?",
                    a: "SmartPDFPro combines privacy-focused browser processing, easy signature creation, secure PDF editing, and modern document workflows in a simple user-friendly interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based PDF editing?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including eSign, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
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
