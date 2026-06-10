"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      enableDeclineButton
      declineButtonText="Decline All"
      cookieName="smartpdfpro_cookie_consent"
      style={{
        background: "#0f172a", // slate-900
        color: "#f8fafc", // slate-50
        fontSize: "14px",
        fontFamily: "inherit",
        alignItems: "center",
        padding: "16px 24px",
        boxShadow: "0 -4px 6px -1px rgb(0 0 0 / 0.1)",
        zIndex: 9999,
      }}
      buttonStyle={{
        background: "#ef4444", // red-500
        color: "white",
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "8px",
        padding: "10px 24px",
        marginLeft: "12px",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#94a3b8", // slate-400
        border: "1px solid #475569", // slate-600
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "8px",
        padding: "9px 24px",
        marginLeft: "12px",
      }}
      expires={365}
    >
      We use cookies to enhance your experience, analyze site traffic, and serve targeted advertisements via Google AdSense. By continuing to visit this site you agree to our use of cookies.{" "}
      <Link href="/privacy" className="text-red-400 hover:text-red-300 underline ml-1">
        Learn more
      </Link>
    </CookieConsent>
  );
}
