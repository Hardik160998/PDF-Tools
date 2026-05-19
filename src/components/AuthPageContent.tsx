"use client";

import { useState } from "react";
import { X, Heart, Check, Lock, Users, Shield, Zap, Star, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, saveUserSignup, saveUserLogin } from "../lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface AuthPageContentProps {
  initialMode: "login" | "signup";
}

export default function AuthPageContent({ initialMode }: AuthPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/";
  const { loginAsMock } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const isSignUp = mode === "signup";

  const handleToggleMode = (newMode: "login" | "signup") => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setStatusMessage(null);
    setIsLoading(false);
    setMode(newMode);
    // Update URL to match selected mode
    router.push(newMode === "login" ? "/login" : "/signup");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setStatusMessage({ type: 'error', text: "Passwords do not match." });
          setIsLoading(false);
          return;
        }

        // Try registering in Supabase Auth first
        let authError = null;
        try {
          const authClient = supabase.auth;
          if (authClient && typeof authClient.signUp === 'function') {
            const { error: aErr } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName
                }
              }
            });
            authError = aErr;
          }
        } catch (e) {
          console.warn("Supabase Auth signUp failed, using public table insertion:", e);
        }

        if (authError) {
          setStatusMessage({ type: 'error', text: authError.message });
          setIsLoading(false);
          return;
        }

        // Always save to the public users table for logging and fallback custom sessions
        const { error } = await saveUserSignup(email, fullName);
        if (error) {
          console.warn("Public users table registration logging failed:", error);
        }
        setStatusMessage({ type: 'success', text: "Account created successfully! Redirecting..." });
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } else {
        // Try logging in via Supabase Auth first
        let authError = null;
        try {
          const authClient = supabase.auth;
          if (authClient && typeof authClient.signInWithPassword === 'function') {
            const { error: aErr } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            authError = aErr;
          }
        } catch (e) {
          console.warn("Supabase Auth signIn failed, using public table update:", e);
        }

        if (authError) {
          setStatusMessage({ type: 'error', text: authError.message });
          setIsLoading(false);
          return;
        }

        // Always save to the public users table for logging
        const { error } = await saveUserLogin(email);
        if (error) {
          console.warn("Public users table login logging failed:", error);
        }
        setStatusMessage({ type: 'success', text: "Logged in successfully! Redirecting..." });
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err?.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-page-container" className="min-h-screen w-full bg-slate-950 flex overflow-hidden font-sans">

      {/* Left Side: Stats & Marketing (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #8b5cf6 100%)' }}>

        {/* Subtle background circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center justify-between relative z-10">
          <a href="/" className="flex items-center gap-1.5 font-bold text-xl tracking-tighter hover:opacity-90 transition-opacity">
            <span className="uppercase text-white">Smart</span>
            <Heart className="fill-red-500 text-red-500" size={20} />
            <span className="uppercase text-white">PDFs</span>
          </a>
        </div>

        {/* Title & Description */}
        <div className="my-auto space-y-8 max-w-lg relative z-10">
          <h2 className="font-outfit text-4xl lg:text-5xl font-[900] leading-tight tracking-tight text-white">
            Process PDFs Privately &amp; Fast ⚡
          </h2>
          <p className="text-white/80 text-base font-medium leading-relaxed">
            Convert, merge, split, compress, and sign your PDFs directly in your browser. Your files never leave your device.
          </p>

          {/* Stats Boxes */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <span className="block text-2xl lg:text-3xl font-[900] tracking-tight leading-none text-white">22+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-2 block">Free Tools</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <span className="block text-2xl lg:text-3xl font-[900] tracking-tight leading-none text-white">1M+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-2 block">Active Users</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <span className="block text-2xl lg:text-3xl font-[900] tracking-tight leading-none text-white">100%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-2 block">Browser Safe</span>
            </div>
          </div>

          {/* Check list */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white/95">Zero uploads — files never leave your device</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white/95">Local browser compilation — no queues or waiting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white/95">No login required to start converting</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 mt-6">
            <div className="flex gap-1 mb-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm font-medium italic text-white/95 leading-relaxed">
              &ldquo;Smart PDFs is my daily choice. It&apos;s incredibly fast and doesn&apos;t compromise my document privacy at all.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-9 h-9 rounded-full bg-yellow-400 text-slate-900 font-bold text-sm flex items-center justify-center">
                Y
              </div>
              <div>
                <span className="block text-xs font-bold">Yash Bhaliya</span>
                <span className="block text-[10px] text-white/60 font-semibold leading-none">Developer &amp; Verified Seller</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer security badges */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 text-white/70 text-[10px] font-bold tracking-wider uppercase relative z-10">
          <span className="flex items-center gap-1.5"><Lock size={14} /> AES-256 Encrypted</span>
          <span className="flex items-center gap-1.5"><Users size={14} /> 1M+ Users</span>
          <span className="flex items-center gap-1.5"><Shield size={14} /> Local Processing</span>
          <span className="flex items-center gap-1.5"><Zap size={14} /> Instant</span>
        </div>
      </div>

      {/* Right Side: Login/Signup Form */}
      <div className="w-full md:w-1/2 bg-white p-8 sm:p-16 flex flex-col justify-between relative text-zinc-800 min-h-screen">

        {/* Top bar on Mobile (logo & back button) */}
        <div className="flex md:hidden items-center justify-between w-full mb-8">
          <a href="/" className="flex items-center gap-1.5 font-bold text-lg tracking-tighter">
            <span className="uppercase text-zinc-900">Smart</span>
            <Heart className="fill-red-500 text-red-500" size={16} />
            <span className="uppercase text-zinc-900">PDFs</span>
          </a>
          <a href="/" className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-600 hover:text-zinc-900 transition-colors bg-zinc-100 px-2.5 py-1.5 rounded-xl border border-zinc-200">
            <ArrowLeft size={12} /> Back
          </a>
        </div>

        {/* Close Button (redirects to home) */}
        <a
          href="/"
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-20"
          aria-label="Close"
        >
          <X size={20} />
        </a>

        {/* Form wrapper */}
        <div className="my-auto space-y-8 w-full max-w-md mx-auto">

          {/* Login/Signup Toggle Pill */}
          <div className="flex justify-center">
            <div className="bg-zinc-100 border border-zinc-200 p-1.5 rounded-2xl flex gap-1 w-full max-w-[280px]">
              <button
                type="button"
                onClick={() => handleToggleMode("login")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${!isSignUp
                    ? "bg-white shadow-md border border-zinc-200/50"
                    : "text-zinc-400 hover:text-zinc-700"
                  }`}
                style={!isSignUp ? { color: "#09090b" } : undefined}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode("signup")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${isSignUp
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-zinc-400 hover:text-zinc-700"
                  }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Header info */}
          <div className="text-center md:text-left space-y-2">
            <h3 className="font-outfit text-3xl font-[900] tracking-tight flex items-center justify-center md:justify-start gap-2 text-zinc-900">
              {isSignUp ? "Join Smart PDFs 🚀" : "Welcome Back! 👋"}
            </h3>
            <p className="text-zinc-500 text-sm font-semibold">
              {isSignUp
                ? "Free account. Start organizing your files today."
                : "Sign in to access your saved history and preferences."}
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-xl text-xs font-bold leading-relaxed tracking-wide ${statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                : 'bg-rose-50 text-rose-800 border border-rose-200/50'
              }`}>
              <div>{statusMessage.text}</div>
              {statusMessage.type === 'error' && (
                <div className="mt-3 pt-3 border-t border-rose-200/40 flex flex-col gap-2">
                  <p className="text-[10px] text-rose-700/80 font-medium normal-case leading-normal">
                    Supabase limits emails in dev mode. You can log in locally to test pages and views.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsMock(email || "dev@smartpdfs.com", fullName || "SmartPDFs Dev");
                      setStatusMessage({ type: 'success', text: "Logged in via Dev Bypass! Redirecting..." });
                      setTimeout(() => {
                        router.push(redirectTo);
                      }, 1200);
                    }}
                    className="w-full py-2 px-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Bypass &amp; Log In Locally (Dev Mode)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="fullname" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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
                  className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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
                className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Password
                </label>
                {!isSignUp && (
                  <a href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-wider">
                    Forgot?
                  </a>
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
                  placeholder={isSignUp ? "Min 6 characters" : "Enter password"}
                  className="w-full pl-4 pr-12 py-3.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold disabled:opacity-50"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>⏳ Processing...</>
              ) : isSignUp ? (
                <>✨ Create Free Account</>
              ) : (
                <>🔓 Sign In to Account</>
              )}
            </button>
          </form>

          {/* Toggle Footer text */}
          <div className="text-center text-xs font-semibold text-zinc-500 pt-2">
            {isSignUp ? (
              <>
                Already have an account?{" "}
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
                New to Smart PDFs?{" "}
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

        </div>

        {/* Secure label */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase mt-12">
          <Lock size={12} className="text-zinc-400" /> Secured with AES-256 Encryption
        </div>
      </div>
    </div>
  );
}
