"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Calendar, Settings, History, 
  Edit3, Save, Lock, Shield, ChevronRight, Zap,
  Crown, Sparkles, CheckCircle2, CreditCard, Download, Award
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ClickHistoryItem {
  toolKey: string;
  title: string;
  url: string;
  timestamp: string;
}

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [recentTools, setRecentTools] = useState<ClickHistoryItem[]>([]);
  const [userPlan, setUserPlan] = useState("Basic Plan");



  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  // Set local state when profile loads
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
    if (profile?.current_plan) {
      setUserPlan(profile.current_plan);
    } else if (profile?.plan) {
      setUserPlan(profile.plan);
    }
  }, [profile]);

  // Load local tool usage history
  useEffect(() => {
    try {
      const historyStr = localStorage.getItem("pdf_tool_clicks");
      if (historyStr) {
        const parsed = JSON.parse(historyStr);
        if (Array.isArray(parsed)) {
          setRecentTools(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn("Failed to load local click history:", e);
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("users")
        .upsert(
          {
            email: user.email,
            full_name: fullName,
            last_login: new Date().toISOString(),
          },
          { onConflict: "email" }
        );

      if (error) {
        throw error;
      }

      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      await refreshProfile();
    } catch (err: any) {
      console.error("Update profile error:", err);
      setErrorMsg(err.message || "Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!user) return;
    try {
      setIsDownloading(true);
      
      // Dynamically import pdf-lib to optimize bundle size
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 page dimensions
      
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const invoiceNum = `INV-SP-${Date.now().toString().slice(-6)}`;
      const invoiceDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      
      const priceINR = userPlan === "Yearly Pro" ? "INR 1,699.00" : "INR 399.00";
      const priceUSD = userPlan === "Yearly Pro" ? "$19.99" : "$4.99";
      const cycle = userPlan === "Yearly Pro" ? "Yearly" : "Monthly";

      // 1. Draw Header Header background / banner line
      page.drawRectangle({
        x: 0,
        y: 841.89 - 60,
        width: 595.28,
        height: 60,
        color: rgb(0.93, 0.95, 0.98), // light slate/blue banner
      });

      page.drawText("SMARTPDFS PLUS", {
        x: 40,
        y: 841.89 - 42,
        size: 18,
        font: helveticaBold,
        color: rgb(0.94, 0.27, 0.27), // primary red
      });

      page.drawText("RECEIPT / INVOICE", {
        x: 420,
        y: 841.89 - 40,
        size: 14,
        font: helveticaBold,
        color: rgb(0.1, 0.15, 0.3),
      });

      // 2. Invoice Details
      page.drawText("Invoice Details", { x: 40, y: 720, size: 12, font: helveticaBold, color: rgb(0.1, 0.15, 0.3) });
      page.drawText(`Invoice Number: ${invoiceNum}`, { x: 40, y: 695, size: 10, font: helvetica });
      page.drawText(`Date: ${invoiceDate}`, { x: 40, y: 680, size: 10, font: helvetica });
      page.drawText(`Payment Method: Razorpay`, { x: 40, y: 665, size: 10, font: helvetica });
      page.drawText(`Payment Status: PAID`, { x: 40, y: 650, size: 10, font: helveticaBold, color: rgb(0.1, 0.7, 0.3) });

      // Customer info
      page.drawText("Billed To", { x: 320, y: 720, size: 12, font: helveticaBold, color: rgb(0.1, 0.15, 0.3) });
      page.drawText(`Name: ${fullName || "SmartPDFs Customer"}`, { x: 320, y: 695, size: 10, font: helvetica });
      page.drawText(`Email: ${user.email || ""}`, { x: 320, y: 680, size: 10, font: helvetica });

      // Divider line
      page.drawLine({
        start: { x: 40, y: 610 },
        end: { x: 555.28, y: 610 },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
      });

      // Table Header
      page.drawText("Item / Description", { x: 50, y: 585, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.3) });
      page.drawText("Qty", { x: 350, y: 585, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.3) });
      page.drawText("Price", { x: 480, y: 585, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.3) });

      // Table Row
      page.drawText(`SmartPDFs Plus - ${userPlan} Subscription (${cycle} Cycle)`, { x: 50, y: 555, size: 10, font: helvetica });
      page.drawText("1", { x: 350, y: 555, size: 10, font: helvetica });
      page.drawText(`${priceINR} (${priceUSD} USD)`, { x: 480, y: 555, size: 10, font: helvetica });

      // Divider
      page.drawLine({
        start: { x: 40, y: 535 },
        end: { x: 555.28, y: 535 },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
      });

      // Total section
      page.drawText("Subtotal:", { x: 380, y: 505, size: 10, font: helvetica });
      page.drawText(`${priceINR} (${priceUSD})`, { x: 470, y: 505, size: 10, font: helvetica });

      page.drawText("Total Paid:", { x: 380, y: 485, size: 11, font: helveticaBold, color: rgb(0.1, 0.15, 0.3) });
      page.drawText(`${priceINR} (${priceUSD})`, { x: 470, y: 485, size: 11, font: helveticaBold, color: rgb(0.1, 0.15, 0.3) });

      // Bottom banner
      page.drawRectangle({
        x: 40,
        y: 100,
        width: 515.28,
        height: 80,
        color: rgb(0.96, 0.96, 0.98),
      });

      page.drawText("Thank you for your purchase!", {
        x: 60,
        y: 145,
        size: 11,
        font: helveticaBold,
        color: rgb(0.1, 0.15, 0.3),
      });

      page.drawText("Your subscription is active. All premium offline PDF and Ecommerce label features are unlocked.", {
        x: 60,
        y: 125,
        size: 9,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Save and download PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `SmartPDFs_Receipt_${invoiceNum}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Receipt generation error:", error);
      alert("Could not generate receipt PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading user profile...</p>
        </div>
      </div>
    );
  }

  const getAvatarInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || "U";
  };

  const getJoinedDate = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate a mock license key based on user email
  const getLicenseKey = () => {
    if (!user.email) return "SP-FREE-MEMBER";
    const cleanMail = user.email.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const part1 = cleanMail.slice(0, 4).padEnd(4, "X");
    const part2 = cleanMail.slice(-4).padEnd(4, "Y");
    const prefix = userPlan === "Yearly Pro" ? "YEARLY" : userPlan === "Monthly Pro" ? "MONTHLY" : "FREE";
    return `SP-${prefix}-${part1}-${part2}-2026`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden font-sans">
      
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[550px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 -z-10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Account Banner Card */}
        <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Glowing gradient back accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 p-[3px] shadow-lg flex-shrink-0">
            <div className="w-full h-full rounded-[21px] bg-white dark:bg-slate-950 flex items-center justify-center text-3xl font-black text-slate-800 dark:text-slate-100">
              {getAvatarInitials()}
            </div>
            {/* VIP Golden Badge */}
            <div className="absolute -top-2.5 -right-2.5 bg-amber-500 text-slate-950 p-1.5 rounded-xl shadow-md border border-amber-400 flex items-center justify-center">
              <Crown size={12} className="fill-slate-950 text-slate-950" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3 relative z-10">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                  {profile?.full_name || "SmartPDFs User"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Crown size={10} className="fill-amber-500" /> {userPlan === "Basic Plan" ? "BASIC MEMBER" : "PRO VIP"}
                </span>
              </div>
              <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 flex items-center justify-center md:justify-start gap-1">
                <Sparkles size={14} className="text-indigo-500" /> {userPlan === "Basic Plan" ? "Basic Member" : `${userPlan} Premium Member`}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" /> Member since {getJoinedDate()}
              </span>
            </div>
          </div>

          {/* Premium Status Banner */}
          <div className="relative overflow-hidden bg-gradient-to-tr from-amber-500/10 via-purple-600/10 to-indigo-600/10 dark:from-amber-500/20 dark:via-purple-600/20 dark:to-indigo-600/20 border border-amber-500/20 dark:border-amber-400/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-full md:w-44 flex-shrink-0">
            {/* Soft decorative background glow */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
            <span className="text-[10px] font-black tracking-widest uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1"><Award size={10} /> MEMBERSHIP</span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-purple-600 dark:from-amber-400 dark:to-purple-400 mt-1 uppercase">{userPlan}</span>
            <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">{userPlan === "Basic Plan" ? "Upgrade for Pro Tools 🔓" : "All Pro Tools Unlocked 🔓"}</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (2 cols width on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Interactive Pro Membership Pass (Wow factor) */}
            <div className="relative group overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white transition-all duration-300 hover:shadow-indigo-500/10 hover:border-white/20">
              
              {/* Glowing decorative circles */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative flex flex-col justify-between h-48">
                
                {/* Pass Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      SmartPDFs Plus Pass
                    </span>
                    <p className="text-[10px] text-white/55 uppercase tracking-widest font-black">
                      {userPlan === "Free Plan" ? "STANDARD IDENTITY" : `${userPlan.replace(" Plan", "").toUpperCase()} VIP IDENTITY`}
                    </p>
                  </div>
                  <Crown className="text-amber-400 fill-amber-400/20" size={32} />
                </div>

                {/* Pass Middle */}
                <div className="my-auto pt-4">
                  <p className="font-mono text-base sm:text-lg tracking-widest text-slate-100 font-bold">
                    {getLicenseKey()}
                  </p>
                </div>

                {/* Pass Footer */}
                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <div className="min-w-0">
                    <p className="text-[9px] text-white/45 uppercase tracking-wider font-bold">PASS HOLDER</p>
                    <p className="text-sm font-black truncate max-w-[200px]">{profile?.full_name || "SmartPDFs VIP Member"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9px] text-white/45 uppercase tracking-wider font-bold">STATUS</p>
                    <p className="text-sm font-black text-emerald-400 flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Profile settings card */}
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                  <Settings size={18} className="text-indigo-500" /> Account Settings
                </h2>
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-transparent dark:border-slate-700/50"
                  >
                    <Edit3 size={12} /> Edit Display Name
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold p-3.5 rounded-xl">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold p-3.5 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ""}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-900 rounded-xl py-3.5 px-4 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed outline-none"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFullName(profile?.full_name || "");
                      }}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-all border border-transparent dark:border-slate-700/50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 py-2.5 px-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Save size={13} /> {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>

              {/* Account Security Info card */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                  <Lock size={16} className="text-indigo-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Secure Database</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Your files and actions are logged using local sandboxing. No documents are stored on our servers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                  <Shield size={16} className="text-emerald-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Auth Guarantee</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Secured via industry-standard Supabase identity management. Your credentials are fully encrypted.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* License & Billing mock panel */}
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-6">
              <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-500" /> License &amp; Billing
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Plan Status</span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                    userPlan !== "Basic Plan"
                      ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                      : "text-slate-500 bg-slate-500/10 border-slate-500/20"
                  }`}>
                    {userPlan !== "Basic Plan" ? `${userPlan} (${profile?.subscription_status || 'active'})` : "Basic Plan"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Subscription Start Date</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {profile?.subscription_start_date 
                      ? new Date(profile.subscription_start_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Subscription End Date</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {profile?.subscription_end_date 
                      ? new Date(profile.subscription_end_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Razorpay Customer ID</span>
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                    {profile?.razorpay_customer_id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Billing Cycle</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {userPlan === "Yearly Pro"
                      ? "Annual billing ($19.99/year)"
                      : userPlan === "Monthly Pro"
                      ? "Monthly billing ($4.99/month)"
                      : "No subscription (Basic tier)"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Amount Paid</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {userPlan === "Yearly Pro"
                      ? "$19.99 (via Razorpay)"
                      : userPlan === "Monthly Pro"
                      ? "$4.99 (via Razorpay)"
                      : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-bold text-slate-500">Invoice History</span>
                  {userPlan !== "Basic Plan" ? (
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={handleDownloadReceipt}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 disabled:text-indigo-300 disabled:cursor-not-allowed transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      <Download size={12} className={isDownloading ? "animate-bounce" : ""} />
                      {isDownloading ? "Generating..." : "Download Receipt"}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">No invoices available</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar layout) */}
          <div className="space-y-8">
            
            {/* Pro Features list */}
            <div className="bg-gradient-to-b from-white/80 to-white/60 dark:from-slate-900/70 dark:to-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-5">
              <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> Active Pro Privileges
              </h2>
              
              <div className="space-y-4">
                {[
                  { title: "Unlimited File Conversions", desc: "No hourly caps on batch conversions." },
                  { title: "Huge File Upload Limits", desc: "Process PDFs up to 1GB in size." },
                  { title: "Zero Ads Experience", desc: "100% clean and distraction-free workspace." },
                  { title: "Fast Offline Processing", desc: "Direct browser compilation at top speed." },
                  { title: "Premium OCR Features", desc: "Extract text from scanned PDFs offline." },
                  { title: "24/7 Priority Mail Support", desc: "Helpdesk access with VIP SLA." },
                ].map((feat, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{feat.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent History Sidebar */}
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-5">
              
              <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <History size={16} className="text-indigo-500" /> Recent Tool Clicks
              </h2>

              <div className="space-y-3">
                {recentTools.length > 0 ? (
                  recentTools.map((item, idx) => (
                    <Link
                      key={`${item.toolKey}-${idx}`}
                      href={item.url}
                      className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100/80 dark:border-slate-800/85 rounded-2xl group transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all">
                          <Zap size={14} className="fill-indigo-500/10" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200 truncate leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <p className="text-xs font-extrabold text-slate-400 dark:text-slate-500">No recent activity</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-normal">
                      Used tools will appear here for fast access.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
