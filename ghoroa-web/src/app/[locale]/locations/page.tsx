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
    title: 'Locations — Ghoroa',
    description: 'Branch locations.',
  });
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') return null;
  const { locations, settings } = await loadHomeData(locale);
  return (
    <div>
      <Nav locale={locale} />
      <main className="pt-28 px-5 py-16 lg:px-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="display text-4xl text-cream">{locale === 'bn' ? 'লোকেশন' : 'Locations'}</h1>
          <ul className="mt-8 space-y-4">
            {locations.map((loc) => (
              <li key={loc.id} className="border-b border-gold-deep/20 pb-4">
                <h2 className="display text-xl text-gold">{loc.name}</h2>
                <p className="mt-1 text-cream/85">{loc.address}</p>
                <p className="text-sm text-cream/70">{loc.phone}</p>
              </li>
            ))}
          </ul>
        </article>
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}
