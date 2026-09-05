import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import { SiteFooter, Nav } from '@/components/layout';
import { MenuCatalog } from '@/components/home/MenuCatalog';
import { loadHomeData } from '@/components/home/page-data';
import type { Locale } from '@/lib/cms';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: 'Menu — Ghoroa',
    description: 'Full Ghoroa menu — rice, curry, kebab, breads, and more.',
  });
}

const CATEGORY_ORDER = [
  'rice',
  'bread',
  'curry',
  'kebab-grill',
  'bhorta-bhaji',
  'dal',
  'fish',
  'dessert',
  'beverage',
  'juice',
];

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (raw !== 'en' && raw !== 'bn') return null;
  const locale = raw as Locale;
  const { menu, settings } = await loadHomeData(locale);

  const slugs = [
    ...CATEGORY_ORDER.filter((s) => (menu.groups[s]?.length ?? 0) > 0),
    ...Object.keys(menu.groups).filter(
      (s) => !CATEGORY_ORDER.includes(s) && (menu.groups[s]?.length ?? 0) > 0,
    ),
  ];

  return (
    <div>
      <Nav locale={locale} orderNow={settings.order_now} />
      <main className="pt-28 px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-[82rem]">
          <header className="max-w-2xl">
            <h1 className="display text-4xl text-cream md:text-5xl">
              {locale === 'bn' ? 'মেনু' : 'Menu'}
            </h1>
            <p className="mt-4 text-[0.95rem] leading-[1.75] text-cream/85">{settings.tagline}</p>
            <p className="mt-2 text-[0.8rem] text-gold-deep">
              {locale === 'bn'
                ? 'দাম এখানে খাওয়ার (eat-in), টাকায়।'
                : 'Prices shown are eat-in, in taka.'}
            </p>
          </header>

          <MenuCatalog locale={locale} menu={menu} slugs={slugs} />
        </div>
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}
