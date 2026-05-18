import { FileText, Clock, ArrowRight, CheckCircle2, ArrowLeft, Settings, PenTool } from 'lucide-react';

export default function ESignPdfPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><PenTool size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              How to E-Sign PDF — Sign Documents Electronically
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border-2 border-red-500 px-2 py-0.5 rounded-full shadow-sm">Sign</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 4 min read</span>
              <span>May 3, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="How to E-Sign PDF" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Need to sign a contract, lease agreement, or tax form? Our E-Sign PDF tool allows you to add secure, legally-binding electronic signatures to your documents in seconds.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
            <p className="font-black text-violet-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to draw, type, or upload your signature',
                'How to place and resize your signature on the document',
                'Understanding the security of in-browser signing',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-violet-700"><CheckCircle2 size={13} className="text-violet-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Features & Settings Explained</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our E-Sign tool provides multiple ways to sign your documents:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Draw Signature', desc: 'Use your mouse, trackpad, or stylus to draw a natural-looking signature.' },
              { title: 'Type to Sign', desc: 'Type your name and choose from several professional cursive fonts.' },
              { title: 'Upload Image', desc: 'Upload a photo of your physical signature on paper for maximum authenticity.' },
              { title: 'Color & Thickness', desc: 'Adjust the pen color (Black, Blue, Red) and thickness to match your style.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={14} className="text-violet-500" />
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: How to E-Sign a PDF</h2>
          {[
            { step: '1', title: 'Upload PDF', desc: 'Drag and drop your PDF file into the signing area.' },
            { step: '2', title: 'Create Signature', desc: 'Choose to draw, type, or upload your signature.' },
            { step: '3', title: 'Place on Document', desc: 'Drag your signature to the correct line and resize it as needed.' },
            { step: '4', title: 'Save and Download', desc: 'Click "Finish" to apply the signature and download your signed PDF.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Common Use Cases</h2>
          <div className="space-y-3 my-4">
            {[
              { title: 'Business Contracts', desc: 'Sign vendor agreements, NDAs, and sales contracts instantly.' },
              { title: 'Real Estate', desc: 'Sign lease agreements, offer letters, and property documents.' },
              { title: 'HR Documents', desc: 'Sign offer letters, tax forms (W-9, etc.), and employee handbooks.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Why In-Browser Signing is the Safest Option</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            When you use other online signing services, you have to upload your sensitive contracts to their servers. This creates a risk of data breaches and unauthorized access.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex gap-3 my-4">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-emerald-800 text-sm">100% Local Processing</p>
              <p className="text-sm text-emerald-700 mt-1">Our E-Sign tool works entirely inside your browser. Your document never leaves your device, and your signature is never stored on any server. It's the digital equivalent of signing a paper on your own desk.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">How to Add Dates and Text Alongside Your Signature</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Often, a signature isn't enough. You may also need to add the date of signing or your printed name. Here is how to do it:
          </p>
          <div className="space-y-3 my-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">1. Select the Text Tool</p>
              <p className="text-xs text-slate-500 leading-relaxed">Click on the "Add Text" icon in the toolbar.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">2. Click and Type</p>
              <p className="text-xs text-slate-500 leading-relaxed">Click on the document where you need to add the date or name. A text box will appear for you to type in.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">3. Move and Resize</p>
              <p className="text-xs text-slate-500 leading-relaxed">Drag the text box to align it perfectly with your signature.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Are electronic signatures legally binding?', a: 'Yes, in most countries (including the US with the ESIGN Act and Europe with eIDAS), electronic signatures are as legally binding as pen-and-ink signatures.' },
              { q: 'Is my document secure?', a: 'Yes. All signing happens locally in your browser. Your document is never uploaded to our servers, ensuring maximum privacy.' },
              { q: 'Can I add text like dates or my printed name?', a: 'Yes, our tool allows you to add text boxes alongside your signature for dates and names.' }
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
              <p className="font-black text-slate-900">Ready to sign your document?</p>
              <p className="text-xs text-slate-500 mt-1">Add your signature securely in seconds.</p>
            </div>
            <a href="/tool/esign-pdf" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open E-Sign PDF Tool <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
