import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import AddBlankPage from "@/components/tools/AddBlankPage";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  ArrowRight,
  HelpCircle,
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
  name: "Add Blank Page to PDF Online Free",
  url: `${siteUrl}/tool/add-blank-page`,
  image: `${siteUrl}/img/add-blank-page-og.png`,
  description:
    "Insert blank pages into your PDF files online for free. Choose page size (A4, Letter) and insert locations instantly. 100% secure local browser processing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Insert empty pages anywhere in PDF",
    "Auto-match existing page dimensions",
    "Standard page templates (A4, Letter, Legal)",
    "Clean page insertion with no watermarks",
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
      name: "Add Blank Page",
      item: `${siteUrl}/tool/add-blank-page`,
    },
  ],
};

export function generateMetadata() {
  const id = "add-blank-page";
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

export default function AddBlankPagePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("add-blank-page");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("add-blank-page")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/add-blank-page` },
              ]}
            />
          </>
        ) : null;
      })()}

      {/* Dynamic JSON-LD structured script injections for Google Crawler */}

      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-10 pb-16">
        {/* Navigation Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <li>
              <Link
                href="/"
                className="hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link
                href="/#tools-grid"
                className="hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
              >
                Tools
              </Link>
            </li>
            <li
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
              aria-current="page"
            >
              <span>/</span>
              <span>Add Blank Page</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <AddBlankPage id="add-blank-page" />
        </div>

        <RelatedTools />

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-indigo-100 dark:to-indigo-400 uppercase">
              Add Blank Pages to PDF Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Insert blank templates or empty pages into PDF files effortlessly.
              Match original page dimensions automatically. Processes 100%
              locally in your web browser, ensuring complete privacy.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                How to Insert Blank Pages in a PDF?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Visual step-by-step guide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload Document",
                  desc: "Select or drag & drop your PDF file into our blank page inserter. Pages are rendered immediately.",
                },
                {
                  step: "02",
                  title: "Choose Size & Location",
                  desc: "Specify where to insert (start, end, or after custom pages) and pick page dimensions (A4, Letter, etc.).",
                },
                {
                  step: "03",
                  title: "Insert & Download",
                  desc: "Click 'Insert Blank Page' to run. Instantly download your updated PDF file with the new empty page included.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-indigo-500/20 group-hover:text-indigo-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 animate-pulse">
                      <ArrowRight size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Features and Benefits Grid */}
          <section className="bg-gradient-to-tr from-white to-indigo-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-indigo-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-indigo-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
                  <Star size={12} className="fill-indigo-500" /> Premium
                  Benefits
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Blank Page Insertion Benefits
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md">
                Fast browser-based operations without queues or subscriptions.
                Tailor files instantly and secure privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "No Cloud Uploads",
                  desc: "Runs directly on your computer's browser using local WebAssembly. Safe, fast, and confidential.",
                },
                {
                  title: "Template Match Dimensions",
                  desc: "Select custom layout dimensions or auto-match pages sizes so there are no page size shifts.",
                },
                {
                  title: "Visual Page Indexing",
                  desc: "View all pages clearly. Specify exactly where blank inserts go to add notes or separation.",
                },
                {
                  title: "No Quality Loss",
                  desc: "Vector graphics and existing fonts are kept intact, without file resizing artifacts.",
                },
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    {feat.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs Accordion */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <HelpCircle size={24} />
              </span>
              Frequently Asked Questions
            </h2>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Add Blank Page FAQs
            </p>

            <div className="space-y-4">
              {[
                {
                  q: "How can I add a blank page to my PDF?",
                  a: "Upload your PDF file to our tool. Specify where you want to insert the blank page (e.g. at the beginning, end, or after a specific page number). Choose the desired blank page size (such as matching existing size or A4), and click 'Insert Blank Page' to download the updated PDF file.",
                },
                {
                  q: "Is my PDF file kept private when inserting blank pages?",
                  a: "Yes, absolutely! The insertion process is completed entirely on your local device. We never upload or save your documents to any external servers, maintaining total security.",
                },
                {
                  q: "Can I match the exact dimensions of the current PDF pages?",
                  a: "Yes, our tool reads the dimensions of your uploaded PDF pages and allows you to auto-match the dimensions for the newly inserted empty page, ensuring layout consistency.",
                },
                {
                  q: "Can I insert multiple blank pages at different places in a single session?",
                  a: "You can insert one or more blank pages at a specified index in a single run. If you need to distribute empty pages across various distinct points, you can download the PDF and re-upload it to insert another page, or use our visual PDF Organizer tool to arrange pages as you like.",
                },
                {
                  q: "Can I insert a blank page into a PDF online for free?",
                  a: "Yes, SmartPDFPro allows users to add blank pages to PDF files online for free directly in the browser without software installation.",
                },

                {
                  q: "How do I add an empty page between PDF pages?",
                  a: "Upload your PDF, choose the insertion position, and SmartPDFPro will automatically place a blank page between the selected PDF pages.",
                },

                {
                  q: "Can I add a blank page at the beginning or end of a PDF?",
                  a: "Yes, you can insert blank pages at the start, end, or any custom page position inside your PDF document.",
                },

                {
                  q: "Does SmartPDFPro support A4 blank pages?",
                  a: "Yes, users can insert standard A4 blank pages or match the dimensions of existing PDF pages automatically.",
                },

                {
                  q: "Can I insert white pages into scanned PDFs?",
                  a: "Yes, SmartPDFPro supports adding blank pages to scanned PDF documents, ebooks, reports, invoices, and image-based PDFs.",
                },

                {
                  q: "Will the PDF formatting remain unchanged after adding pages?",
                  a: "Yes, SmartPDFPro preserves the original formatting, page quality, orientation, and layout while inserting blank pages.",
                },

                {
                  q: "Can I use the Add Blank Page tool on mobile devices?",
                  a: "Yes, the tool works on Android, iPhone, tablet, Windows, and Mac browsers without requiring additional apps.",
                },

                {
                  q: "Do I need Adobe Acrobat to insert blank pages into a PDF?",
                  a: "No, SmartPDFPro provides a browser-based PDF editor that lets you insert blank pages online without Adobe Acrobat or other software.",
                },

                {
                  q: "Can I organize PDF pages after adding blank pages?",
                  a: "Yes, after inserting blank pages you can use the Organize PDF tool to reorder, rotate, or delete pages visually.",
                },

                {
                  q: "Is the Add Blank Page tool secure?",
                  a: "Yes, SmartPDFPro processes PDF files securely in your browser and does not permanently store uploaded documents.",
                },

                {
                  q: "Can I add multiple empty pages to a PDF?",
                  a: "Yes, users can insert one or more blank pages into PDF documents depending on their workflow requirements.",
                },

                {
                  q: "Does the Add Blank Page tool work offline?",
                  a: "Many SmartPDFPro PDF editing tools work directly in the browser after loading, reducing the need for constant internet connectivity.",
                },

                {
                  q: "What types of PDF files support blank page insertion?",
                  a: "SmartPDFPro supports invoices, ebooks, business reports, contracts, scanned PDFs, academic documents, and other standard PDF files.",
                },

                {
                  q: "Can I insert blank pages for note-taking or printing?",
                  a: "Yes, many users insert empty pages into PDFs for handwritten notes, annotations, signatures, or double-sided printing layouts.",
                },

                {
                  q: "Does adding blank pages reduce PDF quality?",
                  a: "No, SmartPDFPro preserves the original PDF quality while inserting new blank pages.",
                },

                {
                  q: "Can I preview the PDF before downloading?",
                  a: "Yes, SmartPDFPro provides PDF page previews and page positioning options before generating the final file.",
                },

                {
                  q: "Can I add landscape or portrait blank pages?",
                  a: "Yes, SmartPDFPro supports both portrait and landscape page orientations based on your PDF layout.",
                },

                {
                  q: "Why use SmartPDFPro to add blank pages to PDF?",
                  a: "SmartPDFPro offers fast browser-based PDF editing, privacy-focused processing, mobile compatibility, and simple page management without software installation.",
                },

                {
                  q: "Can students and businesses use this PDF blank page tool?",
                  a: "Yes, the Add Blank Page tool is useful for students, teachers, office workers, legal professionals, and businesses handling PDF documents daily.",
                },

                {
                  q: "What is the best free online tool to insert blank pages into PDF files?",
                  a: "SmartPDFPro is a fast and secure online PDF editor that allows users to insert blank pages, organize PDFs, and edit documents for free.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white  tracking-tight flex items-center gap-3">
                      <HelpCircle size={22} className="text-indigo-500 shrink-0" />
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
      </div>
    </div>
  );
}
