'use client';

/**
 * Source: Watermelon UI `changeable-pricing-section` billing toggle
 * https://ui.watermelon.sh/animated-components/changeable-pricing-section
 * Extracted two-option spring toggle; brand-adapted for Ghoroa EN/BN.
 */
import { motion } from 'motion/react';

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
      data-locale-latin="true"
      className="relative z-0 flex items-center rounded-full bg-cream/10 p-0.5 ring-1 ring-cream/15"
    >
      <motion.div
        aria-hidden
        className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] -z-10 rounded-full bg-terracotta shadow-sm"
        animate={{ x: value === 'en' ? 0 : '100%' }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.55 }}
      />
      <button
        type="button"
        aria-pressed={value === 'en'}
        onClick={() => onChange('en')}
        className={`z-10 w-9 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] transition-colors ${
          value === 'en' ? 'text-cream' : 'text-cream/55 hover:text-cream/80'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={value === 'bn'}
        onClick={() => onChange('bn')}
        className={`z-10 w-9 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] transition-colors ${
          value === 'bn' ? 'text-cream' : 'text-cream/55 hover:text-cream/80'
        }`}
      >
        BN
      </button>
    </div>
  );
}
