"use client";

import { Cookies, getCookieConsentValue } from "react-cookie-consent";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

const loadGoogleAnalytics = () => {
  if (typeof window !== "undefined" && !(window as any).gtag) {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-F81GEFE6V4";
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);
    (window as any).dataLayer = (window as any).dataLayer || [];
    const gtag = (...args: any[]) => (window as any).dataLayer!.push(args);
    (window as any).gtag = gtag as any;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }
};

const loadAdSense = () => {
  if (typeof window !== "undefined" && !(window as any).adsbygoogle) {
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
    const adScript = document.createElement("script");
    adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3740676760592264";
    adScript.async = true;
    adScript.crossOrigin = "anonymous";
    document.head.appendChild(adScript);
  }
};

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getCookieConsentValue("smartpdfpro_cookie_consent");
    if (consent === "true") {
      loadGoogleAnalytics();
      loadAdSense();
    } else if (consent === "false") {
      loadAdSense(); // Load AdSense even if declined
    } else {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  const handleAccept = () => {
    Cookies.set("smartpdfpro_cookie_consent", "true", { expires: 365, path: "/" });
    Cookies.set("adsense_consent", "true", { expires: 365, path: "/" });
    loadGoogleAnalytics();
    loadAdSense();
    setShowBanner(false);
  };

  const handleDecline = () => {
    Cookies.set("smartpdfpro_cookie_consent", "false", { expires: 365, path: "/" });
    Cookies.set("adsense_consent", "true", { expires: 365, path: "/" });
    loadAdSense();
    setShowBanner(false);
  };

  return (
    <div className="fixed right-6 bottom-6 z-[9999] w-[420px] max-w-[calc(100%-32px)] max-h-[calc(100vh-48px)] overflow-y-auto custom-scrollbar flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-sm p-6 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-3 py-1 w-full">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <p className="font-bold text-slate-900 dark:text-white text-lg m-0">We value your privacy</p>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-b border-slate-200 dark:border-slate-800 pb-5 m-0">
          We use cookies to enhance your browsing experience, analyze site traffic, process secure payments, and serve targeted advertisements.
        </p>
        
        <details className="group mt-2 mb-2">
          <summary className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer flex items-center gap-1.5 focus:outline-none transition-colors w-max select-none [&::-webkit-details-marker]:hidden m-0">
            Show Cookie Details
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </summary>
          <div className="flex flex-col gap-y-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                Essential
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-3 leading-relaxed">
                Necessary for the website to function securely and properly.{" "}
                <Link href="/cookie-policy#essential" target="_blank" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline">Essential Cookies Policy</Link>
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                Analytics
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-3 leading-relaxed">
                Helps us understand how visitors interact with the website.{" "}
                <a href="https://policies.google.com/privacy?hl=en-GB" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline">Analytics Cookies Policy</a>
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                Advertising
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-3 leading-relaxed">
                Used to deliver relevant ads and track campaign performance.{" "}
                <a href="https://support.google.com/adsense/answer/48182?sjid=14695444302049797352-NC" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline">Advertising Cookies Policy</a>
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                Payment
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-3 leading-relaxed">
                Required for securely processing your transactions.{" "}
                <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline">Payment Processing Policy</a>
              </span>
            </div>
          </div>
        </details>

        <div className="flex w-full gap-3 mt-4">
          <button 
            onClick={handleDecline}
            className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700 text-sm font-semibold rounded-xl py-[11px] px-6 m-0 flex-1 text-center transition-colors cursor-pointer"
          >
            Decline All
          </button>
          <button 
            onClick={handleAccept}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl py-3 px-6 m-0 flex-1 text-center transition-colors cursor-pointer"
          >
            Accept All
          </button>
        </div>
        
        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-4 m-0 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="http://smartpdfpro.com/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline">Terms of Service</a>
          {" "}and{" "}
          <a href="https://www.smartpdfpro.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
