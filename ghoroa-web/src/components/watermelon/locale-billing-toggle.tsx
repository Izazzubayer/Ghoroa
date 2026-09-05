'use client';

/**
 * Quiet EN / বা text switch — replaces the pill billing toggle.
 */
export type LocaleId = 'en' | 'bn';

export function LocaleBillingToggle({
  value,
  onChange,
  ariaLabel,
}: {
  value: LocaleId;
  onChange: (next: LocaleId) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-center gap-1.5 font-semibold"
    >
      <button
        type="button"
        aria-pressed={value === 'en'}
        aria-current={value === 'en' ? 'true' : undefined}
        data-locale-latin="true"
        onClick={() => onChange('en')}
        className={`text-[0.62rem] uppercase tracking-[0.18em] ${
          value === 'en'
            ? 'text-gold'
            : 'text-cream/55 transition-colors hover:text-cream'
        }`}
      >
        EN
      </button>
      <span aria-hidden className="text-[0.62rem] text-cream/30">
        /
      </span>
      <button
        type="button"
        aria-pressed={value === 'bn'}
        aria-current={value === 'bn' ? 'true' : undefined}
        onClick={() => onChange('bn')}
        className={`font-bn text-[0.8rem] leading-none ${
          value === 'bn'
            ? 'text-gold'
            : 'text-cream/55 transition-colors hover:text-cream'
        }`}
      >
        বা
      </button>
    </div>
  );
}
