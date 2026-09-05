import { Eyebrow, GoldButton, Ornament, Reveal } from '@/components/primitives';

export function Reserve({
  locale,
  settings,
}: {
  locale: 'en' | 'bn';
  settings: { phone: string; order_now: string; hours: string; address: string };
}) {
  const info =
    locale === 'bn'
      ? [
          { label: 'সময়', lines: [settings.hours || ''] },
          { label: 'ফোন', lines: [settings.phone] },
          { label: 'ঠিকানা', lines: [settings.address] },
        ]
      : [
          { label: 'Hours', lines: [settings.hours || ''] },
          { label: 'Call', lines: [settings.phone] },
          { label: 'Find us', lines: [settings.address] },
        ];

  return (
    <section
      id="reservations"
      className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#123524_0%,#0b1d13_45%,#080d09_100%)] py-28 lg:py-36"
      aria-labelledby="reserve-title"
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 text-gold-deep opacity-20"
        width="760"
        height="420"
        viewBox="0 0 760 420"
        fill="none"
      >
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${80 + i * 52} 420V${200 - i * 34}a${300 - i * 52} ${300 - i * 52} 0 0 1 ${600 - i * 104} 0V420`}
            stroke="currentColor"
            strokeWidth="1"
            opacity={1 - i * 0.2}
          />
        ))}
      </svg>
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-dark to-transparent" />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <Reveal className="flex flex-col items-center">
          <Eyebrow>{locale === 'bn' ? 'রিজার্ভেশন' : 'Reservations'}</Eyebrow>
          <h2 id="reserve-title" className="display mt-5 text-[clamp(2rem,4.2vw,3.4rem)] font-normal leading-[1.08] text-cream">
            {locale === 'bn' ? 'টেবিলে আসুন।' : 'Join us at the table.'}
          </h2>
          <Ornament className="mt-6" />
          <p className="mt-6 max-w-lg text-[0.95rem] leading-[1.8] text-cream/85">
            {locale === 'bn'
              ? 'আপনি টেবিলে ঢুকবেন।  ৬+ অথবা  রিজার্ভেশন  লিখুন।'
              : "Whether it's a quiet dinner or a family gathering, we'll keep a seat warm. Call ahead for parties of six or more."}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <GoldButton href={`tel:${settings.phone.replace(/\s/g, '')}`}>
              {locale === 'bn' ? 'ফোন রিজার্ভ' : 'Call to reserve'}
            </GoldButton>
            <a
              href={settings.order_now}
              className="inline-flex items-center gap-2 border border-cream/30 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream/90 transition-colors hover:border-cream hover:text-cream"
            >
              {locale === 'bn' ? 'WhatsApp' : 'Order on WhatsApp'}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-16 w-full">
          <dl className="grid gap-px overflow-hidden border border-gold-deep/30 bg-gold-deep/30 sm:grid-cols-3">
            {info.map((i) => (
              <div key={i.label} className="bg-dark/80 px-6 py-7">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">{i.label}</dt>
                {i.lines.map((line) => (
                  <dd key={line} className="mt-2 text-[0.85rem] text-cream/90">
                    {line}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
