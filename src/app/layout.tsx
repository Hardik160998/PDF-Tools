import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Heart, Search } from "lucide-react";

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

              <nav className="hidden lg:flex items-center gap-6">
                {['MERGE PDF', 'SPLIT PDF', 'COMPRESS PDF', 'CONVERT PDF', 'ALL PDF TOOLS'].map((link) => (
                   <a key={link} href="#" className="text-xs font-black text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors uppercase tracking-tight">
                    {link}
                   </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-50 rounded-full transition-all" aria-label="Search tools">
                <Search size={20} />
              </button>
              <button className="hidden sm:block text-sm font-black text-slate-700 hover:text-red-500 px-4 py-2 border border-transparent hover:border-slate-100 rounded-lg transition-all">
                Login
              </button>
              <button className="primary-button text-xs uppercase tracking-widest shadow-lg shadow-red-500/20">
                Sign Up
              </button>
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
