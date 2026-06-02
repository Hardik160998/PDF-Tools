import { MetadataRoute } from "next";
import { TOOL_META_MAP } from "@/data/toolData";
import fs from "fs";
import path from "path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/premium-plans",
    "/blog",
  ];

  // Dynamic reading of blog pages since there is no central config for blogs
  let blogRoutes: string[] = [];
  try {
    const blogDir = path.join(process.cwd(), "src/app/blog");
    if (fs.existsSync(blogDir)) {
      blogRoutes = fs
        .readdirSync(blogDir)
        .filter((dir) => fs.statSync(path.join(blogDir, dir)).isDirectory())
        .map((dir) => `/blog/${dir}`);
    }
  } catch (error) {
    console.error("Error reading blog directory for sitemap:", error);
  }

  // All tools from TOOL_META_MAP
  const toolRoutes = Object.keys(TOOL_META_MAP).map((slug) => `/tool/${slug}`);

  const allRoutes = [...staticRoutes, ...blogRoutes, ...toolRoutes];

  // Remove duplicates just in case
  const uniqueRoutes = Array.from(new Set(allRoutes));

  return uniqueRoutes.map((route) => {
    let priority = 0.7;
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly";

    if (route === "/") {
      priority = 1.0;
      changeFrequency = "weekly";
    } else if (route.startsWith("/tool")) {
      priority = 0.9;
      changeFrequency = "weekly";
    } else if (route.startsWith("/blog")) {
      priority = 0.8;
      changeFrequency = "monthly";
    }

    return {
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}
