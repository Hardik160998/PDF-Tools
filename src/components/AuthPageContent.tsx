"use client";

import { useState, useEffect } from "react";
import { X, Heart, Check, Lock, Users, Shield, Zap, Star, Mail, Key, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface AuthPageContentProps {
 initialMode: "login" | "signup";
}

export default function AuthPageContent({ initialMode }: AuthPageContentProps) {
 const router = useRouter();
 const searchParams = useSearchParams();
 const redirectTo = searchParams?.get("redirect") || "/";
 // Pre-fill email if coming from signup → login redirect (?email=xxx)
 const emailFromQuery = searchParams?.get("email") || "";
 const { loginAsMock, mergeCreditsOnLogin } = useAuth();
 const [mode, setMode] = useState<"login" | "signup" | "forgot-password">(initialMode);

 const [fullName, setFullName] = useState("");
 const [email, setEmail] = useState("");

 useEffect(() => {
 if (typeof window !== "undefined") {
 const params = new URLSearchParams(window.location.search);
 const urlMode = params.get("mode");
 if (urlMode === "forgot-password") {
 setMode("forgot-password");
 } else {
 setMode(initialMode);
 }
 }
 }, [initialMode, searchParams]);

 useEffect(() => {
 if (emailFromQuery) {
 setEmail(emailFromQuery);
 }
 }, [emailFromQuery]);
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

 const [isOtpSent, setIsOtpSent] = useState(false);
 const [otpCode, setOtpCode] = useState("");
 const [signupToken, setSignupToken] = useState("");

 // Show a quick success hint if we arrived here right after signup OTP verify
 const justVerified = initialMode === "login" && !!emailFromQuery;

 const isSignUp = mode === "signup";

 const handleToggleMode = (newMode: "login" | "signup" | "forgot-password") => {
 setFullName("");
 // Keep email so user doesn't have to retype when switching tabs
 setPassword("");
 setShowPassword(false);
 setStatusMessage(null);
 setIsLoading(false);
 setIsOtpSent(false);
 setOtpCode("");
 setSignupToken("");
 setMode(newMode);
 // Update URL — preserve email query param if present
 const params = new URLSearchParams();
 if (redirectTo && redirectTo !== "/") params.set("redirect", redirectTo);
 if (email) params.set("email", email);
 
 if (newMode === "forgot-password") {
 params.set("mode", "forgot-password");
 router.push("/login?" + params.toString());
 } else {
 const queryString = params.toString() ? `?${params.toString()}` : "";
 router.push((newMode === "login" ? "/login" : "/signup") + queryString);
 }
 };

 const handleAuth = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsLoading(true);
 setStatusMessage(null);

 let guestToken: string | undefined;
 try {
 const stored = localStorage.getItem("pdf_guest_session");
 if (stored) guestToken = JSON.parse(stored)?.sessionToken;
 } catch { }

 try {
 if (isSignUp) {
 // Show immediate feedback before SMTP completes (can take 2-5s)
 setStatusMessage({
 type: "success",
 text: "Sending verification code to your email... ✉️"
 });

 // Send OTP via Gmail SMTP by calling our API
 const res = await fetch("/api/auth/signup", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ email, password, fullName })
 });
 
 let data;
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 data = await res.json();
 } else {
 const text = await res.text();
 console.error("Signup API error response:", text);
 throw new Error(`Server error (${res.status}). Please try again later.`);
 }
 
 if (res.ok && data.success) {
 setSignupToken(data.signupToken);
 setIsOtpSent(true);
 setStatusMessage({
 type: "success",
 text: "✅ Code sent! Check your email and enter the 6-digit code below."
 });
 } else {
 throw new Error(data.error || "Failed to send verification code.");
 }
 } else {
 // Login Flow (Email & Password only)
 const { data, error } = await supabase.auth.signInWithPassword({
 email,
 password
 });

 if (error) throw error;

 if (data.user) {
 // ✅ Run DB update + credit merge in PARALLEL — saves 500-800ms
 // Wrap supabase call in Promise.resolve() since it returns PromiseLike (not full Promise)
 const [, newCredits] = await Promise.all([
 Promise.resolve(
 supabase
 .from('users')
 .update({
 last_login: new Date().toISOString(),
 is_confirmation: true
 })
 .eq('id', data.user.id)
 ).catch(() => null),
 mergeCreditsOnLogin(guestToken).catch(() => null)
 ]);

 const creditMsg = newCredits !== null ? ` You now have ${newCredits} credits.` : "";
 setStatusMessage({ type: "success", text: `Logged in! 🎉${creditMsg} Redirecting...` });
 // Redirect quickly — onAuthStateChange will handle profile sync in background
 setTimeout(() => {
 router.push(redirectTo);
 }, 600);
 }
 }
 } catch (err: any) {
 console.error("Auth error:", err);
 setStatusMessage({ type: "error", text: err.message || "Authentication failed." });
 } finally {
 setIsLoading(false);
 }
 };

 const handleVerifyOtp = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsLoading(true);
 setStatusMessage(null);

 try {
 const res = await fetch("/api/auth/verify-otp", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ signupToken, userOtp: otpCode })
 });
 
 let data;
 const contentType = res.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
 data = await res.json();
 } else {
 const text = await res.text();
 console.error("Verify OTP API error response:", text);
 throw new Error(`Server error (${res.status}). Please try again.`);
 }

 if (!res.ok || !data.success) {
 throw new Error(data.error || "Failed to verify code.");
 }

 setStatusMessage({
 type: "success",
 text: "✅ Account verified! Redirecting to login..."
 });

 // Redirect quickly — reduced from 2000ms to 700ms
 setTimeout(() => {
 setIsOtpSent(false);
 setMode("login");
 setPassword("");
 setStatusMessage(null);
 setIsLoading(false);
 // Pass email as query param so login form is pre-filled
 router.push(`/login?email=${encodeURIComponent(email)}`);
 }, 700);

 } catch (err: any) {
 console.error("OTP verification error:", err);
 setStatusMessage({ type: "error", text: err.message || "OTP verification failed." });
 } finally {
 setIsLoading(false);
 }
 };

 const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsLoading(true);
 setStatusMessage(null);

 try {
 const { error } = await supabase.auth.resetPasswordForEmail(email, {
 redirectTo: `${window.location.origin}/reset-password`,
 });

 if (error) throw error;

 setStatusMessage({
 type: "success",
 text: "✅ Reset link sent! Check your email inbox and spam folder."
 });
 } catch (err: any) {
 console.error("Forgot password error:", err);
 setStatusMessage({ type: "error", text: err.message || "Failed to send reset link." });
 } finally {
 setIsLoading(false);
 }
 };

 return (
   <div
     id="auth-page-container"
     className="min-h-screen w-full bg-slate-950 flex overflow-hidden "
   >
     {/* Left Side: Stats & Marketing (hidden on mobile) */}
     <div
       className="hidden md:flex flex-col justify-between w-1/2 p-12 text-white relative overflow-hidden"
       style={{
         background:
           "linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #8b5cf6 100%)",
       }}
     >
       {/* Subtle background circles */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

       {/* Logo */}
       <div className="flex items-center justify-between relative z-10">
         <a
           href="/"
           className="flex items-center gap-1.5 font-bold text-xl tracking-tighter hover:opacity-90 transition-opacity"
         >
           <Image
             src="/img/logo-v-trans.png"
             alt="SmartPDFPro"
             width={180}
             height={40}
             className="h-10 w-auto"
           />
         </a>
       </div>

       {/* Title & Description */}
       <div className="my-auto space-y-8 max-w-lg relative z-10">
         <h2 className="text-4xl lg:text-5xl font-[900] leading-tight tracking-tight text-white">
           Process PDFs Privately &amp; Fast ⚡
         </h2>
         <p className="text-white/80 text-base font-medium leading-relaxed">
           Convert, merge, split, compress, and sign your PDFs directly in your
           browser. Your files never leave your device.
         </p>

         {/* Stats Boxes */}
         <div className="grid grid-cols-3 gap-4 pt-2">
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
             <span className="block text-2xl lg:text-3xl font-[900] tracking-tight leading-none text-white">
               22+
             </span>
             <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-2 block">
               Free Tools
             </span>
           </div>
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
             <span className="block text-2xl lg:text-3xl font-[900] tracking-tight leading-none text-white">
               1M+
             </span>
             <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-2 block">
               Active Users
             </span>
           </div>
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
             <span className="block text-2xl lg:text-3xl font-[900] tracking-tight leading-none text-white">
               100%
             </span>
             <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-2 block">
               Browser Safe
             </span>
           </div>
         </div>

         {/* Check list */}
         <div className="space-y-4 pt-4">
           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
               <Check size={14} className="text-white" />
             </div>
             <span className="text-sm font-semibold text-white/95">
               Zero uploads — files never leave your device
             </span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
               <Check size={14} className="text-white" />
             </div>
             <span className="text-sm font-semibold text-white/95">
               Local browser compilation — no queues or waiting
             </span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
               <Check size={14} className="text-white" />
             </div>
             <span className="text-sm font-semibold text-white/95">
               No login required to start converting
             </span>
           </div>
         </div>

         {/* Testimonial */}
         <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 mt-6">
           <div className="flex gap-1 mb-2.5">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star
                 key={s}
                 size={14}
                 className="fill-yellow-400 text-yellow-400"
               />
             ))}
           </div>
           <p className="text-sm font-medium italic text-white/95 leading-relaxed">
             &ldquo;Smart PDFs is my daily choice. It&apos;s incredibly fast and
             doesn&apos;t compromise my document privacy at all.&rdquo;
           </p>
           <div className="flex items-center gap-3 mt-4">
             <div className="w-9 h-9 rounded-full bg-yellow-400 text-slate-900 font-bold text-sm flex items-center justify-center">
               Y
             </div>
             <div>
               <span className="block text-xs font-bold">Yash Bhaliya</span>
               <span className="block text-[10px] text-white/60 font-semibold leading-none">
                 Developer &amp; Verified Seller
               </span>
             </div>
           </div>
         </div>
       </div>

       {/* Footer security badges */}
       <div className="flex items-center justify-between pt-6 border-t border-white/10 text-white/70 text-[10px] font-bold tracking-wider uppercase relative z-10">
         <span className="flex items-center gap-1.5">
           <Lock size={14} /> AES-256 Encrypted
         </span>
         <span className="flex items-center gap-1.5">
           <Users size={14} /> 1M+ Users
         </span>
         <span className="flex items-center gap-1.5">
           <Shield size={14} /> Local Processing
         </span>
         <span className="flex items-center gap-1.5">
           <Zap size={14} /> Instant
         </span>
       </div>
     </div>

     {/* Right Side: Login/Signup Form */}
     <div className="w-full md:w-1/2 bg-white p-8 sm:p-16 flex flex-col justify-between relative text-slate-800 min-h-screen">
       {/* Top bar on Mobile (logo & close button placeholder space) */}
       <div className="flex md:hidden items-center justify-between w-full mb-8">
         <a
           href="/"
           className="flex items-center gap-1.5 font-bold text-lg tracking-tighter"
         >
           <Image
             src="/img/logo-v-trans.png"
             alt="SmartPDFPro"
             width={180}
             height={40}
             className="h-10 w-auto"
           />
         </a>
       </div>

       {/* Close Button (redirects to home) */}
       <a
         href="/"
         className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-20 auth-btn-secondary"
         aria-label="Close"
       >
         <X size={20} />
       </a>

       {/* Form wrapper */}
       <div className="my-auto space-y-8 w-full max-w-md mx-auto">
         {/* Login/Signup Toggle Pill */}
         {!isOtpSent && mode !== "forgot-password" && (
           <div className="flex justify-center">
             <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-2xl flex gap-1 w-full max-w-[280px] auth-toggle-pill-container">
               <button
                 type="button"
                 onClick={() => handleToggleMode("login")}
                 className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                   !isSignUp
                     ? "bg-white shadow-md border border-slate-200/50 text-slate-900 auth-toggle-active-btn"
                     : "text-slate-400 hover:text-slate-700 auth-toggle-inactive-btn"
                 }`}
               >
                 Login
               </button>
               <button
                 type="button"
                 onClick={() => handleToggleMode("signup")}
                 className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                   isSignUp
                     ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                     : "text-slate-400 hover:text-slate-700 auth-toggle-inactive-btn"
                 }`}
               >
                 Sign Up
               </button>
             </div>
           </div>
         )}

         {/* Header info */}
         <div className="text-center md:text-left space-y-2">
           <h3 className="text-3xl font-[900] tracking-tight flex items-center justify-center md:justify-start gap-2 text-slate-900">
             {isOtpSent
               ? "Verify Your Email ✉️"
               : mode === "forgot-password"
                 ? "Reset Your Password 🔒"
                 : isSignUp
                   ? "Join Smart PDFs 🚀"
                   : "Welcome Back! 👋"}
           </h3>
           <p className="text-slate-500 text-sm font-semibold">
             {isOtpSent
               ? `Enter the 6-digit code sent to ${email} to complete your signup.`
               : mode === "forgot-password"
                 ? "Enter your email address and we will send you a recovery link."
                 : isSignUp
                   ? "Free account. Start organizing your files today."
                   : "Sign in to access your saved history and preferences."}
           </p>
         </div>

         {/* Just-verified hint — shown when redirected from OTP verification */}
         {justVerified && !statusMessage && (
           <div className="p-3.5 rounded-xl bg-green-50 border border-green-100 text-green-800 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
             <span className="text-base">✅</span>
             <span>
               Account verified! Your email is pre-filled — just enter your
               password to log in instantly.
             </span>
           </div>
         )}

         {/* Status Message */}
         {statusMessage && (
           <div
             className={`p-4 rounded-xl text-xs font-bold leading-relaxed tracking-wide ${
               statusMessage.type === "success"
                 ? "bg-green-50 text-green-800 border border-green-200/50"
                 : "bg-red-50 text-red-800 border border-red-100/50"
             }`}
           >
             <div>{statusMessage.text}</div>
           </div>
         )}

         {/* Form */}
         {isOtpSent ? (
           <form onSubmit={handleVerifyOtp} className="space-y-5">
             <div className="space-y-2">
               <label
                 htmlFor="otp"
                 className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
               >
                 6-Digit Verification Code
               </label>
               <input
                 type="text"
                 id="otp"
                 required
                 disabled={isLoading}
                 value={otpCode}
                 onChange={(e) =>
                   setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                 }
                 placeholder="123456"
                 className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-center font-mono text-xl tracking-widest text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-50 font-bold"
               />
             </div>

             {/* Submit Button */}
             <button
               type="submit"
               disabled={isLoading || otpCode.length !== 6}
               className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
             >
               {isLoading ? (
                 <>⏳ Verifying...</>
               ) : (
                 <>✨ Verify &amp; Complete Signup</>
               )}
             </button>

             <button
               type="button"
               onClick={() => {
                 setIsOtpSent(false);
                 setOtpCode("");
                 setStatusMessage(null);
               }}
               className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-2 bg-transparent border-none cursor-pointer"
             >
               ← Back to signup details
             </button>
           </form>
         ) : mode === "forgot-password" ? (
           <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
             {/* Email Address */}
             <div className="space-y-2">
               <label
                 htmlFor="email"
                 className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
               >
                 Email Address
               </label>
               <input
                 type="email"
                 id="email"
                 required
                 disabled={isLoading}
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="you@example.com"
                 className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
               />
             </div>

             {/* Submit Button */}
             <button
               type="submit"
               disabled={isLoading}
               className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
             >
               {isLoading ? <>⏳ Sending...</> : <>✉️ Send Reset Link</>}
             </button>

             <button
               type="button"
               onClick={() => handleToggleMode("login")}
               className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-2 bg-transparent border-none cursor-pointer"
             >
               ← Back to Login
             </button>
           </form>
         ) : (
           <form onSubmit={handleAuth} className="space-y-5">
             {/* Full Name (Sign Up only) */}
             {isSignUp && (
               <div className="space-y-2">
                 <label
                   htmlFor="fullname"
                   className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                 >
                   Full Name
                 </label>
                 <input
                   type="text"
                   id="fullname"
                   required
                   disabled={isLoading}
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   placeholder="Your full name"
                   className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
                 />
               </div>
             )}

             {/* Email Address */}
             <div className="space-y-2">
               <label
                 htmlFor="email"
                 className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
               >
                 Email Address
               </label>
               <input
                 type="email"
                 id="email"
                 required
                 disabled={isLoading}
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="you@example.com"
                 className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
               />
             </div>

             {/* Password */}
             <div className="space-y-2">
               <div className="flex justify-between items-center">
                 <label
                   htmlFor="password"
                   className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                 >
                   Password
                 </label>
                 {!isSignUp && (
                   <button
                     type="button"
                     onClick={() => handleToggleMode("forgot-password")}
                     className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                   >
                     Forgot password?
                   </button>
                 )}
               </div>
               <div className="relative">
                 <input
                   type={showPassword ? "text" : "password"}
                   id="password"
                   required
                   disabled={isLoading}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full pl-4 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                   disabled={isLoading}
                   aria-label={showPassword ? "Hide password" : "Show password"}
                 >
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
               </div>
             </div>

             {/* Submit Button */}
             <button
               type="submit"
               disabled={isLoading}
               className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
             >
               {isLoading ? (
                 <>⏳ Processing...</>
               ) : isSignUp ? (
                 <>✨ Send Code &amp; Sign Up</>
               ) : (
                 <>🔑 Secure Login</>
               )}
             </button>
           </form>
         )}

         {/* Toggle Footer text */}
         {!isOtpSent && (
           <div className="text-center text-xs font-semibold text-slate-500 pt-2">
             {isSignUp ? (
               <>
                 Already have an account?{""}
                 <button
                   type="button"
                   onClick={() => handleToggleMode("login")}
                   className="text-blue-600 hover:text-blue-500 transition-colors underline bg-transparent border-none p-0 cursor-pointer"
                 >
                   Log in here
                 </button>
               </>
             ) : (
               <>
                 New to Smart PDFs?{""}
                 <button
                   type="button"
                   onClick={() => handleToggleMode("signup")}
                   className="text-blue-600 hover:text-blue-500 transition-colors underline bg-transparent border-none p-0 cursor-pointer"
                 >
                   Create free account
                 </button>
               </>
             )}
           </div>
         )}
       </div>

       {/* Secure label */}
       <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-12">
         <Lock size={12} className="text-slate-400" /> Secured with AES-256
         Encryption
       </div>
     </div>
   </div>
 );
}
