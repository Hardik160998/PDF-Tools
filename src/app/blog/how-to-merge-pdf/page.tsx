import React, { useMemo } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Combine, Clock, CircleCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSchema from '@/components/seo/FAQSchema';
import WebAppSchema from '@/components/seo/WebAppSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://smartpdfpro.com/';

export const metadata: Metadata = {
  title: 'How to Merge Multiple PDFs into One File (Free & Easy) | SmartPDFs Plus',
  description: 'Learn how to easily merge, combine, and organize multiple PDF files into one single document for free. No software installation required.',
  keywords: 'merge pdf, combine pdf, join pdf files, free pdf merger, merge pdf online, combine multiple pdfs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${siteUrl}/blog/how-to-merge-pdf`,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'How to Merge Multiple PDFs into One File (Free & Easy)',
    description: 'Learn how to easily merge, combine, and organize multiple PDF files into one single document for free.',
    url: `${siteUrl}/blog/how-to-merge-pdf`,
    siteName: 'SmartPDFs Plus',
    images: [
      {
        url: '/img/merge-multiple-pdfs.png',
        width: 1200,
        height: 630,
        alt: 'Merge Multiple PDFs Banner',
      },
    ],
    locale: 'en_US',
    type: 'article',
    authors: ['SmartPDFs Plus Team'],
    publishedTime: '2026-04-20T00:00:00.000Z',
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Merge Multiple PDFs into One File (Free & Easy)',
    description: 'Learn how to easily merge, combine, and organize multiple PDF files into one single document for free.',
    images: ['/img/merge-multiple-pdfs.png'],
  },
  category: 'Technology',
  authors: [{ name: 'SmartPDFs Plus Team', url: siteUrl }],
};

export default function HowToMergePdfPage() {
  const breadcrumbItems = useMemo(() => [
    { label: 'Blog', href: '/blog' },
    { label: 'How to Merge PDF', href: '/blog/how-to-merge-pdf' }
  ], []);

  return (
    <main className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema />
      <WebAppSchema />

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
              className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
              aria-hidden="true"
            >
              <Combine size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
                How to Merge Multiple PDFs into One File (Free & Easy)
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap mt-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border-2 border-red-500 px-2 py-0.5 rounded-full shadow-sm">
                  Organize
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} aria-hidden="true" /> 5 min read
                </span>
                <span>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1">
                  By <strong>SmartPDFs Plus Team</strong>
                </span>
              </div>
            </div>
          </div>
        </header>

        <figure className="mb-8 shadow-2xl rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
          <Image
            src="/img/merge-multiple-pdfs.png"
            alt="How to Merge Multiple PDFs into One File"
            width={1200}
            height={630}
            sizes="(max-width: 768px) 100vw, 800px"
            priority
            className="w-full h-auto object-contain"
          />
        </figure>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            Need to combine several PDF files into one? Whether you are assembling a report, building a portfolio, or organizing scanned documents, our <Link href="/tool/merge" className="text-orange-600 hover:underline">Merge PDF tool</Link> makes it instant — no software, no sign-up, completely free.
          </p>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6" role="note" aria-label="Learning Objectives">
            <p className="font-black text-orange-800 text-sm mb-3 uppercase tracking-wider">What you&apos;ll learn</p>
            <ul className="space-y-2 list-none p-0 m-0">
              <li className="flex items-center gap-3 text-sm text-orange-700">
                <CircleCheck className="text-orange-500" size={16} aria-hidden="true" />
                <span>How to seamlessly combine PDFs in your browser without losing quality</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-orange-700">
                <CircleCheck className="text-orange-500" size={16} aria-hidden="true" />
                <span>Tips on reordering and organizing your pages before the final merge</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-orange-700">
                <CircleCheck className="text-orange-500" size={16} aria-hidden="true" />
                <span>How our local browser processing ensures 100% data privacy</span>
              </li>
            </ul>
          </div>

          <section aria-labelledby="what-is-merge-pdf">
            <h2 id="what-is-merge-pdf" className="text-2xl font-black text-slate-900 mt-10 mb-4">What is Merge PDF?</h2>
            <p className="leading-relaxed">
              Merging PDFs is the process of taking two or more separate PDF (Portable Document Format) files and appending them together sequentially to create a single, unified document. It is essentially digital stapling. Instead of emailing someone five different attachments, you merge them into one professional, continuous file that is far easier to manage and present.
            </p>
          </section>

          <section aria-labelledby="why-merge-pdfs">
            <h2 id="why-merge-pdfs" className="text-2xl font-black text-slate-900 mt-10 mb-4">Why Merge PDF Files?</h2>
            <p className="leading-relaxed mb-4">
              Managing a multitude of separate files can be chaotic. If you are applying for a job, you might have your resume, cover letter, and portfolio as three separate documents. If you are handling taxes, you have dozens of receipts. By combining them, you drastically reduce clutter. It also guarantees that the recipient views your documents in the exact order you intend, without missing an attachment.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Common Use Cases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h4 className="font-black text-slate-900 text-base mb-2">Corporate Reports</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Combine monthly financial statements from different departments into a single annual document.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h4 className="font-black text-slate-900 text-base mb-2">Job Applications</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Join your resume, cover letter, and work samples into one professional file that is easy for HR to review.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h4 className="font-black text-slate-900 text-base mb-2">Scanned Documents</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Merge separate scans of pages into a single continuous book or document. If you need to break them up later, you can always <Link href="/tool/split" className="text-orange-600 hover:underline">split the PDF</Link>.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <h4 className="font-black text-slate-900 text-base mb-2">Project Documentation</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Combine project plans, requirements, and designs for easy sharing across the team.</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="benefits-of-merging">
            <h2 id="benefits-of-merging" className="text-2xl font-black text-slate-900 mt-10 mb-4">Benefits of Merging PDFs</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Improved Organization:</strong> Stop digging through folders for that one missing page. One file means one place to look.</li>
              <li><strong>Easier Sharing:</strong> Email clients often have limits on the number of attachments. One merged file circumvents this issue. And if the combined file is too large, you can easily <Link href="/tool/compress" className="text-orange-600 hover:underline">compress the PDF</Link> to reduce its size.</li>
              <li><strong>Consistent Formatting:</strong> PDFs maintain their layout exactly as intended, across all devices.</li>
              <li><strong>Archiving:</strong> It is much simpler to archive and backup a single, comprehensive record of an event or project than a scattered mess of loose files.</li>
            </ul>
          </section>

          <section aria-labelledby="features-of-tool">
            <h2 id="features-of-tool" className="text-2xl font-black text-slate-900 mt-10 mb-4">Features of Our Merge PDF Tool</h2>
            <p className="mb-4">Our tool is designed with modern web technologies to be the fastest and safest available.</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <CircleCheck className="text-green-500 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <div>
                  <strong className="block text-slate-900">100% Client-Side Processing</strong>
                  <span className="text-sm">Your files are processed directly in your web browser. They are never uploaded to our servers, ensuring absolute privacy.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <CircleCheck className="text-green-500 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <div>
                  <strong className="block text-slate-900">No File Limits</strong>
                  <span className="text-sm">Merge as many files as you want. There are no arbitrary paywalls limiting you to 3 files a day.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <CircleCheck className="text-green-500 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <div>
                  <strong className="block text-slate-900">Lossless Quality</strong>
                  <span className="text-sm">The tool simply stitches the documents together without degrading image quality or altering the text vectors. If you need to convert it to a word doc later, try our <Link href="/tool/pdf-to-word" className="text-orange-600 hover:underline">PDF to Word converter</Link>.</span>
                </div>
              </li>
            </ul>
          </section>

          <section aria-labelledby="how-to-merge-online">
            <h2 id="how-to-merge-online" className="text-2xl font-black text-slate-900 mt-10 mb-6">How to Merge PDF Online</h2>

            <div className="space-y-4">
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md" aria-hidden="true">1</div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg mb-1">Open the Merge PDF Tool</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Navigate to our dedicated <Link href="/tool/merge" className="text-orange-600 font-bold hover:underline">Merge PDF</Link> tool page. You can do this on desktop or mobile.</p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md" aria-hidden="true">2</div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg mb-1">Upload Your PDF Files</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Click the prominent &quot;Select PDF Files&quot; button, or drag and drop your PDFs directly into the upload area. You can add files from your computer, Google Drive, or Dropbox.</p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md" aria-hidden="true">3</div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg mb-1">Reorder Your Files (Optional)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Once uploaded, you will see a visual list of your files. Simply drag and drop the grip handle on each file row to change their order. The top file will be the beginning of your new document.</p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md" aria-hidden="true">4</div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg mb-1">Execute the Merge</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Click the orange &quot;Merge PDF&quot; button. Thanks to WebAssembly and local processing, the files will be stitched together almost instantly.</p>
                </div>
              </div>
              <div className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md" aria-hidden="true">5</div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg mb-1">Download Your Document</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Click the &quot;Download&quot; button to save your combined, unified PDF file back to your device.</p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="best-practices">
            <h2 id="best-practices" className="text-2xl font-black text-slate-900 mt-10 mb-4">Best Practices</h2>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <CircleCheck className="text-blue-500 shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span><strong>Check orientations:</strong> Ensure all files are oriented correctly (portrait vs landscape) before merging to avoid jarring transitions.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <CircleCheck className="text-blue-500 shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span><strong>Batch upload:</strong> Select multiple files at once from your file explorer using Ctrl+Click (Windows) or Cmd+Click (Mac) to save time.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <CircleCheck className="text-blue-500 shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span><strong>Review your order:</strong> Always double check the order before hitting merge. The visual preview makes this easy.</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="faqs">
            <h2 id="faqs" className="text-2xl font-black text-slate-900 mt-10 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-base mb-2">Is there a file size limit for merging?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">No, there is no hard limit on file size because processing happens locally in your browser. However, very large files may slow down your browser depending on your device RAM.</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-base mb-2">Can I merge password-protected PDFs?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Yes, but you must know the password to unlock them first before they can be merged. The tool will securely prompt you if a file is locked.</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-base mb-2">Will merging reduce the quality of my PDFs?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">No. The tool combines the files without re-encoding images or stripping data, so the quality remains exactly the same as the original files.</p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-500 rounded-3xl p-8 text-center text-slate-900 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 mt-12 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Ready to merge your PDFs?</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">Combine multiple files into one seamless document in seconds, absolutely free and secure.</p>
            </div>
            <Link
              href="/tool/merge"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-md focus:outline-none focus:ring-4 focus:ring-orange-300"
              aria-label="Open Merge PDF Tool"
            >
              Open Merge PDF Tool <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

        </div>
      </article>
    </main>
  );
}
