/**
 * Credit System Configuration
 * Central source of truth for all credit-related constants.
 */

/** Credits given to new guest visitors (before login) */
export const GUEST_CREDITS = 5;

/** Bonus credits added when a guest signs up or logs in */
export const AUTH_BONUS_CREDITS = 5;

/** Maximum total credits a user can have */
export const MAX_TOTAL_CREDITS = GUEST_CREDITS + AUTH_BONUS_CREDITS; // 10

/** How long a guest session token is valid (in days) */
export const GUEST_SESSION_EXPIRY_DAYS = 30;

/** Cookie name for storing guest session token */
export const GUEST_SESSION_COOKIE = 'pdf_guest_token';

/** localStorage key for guest session data */
export const GUEST_STORAGE_KEY = 'pdf_guest_session';

/**
 * Tools that are completely FREE and do NOT consume any credits.
 * Add tool IDs here to whitelist them from credit deduction.
 */
export const FREE_TOOLS: string[] = [
 // Add tool IDs here that should be free
 // e.g., 'pdf-viewer', 'pdf-info'
];

/**
 * Check if a tool is free (does not cost credits).
 */
export function isFreeTool(toolId: string): boolean {
 return FREE_TOOLS.includes(toolId);
}

/**
 * Credit thresholds for UI warning colors.
 */
export const CREDIT_THRESHOLDS = {
 /** Green zone — plenty of credits */
 HIGH: 4,
 /** Yellow zone — getting low */
 LOW: 2,
 /** Red zone — critical, nearly empty */
 CRITICAL: 1,
} as const;

/**
 * Get color class based on remaining credits for UI display.
 */
export function getCreditColorClass(remaining: number): {
 text: string;
 bar: string;
 bg: string;
} {
 if (remaining <= 0) {
 return { text: 'text-red-600', bar: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-950/20' };
 }
 if (remaining <= CREDIT_THRESHOLDS.CRITICAL) {
 return { text: 'text-red-500', bar: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-950/20' };
 }
 if (remaining <= CREDIT_THRESHOLDS.LOW) {
 return { text: 'text-orange-500', bar: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' };
 }
 if (remaining <= CREDIT_THRESHOLDS.HIGH) {
 return { text: 'text-yellow-600', bar: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/20' };
 }
 return { text: 'text-emerald-600', bar: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' };
}
