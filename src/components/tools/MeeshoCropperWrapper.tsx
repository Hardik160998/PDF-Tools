"use client";

import dynamic from "next/dynamic";
import { ShoppingBag, Upload, Plus, Shield, Zap, Sparkles, Lock, Trash2, Smartphone, Rocket } from "lucide-react";

const ACCENT = '#f43397';

export function MeeshoCropperSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 animate-pulse">
      <div className="flex flex-col lg:flex-row-reverse gap-4 sm:gap-8 items-start pointer-events-none">
        <div className="flex-1 w-full space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5 sm:p-10 min-h-[500px] flex flex-col relative overflow-hidden w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

            <div className="relative text-center space-y-4 mb-6">
              <div className="inline-flex p-3 rounded-xl text-white shadow-lg" style={{ background: ACCENT }}>
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight text-center">
                Meesho Label Cropper
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-center">
                Auto-crop Meesho shipping labels — removes the invoice section below "Total", keeps the shipping label.
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
                <div className="relative mb-8">
                  <div className="w-32 h-40 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-pink-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                      <ShoppingBag size={48} className="opacity-20" style={{ color: ACCENT }} />
                    </div>
                    <div className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm" style={{ background: ACCENT }}>PDF</div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20" style={{ background: ACCENT }}>
                    <Upload size={20} strokeWidth={3} />
                  </div>
                  <Plus size={16} className="absolute -top-4 -left-6 opacity-60" style={{ color: ACCENT }} />
                  <Plus size={12} className="absolute top-10 -right-8 opacity-60" style={{ color: ACCENT }} />
                  <Plus size={14} className="absolute bottom-2 -left-8 opacity-60" style={{ color: ACCENT }} />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
                  Drag &amp; drop Meesho PDFs here
                </h3>
                <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                  or click to <span style={{ color: ACCENT }}>browse</span>
                </p>
                <p className="text-sm text-slate-400 font-medium mb-8 text-center">Supports multiple PDF files</p>

                <div className="px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl relative z-10 flex items-center gap-3" style={{ background: ACCENT }}>
                  <Plus size={20} /> SELECT PDF FILES
                </div>
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

const MeeshoCropperClient = dynamic(() => import("./MeeshoCropper"), {
  ssr: false,
  loading: () => <MeeshoCropperSkeleton />,
});

export default function MeeshoCropperWrapper({ id }: { id: string }) {
  return <MeeshoCropperClient id={id} />;
}
