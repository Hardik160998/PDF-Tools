"use client";

import { useState, useCallback } from "react";
import { useCredits } from "@/hooks/useCredits";
import OutOfCreditsModal from "./OutOfCreditsModal";
import CreditCounter from "./CreditCounter";

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
 *
 * Usage:
 * ```tsx
 * <CreditGate toolName="merge">
 *   <MergeToolUI onProcess={handleProcess} />
 * </CreditGate>
 * ```
 *
 * The `deductCredit` function is passed down via the render prop pattern,
 * OR components can call `useCredits().deductCredit()` directly.
 *
 * This gate:
 * 1. Shows a credit counter above the tool
 * 2. Shows OutOfCreditsModal when credits are 0
 * 3. Allows tool to deduct credits on action
 */
export default function CreditGate({
  toolName,
  children,
  showCounter = true,
  onCreditDeducted,
}: CreditGateProps) {
  const { remaining, isGuest, isPremium, unlimited, isLoading } = useCredits();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOutOfCredits = useCallback(() => {
    setModalOpen(true);
  }, []);

  if (isLoading) {
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

  return (
    <>
      {/* Out of credits modal */}
      <OutOfCreditsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isGuest={isGuest}
      />

      {/* If credits are 0 and modal is closed, show inline blocked state */}
      {remaining <= 0 && !modalOpen && (
        <button
          onClick={() => setModalOpen(true)}
          className="w-full cursor-pointer group"
          aria-label="View credit options"
        >
          <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-center justify-between hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚡</span>
              <p className="text-xs font-bold text-red-700 dark:text-red-400">
                {isGuest
                  ? "No guest credits left — Sign up to get +5 credits!"
                  : "No credits remaining — Upgrade to Premium"}
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 group-hover:underline">
              {isGuest ? "Sign Up Free →" : "Upgrade →"}
            </span>
          </div>
        </button>
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
