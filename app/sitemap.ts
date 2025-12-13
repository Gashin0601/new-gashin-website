import { MetadataRoute } from "next";
import newsData from "@/data/news.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gashin.me";
  const currentDate = new Date();

  // Static pages with proper priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic news pages
  const newsPages: MetadataRoute.Sitemap = newsData.map((news) => ({
    url: `${baseUrl}/news/${news.slug}`,
    lastModified: new Date(news.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages];
}
