"use client";

import { useCredits } from "@/hooks/useCredits";
import CreditCounter from "./CreditCounter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CenteredCardSkeleton } from "@/app/tool/[id]/skeletons";

const PREMIUM_TOOL_SKELETON_ACCENTS: Record<string, string> = {
  "meesho-cropper": "#f26522",
  "meshocrop": "#f26522",
  "flipkart-cropper": "#F7941D",
  "amazon-cropper": "#FF9900",
  "snapdeal-cropper": "#E40046",
  "ocr-pdf": "#3b82f6",
  "redact-pdf": "#ef4444",
  "webpage-to-pdf": "#0ea5e9",
};

interface CreditGateProps {
  /**
   * Tool identifier used for logging and idempotency.
   * Example: "merge", "compress", "crop-pdf"
   */
  toolName: string;
  /** The tool UI to render if credits are available */
  children: React.ReactNode;
  /**
   * Whether to show an in-page credit counter above the tool.
   * Defaults to true.
   */
  showCounter?: boolean;
  /**
   * Called when a credit is successfully deducted.
   * Receives the new remaining credit count.
   */
  onCreditDeducted?: (remaining: number) => void;
}

/**
 * CreditGate — wraps any tool page to enforce credit-based access.
 */
export default function CreditGate({
  toolName,
  children,
  showCounter = true,
  onCreditDeducted,
}: CreditGateProps) {
  const { remaining, isGuest, isPremium, unlimited, isLoading } = useCredits();
  const pathname = usePathname();
  const redirectParam = encodeURIComponent(pathname || "/");

  if (isLoading) {
    const accent = PREMIUM_TOOL_SKELETON_ACCENTS[toolName];
    if (accent) {
      return <CenteredCardSkeleton accent={accent} />;
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
        <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-blue-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Checking credits...</p>
      </div>
    );
  }

  // If premium — skip credit gate entirely
  if (isPremium || unlimited) {
    return <>{children}</>;
  }

  // Determine if we should show the banner
  const showBanner = isGuest || remaining <= 0;

  return (
    <>
      {/* If guest or credits are 0, show inline premium banner */}
      {showBanner && (
        <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
          <Link
            href={isGuest ? `/signup?redirect=${redirectParam}` : "/premium-plans"}
            className="w-full block group"
            aria-label="View credit options"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/10 dark:to-rose-950/10 border border-red-200 dark:border-red-800 flex flex-col sm:flex-row items-center justify-between gap-3 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-950/20 dark:hover:to-rose-950/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 shadow-sm shadow-red-500/5">
              <div className="flex items-center gap-2.5">
                <span className="text-base animate-pulse">⚡</span>
                <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-400">
                  {isGuest
                    ? remaining <= 0
                      ? "No guest credits left — Sign up to get +5 credits!"
                      : `You have ${remaining} guest credit${remaining === 1 ? "" : "s"} left — Sign up to get +5 credits!`
                    : "No credits remaining — Upgrade to Premium"}
                </p>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/50 px-4 py-1.5 rounded-full shadow-sm">
                {isGuest ? "SIGN UP FREE →" : "UPGRADE →"}
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Credit counter (compact card, not navbar pill) */}
      {showCounter && remaining > 0 && (
        <div className="mb-4">
          <CreditCounter compact={false} />
        </div>
      )}

      {/* Render tool — always visible, but tool should call deductCredit before processing */}
      {children}
    </>
  );
}
