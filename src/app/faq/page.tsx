'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Zap, FileText, Settings, CreditCard, Smartphone, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'general',
    label: 'General',
    icon: HelpCircle,
    color: 'bg-blue-500',
    faqs: [
      {
        q: 'What is SmartPDFs Plus?',
        a: 'SmartPDFs Plus is a free, browser-based PDF toolkit with 22+ tools. You can merge, split, compress, convert, organize, watermark, protect, and repair PDF files — all without installing any software or creating an account.',
      },
      {
        q: 'Is SmartPDFs Plus completely free?',
        a: 'Yes! All client-side tools (Merge, Split, Compress, Organize, Watermark, Page Numbers, Edit Metadata, PDF to JPG, JPG to PDF, PDF to Text, PDF to XML, Unlock, Protect, Aadhar Cropper) are 100% free with no sign-up required. Server-side tools (Word/Excel/PowerPoint conversions, Repair PDF) are also free but require an internet connection.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No account is needed for any tool. Just open the tool page, upload your file, and download the result. It\'s that simple.',
      },
      {
        q: 'What browsers are supported?',
        a: 'SmartPDFs Plus works on all modern browsers — Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend Chrome or Edge for the best performance. Internet Explorer is not supported.',
      },
      {
        q: 'Can I use SmartPDFs Plus on mobile?',
        a: 'Yes! SmartPDFs Plus is fully responsive and optimized for mobile. All tools work on iOS (Safari, Chrome) and Android (Chrome, Firefox). The Organize PDF tool even supports touch drag-and-drop for reordering pages.',
      },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: Shield,
    color: 'bg-green-500',
    faqs: [
      {
        q: 'Are my files safe and private?',
        a: 'Absolutely. Client-side tools (Merge, Split, Compress, Organize, Watermark, etc.) process your files entirely in your browser using JavaScript — your files never leave your device and are never uploaded to any server.',
      },
      {
        q: 'Which tools upload files to a server?',
        a: 'Only server-side tools require file upload: Word to PDF, PDF to Word, Excel to PDF, PDF to Excel, PowerPoint to PDF, PDF to PowerPoint, HTML to PDF, and Repair PDF. These use ConvertAPI for processing. Files are transmitted over encrypted HTTPS and deleted immediately after processing.',
      },
      {
        q: 'Do you store or read my PDF files?',
        a: 'No. For client-side tools, files never leave your browser. For server-side tools, files are processed and automatically deleted within 1 hour. We do not read, analyze, or retain any file content.',
      },
      {
        q: 'Is the Aadhar PDF safe to upload?',
        a: 'Yes. The Aadhar Cropper tool is 100% client-side — your Aadhar PDF is processed entirely in your browser and never uploaded to any server. Your personal data stays on your device.',
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Features',
    icon: Zap,
    color: 'bg-orange-500',
    faqs: [
      {
        q: 'How do I merge multiple PDFs?',
        a: 'Go to Merge PDF → click "Select PDF Files" to upload multiple files → drag to reorder them if needed → click "Merge PDF" → download the combined file. You can add as many files as you want.',
      },
      {
        q: 'How do I split a PDF into parts?',
        a: 'Go to Split PDF → upload your PDF → choose "Divide in Parts" (split into 2, 3, or 4 equal parts) or "Extract All Pages" (each page becomes a separate PDF) → click "Split PDF" → download the ZIP file containing all parts.',
      },
      {
        q: 'How does the Organize PDF tool work?',
        a: 'Go to Organize PDF → upload one or more PDFs → thumbnails of all pages appear → drag and drop pages to reorder them → use the rotate button on each page to rotate 90° → delete unwanted pages → click "Organize PDF" to download the reorganized document.',
      },
      {
        q: 'Can I compress a PDF without losing quality?',
        a: 'Our Compress PDF tool uses object stream optimization and metadata stripping to reduce file size. Results vary by file — text-heavy PDFs compress well, while image-heavy PDFs may see smaller reductions. The visual quality of content is preserved.',
      },
      {
        q: 'How do I add a watermark to a PDF?',
        a: 'Go to Watermark → upload your PDF → choose "Text" (type your watermark text like "CONFIDENTIAL") or "Image" (upload a logo PNG/JPG) → click "Apply Watermark" → download the watermarked PDF. The watermark is centered on every page.',
      },
      {
        q: 'How do I convert Word/Excel/PowerPoint to PDF?',
        a: 'Go to the respective tool (e.g., Word to PDF) → upload your file → click "Convert" → download the PDF. These tools require an internet connection as they use our cloud conversion service. Supported formats: .docx, .xlsx, .pptx, .html.',
      },
      {
        q: 'What is the Aadhar Cropper tool?',
        a: 'The Aadhar Cropper is a specialized tool for Indian users. Upload your e-Aadhar PDF → crop the front side of the card → crop the back side → download a print-ready A4 PDF with both sides formatted to standard ID card dimensions (86mm × 54mm). Everything runs in your browser — completely private.',
      },
      {
        q: 'How do I unlock a password-protected PDF?',
        a: 'Go to Unlock PDF → upload your encrypted PDF → enter the current password → click "Unlock PDF" → download the unlocked version. Note: You must know the password — this tool removes protection from PDFs you own.',
      },
    ],
  },
  {
    id: 'files',
    label: 'File Formats & Limits',
    icon: FileText,
    color: 'bg-purple-500',
    faqs: [
      {
        q: 'What file formats does SmartPDFs support?',
        a: 'Input: PDF, DOCX, XLSX, PPTX, HTML, JPG, PNG, JPEG. Output: PDF, DOCX, XLSX, PPTX, JPG, TXT, XML, ZIP. The primary format is PDF — most tools work with PDF as both input and output.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'Client-side tools: No hard limit — depends on your device\'s RAM. Most modern devices handle PDFs up to 200–500MB easily. Server-side tools (Office conversions, Repair): 100MB per file limit.',
      },
      {
        q: 'How many files can I process at once?',
        a: 'Merge PDF: Unlimited files. Organize PDF: Unlimited files (all pages shown as thumbnails). Repair PDF: Multiple files at once. Split PDF: One file at a time. JPG to PDF: Multiple images at once.',
      },
      {
        q: 'Can I process password-protected PDFs?',
        a: 'Most tools require the PDF to be unlocked first. Use the Unlock PDF tool to remove the password, then use any other tool. The Unlock PDF tool itself accepts encrypted PDFs — just provide the password.',
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical',
    icon: Settings,
    color: 'bg-slate-600',
    faqs: [
      {
        q: 'What technology powers SmartPDFs Plus?',
        a: 'SmartPDFs Plus is built with Next.js 16, React, and TypeScript. Client-side PDF processing uses pdf-lib (for creating/editing PDFs) and PDF.js (for rendering/reading PDFs). Office conversions use ConvertAPI. The UI is styled with Tailwind CSS.',
      },
      {
        q: 'Why does the page show a loading skeleton?',
        a: 'Each tool page loads its JavaScript bundle on demand (lazy loading). The skeleton/shimmer animation shows while the tool is loading — this keeps the initial page load fast. It typically takes less than 1 second.',
      },
      {
        q: 'The tool is not working. What should I do?',
        a: 'Try these steps: 1) Refresh the page. 2) Try a different browser (Chrome recommended). 3) Check if your PDF is password-protected (unlock it first). 4) For large files, try a smaller file first. 5) If the issue persists, contact us at support@smartpdfs.com.',
      },
      {
        q: 'Does SmartPDFs work offline?',
        a: 'Client-side tools (Merge, Split, Compress, Organize, Watermark, etc.) work offline once the page is loaded — no internet needed for processing. Server-side tools (Office conversions, Repair) require an active internet connection.',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory)!;
  const totalFaqs = CATEGORIES.reduce((sum, c) => sum + c.faqs.length, 0);

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-black uppercase tracking-widest mb-6">
          <HelpCircle size={13} /> Frequently Asked Questions
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Got Questions?<br />We Have Answers.
        </h1>
        <p className="text-lg text-slate-500 mb-2">
          {totalFaqs} answers covering everything about SmartPDFs Plus.
        </p>
      </section>

      {/* Category tabs + FAQ */}
      <section className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Category sidebar */}
          <div className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {CATEGORIES.map(({ id, label, icon: Icon, color, faqs }) => (
                <button
                  key={id}
                  onClick={() => { setActiveCategory(id); setOpenIndex(0); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all whitespace-nowrap lg:whitespace-normal w-full ${
                    activeCategory === id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 ${activeCategory === id ? 'bg-white/20' : color} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon size={13} className={activeCategory === id ? 'text-white' : 'text-white'} />
                  </div>
                  <span className="text-xs font-black">{label}</span>
                  <span className={`ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                    activeCategory === id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {faqs.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ accordion */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 ${currentCategory.color} rounded-xl flex items-center justify-center text-white`}>
                <currentCategory.icon size={16} />
              </div>
              <h2 className="font-black text-slate-900 text-lg">{currentCategory.label}</h2>
              <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {currentCategory.faqs.length} questions
              </span>
            </div>

            {currentCategory.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-start justify-between p-5 text-left gap-4"
                >
                  <span className={`font-bold text-sm leading-snug ${openIndex === i ? 'text-red-500' : 'text-slate-900'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 mt-0.5 transition-transform duration-200 ${openIndex === i ? 'rotate-180 text-red-400' : ''}`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white space-y-4">
          <HelpCircle size={32} className="mx-auto text-slate-400" />
          <h3 className="text-xl font-black">Still have questions?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Can't find what you're looking for? Our support team is happy to help. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all">
              Contact Support <ArrowRight size={14} />
            </a>
            <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-sm transition-all border border-white/20">
              Explore Tools
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
