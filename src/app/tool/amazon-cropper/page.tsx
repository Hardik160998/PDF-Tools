import AmazonCropper from '@/components/tools/AmazonCropper';
import { ShoppingBag, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: 'Amazon Label Cropper - Smart Invoice Removal',
  description: 'Automatically remove invoice pages and crop Amazon shipping labels to full height.',
};

export default function AmazonCropperPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">

        {/* The Tool */}
        <AmazonCropper id="amazon-main" />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {[
            { icon: ShoppingBag, title: "Invoice Auto-Clear", desc: "Even-numbered invoice pages (2,4,6...) are detected and removed instantly." },
            { icon: Zap, title: "High Precision", desc: "Anchor-based cropping ensures 'Sold on' and 'ATSPL' details are never cut off." },
            { icon: ShieldCheck, title: "Warehouse Ready", desc: "Optimized for thermal printers and fast batch processing in busy hubs." }
          ].map((feat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feat.icon className="text-[#FF9900]" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Guidelines */}
        <div className="bg-[#FF9900]/5 dark:bg-[#FF9900]/10 border border-[#FF9900]/20 rounded-3xl p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="text-[#FF9900]" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">How to use</h2>
          </div>
          <div className="space-y-4 max-w-3xl">
            <p className="text-slate-700 dark:text-slate-300 font-medium">1. Upload your Amazon Label PDF batch.</p>
            <p className="text-slate-700 dark:text-slate-300 font-medium">2. The tool identifies Labels and automatically filters out the Invoice pages.</p>
            <p className="text-slate-700 dark:text-slate-300 font-medium">3. Labels are arranged in a 4-per-page (2x2) A4 grid for maximum efficiency.</p>
            <p className="text-slate-700 dark:text-slate-300 font-medium">4. Click "Extract" to get your print-ready PDF file.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
