import React, { useMemo } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Scissors, Clock, ArrowRight, CheckCircle2, ArrowLeft, Maximize, Crop, Scaling, MousePointer2 } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSchema from '@/components/seo/FAQSchema';
import WebAppSchema from '@/components/seo/WebAppSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'SITE_OFFICIAL_DOMAIN';

export const metadata: Metadata = {
  title: 'How to Crop PDF Pages Online: Remove White Space & Margins | SmartPDFs Plus',
  description: 'Learn how to accurately crop PDF pages to remove margins, trim white space, or extract specific regions. Understand PDF CropBox vs MediaBox specifications.',
  keywords: 'crop pdf online, remove pdf margins, trim pdf white space, cropbox pdf, mediabox pdf, edit pdf dimensions, free pdf cropper',
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
    canonical: `${siteUrl}/blog/how-to-crop-pdf`,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'How to Crop PDF Pages: The Complete Guide',
    description: 'Master PDF cropping. Learn how to accurately remove margins, trim white space, and extract specific regions using precise bounding boxes.',
    url: `${siteUrl}/blog/how-to-crop-pdf`,
    siteName: 'SmartPDFs Plus',
    images: [
      {
        url: '/img/crop-pdf.png',
        width: 1200,
        height: 630,
        alt: 'Crop PDF Guide Banner showing bounding boxes',
      },
    ],
    locale: 'en_US',
    type: 'article',
    authors: ['SmartPDFs Plus Team'],
    publishedTime: '2026-05-22T00:00:00.000Z',
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Crop PDF Pages: The Complete Guide',
    description: 'Master PDF cropping. Learn how to accurately remove margins, trim white space, and extract specific regions using precise bounding boxes.',
    images: ['/img/crop-pdf.png'],
  },
  category: 'Special Tools',
  authors: [{ name: 'SmartPDFs Plus Team', url: siteUrl }],
};

export default function CropPDFPost() {
  const breadcrumbItems = useMemo(() => [
    { label: 'Blog', href: '/blog' },
    { label: 'How to Crop PDF', href: '/blog/how-to-crop-pdf' }
  ], []);

  // Generate Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    image: '/img/crop-pdf.png',
    author: {
      '@type': 'Organization',
      name: 'SmartPDFs Plus Team',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmartPDFs Plus',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`
      }
    },
    datePublished: '2026-05-22T00:00:00.000Z',
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/how-to-crop-pdf`
    }
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema />
      <WebAppSchema />

      <article className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <nav aria-label="Breadcrumb navigation" className="mb-8">
          <Breadcrumbs items={breadcrumbItems} />

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-500 transition-colors font-bold mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1"
            aria-label="Navigate Back to Blog"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to Blog
          </Link>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
              aria-hidden="true"
            >
              <Scissors size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-2">
                How to Crop PDF Pages Online: Remove Margins & White Space
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white text-indigo-600 border-2 border-indigo-500 px-2 py-0.5 rounded-full shadow-sm">
                  Special
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} aria-hidden="true" /> 11 min read
                </span>
                <span>Last Updated: May 30, 2026</span>
              </div>
            </div>
          </div>

          <figure className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border border-slate-100 bg-slate-50">
            <Image
              src="/img/crop-pdf.png"
              alt="Visual guide demonstrating how to adjust bounding boxes to crop a PDF page"
              width={1200}
              height={630}
              priority
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <figcaption className="sr-only">Comprehensive guide to manually defining crop boxes and trimming PDF documents.</figcaption>
          </figure>
        </header>

        <section className="prose prose-slate max-w-none space-y-8" aria-label="Article Content">

          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Whether you are reading academic papers on a 6-inch e-reader, trying to print a shipping label without wasting ink on blank space, or formatting a document for a presentation, wide margins and excessive white space in PDFs are incredibly frustrating.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Cropping an image is simple: you just delete the pixels outside the boundary. But PDFs are not images; they are complex coordinate-based vector documents. In this comprehensive guide, we will explore the technical nuances of the PDF specification (including the mysterious CropBox and MediaBox), explain why some cropped PDFs revert back to their original size when printed, and show you how to crop your documents flawlessly.
          </p>

          <aside className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-sm" aria-labelledby="toc-heading">
            <h2 id="toc-heading" className="font-black text-indigo-900 text-lg mb-4 mt-0">What You Will Learn</h2>
            <ul className="space-y-3 m-0 list-none p-0">
              {[
                'The technical difference between a MediaBox, CropBox, and TrimBox.',
                'Why PDF cropping does not actually delete data (and why that matters for privacy).',
                'How to use visual, drag-and-drop bounding boxes to select the perfect crop area.',
                'Batch cropping: How to apply one crop area to hundreds of pages instantly.',
                'How to securely crop sensitive documents entirely offline in your browser.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-indigo-800 leading-relaxed">
                  <CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">1. The PDF Page Boxes Explained</h2>
            <p className="text-slate-600 leading-relaxed">
              To understand how PDF cropping works, you must understand how Adobe architected the PDF page boundary system. Unlike a photograph which just has a width and height, a single PDF page actually has up to five different invisible bounding boxes dictating how it should be displayed and printed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-900">
                  <Maximize size={18} className="text-indigo-500" aria-hidden="true" />
                  <h3 className="font-black text-sm m-0">MediaBox</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  The absolute physical boundaries of the page medium. This is the largest box. If you create an A4 document, the MediaBox defines the 210x297mm paper size.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-900">
                  <Crop size={18} className="text-indigo-500" aria-hidden="true" />
                  <h3 className="font-black text-sm m-0">CropBox</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  The visible region to which the page should be clipped when displayed on a screen or printed. <strong>This is the box that a cropping tool modifies.</strong>
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-900">
                  <Scaling size={18} className="text-indigo-500" aria-hidden="true" />
                  <h3 className="font-black text-sm m-0">TrimBox / BleedBox</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  Used specifically in professional printing. The TrimBox dictates where the paper cutter will physically slice the page after it comes off the press.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">2. The "Hidden Data" Warning</h2>
            <p className="text-slate-600 leading-relaxed">
              Here is the most critical thing to understand about cropping a PDF: <strong>Cropping a PDF does not delete the cropped content; it merely hides it.</strong>
            </p>
            <p className="text-slate-600 leading-relaxed">
              When you use a standard tool to crop a PDF, the software simply updates the mathematical coordinates of the <code>CropBox</code>. All the text, images, and vectors that fall outside that new box are still physically present in the file's binary code. A user could open the file in advanced PDF software, reset the <code>CropBox</code> to match the <code>MediaBox</code>, and view everything you thought you cropped out.
            </p>
            <p className="text-slate-600 leading-relaxed font-bold">
              If you are cropping a document to hide sensitive information (like cropping out a signature or a Social Security Number), do NOT use a standard cropping tool. You must use a true <Link href="/blog/how-to-redact-pdf" className="text-indigo-500 hover:underline">PDF Redaction</Link> tool, or flatten the PDF into a JPG image first.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">3. How to Crop a PDF (Step-by-Step)</h2>
            <p className="text-slate-600 leading-relaxed">
              Using the SmartPDFs Plus <Link href="/tool/crop-pdf" className="text-indigo-500 font-semibold hover:underline">Visual PDF Cropper</Link>, removing vast swathes of white space is a breeze.
            </p>

            <ol className="space-y-4 my-6 list-none p-0">
              {[
                {
                  title: 'Upload the Document',
                  desc: 'Load your PDF into our secure, browser-based editor. The file is processed locally on your device for absolute privacy.'
                },
                {
                  title: 'Draw the Crop Area',
                  desc: 'Use your mouse to click and drag a bounding box over the exact area you wish to keep. You will see a visual overlay dimming the areas that will be hidden.'
                },
                {
                  title: 'Apply to All Pages (Optional)',
                  desc: 'If you are reading an academic journal where every page has massive 2-inch margins, you don\'t need to crop them one by one. Check the "Apply to all pages" toggle to apply the exact same coordinate math to the entire document.'
                },
                {
                  title: 'Download and View',
                  desc: 'Hit the Crop button. The tool will rewrite the internal CropBox arrays and generate a brand new, perfectly trimmed PDF file.'
                }
              ].map((step, i) => (
                <li key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                    <MousePointer2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base m-0">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1 mb-0">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">4. Common Cropping Use Cases</h2>
            <p className="text-slate-600 leading-relaxed">
              While general cropping is useful, we've noticed thousands of users rely on cropping for very specific e-commerce workflows. For example, sellers on platforms like Amazon and Flipkart frequently receive A4 PDFs containing a small shipping label at the top.
            </p>
            <p className="text-slate-600 leading-relaxed">
              If you run an e-commerce business, manually drawing a crop box for 500 daily orders is impossible. That is why we built specialized, one-click automated cropping tools that utilize AI algorithms to instantly locate and extract labels:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><Link href="/tool/crop-amazon" className="text-indigo-600 font-semibold hover:underline">Amazon Label Cropper</Link></li>
              <li><Link href="/tool/crop-flipkart" className="text-indigo-600 font-semibold hover:underline">Flipkart Label Cropper</Link></li>
              <li><Link href="/tool/crop-meesho" className="text-indigo-600 font-semibold hover:underline">Meesho Label & Invoice Cropper</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">Frequently Asked Questions</h2>
            <div className="space-y-4 my-6" itemScope itemType="https://schema.org/FAQPage">
              {[
                {
                  q: 'Why does my cropped PDF still print on a full A4 page?',
                  a: 'Your printer software may be set to "Fit to Page" or "Center on A4". When you print, ensure your paper size settings match the new dimensions of the cropped PDF, and select "Actual Size" in the print dialog.'
                },
                {
                  q: 'Does cropping reduce the PDF file size?',
                  a: 'Usually not. Because PDF cropping updates the viewing boundary (CropBox) rather than deleting the actual underlying data, the file size generally remains identical to the original.'
                },
                {
                  q: 'Can I crop different pages to different sizes?',
                  a: 'Yes. Our visual cropper allows you to scroll through your document and apply unique bounding boxes to individual pages, overriding the batch-crop settings.'
                },
                {
                  q: 'How do I un-crop a PDF?',
                  a: 'If you have the original file, or if the file was cropped using standard CropBox techniques, advanced PDF editors (like Adobe Acrobat Pro) can reset the CropBox coordinates to match the original MediaBox.'
                }
              ].map(({ q, a }, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-indigo-200 transition-colors" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 text-base mb-2 mt-0" itemProp="name">{q}</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm text-slate-600 leading-relaxed m-0" itemProp="text">{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-br from-white to-indigo-50/30 border-2 border-indigo-500 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow mt-10">
            <h2 className="font-black text-2xl text-slate-900 mt-0 mb-3">Ready to trim the fat?</h2>
            <p className="text-slate-600 mb-6 text-sm">Remove wide margins and extract exactly what you need with our visual, drag-and-drop PDF cropper.</p>
            <div className="flex justify-center">
              <Link
                href="/tool/crop-pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
                aria-label="Crop PDF Tool"
              >
                <Crop size={16} aria-hidden="true" />
                Open PDF Cropper
              </Link>
            </div>
          </section>

        </section>
      </article>
    </main>
  );
}
