import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghoroa.com';
  return [
    { url: `${base}/en`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/bn`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/en/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/en/menu`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/en/locations`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/en/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/en/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/bn/about`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
