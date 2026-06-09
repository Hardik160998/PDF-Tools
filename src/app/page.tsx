import { Metadata } from "next";
import HomeClient from "./HomeClient";
import WebSiteSchema from "@/components/seo/WebSiteSchema";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import { getAllTools, getCategories } from "@/lib/supabase";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SmartPDFs Pro | Free Online PDF Tools",
  description:
    "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "SmartPDFs Pro | Free Online PDF Tools",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
    url: "/",
    siteName: "SmartPDFs Pro",
    images: [
      { url: `${siteUrl}/img/snapdeal-label.png`, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPDFs Pro | Free Online PDF Tools",
    description:
      "Merge, split, compress, convert, rotate, unlock and watermark PDFs online for free with just a few clicks.",
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
};

export const revalidate = 300;

export default async function Page() {
  const [allTools, categories] = await Promise.all([
    getAllTools(),
    getCategories(),
  ]);

  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
      <HomeClient initialTools={allTools} initialCategories={categories} />
    </>
  );
}
