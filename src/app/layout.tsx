import type { Metadata, Viewport } from "next";
import { Lato, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import CookieConsentBanner from "@/components/CookieConsentBanner";
import "./globals.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/lib/QueryProvider";
import AppLayout from "@/components/AppLayout";
import { getAllTools, getCategories } from "@/lib/supabase";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#020617",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "SmartPDFs Pro | Every tool you need to work with PDFs",
    template: "%s | SmartPDFs Pro",
  },

  description:
    "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free. Fast, secure and easy-to-use PDF tools.",

  applicationName: "SmartPDFs Pro",

  keywords: [
    "PDF",
    "PDF tools",
    "Merge PDF",
    "Split PDF",
    "Compress PDF",
    "Convert PDF",
    "Rotate PDF",
    "Unlock PDF",
    "Lock PDF",
    "Watermark PDF",
    "Edit PDF",
    "PDF Converter",
    "PDF Editor",
    "Online PDF Tools",
    "Free PDF Tools",
  ],

  authors: [
    {
      name: "SmartPDFs Pro",
      url: siteUrl,
    },
  ],

  creator: "SmartPDFs Pro",
  publisher: "SmartPDFs Pro",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  category: "Technology",

  verification: {
    google: "faGRoUrcsF8-R-LxvgXanoDxKXiSCHjsmPtPSbXup5Y",
  },

  openGraph: {
    title: "SmartPDFs Pro | Every tool you need to work with PDFs",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free.",

    url: siteUrl,

    siteName: "SmartPDFs Pro",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/img/snapdeal-label.png",
        width: 1200,
        height: 630,
        alt: "SmartPDFs Pro",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SmartPDFs Pro | Every tool you need to work with PDFs",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free.",

    creator: "@smartpdfpro", // Remove if you don't have Twitter/X

    images: ["/img/snapdeal-label.png"],
  },

  icons: {
    icon: "/img/favicons/favicon.ico",
    shortcut: "/img/favicons/favicon-16x16.png",
    apple: "/img/favicons/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [allTools, categories] = await Promise.all([
    getAllTools(),
    getCategories(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SmartPDFs Pro",
    url: siteUrl,
    logo: `${siteUrl}/img/logo.png`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SmartPDFs Pro",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          rel="dns-prefetch"
          href="https://fonts.googleapis.com"
        />

        <meta
          name="color-scheme"
          content="light dark"
        />

        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
(function () {
try {
var stored = localStorage.getItem("theme");
var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
var theme =
stored === "dark" || (stored === null && systemDark)
? "dark"
: "light";

if (theme === "dark") {
document.documentElement.classList.add("dark");
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.style.colorScheme = "dark";
} else {
document.documentElement.classList.remove("dark");
document.documentElement.setAttribute("data-theme", "light");
document.documentElement.style.colorScheme = "light";
}
} catch (e) {}
})();
`,
          }}
        />

        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body
        className={`${lato.variable} ${outfit.variable} ${lato.className} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col selection:bg-blue-500/30`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppLayout
                latoClass={lato.className}
                latoVariable={lato.variable}
                initialTools={allTools}
                initialCategories={categories}
              >
                {children}
              </AppLayout>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>

        <CookieConsentBanner />

        {/* Replace with your GA ID if needed */}
        {/* <GoogleAnalytics gaId="G-XXXXXXXXXX" /> */}
      </body>
    </html>
  );
}