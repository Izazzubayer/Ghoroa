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
    title: 'Menu — Ghoroa',
    description: 'Explore Ghoroa full menu from WordPress CMS.',
  });
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') return null;
  const { menu, settings } = await loadHomeData(locale);
  return (
    <div>
      <Nav locale={locale} orderNow={settings.order_now} />
      <main className="pt-28 px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-[82rem]">
          <h1 className="display text-4xl text-cream">{locale === 'bn' ? 'মেনু' : 'Menu'}</h1>
          <p className="mt-4 text-cream/85">{settings.tagline}</p>
          <div className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-2">
            {Object.entries(menu.groups).map(([slug, items]) => (
              <section key={slug}>
                <h2 className="display text-xl text-gold">{slug}</h2>
                <ul className="mt-4 space-y-4">
                  {items.map((it) => (
                    <li key={it.id}>
                      <div className="flex items-baseline gap-2">
                        <h3 className="display text-base text-cream">{it.name}</h3>
                        <span className="text-gold-deep tabular-nums">{String(it.price_eatin ?? '')}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}
