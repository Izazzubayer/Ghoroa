import { Suspense } from 'react';
import { HomePageClient } from './HomePageClient';
import {
  fetchFaqs,
  fetchLocations,
  fetchMenu,
  fetchSettings,
  type Locale,
} from '@/lib/cms';

export async function loadHomeData(locale: Locale) {
  const [menu, settings, faqs, locations] = await Promise.all([
    fetchMenu(locale),
    fetchSettings(),
    fetchFaqs(locale),
    fetchLocations(locale),
  ]);
  return { menu, settings, faqs: faqs.items, locations: locations.locations };
}

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark text-cream" />}>
      <HomePageAsync locale={locale} />
    </Suspense>
  );
}

async function HomePageAsync({ locale }: { locale: Locale }) {
  const data = await loadHomeData(locale);
  return <HomePageClient locale={locale} {...data} />;
}
