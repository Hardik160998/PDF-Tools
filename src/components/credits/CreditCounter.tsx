"use client";

import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { getCreditColorClass, CREDIT_THRESHOLDS } from "@/lib/credits/config";
import { Zap, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CreditCounterProps {
  /** Compact mode for navbar (pill style) vs expanded (card) */
  compact?: boolean;
}

/**
 * Credit counter badge — shows remaining credits with animated progress bar.
 * Displayed in the navbar for all users (guest and authenticated).
 * Pulses when credits are critically low.
 */
export default function CreditCounter({ compact = true }: CreditCounterProps) {
  const { user } = useAuth();
  const { remaining, total, isGuest, isPremium, unlimited, isLoading } = useCredits();
  const [prevRemaining, setPrevRemaining] = useState(remaining);
  const [flash, setFlash] = useState(false);

  // Flash animation when credits decrease
  useEffect(() => {
    if (remaining < prevRemaining && !isLoading) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      setPrevRemaining(remaining);
      return () => clearTimeout(t);
    }
    setPrevRemaining(remaining);
  }, [remaining, prevRemaining, isLoading]);

  if (isLoading) {
    return (
      <div className="h-7 w-24 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  // Premium users — show unlimited badge
  if (isPremium || unlimited) {
    return compact ? (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <Crown size={11} className="text-amber-500 fill-amber-500/30" />
        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          Unlimited
        </span>
      </div>
    ) : null;
  }

  const colors = getCreditColorClass(remaining);
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
  const isCritical = remaining <= CREDIT_THRESHOLDS.CRITICAL && remaining > 0;
  const isEmpty = remaining <= 0;

  if (compact) {
    return (
      <Link
        href={user ? "/premium-plans" : "/signup"}
        className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all hover:scale-105 ${
          isEmpty
            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 animate-pulse"
            : isCritical
            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
        } ${flash ? "ring-2 ring-red-400/50" : ""}`}
        title={
          isEmpty
            ? "Out of credits — Sign up for more!"
            : `${remaining} of ${total} free credits remaining`
        }
      >
        <Zap
          size={11}
          className={`${isEmpty ? "text-red-500" : isCritical ? "text-orange-500" : "text-emerald-500"} ${
            isCritical ? "animate-bounce" : ""
          }`}
          fill="currentColor"
        />
        <span
          className={`text-[10px] font-black uppercase tracking-wider ${
            isEmpty
              ? "text-red-600 dark:text-red-400"
              : isCritical
              ? "text-orange-600 dark:text-orange-400"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          {isEmpty ? "No Credits" : `${remaining} Credits`}
        </span>

        {/* Mini progress bar */}
        <div className="w-12 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </Link>
    );
  }

  // Expanded card mode
  return (
    <div
      className={`p-4 rounded-2xl border ${colors.bg} ${
        isEmpty ? "border-red-200 dark:border-red-800" : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className={colors.text} />
          <span className={`text-xs font-bold ${colors.text}`}>
            {isGuest ? "Guest Credits" : "Your Credits"}
          </span>
        </div>
        <span className={`text-lg font-black ${colors.text}`}>
          {remaining}
          <span className="text-xs font-semibold text-slate-400"> / {total}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors.bar} ${
            isCritical ? "animate-pulse" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
        {isEmpty
          ? isGuest
            ? "Sign up to get 5 more free credits!"
            : "Upgrade to Premium for unlimited access."
          : isCritical
          ? `Only ${remaining} credit${remaining === 1 ? "" : "s"} left — use wisely!`
          : `${remaining} free credit${remaining === 1 ? "" : "s"} remaining`}
      </p>

      {!isEmpty && isGuest && (
        <p className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold mt-1">
          💡 Sign up to get +5 more credits (total 10)
        </p>
      )}
    </div>
  );
}
