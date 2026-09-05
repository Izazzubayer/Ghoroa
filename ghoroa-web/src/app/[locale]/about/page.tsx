import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import { SiteFooter, Nav } from '@/components/layout';
import { DisplayText } from '@/components/primitives';
import { loadHomeData } from '@/components/home/page-data';
import { aboutCopy } from '@/lib/about-copy';
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
    title: 'About — Ghoroa',
    description:
      'Ghoroa began in Motijheel in 1979 — Motijheel roots, bhuna khichuri legend, and home cooking still.',
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (raw !== 'en' && raw !== 'bn') return null;
  const locale = raw as Locale;
  const { settings } = await loadHomeData(locale);
  const copy = aboutCopy(locale);

  return (
    <div>
      <Nav locale={locale} orderNow={settings.order_now} />
      <main className="pt-28 px-5 py-16 lg:px-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="display text-4xl text-cream md:text-5xl">{copy.title}</h1>
          <p className="mt-6 text-[1.05rem] leading-[1.85] text-cream/90">{copy.lead}</p>

          <div className="mt-14 space-y-12">
            {copy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl text-gold md:text-3xl">
                  <DisplayText text={section.heading} />
                </h2>
                <p className="mt-4 text-[0.95rem] leading-[1.85] text-cream/85">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-14 border-t border-gold-deep/25 pt-8 text-[0.8rem] text-cream/55">
            {locale === 'bn'
              ? 'ইতিহাসের রূপরেখা প্রকাশিত প্রতিবেদন (যেমন The Business Standard) থেকে সংক্ষেপে তোলা; শাখা ও সময়সূচি নিশ্চিত করতে Locations দেখুন।'
              : 'Story drawn from published reporting (including The Business Standard). Confirm live addresses on Locations.'}
          </p>
        </article>
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}
