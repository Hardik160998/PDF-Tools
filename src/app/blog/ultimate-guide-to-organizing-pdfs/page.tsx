import { LayoutGrid, Clock, ArrowRight, CheckCircle2, ArrowLeft, Settings, Combine, Scissors, Trash2, FileText } from 'lucide-react';

export default function GuideToOrganizingPdfsPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><LayoutGrid size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              The Ultimate Guide to Organizing PDFs — Merge, Split & Rearrange
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Guide</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 5 min read</span>
              <span>May 5, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="Ultimate Guide to Organizing PDFs" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Do you have multiple PDFs that need to be combined? Or a large document that needs to be split into separate files? Our suite of PDF organization tools gives you full control over your document structure.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <p className="font-black text-purple-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to merge multiple PDFs into one file',
                'How to split a PDF into separate pages or files',
                'How to rearrange, rotate, and delete pages visually',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-purple-700"><CheckCircle2 size={13} className="text-purple-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Organization Tools Explained</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            We offer several specialized tools in the "Organize" category to help you manage your documents:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Merge PDF', desc: 'Combine multiple PDF files into a single document in any order you choose.' },
              { title: 'Split PDF', desc: 'Divide a large PDF into separate files by page ranges or extract all pages.' },
              { title: 'Organize PDF', desc: 'Rearrange, rotate, and delete pages visually using drag-and-drop thumbnails.' },
              { title: 'Delete Pages', desc: 'Quickly remove unwanted pages from your document without full reorganization.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={14} className="text-purple-500" />
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Features & Settings</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our organization tools are packed with features to save you time:
          </p>
          <div className="grid grid-cols-1 gap-3 my-4">
            {[
              { title: 'Visual Thumbnails', desc: 'See a preview of every page before you merge, split, or rearrange.' },
              { title: 'Drag & Drop', desc: 'Easily change the order of pages or files by dragging them into position.' },
              { title: 'Custom Page Ranges', desc: 'Specify exactly which pages to extract or split (e.g., 1-5, 8, 11-13).' }
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
              { title: 'Combining Reports', desc: 'Merge monthly reports from different departments into one annual file.' },
              { title: 'Extracting Chapters', desc: 'Split a textbook PDF to extract only the chapter you need to study.' },
              { title: 'Cleaning Up Scans', desc: 'Delete blank pages and rotate sideways pages after scanning a document.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Mastering Page Ranges for Splitting</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            When splitting a large PDF, you don't have to extract pages one by one. Our tool supports advanced page range selection:
          </p>
          <div className="space-y-3 my-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">Specific Pages</p>
              <p className="text-xs text-slate-500 leading-relaxed">Enter `1,3,5` to extract only pages 1, 3, and 5 into a new document.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">Ranges</p>
              <p className="text-xs text-slate-500 leading-relaxed">Enter `5-10` to extract all pages from page 5 to page 10 inclusive.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">Combinations</p>
              <p className="text-xs text-slate-500 leading-relaxed">You can mix them! Enter `1,3,5-10` to get pages 1, 3, and the range from 5 to 10.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Will merging PDFs affect the quality?', a: 'No. Merging combines the files without altering the content or compressing images, so quality remains the same.' },
              { q: 'Can I split password-protected PDFs?', a: 'You must unlock the PDF first using our Unlock tool before you can split or organize its pages.' },
              { q: 'Is there a limit to how many files I can merge?', a: 'No strict limit, but merging dozens of very large files may slow down your browser depending on your device.' }
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
              <p className="font-black text-slate-900">Ready to organize your PDFs?</p>
              <p className="text-xs text-slate-500 mt-1">Try our fast, browser-based organization tools.</p>
            </div>
            <a href="/blog/organize-pdf-pages" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Explore Organize Tools <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
