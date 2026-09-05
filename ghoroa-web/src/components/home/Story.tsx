import { ArchFrame, Eyebrow, GoldButton, Reveal } from '@/components/primitives';

export function Story({
  locale,
  settings,
}: {
  locale: 'en' | 'bn';
  settings: { about: string };
}) {
  const stats = [
    { value: '40+', label: locale === 'bn' ? 'বছরের রেসিপি' : 'Years of recipes' },
    { value: '117', label: locale === 'bn' ? 'মন্ত্র খাবার' : 'Dishes served' },
    { value: '1', label: locale === 'bn' ? 'কিচেন, কোনো শর্টকাট নেই' : 'Kitchen, no shortcuts' },
  ];

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
              <p>
                {locale === 'bn'
                  ? 'Ghoroa Bangladeshi ঐতিহ্যের স্বাদ আপনার টেবিলে আনে। ঐতিহ্যবাহী রেসিপি ঐতিহ্য ঐতিহ্য ঐতিহ্য ঐতিহ্য ঐতিহ্য ঐতিহ্য'
                  : settings.about ||
                    'Ghoroa brings the soul of Bengal to your table. Inspired by traditional recipes passed down through generations, we celebrate the rich flavours, warm hospitality, and timeless culture of Bangladesh.'}
              </p>
              <p>
                {locale === 'bn'
                  ? 'প্রতিটি খাবার ঐতিহ্যের ঐতিহ্যের মতো খাঁটি মশলা, খাঁটি খামার, এবং ধৈর্যের সাথে খাঁটি খাঁটি খাঁটি খাঁটি খাঁটি খাঁটি'
                  : 'Every dish begins the way it always has — spices ground fresh, mustard oil in the pan, and the patience to wait for the first bubble.'}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9">
              <GoldButton href={`${locale === 'bn' ? '/bn' : '/en'}#menu`} variant="primary">
                {locale === 'bn' ? 'মেনু দেখুন' : 'Discover our story'}
              </GoldButton>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/12 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-3xl font-light tracking-tight text-forest">{s.value}</span>
                    <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.14em] text-muted">{s.label}</span>
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
