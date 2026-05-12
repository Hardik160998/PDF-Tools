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
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">
            Amazon Label <span className="text-[#FF9900]">Cropper</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Extract high-precision shipping labels and automatically clear out unwanted invoice pages from your Amazon PDF batches.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: ShoppingBag, title: "Invoice Auto-Clear", desc: "Even-numbered invoice pages (2,4,6...) are detected and removed instantly.", guj: "ઇન્વૉઇસ પેજ ઓટોમેટિકલી નીકળી જશે." },
            { icon: Zap, title: "High Precision", desc: "Anchor-based cropping ensures 'Sold on' and 'ATSPL' details are never cut off.", guj: "પૂરેપૂરું લેબલ ક્રોપ થશે, કોઈ વિગત કપાશે નહીં." },
            { icon: ShieldCheck, title: "Warehouse Ready", desc: "Optimized for thermal printers and fast batch processing in busy hubs.", guj: "વેરહાઉસ માટે ખાસ તૈયાર કરેલું ટૂલ." }
          ].map((feat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feat.icon className="text-[#FF9900]" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{feat.desc}</p>
              <p className="text-[10px] font-bold text-[#FF9900] uppercase tracking-widest bg-[#FF9900]/10 px-3 py-1 rounded-full w-fit">{feat.guj}</p>
            </div>
          ))}
        </div>

        {/* The Tool */}
        <AmazonCropper id="amazon-main" />

        {/* Guidelines */}
        <div className="mt-16 bg-[#FF9900]/5 dark:bg-[#FF9900]/10 border border-[#FF9900]/20 rounded-3xl p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="text-[#FF9900]" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">How to use / કેવી રીતે વાપરવું</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 font-medium">1. Upload your Amazon Label PDF batch.</p>
              <p className="text-slate-700 dark:text-slate-300 font-medium">2. The tool identifies Labels on Odd pages and Invoices on Even pages.</p>
              <p className="text-slate-700 dark:text-slate-300 font-medium">3. Click "Extract" to get a clean, label-only PDF ready for printing.</p>
            </div>
            <div className="space-y-4 border-l-0 sm:border-l border-[#FF9900]/20 sm:pl-10">
              <p className="text-slate-700 dark:text-slate-300 font-bold">૧. એમેઝોન લેબલ PDF અપલોડ કરો.</p>
              <p className="text-slate-700 dark:text-slate-300 font-bold">૨. ટૂલ ઓટોમેટિકલી ઈવન પેજ (ઇન્વૉઇસ) કાઢી નાખશે.</p>
              <p className="text-slate-700 dark:text-slate-300 font-bold">૩. "Extract" બટન દબાવીને ફક્ત લેબલ વાળી ફાઇલ ડાઉનલોડ કરો.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
