import React, { useMemo } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon, Clock, ArrowRight, CheckCircle2, ArrowLeft, ImagePlus, BoxSelect, Zap } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSchema from '@/components/seo/FAQSchema';
import WebAppSchema from '@/components/seo/WebAppSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfsplus.com';

export const metadata: Metadata = {
  title: 'The Ultimate Guide to Image Conversion: JPG, PNG, WebP & PDF | SmartPDFs Plus',
  description: 'Master image conversion. Learn the technical differences between lossy and lossless formats (JPG, PNG, WebP) and how to convert images to vector PDFs without losing quality.',
  keywords: 'image conversion guide, convert jpg to pdf, convert png to pdf, webp to pdf, lossy vs lossless, image resolution, dpi, edit pdf images',
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
    canonical: `${siteUrl}/blog/ultimate-image-conversion-guide`,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'The Ultimate Guide to Image Conversion',
    description: 'Master image conversion. Learn the technical differences between lossy and lossless formats and how to convert images to vector PDFs without losing quality.',
    url: `${siteUrl}/blog/ultimate-image-conversion-guide`,
    siteName: 'SmartPDFs Plus',
    images: [
      {
        url: '/img/convert-img.png',
        width: 1200,
        height: 630,
        alt: 'Ultimate Image Conversion Guide Banner',
      },
    ],
    locale: 'en_US',
    type: 'article',
    authors: ['SmartPDFs Plus Team'],
    publishedTime: '2026-05-30T00:00:00.000Z',
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Ultimate Guide to Image Conversion',
    description: 'Master image conversion. Learn the technical differences between lossy and lossless formats and how to convert images to vector PDFs without losing quality.',
    images: ['/img/convert-img.png'],
  },
  category: 'Image Tools',
  authors: [{ name: 'SmartPDFs Plus Team', url: siteUrl }],
};

export default function ImageConversionGuidePost() {
  const breadcrumbItems = useMemo(() => [
    { label: 'Blog', href: '/blog' },
    { label: 'Ultimate Image Conversion Guide', href: '/blog/ultimate-image-conversion-guide' }
  ], []);

  // Generate Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    image: '/img/convert-img.png',
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
    datePublished: '2026-05-30T00:00:00.000Z',
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/ultimate-image-conversion-guide`
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
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-500 transition-colors font-bold mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1"
            aria-label="Navigate Back to Blog"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to Blog
          </Link>
        </nav>
        
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
              aria-hidden="true"
            >
              <ImageIcon size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-2">
                The Ultimate Guide to Image Conversion: JPG, PNG, WebP & PDF
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white text-emerald-600 border-2 border-emerald-500 px-2 py-0.5 rounded-full shadow-sm">
                  Image Tools
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} aria-hidden="true" /> 12 min read
                </span>
                <span>Last Updated: May 30, 2026</span>
              </div>
            </div>
          </div>

          <figure className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border border-slate-100 bg-slate-50">
            <Image 
              src="/img/convert-img.png" 
              alt="Visual guide demonstrating the conversion process between different raster and vector image formats" 
              width={1200} 
              height={630} 
              priority
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <figcaption className="sr-only">Comprehensive guide to mastering image formats and PDF wrapping.</figcaption>
          </figure>
        </header>

        <section className="prose prose-slate max-w-none space-y-8" aria-label="Article Content">
          
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            In the digital age, understanding image formats is no longer just for graphic designers. Whether you are uploading a photograph to a government portal that strict demands a &quot;PDF under 2MB&quot;, building a lightning-fast Next.js web application, or archiving family photos, choosing the right file format is critical. 
          </p>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Not all image formats are created equal. Some permanently destroy color data to save space (Lossy), some preserve every single pixel perfectly (Lossless), and some (like PDF) aren't even true image formats at all, but rather complex containers. In this ultimate guide, we will dissect the architecture of JPG, PNG, WebP, and PDF, and show you how to convert between them flawlessly.
          </p>

          <aside className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm" aria-labelledby="toc-heading">
            <h2 id="toc-heading" className="font-black text-emerald-900 text-lg mb-4 mt-0">What You Will Learn</h2>
            <ul className="space-y-3 m-0 list-none p-0">
              {[
                'The technical difference between Lossy (JPG/WebP) and Lossless (PNG/WebP) compression.',
                'Why converting a blurry JPG to a PNG will never restore its quality.',
                'The architecture of a PDF wrapper, and how images are embedded inside PDFs.',
                'How to safely strip EXIF metadata (GPS coordinates, camera model) during conversion.',
                'Batch converting massive photo albums into a single compiled PDF document.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-emerald-800 leading-relaxed">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">1. Raster Formats: JPG vs PNG vs WebP</h2>
            <p className="text-slate-600 leading-relaxed">
              Before you can convert an image effectively, you must understand the underlying algorithms driving the format. JPG, PNG, and WebP are all <em>Raster</em> formats. This means they are constructed using a grid of thousands of tiny colored squares called pixels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2 text-slate-900">
                  <Zap size={18} className="text-emerald-500" aria-hidden="true" />
                  <h3 className="font-black text-sm m-0">JPEG (JPG)</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  <strong>The Lossy Standard.</strong> Designed for complex photographs. To reduce file size, the JPG algorithm mathematically averages out neighboring colors and deletes data. Every time you save a JPG, it loses quality permanently (Generation Loss). It does not support transparency.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2 text-slate-900">
                  <BoxSelect size={18} className="text-emerald-500" aria-hidden="true" />
                  <h3 className="font-black text-sm m-0">PNG</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  <strong>The Lossless Standard.</strong> Designed for graphics, logos, and screenshots containing text. PNG uses LZW compression to shrink the file without deleting a single pixel of color data. It fully supports an alpha channel (transparency).
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2 text-slate-900">
                  <ImagePlus size={18} className="text-emerald-500" aria-hidden="true" />
                  <h3 className="font-black text-sm m-0">WebP</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  <strong>The Modern Web.</strong> Created by Google. WebP can operate in both lossy AND lossless modes. It supports transparency and animation. It generally produces files 25-34% smaller than equivalent JPGs and PNGs, making it the king of web performance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">2. The Golden Rule of Conversion</h2>
            <p className="text-slate-600 leading-relaxed font-bold">
              You cannot create data out of thin air.
            </p>
            <p className="text-slate-600 leading-relaxed">
              If you have a heavily compressed, pixelated JPG file (say, 50kb), converting it to a PNG will result in a much larger file (say, 500kb), but the image will still look terrible. The PNG algorithm perfectly preserves the blurry, blocky artifacts created by the JPG. 
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Workflow Best Practice:</strong> Always store your master files in a lossless format (like PNG, TIFF, or PSD). When you need to upload to a website or send an email, export a <em>copy</em> of that master file to a lossy format (JPG/WebP) to save space.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">3. The PDF Wrapper Explained</h2>
            <p className="text-slate-600 leading-relaxed">
              A massive source of confusion is the relationship between Images and PDFs. 
            </p>
            <p className="text-slate-600 leading-relaxed">
              A PDF (Portable Document Format) is not an image format like a JPG. A PDF is a <em>container</em>. It can hold text, vector graphics, fonts, and yes, raster images. When you use a tool to <Link href="/tool/jpg-to-pdf" className="text-emerald-600 font-semibold hover:underline">Convert JPG to PDF</Link>, the software is not transforming the pixels into a new image format. Instead, it creates a blank PDF page and embeds your JPG image onto that page, much like pasting a photo onto a physical piece of paper.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This is incredibly useful because a PDF can hold hundreds of images inside a single file, ensuring they are always viewed in the correct order, regardless of the device the recipient is using.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">4. Automated Batch Conversion Workflow</h2>
            <p className="text-slate-600 leading-relaxed">
              Converting 50 images into a single PDF document manually using desktop software is tedious. SmartPDFs Plus provides a secure, WebAssembly-powered browser tool to automate this instantly:
            </p>
            
            <ol className="space-y-4 my-6 list-none p-0">
              {[
                {
                  title: 'Upload Your Images',
                  desc: 'Navigate to our JPG to PDF tool. You can drag and drop JPG, PNG, WebP, or HEIC files simultaneously.'
                },
                {
                  title: 'Reorder visually',
                  desc: 'Our interface allows you to drag the image thumbnails to sequence them exactly as they should appear in the final document.'
                },
                {
                  title: 'Set Page Margins & Orientation',
                  desc: 'Choose whether you want the images to stretch to the edges of the PDF page, or if you want a clean white margin. The tool can also auto-detect Portrait vs Landscape.'
                },
                {
                  title: 'Generate PDF',
                  desc: 'Click generate. The WebAssembly engine compiles the PDF wrapper locally in your browser memory (ensuring absolute privacy) and downloads the final file.'
                }
              ].map((step, i) => (
                <li key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                    {i + 1}
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
            <h2 className="text-2xl font-black text-slate-900 border-b pb-2">Frequently Asked Questions</h2>
            <div className="space-y-4 my-6" itemScope itemType="https://schema.org/FAQPage">
              {[
                { 
                  q: 'Does converting a JPG to PDF reduce its quality?', 
                  a: 'No. Assuming the PDF engine is configured correctly, the JPG is embedded into the PDF container exactly as-is, with zero additional compression or quality loss.' 
                },
                { 
                  q: 'How do I extract an image out of a PDF?', 
                  a: 'You can use a PDF to Image converter. The software will locate the embedded image objects within the PDF architecture and save them back to your hard drive as raw JPGs or PNGs.' 
                },
                { 
                  q: 'What is EXIF data and is it preserved?', 
                  a: 'EXIF data contains hidden metadata captured by your camera (like GPS location, date, and camera model). Depending on your conversion settings, EXIF data is often stripped when generating a PDF to enhance privacy and reduce file size.' 
                }
              ].map(({ q, a }, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-emerald-200 transition-colors" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 text-base mb-2 mt-0" itemProp="name">{q}</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm text-slate-600 leading-relaxed m-0" itemProp="text">{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-500 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow mt-10">
            <h2 className="font-black text-2xl text-slate-900 mt-0 mb-3">Ready to Convert?</h2>
            <p className="text-slate-600 mb-6 text-sm">Compile dozens of images into a single, professional PDF document securely in your browser.</p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/tool/jpg-to-pdf" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
                aria-label="JPG to PDF Tool"
              >
                <ImageIcon size={16} aria-hidden="true" />
                Convert JPG to PDF
              </Link>
            </div>
          </section>

        </section>
      </article>
    </main>
  );
}
