import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import DeletePages from "@/components/tools/DeletePages";
import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  Star,
  Check,
  ChevronDown,
} from "lucide-react";

export function generateMetadata() {
  const id = "delete-pages";
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

export default function DeletePagesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("delete-pages");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("delete-pages")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/delete-pages` },
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
                className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link
                href="/#tools-grid"
                className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
              >
                Tools
              </Link>
            </li>
            <li
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
              aria-current="page"
            >
              <span>/</span>
              <span>Delete Pages</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <DeletePages id="delete-pages" />
        </div>

        <RelatedTools />

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">
          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-red-950 to-red-600 dark:from-white dark:via-red-100 dark:to-red-400 uppercase">
              Delete PDF Pages Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Remove extra, blank, or unwanted pages from your PDF documents
              visually. Trim down file size and custom-clean your PDFs with our
              responsive tool, executing completely in your browser sandbox.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                How to Delete Pages from a PDF?
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
                  desc: "Select or drag & drop your PDF file into the page remover workspace. Pages will display instantly.",
                },
                {
                  step: "02",
                  title: "Select for Deletion",
                  desc: "Select unwanted page thumbnails, or specify page ranges (e.g. 2-4) to remove them in batch.",
                },
                {
                  step: "03",
                  title: "Generate PDF",
                  desc: "Click 'Delete Pages' to finalize removal. Download the clean, trimmed PDF file to your local drive.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-red-500/20 group-hover:text-red-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center font-bold text-sm">
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
          <section className="bg-gradient-to-tr from-white to-red-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-red-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-red-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                  <Star size={12} className="fill-red-500" /> Premium Benefits
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Visual PDF Deletion Benefits
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
                  title: "Privacy Guaranteed",
                  desc: "No uploads to servers. All operations perform in-browser, securing your data from third parties.",
                },
                {
                  title: "Grid Thumbnail Viewer",
                  desc: "Easily spot layout irregularities, blank slides, or duplicate pages visually before deletion.",
                },
                {
                  title: "Precise Trim Options",
                  desc: "Combine select clicking and text fields to isolate and drop exactly the pages you choose.",
                },
                {
                  title: "No Quality Loss",
                  desc: "Preserves the original dimensions, color profiles, links, and text formatting of the kept pages.",
                },
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/25">
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                <HelpCircle size={24} />
              </span>
              Frequently Asked Questions
            </h2>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Delete Pages FAQs
            </p>

            <div className="space-y-4">
              {[
                {
                  q: "How do I delete pages from a PDF document?",
                  a: "Upload your PDF document to the page remover tool. Hover over any page thumbnail and click the delete trash icon, or input page numbers/ranges in the sidebar. Click 'Delete Pages' to download your newly trimmed PDF.",
                },
                {
                  q: "Are my documents kept secure and private?",
                  a: "Yes, completely! Page deletion is carried out entirely on your own device using local WebAssembly. We never copy, view, or upload your files to remote cloud storage.",
                },
                {
                  q: "Can I remove blank pages or duplicate pages?",
                  a: "Yes. Our tool generates high-quality thumbnails for every page in your document. You can easily spot empty spaces, duplicate files, or layout errors and discard them visually.",
                },
                {
                  q: "Does deleting pages reduce the quality of the remaining pages?",
                  a: "No. The pages that you choose to keep remain fully intact, maintaining their original vector graphics, layout styles, compression levels, and text fonts.",
                },
                {
                  q: "What is the best free Delete PDF Pages tool online?",
                  a: "SmartPDFPro provides a fast and secure Delete PDF Pages tool that lets users remove unwanted pages from PDF documents online for free.",
                },

                {
                  q: "Can I remove pages from a PDF online without software?",
                  a: "Yes, SmartPDFPro works entirely in your browser and does not require Adobe Acrobat or desktop software installation.",
                },

                {
                  q: "How do I delete unwanted pages from a PDF?",
                  a: "Upload your PDF file, preview page thumbnails, select pages you want to remove, and click 'Delete Pages' to download the updated PDF.",
                },

                {
                  q: "Can I delete multiple PDF pages at once?",
                  a: "Yes, SmartPDFPro supports deleting multiple pages simultaneously using page thumbnails or custom page ranges.",
                },

                {
                  q: "Can I remove blank pages from PDF documents?",
                  a: "Yes, users can visually identify and delete blank pages, duplicate pages, or unnecessary sections from PDFs easily.",
                },

                {
                  q: "Can I remove pages from scanned PDF files?",
                  a: "Yes, SmartPDFPro supports deleting pages from scanned PDFs, image-based documents, reports, contracts, and ebooks.",
                },

                {
                  q: "Does deleting PDF pages reduce document quality?",
                  a: "No, SmartPDFPro preserves the original quality, text clarity, vector graphics, fonts, and formatting of remaining pages.",
                },

                {
                  q: "Can I preview PDF pages before deleting them?",
                  a: "Yes, SmartPDFPro provides high-quality page thumbnails and visual previews before generating the final PDF.",
                },

                {
                  q: "Can I delete PDF pages on mobile devices?",
                  a: "Yes, the Delete PDF Pages tool works on Android, iPhone, tablets, Windows, and Mac browsers.",
                },

                {
                  q: "Is SmartPDFPro Delete PDF Pages tool secure?",
                  a: "Yes, SmartPDFPro processes files securely in your browser and does not permanently store uploaded PDF documents.",
                },

                {
                  q: "Are PDF files uploaded to servers during page deletion?",
                  a: "No, many SmartPDFPro editing operations run locally in your browser using modern browser technologies for improved privacy.",
                },

                {
                  q: "Can I remove confidential pages from business documents?",
                  a: "Yes, SmartPDFPro is useful for removing confidential pages, drafts, duplicate sheets, blank pages, or outdated content from PDFs.",
                },

                {
                  q: "Can businesses use SmartPDFPro Delete PDF tool?",
                  a: "Yes, businesses, students, accountants, legal professionals, and office teams use SmartPDFPro for secure PDF editing workflows.",
                },

                {
                  q: "Can I delete pages from contracts, invoices, and reports?",
                  a: "Yes, SmartPDFPro supports removing pages from invoices, reports, contracts, forms, presentations, academic files, and other PDF documents.",
                },

                {
                  q: "Will hyperlinks and formatting remain after deleting pages?",
                  a: "Yes, SmartPDFPro preserves hyperlinks, formatting, images, fonts, and vector graphics after page deletion.",
                },

                {
                  q: "Can I delete pages from password-protected PDFs?",
                  a: "Yes, but encrypted PDFs must first be unlocked using the Unlock PDF tool before editing.",
                },

                {
                  q: "Can I remove pages offline?",
                  a: "Many SmartPDFPro tools work directly in the browser after loading, reducing dependency on continuous internet access.",
                },

                {
                  q: "Does SmartPDFPro add watermarks after deleting pages?",
                  a: "No, SmartPDFPro does not add watermarks or branding to edited PDF documents.",
                },

                {
                  q: "Can I reorganize PDF pages after deleting them?",
                  a: "Yes, after deleting pages you can use the Organize PDF tool to reorder, rotate, or rearrange remaining pages visually.",
                },

                {
                  q: "Can I remove pages by entering page numbers?",
                  a: "Yes, SmartPDFPro supports deleting pages using custom page numbers and page ranges for faster editing.",
                },

                {
                  q: "What types of PDF files can be edited with SmartPDFPro?",
                  a: "SmartPDFPro supports invoices, contracts, reports, ebooks, scanned PDFs, forms, business documents, and academic files.",
                },

                {
                  q: "Why use SmartPDFPro to delete PDF pages?",
                  a: "SmartPDFPro offers fast browser-based PDF editing, secure processing, mobile compatibility, visual page previews, and watermark-free downloads in one platform.",
                },

                {
                  q: "Does SmartPDFPro support browser-based PDF editing?",
                  a: "Yes, SmartPDFPro provides browser-based PDF tools including delete pages, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                      <HelpCircle size={22} className="text-red-500 shrink-0" />
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
