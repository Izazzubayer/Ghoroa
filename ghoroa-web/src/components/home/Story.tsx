import { BookOpen, ChefHat, MapPin } from 'lucide-react';
import { ArchFrame, Eyebrow, GoldButton, Reveal } from '@/components/primitives';
import { aboutLead } from '@/lib/about-copy';

export function Story({
  locale,
  settings,
}: {
  locale: 'en' | 'bn';
  settings: { about: string };
}) {
  const stats = [
    {
      value: '1979',
      label: locale === 'bn' ? 'মতিঝিলে শুরু' : 'Founded in Motijheel',
      Icon: BookOpen,
    },
    {
      value: '40+',
      label: locale === 'bn' ? 'বছরের টেবিল' : 'Years at the table',
      Icon: MapPin,
    },
    {
      value: '1',
      label: locale === 'bn' ? 'খিচুড়ির স্বাক্ষর' : 'Khichuri, no shortcuts',
      Icon: ChefHat,
    },
  ];

  const storyBody = settings.about?.trim() || aboutLead(locale);
  const storySecond =
    locale === 'bn'
      ? 'প্রতিটি প্লেট সেই একই প্রতিজ্ঞা — তাজা মশলা, ধৈর্যের হাঁড়ি, এবং ঘরের মতো উদার পরিবেশন।'
      : 'Every plate keeps the same promise — spices ground for the day, patience in the pot, and a table that still feels like home.';

  return (
    <section id="story" data-nav-contrast="light" className="grain relative overflow-hidden bg-parchment py-24 text-ink lg:py-32" aria-labelledby="story-title">
      <div className="mx-auto grid max-w-[82rem] items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:px-10">
        <div>
          <Reveal>
            <Eyebrow tone="terracotta">{locale === 'bn' ? 'আমাদের গল্প' : 'Our story'}</Eyebrow>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 id="story-title" className="display mt-5 text-[clamp(2.2rem,4.4vw,3.6rem)] font-normal leading-[1.05]">
              {locale === 'bn' ? (
                <>
                  একটি বাড়ি।
                  <br />
                  একটি ঐতিহ্য।
                  <br />
                  একটি লেগেসি।
                </>
              ) : (
                <>
                  A home.
                  <br />
                  A heritage.
                  <br />
                  A legacy.
                </>
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-7 max-w-lg space-y-4 text-[0.95rem] leading-[1.8] text-muted">
              <p>{storyBody}</p>
              <p>{storySecond}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9">
              <GoldButton href={`${locale === 'bn' ? '/bn' : '/en'}/about`} variant="primary">
                {locale === 'bn' ? 'পুরো গল্প' : 'Read the full story'}
              </GoldButton>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/12 pt-8">
              {stats.map(({ value, label, Icon }) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <Icon
                      aria-hidden
                      className="mb-3 h-5 w-5 text-terracotta"
                      strokeWidth={1.5}
                    />
                    <span className="font-numeral block text-3xl font-normal tracking-tight text-forest">
                      {value}
                    </span>
                    <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.14em] text-muted">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <ArchFrame src="/images/kitchen.jpg" alt={locale === 'bn' ? 'Ghoroa ডাইনিং' : 'The Ghoroa dining room'} />
        </Reveal>
      </div>
    </section>
  );
}
