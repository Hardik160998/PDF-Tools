"use client";

import { useEffect, useState } from "react";
import { X, Crown, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  paymentId: string;
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  planName,
  paymentId,
}: PaymentSuccessModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Gradient Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 bg-[length:200%_auto] animate-[pulse_3s_ease-in-out_infinite]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={14} className="text-slate-500 dark:text-slate-400" />
        </button>

        <div className="p-8 text-center">
          {/* Animated Themed Crown Icon Header */}
          <div
            className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 shadow-xl shadow-amber-500/25 mb-6 mx-auto animate-bounce"
            style={{ animationDuration: "2.5s" }}
          >
            <Crown size={36} className="fill-slate-950/20 text-slate-950" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow">
              <Sparkles size={12} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>

          {/* Celebration Header */}
          <h2
            id="success-modal-title"
            className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2"
          >
            Upgrade Successful!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
            Welcome to{" "}
            <span className="font-bold text-amber-500">SmartPDFs Pro</span>.
            Your premium account is now active.
          </p>

          {/* Order / Payment Summary Card */}
          <div className="mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Plan Activated
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                {planName}
              </span>
            </div>
            <div className="h-px bg-slate-200/60 dark:bg-slate-800/60" />
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Razorpay Payment ID
              </span>
              <span className="block font-mono text-xs font-bold text-slate-800 dark:text-slate-200 break-all bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-3 py-2 rounded-xl shadow-inner select-all">
                {paymentId}
              </span>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 mb-8">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 leading-relaxed">
              🎉 All premium tools, unlimited batch sizes, and 1GB file
              processing speed are now unlocked!
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 text-sm font-bold uppercase tracking-wider py-4 rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Continue to Profile
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
