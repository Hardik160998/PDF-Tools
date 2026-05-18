import { Shield, Clock, ArrowRight, CheckCircle2, ArrowLeft, Settings } from 'lucide-react';

export default function RedactPdfPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Shield size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              How to Redact PDF — Hide Sensitive Information Securely
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border-2 border-red-500 px-2 py-0.5 rounded-full shadow-sm">Security</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 4 min read</span>
              <span>May 1, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/redact-pdf.png" alt="How to Redact PDF" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Need to share a PDF but want to hide sensitive information like passwords, credit card numbers, or personal addresses? Our PDF Redaction tool makes it easy and secure.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <p className="font-black text-slate-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to permanently remove sensitive text and images',
                'The difference between redacting and simply drawing black boxes',
                'Best practices for secure document sharing',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 size={13} className="text-slate-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Why Redact PDFs?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Simply drawing a black box over text in a PDF does NOT remove the underlying data. Anyone can copy the text or remove the shape to see what was hidden. True redaction permanently deletes the text and replaces it with a block, ensuring your private data remains private.
          </p>

          <h2 className="text-xl font-black text-slate-900">Features & Settings Explained</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our tool offers several features to make redaction easy and foolproof:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'True Redaction', desc: 'Permanently removes the underlying text data, not just the visual appearance.' },
              { title: 'Search & Redact', desc: 'Search for specific words or patterns (like credit card numbers) and redact them all at once.' },
              { title: 'Color Options', desc: 'Choose between standard Blackout or Whiteout to match your document style.' },
              { title: 'Custom Labels', desc: 'Add text labels over the redacted area (e.g., "REDACTED" or "CONFIDENTIAL").' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={14} className="text-slate-500" />
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: How to Redact a PDF</h2>
          {[
            { step: '1', title: 'Upload PDF', desc: 'Drag and drop your PDF file into the secure workspace.' },
            { step: '2', title: 'Select Redaction Areas', desc: 'Use the cursor to draw boxes over the text or images you want to hide.' },
            { step: '3', title: 'Apply Redactions', desc: 'Click "Apply" to permanently remove the selected data.' },
            { step: '4', title: 'Download File', desc: 'Save the new, secure PDF to your device.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Common Use Cases</h2>
          <div className="space-y-3 my-4">
            {[
              { title: 'Hiding Financial Data', desc: 'Redact bank account numbers and transaction details before sharing statements.' },
              { title: 'Protecting Personal Info', desc: 'Hide phone numbers, home addresses, and emails in public documents.' },
              { title: 'Legal Documents', desc: 'Anonymize witness names or sensitive case details for court filings.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Redaction vs. Drawing Shapes: The Dangerous Mistake</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Many people make the mistake of using a standard PDF editor to draw a black rectangle over sensitive text and then saving the file. They think the information is hidden, but it's not!
          </p>
          <div className="space-y-3 my-4 mb-6">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="font-black text-red-900 text-sm mb-1">Drawing a Shape (Insecure)</p>
              <p className="text-xs text-red-700 leading-relaxed">This only adds a visual layer on top of the text. Anyone can copy the text underneath, or simply delete the black box shape to reveal the hidden data.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p className="font-black text-emerald-900 text-sm mb-1">True Redaction (Secure)</p>
              <p className="text-xs text-emerald-700 leading-relaxed">This process actually removes the text characters from the PDF code and replaces them with a non-interactive color block. The data is gone forever.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">How to Verify Your Redactions are Secure</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Before sharing your redacted PDF, it is a best practice to verify that the sensitive information is truly gone:
          </p>
          <div className="space-y-3 my-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">1. Try to Select the Text</p>
              <p className="text-xs text-slate-500 leading-relaxed">Open the downloaded PDF and try to click and drag over the redacted area. If the text was truly removed, you should not be able to select or copy any hidden text.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">2. Use the Search Function</p>
              <p className="text-xs text-slate-500 leading-relaxed">Press `Ctrl+F` (or `Cmd+F` on Mac) and search for the specific word or number you redacted. If the search returns zero results, your redaction was successful.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Can a redacted file be un-redacted?', a: 'No. True redaction destroys the data. Once applied and downloaded, the hidden information cannot be recovered.' },
              { q: 'Is it safe to use online?', a: 'Yes. All processing is done locally in your browser. Your document is never uploaded to our servers.' },
              { q: 'What is the difference between Blackout and Whiteout?', a: 'Blackout uses a black box to hide info, while Whiteout uses white, making it look like the text was never there.' }
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
              <p className="font-black text-slate-900">Need to hide sensitive info now?</p>
              <p className="text-xs text-slate-500 mt-1">Redact your PDF securely in your browser.</p>
            </div>
            <a href="/tool/redact-pdf" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open PDF Redaction Tool <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
