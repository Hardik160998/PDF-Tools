"use client";

import dynamic from "next/dynamic";
import { ShoppingBag, Upload, Plus, Shield, Zap, Sparkles, Lock, Trash2, Smartphone, Rocket } from "lucide-react";

const ACCENT = "#FF9900";
const ACCENT_GRADIENT = "linear-gradient(135deg,#FF9900,#ea580c)";

export function AmazonCropperSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 animate-pulse">
      <div className="flex flex-col lg:flex-row-reverse gap-4 sm:gap-8 items-start pointer-events-none">
        <div className="flex-1 w-full space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5 sm:p-10 min-h-[500px] flex flex-col relative overflow-hidden w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

            <div className="relative text-center space-y-4 mb-6">
              <div className="inline-flex p-3 rounded-xl text-white shadow-lg" style={{ background: ACCENT_GRADIENT }}>
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
                Amazon Extraction Engine
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
                Extract shipping labels instantly. Invoices and extra pages are automatically removed.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center w-full max-w-3xl mx-auto">
              <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
                {[
                  { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
                  { icon: Shield, title: "Private", desc: "Your files stay secure" },
                  { icon: Sparkles, title: "Lossless", desc: "Perfect quality output" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                      <f.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                      <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 shadow-sm relative overflow-hidden mb-6">
                <div className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl mb-5 sm:mb-6" style={{ color: ACCENT }}>
                  <Upload size={36} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1e293b] dark:text-white mb-2 sm:mb-3 text-center tracking-tight">Upload Amazon PDFs</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-center">Invoices automatically cleared.</p>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                {[
                  { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
                  { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
                  { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
                  { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
                ].map((f, i) => (
                  <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}10` }}>
                      <f.icon size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{f.title}</p>
                      <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AmazonCropperClient = dynamic(() => import("./AmazonCropper"), {
  ssr: false,
  loading: () => <AmazonCropperSkeleton />,
});

export default function AmazonCropperWrapper({ id }: { id: string }) {
  return <AmazonCropperClient id={id} />;
}
