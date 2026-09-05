import { LocaleDocument } from '@/components/locale-document';
import type { Locale } from '@/lib/cms';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === 'bn' ? 'bn' : 'en';

  return (
    <>
      {/* Apply Bangla font before paint / on soft navigations */}
      {locale === 'bn' ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang="bn";document.documentElement.classList.add("locale-bn");`,
          }}
        />
      ) : (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang="en";document.documentElement.classList.remove("locale-bn");`,
          }}
        />
      )}
      <LocaleDocument locale={locale} />
      {children}
    </>
  );
}
