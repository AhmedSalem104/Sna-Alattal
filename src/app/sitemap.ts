import { MetadataRoute } from 'next';
import { getProducts, getNews, getCategories } from '@/lib/static-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sna-alattal.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/exhibitions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/certificates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const products = getProducts();
  const productPages = products.map((p: any) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const news = getNews();
  const newsPages = news.map((n: any) => ({
    url: `${BASE_URL}/news/${n.slug}`,
    lastModified: new Date(n.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categories = getCategories();
  const categoryPages = categories.map((c: any) => ({
    url: `${BASE_URL}/solutions/${c.slug}`,
    lastModified: new Date(c.updatedAt || '2025-01-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...newsPages, ...categoryPages];
}
