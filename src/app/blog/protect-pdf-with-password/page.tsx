import { Lock, Clock, ArrowRight, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';
export default function ProtectPDFPost() {
  return (
    <article className="min-h-screen"><div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
      <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 font-bold mb-8"><ArrowLeft size={14} /> Back to Blog</a>
      <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Lock size={22} /></div>
        <div><span className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2 py-1 rounded-full">Tutorial</span>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium"><span className="flex items-center gap-1"><Clock size={11} /> 3 min read</span><span>Apr 12, 2026</span></div></div></div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-4 leading-tight">How to Password Protect a PDF File in 3 Simple Steps</h1>
      <p className="text-lg text-slate-500 leading-relaxed mb-8">Protect sensitive documents — contracts, financial reports, personal files — with a password. Works on any device, completely free.</p>
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5"><p className="font-black text-red-800 text-sm mb-2">What you'll learn</p>
          <ul className="space-y-1">{['How to add a password to any PDF','How to remove a password from a PDF you own','Best practices for PDF passwords'].map(i => (<li key={i} className="flex items-center gap-2 text-sm text-red-700"><CheckCircle2 size={13} className="text-red-500" />{i}</li>))}</ul></div>
        <h2 className="text-xl font-black text-slate-900">Why Password Protect a PDF?</h2>
        <p className="text-slate-600 leading-relaxed text-sm">Password protection prevents unauthorized access to sensitive documents. Use it for: legal contracts, financial statements, medical records, personal identification documents, and confidential business reports.</p>
        <h2 className="text-xl font-black text-slate-900">Add a Password in 3 Steps</h2>
        {[{step:'1',title:'Open Protect PDF',desc:'Go to SmartPDFs Plus → Security → Protect PDF.'},{step:'2',title:'Upload & Enter Password',desc:'Upload your PDF, then type a strong password in the password field. Use a mix of letters, numbers, and symbols.'},{step:'3',title:'Download Protected PDF',desc:'Click "Add Password" and download your encrypted PDF. Share it securely — recipients need the password to open it.'}].map(({step,title,desc}) => (
          <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
            <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
          </div>
        ))}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3"><AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" /><div><p className="font-black text-yellow-800 text-sm">Important</p><p className="text-sm text-yellow-700 mt-0.5">Remember your password — there is no recovery option. If you forget it, the PDF cannot be unlocked without the original password.</p></div></div>
        <h2 className="text-xl font-black text-slate-900">How to Remove a Password</h2>
        <p className="text-slate-600 text-sm leading-relaxed">If you own a password-protected PDF and want to remove the protection, use the Unlock PDF tool. Upload the PDF, enter the current password, and download the unlocked version.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/tool/protect" className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-center font-black text-sm transition-all flex items-center justify-center gap-2"><Lock size={16} /> Protect PDF</a>
          <a href="/tool/unlock" className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl text-center font-black text-sm transition-all flex items-center justify-center gap-2"><Lock size={16} /> Unlock PDF</a>
        </div>
      </div>
    </div></article>
  );
}
