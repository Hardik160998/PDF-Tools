"use client";

import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useEffect } from "react";

const loadGoogleAnalytics = () => {
  if (typeof window !== "undefined" && !window.gtag) {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-F81GEFE6V4";
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]) => window.dataLayer!.push(args);
    window.gtag = gtag as any;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }
};


const loadAdSense = () => {
  if (typeof window !== "undefined" && !window.adsbygoogle) {
    window.adsbygoogle = window.adsbygoogle || [];
    const adScript = document.createElement("script");
    adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3740676760592264";
    adScript.async = true;
    adScript.crossOrigin = "anonymous";
    document.head.appendChild(adScript);
  }
};

export default function CookieConsentBanner() {
  useEffect(() => {
    const consent = getCookieConsentValue("smartpdfpro_cookie_consent");
    if (consent === "true") {
      loadGoogleAnalytics();
      loadAdSense();
    } else if (consent === "false") {
      loadAdSense(); // Load AdSense even if declined
    }
  }, []);

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      enableDeclineButton
      declineButtonText="Decline All"
      cookieName="smartpdfpro_cookie_consent"
      onAccept={() => {
        Cookies.set("adsense_consent", "true", { expires: 365, path: "/" });
        loadGoogleAnalytics();
        loadAdSense();
      }}
      onDecline={() => {
        Cookies.set("adsense_consent", "true", { expires: 365, path: "/" });
        loadAdSense();
      }}
      style={{
        background: "#0f172a", // slate-900
        color: "#f8fafc", // slate-50
        fontSize: "14px",
        fontFamily: "inherit",
        padding: "24px",
        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
        zIndex: 9999,
        width: "420px",
        maxWidth: "calc(100% - 32px)",
        left: "auto",
        right: "24px",
        bottom: "24px",
        borderRadius: "24px",
        border: "1px solid #1e293b", // slate-800
        display: "flex",
        flexDirection: "column",
      }}
      contentStyle={{
        flex: "1 1 auto",
        margin: 0,
        width: "100%",
      }}
      buttonWrapperClasses="flex w-full gap-3 mt-2"
      buttonStyle={{
        background: "#6366f1", // indigo-500
        color: "white",
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "12px",
        padding: "12px 24px",
        margin: "0",
        flex: "1",
        textAlign: "center",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#94a3b8", // slate-400
        border: "1px solid #334155", // slate-700
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "12px",
        padding: "11px 24px",
        margin: "0",
        flex: "1",
        textAlign: "center",
      }}
      expires={365}
    >
      <div className="flex flex-col gap-3 py-1 w-full">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <p className="font-bold text-white text-lg">We value your privacy</p>
        </div>
        
        <p className="text-slate-400 text-sm leading-relaxed border-b border-slate-800 pb-5">
          We use cookies to enhance your browsing experience, analyze site traffic, process secure payments, and serve targeted advertisements.
        </p>
        
        <details className="group mt-2 mb-2">
          <summary className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer flex items-center gap-1.5 focus:outline-none transition-colors w-max select-none [&::-webkit-details-marker]:hidden">
            Show Cookie Details
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </summary>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 pt-4 border-t border-slate-800 text-[11px] sm:text-xs font-medium text-slate-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              Essential
              <Link href="/cookie-policy#essential" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline ml-0.5">Read More</Link>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Analytics
              <a href="https://policies.google.com/privacy?hl=en-GB" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline ml-0.5">Read More</a>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Advertising
              <a href="https://support.google.com/adsense/answer/48182?sjid=14695444302049797352-NC" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline ml-0.5">Read More</a>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Payment
              <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline ml-0.5">Read More</a>
            </span>
          </div>
        </details>
      </div>
    </CookieConsent>
  );
}
