"use client";
"use client";

import { useEffect } from "react";

import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type GTagWindow = Window & { gtag?: (cmd: string, id: string, opt?: unknown) => void };

export function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;
    const w = window as GTagWindow;
    if (!w.gtag) return;

    const queryString = searchParams.toString();
    const url = `${window.location.origin}${pathname}${queryString ? `?${queryString}` : ""}`;

    w.gtag("config", GA_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}