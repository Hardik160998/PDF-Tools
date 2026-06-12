"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderActions from "@/components/HeaderActions";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";

import Script from "next/script";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const AllToolsDropdown = dynamic(() => import("@/components/AllToolsDropdown"));
const MobileNav = dynamic(() => import("@/components/MobileNav"));
const MobileSearch = dynamic(() => import("@/components/MobileSearch"));
const ConvertDropdown = dynamic(() => import("@/components/ConvertDropdown"));
const EcommerceDropdown = dynamic(() => import("@/components/EcommerceDropdown"));

export default function AppLayout({
  children,
  latoClass,
  latoVariable,
}: {
  children: React.ReactNode;
  latoClass: string;
  latoVariable: string;
}) {
  const pathname = usePathname();
  const cleanPathname = pathname ? pathname.replace(/\/$/, "") : "";
  const isAuthPage = cleanPathname === "/login" || cleanPathname === "/signup";

  if (isAuthPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="page-content">
      <header
        id="site-header"
        className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-visible"
      >
        <div
          className="w-full px-6 h-16 grid items-center"
          style={{ gridTemplateColumns: "1fr auto 1fr" }}
        >
          {/* Left — Logo */}
          <Link
            href="/"
            className={`${latoClass} flex items-center gap-1.5 font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity justify-self-start`}
          >
            <Image
              src="/img/logo-v-trans.png"
              alt="SmartPDFPro"
              width={232}
              height={60}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Center — Desktop nav */}
          <nav className="desktop-nav">
            {[
              { label: "MERGE PDF", href: "/tool/merge" },
              { label: "SPLIT PDF", href: "/tool/split" },
              { label: "COMPRESS PDF", href: "/tool/compress" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`${latoClass} text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider whitespace-nowrap`}
              >
                {label}
              </Link>
            ))}
            <ConvertDropdown />
            <EcommerceDropdown />
            <AllToolsDropdown />
          </nav>

          {/* Right — Actions */}
          <div className="flex items-center gap-3 justify-self-end">
            {/* Desktop actions — hidden on mobile via CSS */}
            <div className="desktop-nav-actions">
              <HeaderActions />
            </div>
            {/* Mobile actions — hidden on desktop via CSS */}
            <MobileSearch />
            <div className="mob-theme-toggle">
              <ThemeToggle />
            </div>
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="min-h-screen">{children}</main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1 — Logo + description */}
            <div className="space-y-4">
              <Link
                href="/"
                className={`${latoClass} flex items-center gap-1.5 font-bold text-xl tracking-tighter`}
              >
                <Image
                  src="/img/logo-v-trans.png"
                  alt="SmartPDFPro"
                  width={232}
                  height={60}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                The most powerful free web-based PDF toolkit. Merge, split,
                compress, convert and secure your documents — entirely in your
                browser.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                &copy; {new Date().getFullYear()} SmartPDFs Pro. All rights
                reserved.
              </p>
            </div>

            {/* Col 2 — Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "FAQ's", href: "/faq" },
                  { label: "Blog", href: "/blog" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  {
                    label: "Cancellation Policy",
                    href: "/cancellation-policy",
                  },
                  {
                    label: "Shipping & Delivery Policy",
                    href: "/shipping-delivery-policy",
                  },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "Contact Us", href: "/contact" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Contact + Social */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                Get In Touch
              </h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a
                    href="mailto:smartpdfpro@gmail.com"
                    className="hover:text-red-500 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    smartpdfpro@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="hover:text-red-500 transition-colors">
                    India
                  </span>
                </li>
              </ul>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-1">
                {/* Facebook */}
                <a
                  target="_blank"
                  href="https://www.facebook.com/profile.php?id=61590386471384"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  target="_blank"
                  href="https://www.instagram.com/smartpdfpro/"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                {/* WhatsApp */}
                {/* <a
                  href="#"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </a> */}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400 font-medium">
              Built with ❤️ for productivity. 100% free &amp; secure.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookie-policy"
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="/terms"
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
 
    gtag('config', '${GA_ID}');
  `}
        </Script>
      </footer>

      <SpeedInsights />
    </div>
  );
}