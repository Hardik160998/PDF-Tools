"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { GUEST_STORAGE_KEY } from "@/lib/credits/config";
import { updateLocalGuestCredits } from "./useGuestSession";

export interface CreditState {
 remaining: number;
 total: number;
 isGuest: boolean;
 isPremium: boolean;
 unlimited: boolean;
 isLoading: boolean;
 creditsMerged: boolean;
}

interface UseCreditsReturn extends CreditState {
 /** Deducts 1 credit for a tool action. Returns {allowed, remaining} or null on error. */
 deductCredit: (toolName: string) => Promise<{ allowed: boolean; remaining: number } | null>;
 /** Refreshes credit count from server */
 refreshCredits: () => Promise<void>;
 /** Guest session token (for API calls) */
 guestToken: string | null;
}

// Global promise to prevent duplicate concurrent session creations across multiple hook instances
let sessionInitPromise: Promise<any> | null = null;

/**
 * Unified credit hook for all components.
 * Handles both guest and authenticated user credit state.
 * This is the ONLY hook components should use for credit operations.
 */
export function useCredits(): UseCreditsReturn {
 const { user, profile, refreshProfile } = useAuth();
 const [guestToken, setGuestToken] = useState<string | null>(null);
 const [guestCredits, setGuestCredits] = useState<number>(5);
 const [isLoading, setIsLoading] = useState(true);
 const [creditsMerged, setCreditsMerged] = useState(false);

 const isAuthenticated = !!user;
 const userPlan = profile?.current_plan || profile?.plan || "Basic Plan";
 const isPremium =
 userPlan.toLowerCase().includes("pro") ||
 userPlan.toLowerCase().includes("premium");

 // ─── Guest session bootstrap ───────────────────────────────────────────────
 useEffect(() => {
 if (isAuthenticated) {
 setIsLoading(false);
 return;
 }

 // Load guest session from localStorage
 const stored = localStorage.getItem(GUEST_STORAGE_KEY);
 if (stored) {
 try {
 const parsed = JSON.parse(stored);
 if (new Date(parsed.expiresAt) > new Date()) {
 setGuestToken(parsed.sessionToken);
 setGuestCredits(parsed.credits);
 setIsLoading(false);
 return;
 }
 } catch {}
 }

 // Initialize global session request if not already started
 if (!sessionInitPromise) {
 // Pre-generate token synchronously so other components see it immediately
 const newToken = `gst_${Math.random().toString(36).substring(2)}${Date.now()}`;
 
 sessionInitPromise = fetch("/api/credits/session", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ guestId: newToken }),
 }).then(async (r) => {
 const contentType = r.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 return r.json();
 }
 const text = await r.text();
 console.error("Credits Session API error:", text);
 throw new Error(`Server error (${r.status})`);
 });
 }

 // Await the global promise
 sessionInitPromise
 .then((data) => {
 if (data.sessionToken) {
 setGuestToken(data.sessionToken);
 setGuestCredits(data.credits);
 localStorage.setItem(
 GUEST_STORAGE_KEY,
 JSON.stringify({
 sessionToken: data.sessionToken,
 credits: data.credits,
 expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
 })
 );
 }
 })
 .catch((err) => {
 console.error("[useCredits] Session init error:", err);
 sessionInitPromise = null; // allow retry on failure
 })
 .finally(() => setIsLoading(false));
 }, [isAuthenticated]);

 // Sync credits across components when updated locally
 useEffect(() => {
 const handleUpdate = (e: any) => {
 if (e.detail?.credits !== undefined) {
 setGuestCredits(e.detail.credits);
 }
 };
 window.addEventListener('guest-credits-updated', handleUpdate);
 return () => window.removeEventListener('guest-credits-updated', handleUpdate);
 }, []);

 // ─── Refresh credits from server ─────────────────────────────────────────
 const refreshCredits = useCallback(async () => {
 try {
 if (isAuthenticated && user?.email) {
 const isMock = !!localStorage.getItem("sb-mock-session");
 let token = user.email;
 if (!isMock) {
 const { supabase } = await import("@/lib/supabase");
 const { data: { session } } = await (supabase as any).auth.getSession();
 token = session?.access_token || user.email;
 }
 const res = await fetch("/api/credits/status", {
 headers: { Authorization: `Bearer ${token}` },
 });
 if (res.ok) {
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 const data = await res.json();
 setCreditsMerged(data.creditsMerged || false);
 }
 }
 } else if (guestToken) {
 const res = await fetch(`/api/credits/status?token=${guestToken}`);
 if (res.ok) {
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 const data = await res.json();
 setGuestCredits(data.remaining);
 updateLocalGuestCredits(data.remaining);
 }
 }
 }
 } catch (err) {
 console.error("[useCredits] refreshCredits error:", err);
 }
 }, [isAuthenticated, user, guestToken]);

 // ─── Deduct credit ────────────────────────────────────────────────────────
 const deductCredit = useCallback(
 async (toolName: string): Promise<{ allowed: boolean; remaining: number } | null> => {
 try {
 const idempotencyKey = `${toolName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

 if (isAuthenticated && user?.email) {
 const isMock = !!localStorage.getItem("sb-mock-session");
 let token = user.email;
 if (!isMock) {
 const { supabase } = await import("@/lib/supabase");
 const { data: { session } } = await (supabase as any).auth.getSession();
 token = session?.access_token || user.email;
 }

 const res = await fetch("/api/credits/deduct", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify({ toolName, idempotencyKey }),
 });

 let data;
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 data = await res.json();
 } else {
 console.error("Deduct Credits API non-JSON response");
 }

 if (!res.ok) {
 return { allowed: false, remaining: data?.remaining ?? 0 };
 }

 // Update profile credits in context
 if (data && data.remaining !== undefined && !data.unlimited) {
 // Trigger profile refresh to sync credits display
 await refreshProfile();
 }

 return { allowed: true, remaining: data?.remaining ?? 9999 };
 }

 // Guest path
 if (!guestToken) {
 return { allowed: false, remaining: 0 };
 }

 const res = await fetch("/api/credits/deduct", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ toolName, idempotencyKey, guestToken }),
 });

 let data;
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 data = await res.json();
 } else {
 console.error("Deduct Guest Credits API non-JSON response");
 }

 if (!res.ok) {
 setGuestCredits(0);
 updateLocalGuestCredits(0);
 return { allowed: false, remaining: 0 };
 }

 setGuestCredits(data?.remaining ?? 0);
 updateLocalGuestCredits(data?.remaining ?? 0);
 return { allowed: true, remaining: data?.remaining ?? 0 };
 } catch (err) {
 console.error("[useCredits] deductCredit error:", err);
 return null;
 }
 },
 [isAuthenticated, user, guestToken, refreshProfile]
 );

 // ─── Compute state ────────────────────────────────────────────────────────
 if (isAuthenticated) {
 const userCredits = profile?.remaining_credits !== undefined && profile?.remaining_credits !== null
 ? (profile as any).remaining_credits
 : 10;

 return {
 remaining: isPremium ? 9999 : userCredits,
 total: 10,
 isGuest: false,
 isPremium,
 unlimited: isPremium,
 isLoading,
 creditsMerged,
 deductCredit,
 refreshCredits,
 guestToken: null,
 };
 }

 return {
 remaining: guestCredits,
 total: 5,
 isGuest: true,
 isPremium: false,
 unlimited: false,
 isLoading,
 creditsMerged: false,
 deductCredit,
 refreshCredits,
 guestToken,
 };
}
