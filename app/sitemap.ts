import { MetadataRoute } from 'next';
import newsData from '@/data/news.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gashinsuzuki.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic news pages
  const newsPages: MetadataRoute.Sitemap = newsData.map((news) => ({
    url: `${baseUrl}/news/${news.slug}`,
    lastModified: new Date(news.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages];
}
