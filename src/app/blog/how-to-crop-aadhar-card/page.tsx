import React, { useMemo } from "react";
import { Metadata } from "next";
import ArticleSchema from "@/components/seo/ArticleSchema";
import Image from "next/image";
import Link from "next/link";
import {
 Wand2,
 Clock,
 ArrowRight,
 CheckCircle2,
 ArrowLeft,
 Printer,
 AlertTriangle,
 ShieldCheck,
 FileSearch,
 Smartphone,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FAQSchema from "@/components/seo/FAQSchema";
import WebAppSchema from "@/components/seo/WebAppSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
 title: "How to Crop e-Aadhar Card for PVC Printing Online | SmartPDFs Plus",
 description:
 "Learn how to perfectly crop your downloaded e-Aadhar PDF file to exact PVC card dimensions (86mm x 54mm) for seamless printing without losing quality.",
 keywords:
 "crop aadhar card, e aadhar crop online, print aadhar card pvc, aadhar card dimensions, aadhar crop tool, resize aadhar pdf",
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
 canonical: `${siteUrl}/blog/how-to-crop-aadhar-card`,
 },
 metadataBase: new URL(siteUrl),
 openGraph: {
 title: "How to Crop e-Aadhar Card for Perfect PVC Printing",
 description:
 "Stop struggling with A4 paper alignment. Learn how to instantly auto-crop your e-Aadhar PDF to exact wallet dimensions.",
 url: `${siteUrl}/blog/how-to-crop-aadhar-card`,
 siteName: "SmartPDFs Plus",
 images: [
 {
 url: "/img/crop-aadhar-card.png",
 width: 1200,
 height: 630,
 alt: "Crop Aadhar Card to PVC Size Banner",
 },
 ],
 locale: "en_IN",
 type: "article",
 authors: ["SmartPDFs Plus Team"],
 publishedTime: "2026-05-20T00:00:00.000Z",
 modifiedTime: new Date().toISOString(),
 },
 twitter: {
 card: "summary_large_image",
 title: "How to Crop e-Aadhar Card for Perfect PVC Printing",
 description:
 "Stop struggling with A4 paper alignment. Learn how to instantly auto-crop your e-Aadhar PDF to exact wallet dimensions.",
 images: ["/img/crop-aadhar-card.png"],
 },
 category: "Special Tools",
 authors: [{ name: "SmartPDFs Plus Team", url: siteUrl }],
};

export default function CropAadharCardPost() {
 const breadcrumbItems = useMemo(
 () => [
 { label: "Blog", href: "/blog" },
 {
 label: "How to Crop Aadhar Card",
 href: "/blog/how-to-crop-aadhar-card",
 },
 ],
 [],
 );

 // Generate Article JSON-LD
 const articleSchema = {
 "@context": "https://schema.org",
 "@type": "Article",
 headline: metadata.title,
 description: metadata.description,
 image: "/img/crop-aadhar-card.png",
 author: {
 "@type": "Organization",
 name: "SmartPDFs Plus Team",
 url: siteUrl,
 },
 publisher: {
 "@type": "Organization",
 name: "SmartPDFs Plus",
 logo: {
 "@type": "ImageObject",
 url: `${siteUrl}/favicon.ico`,
 },
 },
 datePublished: "2026-05-20T00:00:00.000Z",
 dateModified: new Date().toISOString(),
 mainEntityOfPage: {
 "@type": "WebPage",
 "@id": `${siteUrl}/blog/how-to-crop-aadhar-card`,
 },
 };

 return (
 <main className="min-h-screen">
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
 />
 
 <ArticleSchema 
 title="How to Crop e-Aadhar Card for PVC Printing Online | SmartPDFs Plus" 
 description="Learn how to perfectly crop your downloaded e-Aadhar PDF file to exact PVC card dimensions (86mm x 54mm) for seamless printing without losing quality." 
 url={`${siteUrl}/blog/how-to-crop-aadhar-card`} 
 datePublished="2026-06-01T13:25:51.336Z" 
 />
 <BreadcrumbSchema items={breadcrumbItems} />
 <FAQSchema />
 <WebAppSchema
 name="Aadhar Card Cropper"
 description="Perfectly crop your downloaded e-Aadhar PDF to exact PVC card dimensions (86mm x 54mm) for seamless printing without losing quality."
 url="https://smartpdfpro.com/tool/aadhar-crop"
 />

 <article className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
 <nav aria-label="Breadcrumb navigation" className="mb-8">
 <Breadcrumbs items={breadcrumbItems} />

 <Link
 href="/blog"
 className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded p-1"
 aria-label="Navigate Back to Blog"
 >
 <ArrowLeft size={14} aria-hidden="true" /> Back to Blog
 </Link>
 </nav>

 <header className="mb-8">
 <div className="flex items-center gap-4 mb-6">
 <div
 className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
 aria-hidden="true"
 >
 <Wand2 size={22} />
 </div>
 <div>
 <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-2">
 How to Crop e-Aadhar Card for PVC Printing Online
 </h1>
 <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
 <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-red-600 border-2 border-red-500 px-2 py-0.5 rounded-full shadow-sm">
 Special
 </span>
 <span className="flex items-center gap-1">
 <Clock size={11} aria-hidden="true" /> 9 min read
 </span>
 <span>Last Updated: May 30, 2026</span>
 </div>
 </div>
 </div>

 <figure className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border border-slate-100 bg-slate-50">
 <Image
 src="/img/crop-aadhar-card.png"
 alt="Illustration showing an e-Aadhar PDF being cropped into standard wallet-size ID dimensions"
 width={1200}
 height={630}
 priority
 className="w-full h-auto object-cover"
 sizes="(max-width: 768px) 100vw, 768px"
 />
 <figcaption className="sr-only">
 Comprehensive guide to cropping Aadhar PDFs to standard ID card
 sizes.
 </figcaption>
 </figure>
 </header>

 <section
 className="prose prose-slate max-w-none space-y-8"
 aria-label="Article Content"
 >
 <p className="text-lg text-slate-600 leading-relaxed font-medium">
 Downloading an e-Aadhar from the official UIDAI portal is easy, but
 printing it is a nightmare. The official PDF is formatted as a full
 A4 page, with the actual wallet-sized identification card occupying
 only a small fraction of the space at the bottom. If you try to
 print this directly onto a PVC card or a standard photo printer, you
 will end up with a microscopic, illegible mess.
 </p>
 <p className="text-lg text-slate-600 leading-relaxed font-medium">
 In this guide, we will break down the exact millimeter dimensions
 required for standard CR80 PVC card printing, explain how automated
 bounding-box algorithms extract the card from the A4 sheet, and show
 you how to crop your e-Aadhar PDF securely in your browser without
 compromising your private data.
 </p>

 <aside
 className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm"
 aria-labelledby="toc-heading"
 >
 <h2
 id="toc-heading"
 className="font-bold text-red-900 text-lg mb-4 mt-0"
 >
 What You Will Learn
 </h2>
 <ul className="space-y-3 m-0 list-none p-0">
 {[
 "The exact CR80 physical dimensions (86mm x 54mm) required for PVC card printers.",
 "Why taking screenshots of your PDF destroys print resolution and DPI.",
 "How our automated PDF bounding-box algorithm flawlessly extracts the Front and Back sides.",
 "The critical security implications of using offline vs. online cropping tools.",
 "A step-by-step tutorial for preparing your Aadhar file for professional printing.",
 ].map((item, i) => (
 <li
 key={i}
 className="flex items-start gap-3 text-sm text-red-800 leading-relaxed"
 >
 <CheckCircle2
 size={16}
 className="text-red-500 shrink-0 mt-0.5"
 aria-hidden="true"
 />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 </aside>

 <section>
 <h2 className="text-2xl font-black text-slate-900 border-b pb-2">
 1. The Problem with the Official e-Aadhar PDF
 </h2>
 <p className="text-slate-600 leading-relaxed">
 When you download your e-Aadhar from UIDAI, you receive a
 password-protected PDF. The document spans a standard A4 page
 (210mm x 297mm). The top two-thirds contain instructional text,
 download details, and a massive QR code. Only the bottom third
 contains the actual ID card meant to be cut out.
 </p>
 <p className="text-slate-600 leading-relaxed">
 <strong>The Screenshot Fallacy:</strong> Many people attempt to
 solve this by taking a screenshot of the card on their phone and
 printing the image. This is a massive mistake. A screenshot is a
 low-resolution raster graphic (usually 72 to 96 DPI). When printed
 onto physical PVC, the text becomes heavily pixelated, and the
 all-important QR code becomes completely unscannable, rendering
 the card useless for official verification.
 </p>
 </section>

 <section>
 <h2 className="text-2xl font-black text-slate-900 border-b pb-2">
 2. Exact Dimensions for PVC Printing
 </h2>
 <p className="text-slate-600 leading-relaxed">
 To print a professional-looking ID card, you must format the
 document to the global CR80 standard. This is the exact same
 dimension used for credit cards, driver's licenses, and standard
 PVC printing trays (like those used in Epson or Canon inkjet
 printers).
 </p>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
 <div className="flex items-center gap-2 mb-2 text-slate-900">
 <Printer
 size={18}
 className="text-red-500"
 aria-hidden="true"
 />
 <h3 className="font-bold text-sm m-0">
 CR80 Physical Dimensions
 </h3>
 </div>
 <ul className="text-sm text-slate-600 leading-relaxed m-0 space-y-1">
 <li>
 <strong>Width:</strong> 85.6 mm (3.37 inches)
 </li>
 <li>
 <strong>Height:</strong> 53.98 mm (2.125 inches)
 </li>
 <li>
 <strong>Aspect Ratio:</strong> 1.586 : 1
 </li>
 </ul>
 </div>

 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
 <div className="flex items-center gap-2 mb-2 text-slate-900">
 <FileSearch
 size={18}
 className="text-red-500"
 aria-hidden="true"
 />
 <h3 className="font-bold text-sm m-0">
 Print Resolution (DPI)
 </h3>
 </div>
 <p className="text-sm text-slate-600 leading-relaxed m-0">
 To ensure the micro-printing and QR codes remain perfectly
 crisp, the cropped PDF must maintain a minimum of{""}
 <strong>300 DPI</strong> (Dots Per Inch).
 </p>
 </div>
 </div>

 <p className="text-slate-600 leading-relaxed mt-4">
 Our{""}
 <Link
 href="/tool/crop-aadhar"
 className="text-red-500 font-semibold hover:underline"
 >
 Aadhar Crop Tool
 </Link>{""}
 mathematically isolates the vector coordinates of the card within
 the A4 sheet. It doesn't rasterize the image; it simply moves the
 PDF's <code>CropBox</code> and <code>MediaBox</code> boundaries to
 perfectly encase the 86x54mm area, preserving 100% of the original
 vector quality.
 </p>
 </section>

 <section>
 <h2 className="text-2xl font-black text-slate-900 border-b pb-2">
 3. The Security Imperative: Local Processing
 </h2>
 <p className="text-slate-600 leading-relaxed">
 Your Aadhar card contains your name, date of birth, address, and
 biometric-linked identification number. It is arguably the most
 sensitive document you possess.
 </p>

 <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl my-6 flex gap-4">
 <ShieldCheck
 size={24}
 className="text-red-500 shrink-0"
 aria-hidden="true"
 />
 <div>
 <h3 className="font-bold text-red-900 text-base mt-0 mb-1">
 Zero-Knowledge Architecture
 </h3>
 <p className="text-sm text-red-800 leading-relaxed m-0">
 You should <strong>never</strong> upload an unlocked Aadhar
 PDF to a random server on the internet. SmartPDFs Plus
 processes your Aadhar file entirely within your web browser
 using WebAssembly. The file is cropped utilizing your device's
 RAM and CPU. The document never leaves your computer, ensuring
 absolute privacy and zero risk of data interception.
 </p>
 </div>
 </div>
 </section>

 <section>
 <h2 className="text-2xl font-black text-slate-900 border-b pb-2">
 4. Step-by-Step: How to Crop Your Aadhar PDF
 </h2>
 <p className="text-slate-600 leading-relaxed">
 Preparing your e-Aadhar for PVC printing takes less than 5
 seconds. Here is the exact workflow:
 </p>

 <ol className="space-y-4 my-6 list-none p-0">
 {[
 {
 title: "Remove the Password First",
 desc: "UIDAI locks the e-Aadhar with a password (usually the first 4 letters of your name in caps + your birth year, e.g., SURE1990). You must first unlock the PDF on your computer before the crop tool can read the vector boundaries.",
 },
 {
 title: "Upload to the Cropper",
 desc: "Drag and drop your unlocked A4 e-Aadhar PDF into the SmartPDFs Aadhar Crop Tool.",
 },
 {
 title: "Automated Extraction",
 desc: "The tool automatically detects the front and back panels of the ID card at the bottom of the page. It splits these into two perfectly proportioned 86x54mm pages.",
 },
 {
 title: "Download and Print",
 desc: "Download the finalized PDF. You can now feed this file directly into any PVC ID card printer, or place it into a Word document to print on glossy photo paper without manually resizing it.",
 },
 ].map((step, i) => (
 <li
 key={i}
 className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm"
 >
 <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
 {i + 1}
 </div>
 <div>
 <h3 className="font-bold text-slate-900 text-base m-0">
 {step.title}
 </h3>
 <p className="text-sm text-slate-600 leading-relaxed mt-1 mb-0">
 {step.desc}
 </p>
 </div>
 </li>
 ))}
 </ol>
 </section>

 <section>
 <h2 className="text-2xl font-black text-slate-900 border-b pb-2">
 Frequently Asked Questions
 </h2>
 <div
 className="space-y-4 my-6"
 itemScope
 itemType="https://schema.org/FAQPage"
 >
 {[
 {
 q: "Will cropping the PDF degrade the QR Code?",
 a: "No. Because our tool adjusts the PDF bounding boxes rather than rasterizing the file into an image, the QR code remains in its original vector format. It will scan perfectly on any UIDAI scanner app.",
 },
 {
 q: "Why is the tool asking for a password?",
 a: "The official e-Aadhar PDF is encrypted by the government. The cropping algorithm cannot read the layout of an encrypted file. You must unlock it with your UIDAI password first.",
 },
 {
 q: "Can I print the cropped file on normal A4 paper?",
 a: 'Yes. If you print the cropped 86x54mm PDF onto A4 paper, ensure your printer settings are set to "Actual Size" rather than "Fit to Page". You can then cut it out manually.',
 },
 {
 q: "Is my Aadhar data stored on your servers?",
 a: "Never. SmartPDFs Plus runs entirely in your browser. Disconnect from the internet after loading the tool if you want to verify—it will still work perfectly because no data is sent to the cloud.",
 },
 ].map(({ q, a }, i) => (
 <div
 key={i}
 className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-red-200 transition-colors"
 itemScope
 itemProp="mainEntity"
 itemType="https://schema.org/Question"
 >
 <h3
 className="font-bold text-slate-900 text-base mb-2 mt-0"
 itemProp="name"
 >
 {q}
 </h3>
 <div
 itemScope
 itemProp="acceptedAnswer"
 itemType="https://schema.org/Answer"
 >
 <p
 className="text-sm text-slate-600 leading-relaxed m-0"
 itemProp="text"
 >
 {a}
 </p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Call to Action */}
 <section className="bg-gradient-to-br from-white to-red-50/30 border-2 border-red-500 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow mt-10">
 <h2 className="font-black text-2xl text-slate-900 mt-0 mb-3">
 Ready to Crop Your e-Aadhar?
 </h2>
 <p className="text-slate-600 mb-6 text-sm">
 Instantly format your ID card for perfect PVC printing right in
 your web browser. 100% secure, offline-processing.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/tool/crop-aadhar"
 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
 aria-label="Crop Aadhar PDF Tool"
 >
 <Wand2 size={16} aria-hidden="true" />
 Crop e-Aadhar Now
 </Link>
 <Link
 href="/tool/unlock"
 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 rounded-xl font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
 aria-label="Unlock PDF Tool (Prerequisite)"
 >
 Unlock PDF First
 </Link>
 </div>
 </section>
 </section>
 </article>
 </main>
 );
}
