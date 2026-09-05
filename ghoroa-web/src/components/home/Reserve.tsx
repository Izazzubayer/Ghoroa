import { PatternEdge, PatternMotif } from '@/components/patterns';
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
      data-nav-contrast="light"
      className="grain relative isolate overflow-hidden bg-parchment py-28 text-ink lg:py-36"
      aria-labelledby="reserve-title"
    >
      <div className="absolute inset-x-0 top-0">
        <PatternEdge name="scallop" surface="light" height={40} opacity={0.95} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_0%,color-mix(in_srgb,var(--color-gold)_28%,transparent)_0%,transparent_65%)]"
      />

      <PatternMotif
        name="lotus"
        size={80}
        blend="normal"
        className="pointer-events-none absolute right-6 top-24 opacity-[0.16] lg:right-16"
      />
      <PatternMotif
        name="quatrefoil"
        size={48}
        blend="normal"
        className="pointer-events-none absolute bottom-24 left-8 opacity-[0.14] lg:left-20"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <Reveal className="flex flex-col items-center">
          <Eyebrow>{locale === 'bn' ? 'রিজার্ভেশন' : 'Reservations'}</Eyebrow>
          <h2 id="reserve-title" className="display mt-5 text-[clamp(2rem,4.2vw,3.4rem)] font-normal leading-[1.08] text-ink">
            {locale === 'bn' ? 'টেবিলে আসুন।' : 'Join us at the table.'}
          </h2>
          <Ornament surface="light" className="mx-auto mt-6" />
          <p className="mt-6 max-w-lg text-[0.95rem] leading-[1.8] text-muted">
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
              className="inline-flex items-center gap-2 border border-gold-deep/50 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-forest transition-colors hover:border-gold hover:bg-gold/15"
            >
              {locale === 'bn' ? 'WhatsApp' : 'Order on WhatsApp'}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-16 w-full">
          <dl className="grid gap-px overflow-hidden border border-gold-deep/35 bg-gold-deep/35 sm:grid-cols-3">
            {info.map((i) => (
              <div key={i.label} className="bg-cream/80 px-6 py-7">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                  {i.label}
                </dt>
                {i.lines.map((line) => (
                  <dd key={line} className="mt-2 text-[0.85rem] text-ink/90">
                    {line}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <PatternEdge name="vine" surface="light" height={28} invert opacity={0.95} />
      </div>
    </section>
  );
}
