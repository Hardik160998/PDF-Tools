'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  { q: 'Is SmartPDFs Plus completely free?', a: 'Yes! All client-side tools (Merge, Split, Compress, Organize, Watermark, etc.) are 100% free with no sign-up required. Some server-side tools (Office conversions, Repair) use our API and are also free to use.' },
  { q: 'Are my files safe and private?', a: 'Absolutely. Client-side tools process your files entirely in your browser — your files never leave your device. For server-side tools, files are transmitted over encrypted HTTPS and deleted immediately after processing.' },
  { q: 'Do I need to create an account?', a: 'No account is needed for any of our tools. Just visit the tool page, upload your file, and download the result.' },
  { q: 'What file formats are supported?', a: 'We support PDF as the primary format. For conversions, we support DOCX, XLSX, PPTX, HTML, JPG, and PNG. More formats are being added regularly.' },
  { q: 'Is there a file size limit?', a: 'For client-side tools, the limit depends on your device\'s memory — most modern devices handle files up to 500MB easily. Server-side tools have a 100MB limit per file.' },
  { q: 'Can I use SmartPDFs Plus on mobile?', a: 'Yes! SmartPDFs Plus is fully responsive and works on all modern mobile browsers including Chrome, Safari, and Firefox on iOS and Android.' },
  { q: 'How do I merge multiple PDFs?', a: 'Go to the Merge PDF tool, click "Select PDF Files" to upload multiple files, arrange them in the order you want, then click "Merge PDF" to download the combined file.' },
  { q: 'Can I compress a PDF without losing quality?', a: 'Our Compress PDF tool uses object stream optimization and metadata stripping to reduce file size while maintaining visual quality. Results vary by file content.' },
  { q: 'What browsers are supported?', a: 'SmartPDFs Plus works on all modern browsers: Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend Chrome for the best experience.' },
  { q: 'How do I contact support?', a: 'You can reach us at support@smartpdfs.com. We typically respond within 24 hours on business days.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-black uppercase tracking-widest mb-6">
          <HelpCircle size={13} /> Frequently Asked Questions
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          Got Questions? We Have Answers.
        </h1>
        <p className="text-lg text-slate-500">Everything you need to know about SmartPDFs Plus.</p>
      </section>

      {/* FAQ List */}
      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-600 font-medium mb-3">Still have questions?</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all">
            Contact Us →
          </a>
        </div>
      </section>
    </div>
  );
}
