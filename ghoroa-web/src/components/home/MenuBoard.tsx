'use client';

import { useMemo, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  formatPrice,
  pickDesc,
  pickLocaleLabel,
  type Locale,
  type MenuItem,
  type MenuPayload,
} from '@/lib/cms';
import {
  dishKindFromName,
  dishKindMeta,
  kindsInItems,
} from '@/lib/menu-icons';

export function MenuBoard({
  locale,
  menu,
  slugs,
}: {
  locale: Locale;
  menu: MenuPayload;
  slugs: string[];
}) {
  const [active, setActive] = useState(slugs[0] ?? '');

  const items = (menu.groups[active] ?? []) as MenuItem[];
  const cat = menu.categories[active] || { en: active, bn: active };
  const heading = locale === 'bn' ? cat.bn || cat.en : cat.en;
  const alt = locale === 'bn' ? cat.en : cat.bn;

  const legend = useMemo(() => kindsInItems(items), [items]);

  return (
    <>
      <div
        role="group"
        aria-label={locale === 'bn' ? 'মেনু বিভাগ' : 'Menu sections'}
        className="mt-10"
      >
        <ToggleGroup
          value={active ? [active] : []}
          onValueChange={(next) => {
            const v = next[0];
            if (v) setActive(v);
          }}
          className="flex w-full flex-wrap gap-2 rounded-none"
        >
          {slugs.map((slug) => {
            const c = menu.categories[slug] || { en: slug, bn: slug };
            const label = locale === 'bn' ? c.bn || c.en : c.en;
            const pressed = active === slug;
            return (
              <ToggleGroupItem
                key={slug}
                value={slug}
                aria-label={label}
                className={`rounded-none border px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  pressed
                    ? 'border-terracotta bg-terracotta text-cream hover:bg-terracotta-deep hover:text-cream'
                    : 'border-gold-deep/40 bg-transparent text-cream/75 hover:border-gold hover:bg-transparent hover:text-gold'
                }`}
              >
                {label}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <section className="mt-12" aria-labelledby="menu-active-title">
        <header className="mb-4 flex flex-wrap items-baseline justify-between gap-4 border-b border-gold-deep/35 pb-3">
          <h2 id="menu-active-title" className="display text-2xl text-gold md:text-3xl">
            {heading}
          </h2>
          {alt ? (
            <span
              lang={locale === 'bn' ? 'en' : 'bn'}
              className="font-bn text-[0.85rem] text-cream/70"
            >
              {alt}
            </span>
          ) : null}
        </header>

        {legend.length > 0 ? (
          <ul
            className="mb-8 flex flex-wrap gap-x-4 gap-y-2"
            aria-label={locale === 'bn' ? 'খাবারের ধরন' : 'Dish types in this section'}
          >
            {legend.map((kind) => {
              const { Icon, labelEn, labelBn } = dishKindMeta(kind);
              return (
                <li
                  key={kind}
                  className="inline-flex items-center gap-1.5 text-[0.7rem] text-cream/70"
                >
                  <Icon aria-hidden className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.75} />
                  <span>{locale === 'bn' ? labelBn : labelEn}</span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <ul className="grid gap-x-12 gap-y-5 sm:grid-cols-2">
          {items.map((it) => {
            const name = pickLocaleLabel(it, locale);
            const secondary = locale === 'bn' ? it.name_en : it.name_bn;
            const note = pickDesc(it, locale);
            const price = formatPrice(it.price_eatin ?? it.price_takeaway);
            const kind = dishKindFromName(it.name_en, it.name_bn);
            const { Icon, labelEn, labelBn } = dishKindMeta(kind);
            const kindLabel = locale === 'bn' ? labelBn : labelEn;

            return (
              <li key={`${active}-${it.id}`} className="min-w-0">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-gold-deep/30 text-terracotta"
                    title={kindLabel}
                  >
                    <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
                    <span className="sr-only">{kindLabel}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="display text-[1.05rem] leading-snug text-cream">{name}</h3>
                      <span
                        aria-hidden
                        className="h-px flex-1 translate-y-[-2px] bg-cream/15"
                      />
                      <span className="shrink-0 text-[0.9rem] tabular-nums text-gold-deep">
                        {price}
                      </span>
                    </div>
                    {secondary ? (
                      <p
                        lang={locale === 'bn' ? 'en' : 'bn'}
                        className="font-bn mt-1 text-[0.85rem] text-gold"
                      >
                        {secondary}
                      </p>
                    ) : null}
                    {note ? (
                      <p className="mt-1 max-w-[36ch] text-[0.8rem] leading-[1.6] text-cream/70">
                        {note}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
