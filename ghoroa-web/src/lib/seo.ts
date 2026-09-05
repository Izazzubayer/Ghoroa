import type { Metadata } from 'next';
import { localePrefix } from '@/lib/cms';

export function createMetadata(
  locale: 'en' | 'bn',
  opts: { title: string; description: string }
): Metadata {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghoroa.com';
  const url = `${base}${localePrefix(locale)}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}/en`,
        bn: `${base}/bn`,
      },
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: 'Ghoroa',
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
    metadataBase: new URL(base),
  };
}
