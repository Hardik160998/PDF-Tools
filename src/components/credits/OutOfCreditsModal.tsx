"use client";

import { useEffect, useState } from "react";
import { X, Zap, LogIn, UserPlus, Crown, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

interface OutOfCreditsModalProps {
  /** Whether to show the modal */
  isOpen: boolean;
  /** Called when modal is dismissed */
  onClose: () => void;
  /** Whether user is a guest (not logged in) */
  isGuest: boolean;
}

/**
 * Full-screen blocking modal shown when credits run out.
 * - For guests: prompt to sign up (to get +5 credits) or login
 * - For logged-in basic users: prompt to upgrade to premium
 */
export default function OutOfCreditsModal({
  isOpen,
  onClose,
  isGuest,
}: OutOfCreditsModalProps) {
  const { user } = useAuth();
  const pathname = usePathname();
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

  const redirectParam = encodeURIComponent(pathname || "/");

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="out-of-credits-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Gradient top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={14} className="text-slate-500" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-xl shadow-rose-500/30 mb-6 mx-auto">
            <Zap size={28} fill="white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-red-500">
              <AlertTriangle size={12} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h2
            id="out-of-credits-title"
            className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3"
          >
            {isGuest ? (
              <>
                You&apos;ve Used All{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  5 Free Credits
                </span>
              </>
            ) : (
              <>
                Credits{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  Exhausted
                </span>
              </>
            )}
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            {isGuest ? (
              <>
                Create a free account to unlock{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  +5 bonus credits
                </span>{" "}
                (10 total). No credit card required.
              </>
            ) : (
              <>
                You&apos;ve used all your free tool credits. Upgrade to{" "}
                <span className="font-bold text-amber-500">Premium</span> for
                unlimited access to all PDF tools.
              </>
            )}
          </p>

          {/* Credit bonus callout for guests */}
          {isGuest && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                <Zap size={12} fill="currentColor" />
                Sign up now → get +5 credits instantly
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-1">
                Your remaining guest credits carry over automatically
              </p>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            {isGuest ? (
              <>
                <Link
                  href={`/signup?redirect=${redirectParam}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-black uppercase tracking-wider py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                  onClick={onClose}
                >
                  <UserPlus size={16} />
                  Create Free Account — Get +5 Credits
                </Link>

                <Link
                  href={`/login?redirect=${redirectParam}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold py-3 rounded-2xl transition-all"
                  onClick={onClose}
                >
                  <LogIn size={15} />
                  Already have an account? Log in
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/premium-plans"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-black uppercase tracking-wider py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
                  onClick={onClose}
                >
                  <Crown size={16} className="fill-white/30" />
                  Upgrade to Premium — Unlimited Access
                  <ChevronRight size={14} />
                </Link>

                <button
                  onClick={onClose}
                  className="w-full text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-2 cursor-pointer"
                >
                  Dismiss
                </button>
              </>
            )}
          </div>

          {/* Fine print */}
          {isGuest && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4">
              No credit card required. Free account includes 10 total credits.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
