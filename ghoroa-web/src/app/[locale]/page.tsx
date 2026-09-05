import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import { HomePage } from '@/components/home/page-data';
import type { Locale } from '@/lib/cms';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: 'Home — Ghoroa',
    description: 'Bangladeshi heritage restaurant. Menu, locations, and reservations.',
  });
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') return null;
  return <HomePage locale={locale} />;
}
