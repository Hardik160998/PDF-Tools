import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./mobileview.css";
import { Heart } from "lucide-react";
import AllToolsDropdown from "@/components/AllToolsDropdown";
import NavSearchBar from "@/components/NavSearchBar";
import MobileNav from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: "SmartPDFs Plus | Every tool you need to work with PDFs",
  description: "Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div className="bg-mesh" aria-hidden="true" />
        
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-1.5 font-black text-2xl tracking-tighter hover:opacity-80 transition-opacity">
                <span className="text-slate-900 dark:text-white uppercase">Smart</span>
                <Heart className="fill-red-500 text-red-500" size={24} />
                <span className="text-slate-900 dark:text-white uppercase">PDFs</span>
              </a>

              {/* Desktop nav — hidden on mobile via CSS */}
              <nav className="desktop-nav">
                {[
                  { label: 'MERGE PDF', href: '/tool/merge' },
                  { label: 'SPLIT PDF', href: '/tool/split' },
                  { label: 'COMPRESS PDF', href: '/tool/compress' },
                  { label: 'CONVERT PDF', href: '/tool/extract-text' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} className="text-xs font-black text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors uppercase tracking-tight">
                    {label}
                  </a>
                ))}
                <AllToolsDropdown />
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop actions — hidden on mobile via CSS */}
              <div className="desktop-nav-actions">
                <NavSearchBar />
                <button className="text-sm font-black text-slate-700 hover:text-red-500 px-4 py-2 border border-transparent hover:border-slate-100 rounded-lg transition-all">
                  Login
                </button>
                <button className="primary-button text-xs uppercase tracking-widest shadow-lg shadow-red-500/20">
                  Sign Up
                </button>
              </div>
              {/* Mobile hamburger — hidden on desktop via CSS */}
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-slate-50 dark:bg-slate-900/50 py-16 mt-20 border-t border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">&copy; 2026 SmartPDFs Plus Project. Toolset for modern workflows.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
