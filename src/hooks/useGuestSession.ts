"use client";

import { useState, useEffect, useCallback } from "react";
import { GUEST_SESSION_COOKIE, GUEST_STORAGE_KEY } from "@/lib/credits/config";

export interface GuestSessionData {
 guestId: string;
 sessionToken: string;
 credits: number;
 expiresAt: string;
}

interface UseGuestSessionReturn {
 session: GuestSessionData | null;
 loading: boolean;
 error: string | null;
 refreshSession: () => Promise<void>;
}

/**
 * Manages the guest session lifecycle.
 * - Reads from localStorage on mount
 * - Creates a new session via API if none exists
 * - Persists session to localStorage for client-side access
 * - Syncs with server cookie for API calls
 */
export function useGuestSession(): UseGuestSessionReturn {
 const [session, setSession] = useState<GuestSessionData | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const initSession = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);

 // 1. Try to read from localStorage first
 const stored = localStorage.getItem(GUEST_STORAGE_KEY);
 if (stored) {
 try {
 const parsed: GuestSessionData = JSON.parse(stored);
 // Check if not expired
 if (new Date(parsed.expiresAt) > new Date()) {
 setSession(parsed);
 setLoading(false);

 // Verify with server in background (non-blocking)
 fetch(`/api/credits/session`, { method: "GET" })
 .then((r) => {
 const contentType = r.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 return r.json();
 }
 return {} as any;
 })
 .then((data) => {
 if (data && data.exists && data.credits !== undefined) {
 const updated = { ...parsed, credits: data.credits };
 setSession(updated);
 localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
 }
 })
 .catch(() => {}); // Fail silently

 return;
 }
 } catch {
 localStorage.removeItem(GUEST_STORAGE_KEY);
 }
 }

 // 2. Create new guest session
 const res = await fetch("/api/credits/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
 if (!res.ok) {
 throw new Error("Failed to initialize guest session.");
 }

 let data: GuestSessionData & { success: boolean };
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 data = await res.json();
 } else {
 const text = await res.text();
 console.error("Guest session init response:", text);
 throw new Error(`Server error (${res.status}). Failed to initialize guest session.`);
 }
 
 const newSession: GuestSessionData = {
 guestId: data.guestId,
 sessionToken: data.sessionToken,
 credits: data.credits,
 expiresAt: data.expiresAt,
 };

 setSession(newSession);
 localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newSession));
 } catch (err: any) {
 console.error("[useGuestSession] Error:", err);
 setError(err.message || "Failed to create guest session.");
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => {
 initSession();
 }, [initSession]);

 return { session, loading, error, refreshSession: initSession };
}

/**
 * Updates the local guest session credits count in localStorage.
 * Called after a successful credit deduction.
 */
export function updateLocalGuestCredits(newCredits: number): void {
 if (typeof window === "undefined") return;
 const stored = localStorage.getItem(GUEST_STORAGE_KEY);
 if (stored) {
 try {
 const parsed = JSON.parse(stored);
 parsed.credits = newCredits;
 localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(parsed));
 // Dispatch custom event to notify other components (like Navbar)
 window.dispatchEvent(new CustomEvent('guest-credits-updated', { detail: { credits: newCredits } }));
 } catch {}
 }
}

/**
 * Clears guest session from localStorage (called after login/merge).
 */
export function clearGuestSession(): void {
 if (typeof window === "undefined") return;
 localStorage.removeItem(GUEST_STORAGE_KEY);
}
