import { Wand2, Clock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AadharCropPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Wand2 size={22} /></div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2 py-1 rounded-full">Tutorial</span>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Clock size={11} /> 3 min read</span>
              <span>Apr 8, 2026</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-4 leading-tight">
          How to Crop Aadhar Card for Printing — Free Online Tool
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Got your e-Aadhar PDF but need a properly cropped, print-ready version? SmartPDFs Plus lets you crop both sides of your Aadhar card to standard ID dimensions — entirely in your browser, with zero uploads.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">

          {/* What you'll learn */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <p className="font-black text-red-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to crop your e-Aadhar PDF to standard ID card size',
                'How to get a print-ready A4 PDF with front & back',
                'Why this tool is 100% private and safe for Aadhar data',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-red-700"><CheckCircle2 size={13} className="text-red-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Why Crop Your Aadhar Card?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            When you download your e-Aadhar from the UIDAI website, it comes as a full A4 PDF page. If you need to print it as a standard ID card (86mm × 54mm — the size of a credit card), you need to crop it precisely. Printing the full A4 page wastes paper and the card ends up too small to be useful.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            The SmartPDFs Plus Aadhar Cropper tool handles this automatically — crop the front side, crop the back side, and download a perfectly formatted A4 PDF with both sides ready for high-quality printing.
          </p>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: Crop Aadhar Card with SmartPDFs Plus</h2>
          {[
            { step: '1', title: 'Open the Aadhar Cropper Tool', desc: 'Go to SmartPDFs Plus and click "Aadhar Cropper" from the homepage or navigate to /tool/aadhar-crop.' },
            { step: '2', title: 'Upload Your e-Aadhar PDF', desc: 'Click the upload area or drag and drop your e-Aadhar PDF. The tool also supports JPG and PNG images. Your file is processed entirely in your browser — it never leaves your device.' },
            { step: '3', title: 'Crop the Front Side', desc: 'A visual cropper appears showing the first page of your Aadhar PDF. Drag and resize the crop box to perfectly frame the front side of your Aadhar card. Use the zoom slider to get a precise crop.' },
            { step: '4', title: 'Click "Next" to Crop the Back Side', desc: 'After cropping the front, click "Next". The cropper now shows the second page (or the same page if your Aadhar is single-sided). Crop the back side of the card.' },
            { step: '5', title: 'Click "Finalize" and Download', desc: 'Click "Finalize" to generate your print-ready PDF. Download the A4 PDF — it contains both sides of your Aadhar card formatted to standard 86mm × 54mm ID card dimensions.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Is It Safe to Use for Aadhar?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Yes — completely. The Aadhar Cropper is a 100% client-side tool. This means all processing happens inside your browser using JavaScript. Your Aadhar PDF is never uploaded to any server, never stored, and never transmitted over the internet. Your personal data stays on your device at all times.
          </p>

          {/* Privacy highlight */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex gap-3">
            <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-green-800 text-sm">100% Private — No Upload Required</p>
              <p className="text-sm text-green-700 mt-1">Your Aadhar data never leaves your browser. SmartPDFs Plus processes everything locally using JavaScript — no server, no storage, no risk.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Print Tips for Best Results</h2>
          <ul className="space-y-2">
            {[
              'Print on A4 paper at 100% scale (do not "fit to page") for accurate 86mm × 54mm dimensions',
              'Use a laser printer or high-quality inkjet for sharp text and photo quality',
              'After printing, cut along the card outlines with scissors or a paper cutter',
              'Laminate the printed cards for durability — most print shops offer this service',
              'The tool supports both single-page Aadhar PDFs (front only) and two-page PDFs (front + back)',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
                <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />{tip}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-black text-slate-900">Supported File Formats</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            The Aadhar Cropper supports the following input formats:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { fmt: 'PDF', desc: 'e-Aadhar PDF from UIDAI', color: 'bg-red-50 border-red-100 text-red-700' },
              { fmt: 'JPG', desc: 'Scanned Aadhar image', color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
              { fmt: 'PNG', desc: 'Screenshot or photo', color: 'bg-blue-50 border-blue-100 text-blue-700' },
            ].map(({ fmt, desc, color }) => (
              <div key={fmt} className={`rounded-xl p-3 border text-center ${color}`}>
                <p className="font-black text-base">{fmt}</p>
                <p className="text-xs mt-0.5 opacity-80">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-slate-900 rounded-2xl p-6 text-center text-white space-y-3">
            <p className="font-black">Ready to crop your Aadhar card?</p>
            <a href="/tool/aadhar-crop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all">
              Open Aadhar Cropper Tool <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
