import { Combine, Clock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function MergePDFPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Combine size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              How to Merge Multiple PDFs into One File (Free & Easy)
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border-2 border-red-500 px-2 py-0.5 rounded-full shadow-sm">Organize</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 3 min read</span>
              <span>Apr 20, 2026</span>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="How to Merge Multiple PDFs" className="w-full h-auto" />
        </div>
        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Need to combine several PDF files into one? SmartPDFs Plus makes it instant — no software, no sign-up, completely free.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <p className="font-black text-orange-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {['How to merge PDFs in your browser', 'How to reorder files before merging', 'Tips for best merge results'].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-orange-700"><CheckCircle2 size={13} className="text-orange-500" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Why Merge PDFs?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">Merging PDFs is one of the most common document tasks. Whether you're combining chapters of a report, joining scanned pages, or assembling a portfolio — having one unified PDF is cleaner and easier to share.</p>

          <h2 className="text-xl font-black text-slate-900">Common Use Cases for Merging PDFs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Annual Reports', desc: 'Combine monthly financial statements or reports into a single annual document.' },
              { title: 'Assembling Portfolios', desc: 'Join your resume, cover letter, and work samples into one professional file.' },
              { title: 'Scanned Documents', desc: 'Merge separate scans of pages into a single continuous book or document.' },
              { title: 'Project Documentation', desc: 'Combine project plans, requirements, and designs for easy sharing.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: Merge PDFs with SmartPDFs Plus</h2>
          {[
            { step: '1', title: 'Open the Merge PDF Tool', desc: 'Go to smartpdfs.com and click "Merge PDF" from the homepage or navigation.' },
            { step: '2', title: 'Upload Your PDF Files', desc: 'Click "Select PDF Files" or drag and drop your PDFs into the upload area. You can add as many files as you need.' },
            { step: '3', title: 'Reorder Files (Optional)', desc: 'Drag the grip handle on each file row to reorder them. The files will be merged in the order shown — top to bottom.' },
            { step: '4', title: 'Click "Merge PDF"', desc: 'Hit the orange "Merge PDF" button. Processing happens instantly in your browser — no upload to any server.' },
            { step: '5', title: 'Download Your Merged PDF', desc: 'Click "Download" to save your combined PDF. The file is named "merged.pdf" by default.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Pro Tips</h2>
          <ul className="space-y-2 mb-6">
            {[
              'Add files one by one or select multiple at once using Ctrl+Click (Windows) or Cmd+Click (Mac)',
              'Remove a file by clicking the red X button on its row',
              'There\'s no limit on the number of files you can merge',
              'Your files never leave your browser — 100% private',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
                <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />{tip}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Is there a file size limit for merging?', a: 'No, there is no hard limit on file size because processing happens locally in your browser. However, very large files may slow down your browser depending on your device ram.' },
              { q: 'Can I merge password-protected PDFs?', a: 'Yes, but you must know the password to unlock them first before they can be merged. The tool will prompt you if a file is locked.' },
              { q: 'Will merging reduce the quality of my PDFs?', a: 'No. The tool combines the files without re-encoding images or stripping data, so the quality remains exactly the same as the original files.' }
            ].map(({ q, a }, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{q}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border-2 border-orange-500 rounded-2xl p-6 text-center text-slate-900 space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
            <div>
              <p className="font-black text-slate-900">Ready to merge your PDFs?</p>
              <p className="text-xs text-slate-500 mt-1">Combine multiple files into one seamless document in seconds.</p>
            </div>
            <a href="/tool/merge" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open Merge PDF Tool <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
