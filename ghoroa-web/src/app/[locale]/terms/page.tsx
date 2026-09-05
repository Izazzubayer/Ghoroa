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
    title: 'Terms — Ghoroa',
    description: 'Terms of service.',
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') return null;
  const { settings } = await loadHomeData(locale);
  return (
    <div>
      <Nav locale={locale} />
      <main className="pt-28 px-5 py-16 lg:px-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="display text-4xl text-cream">{locale === 'bn' ? 'টার্মস' : 'Terms'}</h1>
          <p className="mt-6 text-[0.95rem] leading-[1.8] text-cream/85">
            {locale === 'bn'
              ? 'Ghoroa রিজার্ভেশন লিখলে লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে'
              : 'By booking a table or placing an order you agree to our house policies. Menu items and hours may change without notice. For Phase 1 Order Now is WhatsApp; Phase 2 will point to Rosuii.'}
          </p>
        </article>
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}
