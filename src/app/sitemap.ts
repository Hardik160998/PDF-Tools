import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/blog",
    "/blog/ultimate-pdf-optimization-guide",
    "/blog/pdf-to-word-conversion-guide",
    "/blog/how-to-merge-pdf",
    "/blog/compress-pdf-without-losing-quality",
    "/blog/protect-pdf-with-password",
    "/blog/how-to-redact-pdf",
    "/blog/how-to-crop-aadhar-card",
    "/blog/how-to-crop-pdf",
    "/blog/how-to-crop-meesho-labels",
    "/blog/how-to-crop-meesho-labels-without-invoice",
    "/blog/how-to-crop-flipkart-labels",
    "/blog/how-to-crop-amazon-labels",
    "/blog/how-to-crop-snapdeal-labels",
    "/blog/ultimate-image-conversion-guide",
    "/blog/how-to-edit-pdf",
    "/blog/ultimate-pdf-editing-guide",
    "/blog/how-to-e-sign-pdf",
    "/tool/merge",
    "/tool/split",
    "/tool/compress",
    "/tool/pdf-to-word",
    "/tool/word-to-pdf",
    "/tool/pdf-to-excel",
    "/tool/pdf-to-jpg",
    "/tool/optimize-pdf",
  ];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-06-01"),
    changeFrequency: route.startsWith("/blog") ? "weekly" : "daily",
    priority: route === "/" ? 1.0 : route.startsWith("/tool") ? 0.9 : 0.8,
  }));
}
