import { Metadata } from "next";
import ContactClient from "./ContactClient";
import OrganizationSchema from "@/components/seo/OrganizationSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export const metadata: Metadata = {
  title: "Contact Us | SmartPDFs Pro",
  description:
    "Get in touch with the SmartPDFs Pro team. We're here to help with any questions, support requests, or feedback you may have.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | SmartPDFs Pro",
    description:
      "Get in touch with the SmartPDFs Pro team. We're here to help with any questions, support requests, or feedback you may have.",
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SmartPDFs Pro",
    description:
      "Contact form and support information for SmartPDFs Pro users.",
    url: `${siteUrl}/contact`,
  };

  return (
    <>
      <OrganizationSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
      />
      <ContactClient />
    </>
  );
}
