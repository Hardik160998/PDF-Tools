import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "./mobileview.css";
import "./mobilefixes.css";
import "./darktheme.css";
import "./header-responsive.css";
import "./dropdown-fix.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";


const inter = Inter({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800', '900'] });
const outfit = Outfit({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-outfit' });

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
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{
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
           })()
         ` }} />
      </head>
      <body className={`${inter.className} ${outfit.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <AppLayout outfitClass={outfit.className} outfitVariable={outfit.variable}>
              {children}
            </AppLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
