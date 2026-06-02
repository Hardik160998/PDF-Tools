"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Eye, EyeOff, Heart, ArrowRight } from "lucide-react";

function ResetPasswordForm() {
 const router = useRouter();
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
 const [hasSession, setHasSession] = useState<boolean | null>(null);

 useEffect(() => {
 let isMounted = true;

 const checkInitialSession = async () => {
 try {
 const hash = typeof window !== "undefined" ? window.location.hash : "";
 const search = typeof window !== "undefined" ? window.location.search : "";
 
 // Parse params from both hash (ignoring '#') and search query
 const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.substring(1) : hash);
 const searchParams = new URLSearchParams(search);
 
 const errorDesc = hashParams.get("error_description") || searchParams.get("error_description");
 const errorMsg = hashParams.get("error") || searchParams.get("error");

 if (errorDesc || errorMsg) {
 if (isMounted) {
 setHasSession(false);
 const finalError = errorDesc 
 ? decodeURIComponent(errorDesc).replace(/\+/g, " ") 
 : decodeURIComponent(errorMsg || "").replace(/\+/g, " ");
 setStatusMessage({
 type: "error",
 text: `Reset link error: ${finalError}. Please request a new reset link.`
 });
 }
 return;
 }

 const { data: { session } } = await supabase.auth.getSession();
 if (!isMounted) return;

 if (session) {
 setHasSession(true);
 } else {
 // If no initial session, check if there's a recovery token in the URL hash or search params
 const isRecovery = hash.includes("access_token=") || search.includes("code=");
 
 if (!isRecovery) {
 setHasSession(false);
 setStatusMessage({
 type: "error",
 text: "No active reset session detected. Please request a new password reset link if you are not logged in."
 });
 }
 }
 } catch (err) {
 console.error("Session check error:", err);
 }
 };

 checkInitialSession();

 // Listen for auth state changes (e.g. when recovery token is processed asynchronously)
 const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
 if (!isMounted) return;
 if (session) {
 setHasSession(true);
 setStatusMessage(null); // Clear any "no session" error since session is now active
 } else {
 // Only set hasSession to false if there is no recovery parameter in the URL
 const hash = typeof window !== "undefined" ? window.location.hash : "";
 const search = typeof window !== "undefined" ? window.location.search : "";
 const isRecovery = hash.includes("access_token=") || search.includes("code=");
 if (!isRecovery) {
 setHasSession(false);
 }
 }
 });

 return () => {
 isMounted = false;
 subscription.unsubscribe();
 };
 }, []);

 const handleResetPassword = async (e: React.FormEvent) => {
 e.preventDefault();
 if (password !== confirmPassword) {
 setStatusMessage({ type: "error", text: "Passwords do not match." });
 return;
 }
 if (password.length < 6) {
 setStatusMessage({ type: "error", text: "Password must be at least 6 characters long." });
 return;
 }

 setIsLoading(true);
 setStatusMessage(null);

 try {
 const { data: { session } } = await supabase.auth.getSession();
 const accessToken = session?.access_token;

 if (!accessToken) {
 throw new Error("No active session found. Please request a new password reset link.");
 }

 const res = await fetch("/api/auth/update-password", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "Authorization": `Bearer ${accessToken}`
 },
 body: JSON.stringify({ password: password })
 });

 let data;
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 data = await res.json();
 } else {
 const text = await res.text();
 console.error("Update password API error response:", text);
 throw new Error(`Server error (${res.status}). Please try again.`);
 }

 if (!res.ok) {
 throw new Error(data.error || "Failed to update password.");
 }

 // Sign out from client session so they are forced to log in again with new password
 await supabase.auth.signOut();

 setStatusMessage({
 type: "success",
 text: "✅ Password successfully updated! Redirecting to login..."
 });

 setTimeout(() => {
 router.push("/login");
 }, 2500);

 } catch (err: any) {
 console.error("Update password error:", err);
 let errorMsg = err.message || "Failed to update password. Your reset link may have expired.";
 if (errorMsg.toLowerCase().includes("should be different")) {
 errorMsg = "Your new password must be different from your old password. Please choose a different password.";
 }
 setStatusMessage({
 type: "error",
 text: errorMsg
 });
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative z-10 auth-card">
 {/* Logo */}
 <div className="flex justify-center mb-8">
 <a href="/" className="flex items-center gap-1.5 font-bold text-xl tracking-tighter hover:opacity-90 transition-opacity">
 <span className="uppercase text-slate-900 dark:text-white">Smart</span>
 <Heart className="fill-red-500 text-red-500" size={20} />
 <span className="uppercase text-slate-900 dark:text-white">PDFs</span>
 </a>
 </div>

 {/* Header */}
 <div className="text-center space-y-2 mb-8">
 <h3 className="text-2xl font-[900] tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
 Update Password <Lock size={20} className="text-blue-500" />
 </h3>
 <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
 Choose a strong, secure new password below.
 </p>
 </div>

 {/* Status Message */}
 {statusMessage && (
 <div className={`p-4 mb-6 rounded-xl text-xs font-bold leading-relaxed tracking-wide ${
 statusMessage.type === 'success'
 ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-400 border border-green-200/50 dark:border-green-800/30'
 : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400 border border-red-100/50 dark:border-red-800/30'
 }`}>
 <div>{statusMessage.text}</div>
 </div>
 )}

 {/* Form */}
 <form onSubmit={handleResetPassword} className="space-y-5">
 {/* New Password */}
 <div className="space-y-2">
 <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
 New Password
 </label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 id="password"
 required
 disabled={isLoading}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className="w-full pl-4 pr-12 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none cursor-pointer"
 disabled={isLoading}
 aria-label={showPassword ? "Hide password" : "Show password"}
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 {/* Confirm Password */}
 <div className="space-y-2">
 <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
 Confirm Password
 </label>
 <div className="relative">
 <input
 type={showConfirmPassword ? "text" : "password"}
 id="confirmPassword"
 required
 disabled={isLoading}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 placeholder="••••••••"
 className="w-full pl-4 pr-12 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
 />
 <button
 type="button"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none cursor-pointer"
 disabled={isLoading}
 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
 >
 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={isLoading || hasSession === false}
 className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
 >
 {isLoading ? <>⏳ Updating...</> : <>🔑 Update Password</>}
 </button>
 </form>

 <div className="mt-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
 <a href="/login" className="text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center gap-1">
 Back to login <ArrowRight size={14} />
 </a>
 </div>
 </div>
 );
}

export default function ResetPasswordPage() {
 return (
 <div id="auth-page-container" className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
 {/* Background decoration elements */}
 <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />

 <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading reset portal...</div>}>
 <ResetPasswordForm />
 </Suspense>
 </div>
 );
}
