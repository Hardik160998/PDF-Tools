import React, { useMemo } from "react";
import { Metadata } from "next";
import ArticleSchema from "@/components/seo/ArticleSchema";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Trash2,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FAQSchema from "@/components/seo/FAQSchema";
import WebAppSchema from "@/components/seo/WebAppSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  title:
    "How to Rearrange, Rotate & Delete PDF Pages Online (Free Guide) | SmartPDFs Pro",
  description:
    "Learn the exact steps to easily organize your PDF files. Rearrange pages, rotate scanned documents, and delete unwanted pages online for free.",
  keywords:
    "organize pdf, rearrange pdf pages, rotate pdf, delete pdf pages, move pdf pages, reorder pdf, free pdf organizer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${siteUrl}/blog/organize-pdf-pages`,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "How to Rearrange, Rotate & Delete PDF Pages Online",
    description:
      "Learn the exact steps to easily organize your PDF files. Rearrange pages, rotate scanned documents, and delete unwanted pages online for free.",
    url: `${siteUrl}/blog/organize-pdf-pages`,
    siteName: "SmartPDFs Pro",
    images: [
      {
        url: "/img/rearrange.png",
        width: 1200,
        height: 630,
        alt: "Organize PDF Pages Banner",
      },
    ],
    locale: "en_US",
    type: "article",
    authors: ["SmartPDFs Pro Team"],
    publishedTime: "2026-04-10T00:00:00.000Z",
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Rearrange, Rotate & Delete PDF Pages Online",
    description:
      "Learn the exact steps to easily organize your PDF files. Rearrange pages, rotate scanned documents, and delete unwanted pages online for free.",
    images: ["/img/rearrange.png"],
  },
  category: "Technology",
  authors: [{ name: "SmartPDFs Pro Team", url: siteUrl }],
};

export default function OrganizePdfPost() {
  const breadcrumbItems = useMemo(
    () => [
      { label: "Blog", href: "/blog" },
      { label: "Organize PDF Pages", href: "/blog/organize-pdf-pages" },
    ],
    [],
  );

  return (
    <main className="min-h-screen">
      <ArticleSchema
        title="How to Rearrange, Rotate & Delete PDF Pages Online (Free Guide) | SmartPDFs Pro"
        description="Learn the exact steps to easily organize your PDF files. Rearrange pages, rotate scanned documents, and delete unwanted pages online for free."
        url={`${siteUrl}/blog/organize-pdf-pages`}
        datePublished="2026-06-01T13:25:51.362Z"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema />
      <WebAppSchema
        name="Organize PDF Tool"
        description="Learn the exact steps to easily organize your PDF files. Rearrange pages, rotate scanned documents, and delete unwanted pages online for free."
        url="https://smartpdfpro.com/tool/organize"
      />

      <article className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <Breadcrumbs items={breadcrumbItems} />

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
          aria-label="Back to Blog"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Blog
        </Link>

        <header className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
              aria-hidden="true"
            >
              <LayoutGrid size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
                How to Rearrange, Rotate & Delete PDF Pages Online
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-purple-600 border-2 border-purple-500 px-2 py-0.5 rounded-full shadow-sm">
                  Organize
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} aria-hidden="true" /> 7 min read
                </span>
                <span>
                  Last Updated:{""}
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  By <strong>SmartPDFs Pro Team</strong>
                </span>
              </div>
            </div>
          </div>
        </header>

        <figure className="mb-8 shadow-2xl rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
          <Image
            src="/img/rearrange.png"
            alt="How to Rearrange, Rotate and Delete PDF Pages"
            width={1200}
            height={630}
            sizes="(max-width: 768px) 100vw, 800px"
            priority
            className="w-full h-auto object-contain"
          />
        </figure>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <section aria-labelledby="introduction">
            <h2 id="introduction" className="sr-only">
              Introduction
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              We have all dealt with messy PDF files. Whether it is a scanned
              document where every other page is upside down, a massive report
              with blank pages in the middle, or a presentation where the slides
              are simply out of order, disorganized PDFs look unprofessional and
              are difficult to read.
            </p>
            <p className="leading-relaxed">
              Fortunately, fixing these issues doesn't require expensive
              software like Adobe Acrobat. With the right tools, you can easily
              {""}
              <Link
                href="/tool/organize"
                className="text-purple-600 hover:underline"
              >
                organize your PDF
              </Link>
              {""}
              directly in your web browser. In this comprehensive guide, we will
              walk you through exactly how to rearrange, rotate, and delete
              pages from any PDF document quickly, securely, and for free.
            </p>
          </section>

          <div
            className="bg-purple-50 border border-purple-100 rounded-2xl p-6"
            role="note"
            aria-label="Key Takeaways"
          >
            <p className="font-bold text-purple-800 text-sm mb-3 uppercase tracking-wider">
              Key Takeaways
            </p>
            <ul className="space-y-2 list-none p-0 m-0">
              <li className="flex items-center gap-3 text-sm text-purple-700">
                <CheckCircle2
                  className="text-purple-500"
                  size={16}
                  aria-hidden="true"
                />
                <span>
                  How to use an intuitive drag-and-drop interface to reorder
                  pages.
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-purple-700">
                <CheckCircle2
                  className="text-purple-500"
                  size={16}
                  aria-hidden="true"
                />
                <span>
                  Quickly identify and fix incorrectly scanned or sideways
                  pages.
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-purple-700">
                <CheckCircle2
                  className="text-purple-500"
                  size={16}
                  aria-hidden="true"
                />
                <span>
                  Learn keyboard shortcuts to massively speed up your workflow.
                </span>
              </li>
            </ul>
          </div>

          <section aria-labelledby="common-use-cases">
            <h2
              id="common-use-cases"
              className="text-2xl font-bold text-slate-900 mt-10 mb-4"
            >
              Common Use Cases for Organizing PDFs
            </h2>
            <p className="leading-relaxed mb-6">
              Organizing a PDF is one of the most frequent document tasks. Here
              is why most professionals find themselves needing a good PDF
              organizer tool.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Fixing Scanned Files
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Office scanners often misfeed. You end up with documents where
                  pages are scanned upside down or in landscape mode instead of
                  portrait. A quick rotation fixes this instantly.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Removing Blank Pages
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  When saving a Word document to PDF, an accidental page break
                  can result in empty white pages. Removing them makes the file
                  smaller and look much more professional.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Reordering Chapters
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  If you're compiling a portfolio, thesis, or report, you might
                  decide a specific section belongs earlier in the document.
                  Drag and drop lets you visually sort chapters.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Extracting Specific Pages
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  If you have a 100-page manual but only need pages 12-15 to
                  send to a client, you can simply delete the rest, or use our
                  dedicated{""}
                  <Link
                    href="/tool/extract-pages"
                    className="text-purple-600 hover:underline"
                  >
                    extract PDF tool
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="how-to-organize-online">
            <h2
              id="how-to-organize-online"
              className="text-2xl font-bold text-slate-900 mt-10 mb-6"
            >
              How to Use the Organize PDF Tool
            </h2>
            <p className="leading-relaxed mb-6">
              Our Organize PDF tool provides a "light table" view of your
              document. It lays out every page as a visual thumbnail, making it
              incredibly easy to spot mistakes and rearrange the flow.
            </p>

            <div className="space-y-4">
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Open the Tool
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Navigate to our dedicated{""}
                    <Link
                      href="/tool/organize"
                      className="text-purple-600 font-bold hover:underline"
                    >
                      Organize PDF
                    </Link>
                    {""}
                    page. This works on Windows, Mac, iOS, and Android.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Upload Your Document
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click to select your file, or drag it into the browser
                    window. Within seconds, you will see a grid of thumbnails
                    representing every page in your document.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Rearrange via Drag-and-Drop
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click and hold on any page thumbnail. Drag it to a new
                    position in the grid and drop it. The surrounding pages will
                    automatically shift to accommodate it. On mobile devices,
                    tap and hold for a split second until the page lifts, then
                    drag.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  4
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Rotate Pages
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Hover over a page to reveal the action menu. Click the
                    rotate icon (↻) to turn the page 90 degrees clockwise. Click
                    it twice for 180 degrees.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  5
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Delete Unwanted Pages
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Hover over a page and click the trash icon (🗑) to mark it
                    for deletion. The page will dim and be excluded from the
                    final document. If you make a mistake, simply click the
                    "Restore" button that appears on the dimmed thumbnail.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  6
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Apply Changes and Download
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Once the grid looks exactly how you want your final document
                    to appear, click the main "Apply Changes" or "Organize PDF"
                    button. Your browser will generate the new PDF instantly for
                    you to download.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="batch-actions">
            <h2
              id="batch-actions"
              className="text-2xl font-bold text-slate-900 mt-10 mb-6"
            >
              Advanced Batch Actions
            </h2>
            <p className="leading-relaxed mb-6">
              If you are dealing with a 50-page document, clicking rotate on
              every single page is tedious. That is why we built in advanced
              batch actions to save you time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border bg-orange-50 border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCw size={18} className="text-orange-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Rotate All
                  </h3>
                </div>
                <p className="text-sm text-slate-600">
                  Rotate every single page in the document 90° at once. This is
                  a lifesaver for documents that were fed into a scanner
                  sideways.
                </p>
              </div>
              <div className="p-5 rounded-2xl border bg-blue-50 border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 size={18} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Reverse Order
                  </h3>
                </div>
                <p className="text-sm text-slate-600">
                  Flip the entire page sequence (e.g., page 50 becomes page 1,
                  page 49 becomes page 2). Very useful when a physical scanner
                  outputs pages in reverse.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="keyboard-shortcuts">
            <h2
              id="keyboard-shortcuts"
              className="text-2xl font-bold text-slate-900 mt-10 mb-4"
            >
              Keyboard Shortcuts
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Power users can organize their PDFs even faster by utilizing
              desktop keyboard shortcuts. Once you select a page (or multiple
              pages), try these:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                <span className="text-sm text-slate-700 font-bold">
                  Select Multiple
                </span>
                <kbd className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm">
                  Shift + Click
                </kbd>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                <span className="text-sm text-slate-700 font-bold">
                  Delete Selected
                </span>
                <kbd className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm">
                  Delete / Backspace
                </kbd>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                <span className="text-sm text-slate-700 font-bold">
                  Select All
                </span>
                <kbd className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm">
                  Ctrl + A
                </kbd>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                <span className="text-sm text-slate-700 font-bold">
                  Undo Action
                </span>
                <kbd className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm">
                  Ctrl + Z
                </kbd>
              </div>
            </div>
          </section>

          <section aria-labelledby="faqs">
            <h2
              id="faqs"
              className="text-2xl font-bold text-slate-900 mt-10 mb-6"
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Can I undo a deletion if I make a mistake?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Yes! Deleting a page in the grid doesn't permanently destroy
                  it immediately; it merely marks it for deletion. A "Restore"
                  button will appear on the thumbnail, allowing you to easily
                  bring it back before you click Apply.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Is there a limit on the number of pages I can organize?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No hard limits. The tool handles documents with hundreds of
                  pages easily. Since everything runs locally in your browser,
                  the only limitation is your device's available RAM.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Can I combine pages from different PDFs?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Yes! If you upload multiple PDF files into the tool, all their
                  pages will populate into the same visual grid. You can then
                  mix, match, and reorder pages from different documents before
                  exporting them as one single file. Alternatively, you can use
                  our{""}
                  <Link
                    href="/tool/merge"
                    className="text-purple-600 hover:underline"
                  >
                    Merge PDF tool
                  </Link>
                  .
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Are my files kept private?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  100%. We utilize client-side WebAssembly technology. Your
                  files are processed entirely on your own computer or phone and
                  are never uploaded to our servers.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-800 border-2 border-purple-500 rounded-3xl p-8 text-center text-slate-900 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 mt-12 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Ready to organize your PDFs?
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Visually drag to reorder, rotate scans, and delete pages
                instantly and securely in your browser.
              </p>
            </div>
            <Link
              href="/tool/organize"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300"
              aria-label="Open Organize PDF Tool"
            >
              Start Organizing Now <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
