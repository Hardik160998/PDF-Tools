"use client";

import { useEffect, useRef, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { triggerRazorpayPayment } from '@/lib/razorpay';
import { Crown, CheckCircle2, Sparkles, Check, HelpCircle, CreditCard, Download } from 'lucide-react';

const PLAN_TOOLS = [
  {
    category: "Ecommerce Label Croppers",
    description: "Automated, high-fidelity label preparation for online sellers. Removes invoices, extracts addresses, and optimizes barcodes.",
    isProOnly: true,
    tools: [
      { name: "Meesho Label & Invoice Cropper", desc: "Auto-removes invoices below Total. Clean labels in one click." },
      { name: "Meesho Crop Label (no invoice)", desc: "Crops Meesho labels to keep only addresses and barcodes." },
      { name: "Flipkart Label Cropper", desc: "Smart OCR cropping for Flipkart/E-kart shipping labels." },
      { name: "Amazon Label Cropper", desc: "Extracts Amazon shipping labels and removes invoice pages." },
      { name: "Snapdeal Label Cropper", desc: "Smart border detection to crop Snapdeal shipping labels perfectly." }
    ]
  },
  {
    category: "Advanced & Special Tools",
    description: "Highly specialized image cropping, selective rendering, and browser-based signing.",
    isProOnly: true,
    tools: [
      { name: "Aadhar ID Card Cropper", desc: "Crop Aadhar ID cards from e-Aadhar PDFs for high-quality printing." },
      { name: "E-Sign PDF Documents", desc: "Draw or type signatures and place them anywhere on a document." },
      { name: "Edit PDF", desc: "Highlight, draw, and add text or freehand annotations directly on PDFs." },
      { name: "OCR PDF", desc: "Recognize text layer in scanned PDFs with zero remote uploads." }
    ]
  },
  {
    category: "Document Security & Privacy",
    description: "State-of-the-art encryption, redaction, and access controls.",
    isProOnly: true,
    tools: [
      { name: "Protect PDF (Encrypt)", desc: "Encrypt PDF with a password. Manage PDF permissions." },
      { name: "Unlock PDF (Decrypt)", desc: "Remove PDF password security and download unrestricted file." },
      { name: "Redact PDF (Blackout)", desc: "Permanently hide sensitive text and graphics with black boxes." }
    ]
  },
  {
    category: "Standard PDF Operations",
    description: "Essential PDF organization and file size management. Included in the Free Plan.",
    isProOnly: false,
    tools: [
      { name: "Merge PDF", desc: "Combine multiple PDF files into one in any order." },
      { name: "Split PDF", desc: "Extract specific pages or separate a PDF into single pages." },
      { name: "Compress PDF", desc: "Reduce file size while preserving document quality." },
      { name: "Organize PDF Pages", desc: "Reorder, rotate, delete, or add blank pages to a PDF." },
      { name: "Compare PDF", desc: "Compare two PDFs side by side and see changes instantly." },
      { name: "Flatten PDF", desc: "Merge annotations and layers into a flat, non-editable PDF." },
      { name: "Repair PDF", desc: "Recover data and structure from corrupted or damaged PDFs." }
    ]
  },
  {
    category: "Document Conversion & Exports",
    description: "High-accuracy format conversion to and from PDF. Included in the Free Plan.",
    isProOnly: false,
    tools: [
      { name: "Word to PDF & PDF to Word", desc: "Convert files back and forth between docx and PDF formats." },
      { name: "Excel to PDF & PDF to Excel", desc: "Convert spreadsheets and extract tables with high accuracy." },
      { name: "PPT to PDF & PDF to PPT", desc: "Convert slides and presentations to easy-to-read PDFs." },
      { name: "Image to PDF & PDF to Image", desc: "Convert JPG/PNG images to PDF, and export PDF pages as images." },
      { name: "HTML & Webpage to PDF", desc: "Convert webpage URLs or static HTML pages to pixel-perfect PDFs." }
    ]
  }
];

const FAQS = [
  {
    q: "How does the Yearly Pro plan work?",
    a: "Our Yearly Pro is an annual subscription. You pay once a year ($19.99/year) and get unlimited access to all tools, ecommerce label croppers, and feature updates. You can manage or cancel your subscription at any time."
  },
  {
    q: "Is browser-based processing safe for private files?",
    a: "Absolutely! Unlike standard PDF sites, our tools process files directly inside your browser locally using WebAssembly. Your documents are never uploaded to our servers, keeping them 100% private."
  },
  {
    q: "Can I cancel my Monthly Pro subscription?",
    a: "Yes, you can cancel or change your Monthly Pro subscription at any time. Simply visit your Profile settings or contact support to manage your plan billing."
  },
  {
    q: "Which eCommerce labels are currently supported?",
    a: "We support specialized croppers for Meesho (with/without invoices), Flipkart, Amazon, and Snapdeal shipping labels, helping online merchants streamline their order packaging process."
  }
];

function PremiumPlansContent() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasTriggeredRef = useRef(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const activePlan = user ? (profile?.current_plan || profile?.plan || "Basic Plan") : null;

  const handleDownloadReceipt = async () => {
    if (!user) return;
    try {
      setIsDownloading(true);
      
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);
      
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const invoiceNum = `INV-SP-${Date.now().toString().slice(-6)}`;
      const invoiceDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      
      const priceINR = activePlan === "Yearly Pro" ? "INR 1,699.00" : "INR 399.00";
      const priceUSD = activePlan === "Yearly Pro" ? "$19.99" : "$4.99";
      const cycle = activePlan === "Yearly Pro" ? "Yearly" : "Monthly";

      // 1. Draw Header Header background / banner line
      page.drawRectangle({ x: 0, y: 841.89 - 60, width: 595.28, height: 60, color: rgb(0.93, 0.95, 0.98) });
      page.drawText("SMARTPDFS PLUS", { x: 40, y: 841.89 - 42, size: 18, font: helveticaBold, color: rgb(0.94, 0.27, 0.27) });
      page.drawText("RECEIPT / INVOICE", { x: 420, y: 841.89 - 40, size: 14, font: helveticaBold, color: rgb(0.1, 0.15, 0.3) });

      // 2. Add Invoice metadata
      page.drawText("Billed To:", { x: 40, y: 730, size: 10, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText(profile?.full_name || user.email || "Valued Customer", { x: 40, y: 715, size: 11, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(user.email || "", { x: 40, y: 700, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3) });

      page.drawText(`Invoice Number:`, { x: 380, y: 730, size: 10, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText(invoiceNum, { x: 470, y: 730, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      
      page.drawText(`Date of Issue:`, { x: 380, y: 715, size: 10, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText(invoiceDate, { x: 470, y: 715, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      
      page.drawText(`Payment Method:`, { x: 380, y: 700, size: 10, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText("Razorpay (Online)", { x: 470, y: 700, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });

      // 3. Draw Table headers
      const tableY = 620;
      page.drawLine({ start: { x: 40, y: tableY }, end: { x: 555.28, y: tableY }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
      page.drawText("DESCRIPTION", { x: 50, y: tableY - 20, size: 9, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText("BILLING CYCLE", { x: 300, y: tableY - 20, size: 9, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText("AMOUNT", { x: 490, y: tableY - 20, size: 9, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawLine({ start: { x: 40, y: tableY - 30 }, end: { x: 555.28, y: tableY - 30 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

      // 4. Draw Row
      page.drawText(`SmartPDFs ${activePlan} Subscription`, { x: 50, y: tableY - 55, size: 10, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText("Offline processing & ecommerce labels unlocked", { x: 50, y: tableY - 70, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });
      page.drawText(cycle, { x: 300, y: tableY - 55, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(priceUSD, { x: 490, y: tableY - 55, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      page.drawLine({ start: { x: 40, y: tableY - 90 }, end: { x: 555.28, y: tableY - 90 }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });

      // 5. Draw Totals
      page.drawText("Subtotal:", { x: 380, y: tableY - 115, size: 10, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText(priceUSD, { x: 490, y: tableY - 115, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      
      page.drawText("Tax (0%):", { x: 380, y: tableY - 135, size: 10, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
      page.drawText("$0.00", { x: 490, y: tableY - 135, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });

      page.drawLine({ start: { x: 380, y: tableY - 150 }, end: { x: 555.28, y: tableY - 150 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

      page.drawText("Total Paid:", { x: 380, y: tableY - 170, size: 12, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(priceUSD, { x: 490, y: tableY - 170, size: 12, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(`(${priceINR})`, { x: 490, y: tableY - 185, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });

      // Bottom banner
      page.drawRectangle({ x: 40, y: 100, width: 515.28, height: 80, color: rgb(0.96, 0.96, 0.98) });
      page.drawText("Thank you for your purchase!", { x: 60, y: 145, size: 11, font: helveticaBold, color: rgb(0.1, 0.15, 0.3) });
      page.drawText("Your subscription is active. All premium offline PDF and Ecommerce label features are unlocked.", { x: 60, y: 125, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });

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

  const handleCheckout = async (plan: "yearly" | "monthly") => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/premium-plans?plan=${plan}`)}`);
      return;
    }
    const isYearly = plan === "yearly";
    const amountINR = isYearly ? 1699 : 399;
    const planName = isYearly ? "Yearly Pro" : "Monthly Pro";

    await triggerRazorpayPayment({
      userId: user.id,
      planName,
      amountINR,
      userEmail: user.email || "",
      userName: profile?.full_name || user.user_metadata?.full_name || "SmartPDFs Customer",
      onSuccess: (paymentId) => {
        alert(`Payment successful! Payment ID: ${paymentId}`);
        router.push("/profile");
      }
    });
  };

  useEffect(() => {
    if (user && !hasTriggeredRef.current) {
      const planParam = searchParams?.get("plan");
      if (planParam === "yearly" || planParam === "monthly") {
        hasTriggeredRef.current = true;
        // Clean URL parameters immediately to prevent multiple triggers on reload
        router.replace("/premium-plans");
        handleCheckout(planParam);
      }
    }
  }, [user, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 pb-24 px-6">
      {/* Hero Banner Section */}
      <section className="py-16 text-center">
        <div className="w-full mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 text-xs font-semibold uppercase tracking-widest shadow-sm mb-6">
            <Crown size={14} className="fill-amber-500/20" />
            Pricing Plans
          </div>
          <h1 className="font-outfit text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            Premium Tool <span className="text-red-500">Plans</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Unlock advanced features, higher file size limits, and priority browser processing. Choose the plan that works best for you.
          </p>
          
          <div className="flex justify-center mb-4">
            <button 
              onClick={() => document.getElementById('plan-details')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer bg-indigo-50 dark:bg-indigo-950/30 px-5 py-2.5 rounded-full"
            >
              Plan All Details View
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>

          {user && activePlan && activePlan !== "Basic Plan" && (
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-6 mt-8 w-full text-left mb-16">
              <h2 className="font-outfit text-xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-500" /> License &amp; Billing
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Current Plan Status</span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                    activePlan !== "Basic Plan"
                      ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                      : "text-slate-500 bg-slate-500/10 border-slate-500/20"
                  }`}>
                    {activePlan !== "Basic Plan" ? `${activePlan} (${profile?.subscription_status || 'active'})` : "Basic Plan"}
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
                  <span className="text-xs font-bold text-slate-500">Price / Billing Cycle</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {activePlan === "Yearly Pro"
                      ? "Annual billing ($19.99/year)"
                      : activePlan === "Monthly Pro"
                      ? "Monthly billing ($4.99/month)"
                      : "No subscription (Basic tier)"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-bold text-slate-500">Invoice Bill</span>
                  {activePlan !== "Basic Plan" ? (
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
          )}
        </div>
      </section>

      {/* Plans Section */}
      <section className="pb-20">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full mx-auto">
            {/* Basic Plan */}
            <div className={`bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 ${
              activePlan === "Basic Plan"
                ? "border-2 border-amber-400 ring-1 ring-amber-400/20"
                : "border border-slate-100 dark:border-slate-700/80"
            }`}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-outfit text-xl font-black text-slate-800 dark:text-white">Basic Plan</h3>
                  <p className="text-sm text-slate-400 mt-1">Perfect to get started</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-800 dark:text-white">$0</span>
                  <span className="text-sm font-semibold text-slate-400">/ forever</span>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/60" />
                <ul className="space-y-4">
                  {[
                    "Access to basic PDF tools",
                    "Files up to 50MB limits",
                    "Standard local browser speed",
                    "Ad-supported interface",
                    "No credit card required"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                {activePlan === "Basic Plan" ? (
                  <div className="block w-full py-3 px-6 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 rounded-xl">
                    Active Plan
                  </div>
                ) : activePlan ? (
                  // Hide button for Basic Plan if user is logged in under any paid plan
                  null
                ) : (
                  <Link
                    href="/signup"
                    className="block w-full py-3 px-6 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 rounded-xl transition-all"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>

            {/* Yearly Pro Plan (Featured) */}
            <div className={`relative bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 scale-105 z-10 ${
              activePlan === "Yearly Pro" || (!activePlan && true)
                ? "border-2 border-amber-400 ring-1 ring-amber-400/20"
                : "border border-slate-100 dark:border-slate-700/80"
            }`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <Crown size={12} className="fill-slate-900" /> Best Value
              </div>
              <div className="space-y-6">
                <div className="pt-2">
                  <h3 className="font-outfit text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    Yearly Pro
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Annual subscription. Best value.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-amber-500 dark:text-amber-400">$19.99</span>
                  <span className="text-sm font-semibold text-slate-400">/ year</span>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/60" />
                <ul className="space-y-4">
                  {[
                    "All premium tools unlocked",
                    "All Ecommerce Label Croppers",
                    "Batch file processing (No caps)",
                    "Files up to 1GB size support",
                    "High-speed browser processing",
                    "100% clean, Ad-free workspace",
                    "Yearly updates & VIP support"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                {activePlan === "Yearly Pro" ? (
                  <div className="block w-full py-3 px-6 text-center text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/35 rounded-xl uppercase tracking-wider">
                    Active Plan
                  </div>
                ) : activePlan === "Monthly Pro" ? (
                  // Hide button for Yearly Pro if user is logged in under Monthly Pro plan
                  null
                ) : (
                  <button
                    onClick={() => handleCheckout("yearly")}
                    className="block w-full py-3 px-6 text-center text-xs font-black text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/20 uppercase tracking-wider animate-pulse hover:animate-none cursor-pointer"
                    style={{ animationDuration: '3s' }}
                  >
                    Unlock Yearly Pro
                  </button>
                )}
              </div>
            </div>

            {/* Monthly Pro Plan */}
            <div className={`bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 ${
              activePlan === "Monthly Pro"
                ? "border-2 border-amber-400 ring-1 ring-amber-400/20"
                : "border border-slate-100 dark:border-slate-700/80"
            }`}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-outfit text-xl font-black text-slate-800 dark:text-white">Monthly Pro</h3>
                  <p className="text-sm text-slate-400 mt-1">Flexible subscription</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-800 dark:text-white">$4.99</span>
                  <span className="text-sm font-semibold text-slate-400">/ month</span>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/60" />
                <ul className="space-y-4">
                  {[
                    "Access to all tools & croppers",
                    "Files up to 500MB limits",
                    "High-speed browser processing",
                    "Ad-free workspace",
                    "Priority support",
                    "Cancel or upgrade anytime"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                {activePlan === "Monthly Pro" ? (
                  <div className="block w-full py-3 px-6 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 rounded-xl">
                    Active Plan
                  </div>
                ) : activePlan === "Yearly Pro" ? (
                  // Hide button for Monthly Pro if user is logged in under Yearly Pro plan
                  null
                ) : (
                  <button
                    onClick={() => handleCheckout("monthly")}
                    className="block w-full py-3 px-6 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Subscribe Monthly
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Features & Tools Details Section */}
      <section id="plan-details" className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800/80 -mx-6 px-6">
        <div className="w-full mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Explore Tools Included by Plan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              We separate our tools into standard and advanced categories. See which tools require Pro membership below.
            </p>
          </div>

          <div className="space-y-12 w-full mx-auto">
            {PLAN_TOOLS.map((cat, catIdx) => (
              <div key={catIdx} className="bg-slate-50/50 dark:bg-slate-850/30 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div className="space-y-1">
                    <h3 className="font-outfit text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                      {cat.category}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">{cat.description}</p>
                  </div>
                  <div>
                    {cat.isProOnly ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/20">
                        <Crown size={12} className="fill-amber-500/25" /> Pro Feature
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/20">
                        Free Included
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.tools.map((tool, toolIdx) => (
                    <div key={toolIdx} className="bg-white dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between gap-4 hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
                      <div className="space-y-2">
                        <h4 className="font-outfit text-sm font-bold text-slate-800 dark:text-white leading-tight">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                          {tool.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Availability</span>
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${cat.isProOnly ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                            {cat.isProOnly ? <span className="text-[10px] font-black">-</span> : <Check size={10} strokeWidth={3} />}
                          </span>
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="w-full mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Got questions about our pricing or premium capabilities? Find answers below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3">
                <h3 className="font-outfit text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <HelpCircle size={15} className="text-red-500 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PremiumPlansPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950/40">
        <div className="animate-pulse text-slate-500 dark:text-slate-400 font-semibold">Loading plans...</div>
      </div>
    }>
      <PremiumPlansContent />
    </Suspense>
  );
}
