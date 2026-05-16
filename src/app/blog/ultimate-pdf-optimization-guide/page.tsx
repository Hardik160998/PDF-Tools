import { Zap, Clock, ArrowRight, CheckCircle2, ArrowLeft, Settings, Shield } from 'lucide-react';

export default function PdfOptimizationGuidePost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Zap size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              The Ultimate Guide to PDF Optimization — Size, Speed & Repair
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Guide</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 5 min read</span>
              <span>May 4, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="Ultimate PDF Optimization Guide" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Are your PDF files too large to email? Or are they loading slowly on your website? Our suite of PDF optimization tools helps you shrink file sizes, repair corrupted documents, and clean up metadata.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <p className="font-black text-amber-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to compress PDFs without losing visible quality',
                'How to fix corrupted or broken PDF files',
                'Understanding and editing PDF metadata for privacy',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-amber-700"><CheckCircle2 size={13} className="text-amber-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Optimization Tools Explained</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            We offer several specialized tools in the "Optimize" category to keep your files in perfect shape:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Compress PDF', desc: 'Reduces the file size of your PDF by optimizing images and fonts. Perfect for email attachments.' },
              { title: 'Repair PDF', desc: 'Fixes broken files that refuse to open due to corrupted data or incomplete downloads.' },
              { title: 'Edit Metadata', desc: 'View and change author names, creation dates, and other hidden data in your PDF.' },
              { title: 'Optimize (Clean Up)', desc: 'Removes unnecessary data, empty objects, and unreferenced streams to slim down the file.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={14} className="text-amber-500" />
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Why Do PDF Files Get So Big?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Have you ever wondered why a simple text document can sometimes result in a 50MB PDF file? Here are the most common culprits:
          </p>
          <div className="space-y-3 my-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">High-Resolution Images</p>
              <p className="text-xs text-slate-500 leading-relaxed">If you insert photos directly from a camera or smartphone into a document, they may be saved at full resolution (e.g., 4000x3000 pixels) even if they only appear small on the page.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">Embedded Fonts</p>
              <p className="text-xs text-slate-500 leading-relaxed">To ensure your document looks the same on every computer, PDF creators often embed the entire font file. If you use many different fonts, this can add several megabytes.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">Unused Data & Streams</p>
              <p className="text-xs text-slate-500 leading-relaxed">When documents are edited multiple times, some PDF creators leave old data or empty objects in the file structure.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Features & Settings</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            When using our optimization tools, you have control over various settings:
          </p>
          <div className="grid grid-cols-1 gap-3 my-4">
            {[
              { title: 'Compression Levels', desc: 'Choose between Low (best quality), Medium (balanced), and High (smallest size) compression.' },
              { title: 'Image Downsampling', desc: 'Optionally reduce the resolution of high-DPI images to save space.' },
              { title: 'Font Subsetting', desc: 'Only include the characters used in the document rather than the full font file.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Common Use Cases</h2>
          <div className="space-y-3 my-4">
            {[
              { title: 'Email Attachments', desc: 'Shrink a 20MB PDF to under 5MB so it can pass through email file size limits.' },
              { title: 'Web Optimization', desc: 'Optimize PDFs before uploading them to your website so they download instantly for users.' },
              { title: 'Privacy Protection', desc: 'Remove metadata containing your real name and computer details before publishing documents.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Will I lose text quality when compressing?', a: 'No. Text and vector graphics are preserved perfectly. Only images may be compressed depending on the level you choose.' },
              { q: 'Can any broken PDF be repaired?', a: 'Most files with minor corruption can be fixed. However, if the file is completely empty or encrypted without a password, repair may not be possible.' },
              { q: 'Is it safe to edit metadata?', a: 'Yes. Editing metadata does not affect the visible content of the PDF. It only changes the hidden properties.' }
            ].map(({ q, a }, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{q}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-white border-2 border-orange-500 rounded-2xl p-6 text-center text-slate-900 space-y-3 mb-6 shadow-sm hover:shadow-xl transition-all duration-300">
            <div>
              <p className="font-black text-slate-900">Ready to optimize your PDFs?</p>
              <p className="text-xs text-slate-500 mt-1">Try our fast, browser-based optimization tools.</p>
            </div>
            <a href="/tool/optimize-pdf" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open PDF Optimizer <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
