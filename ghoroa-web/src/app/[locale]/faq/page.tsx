import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import { SiteFooter } from '@/components/layout';
import { Nav } from '@/components/layout';
import { loadHomeData } from '@/components/home/page-data';
import type { Locale } from '@/lib/cms';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: 'FAQ — Ghoroa',
    description: 'Frequently asked questions.',
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') return null;
  const { settings, faqs } = await loadHomeData(locale);
  return (
    <div>
      <Nav locale={locale} />
      <main className="pt-28">
        <FaqSection locale={locale} items={faqs} />
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}

import { FaqSection } from '@/components/layout';
