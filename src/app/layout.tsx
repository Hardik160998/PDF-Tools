import type { Metadata } from "next";
import { Lato, Outfit } from "next/font/google";
import "./globals.css";
import "./mobileview.css";
import "./mobilefixes.css";
import "./darktheme.css";
import "./header-responsive.css";
import "./dropdown-fix.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/lib/QueryProvider";
import AppLayout from "@/components/AppLayout";
import Script from "next/script";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  title: "SmartPDFs Pro | Every tool you need to work with PDFs",
  description:
    "Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.",
  openGraph: {
    type: "website",
    title: "SmartPDFs Pro | Every tool you need to work with PDFs",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.",
    siteName: "SmartPDFs Pro",
    images: [
      { url: `${siteUrl}/img/snapdeal-label.png`, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPDFs Pro | Every tool you need to work with PDFs",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.",
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
  icons: {
    icon: "/img/favicons/favicon.ico",

    shortcut: "/img/favicons/favicon-16x16.png",

    apple: "/img/favicons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics - Loaded lazily to avoid blocking the main thread (High TBT fix) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CJBE2GYFFR"
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-CJBE2GYFFR');
          `}
        </Script>
        <meta name="color-scheme" content="light dark" />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
 (function() {
 try {
 var stored = localStorage.getItem('theme');
 var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
 var theme = stored === 'dark' || (stored === null && systemDark) ? 'dark' : 'light';
 if (theme === 'dark') {
 document.documentElement.classList.add('dark');
 document.documentElement.setAttribute('data-theme', 'dark');
 document.documentElement.style.colorScheme = 'dark';
 } else {
 document.documentElement.classList.remove('dark');
 document.documentElement.setAttribute('data-theme', 'light');
 document.documentElement.style.colorScheme = 'light';
 }
 } catch (e) {}
 })();
 `,
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
              >
                {children}
              </AppLayout>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
