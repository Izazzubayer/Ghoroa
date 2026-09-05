'use client';

/**
 * Source: Watermelon UI `changeable-pricing-section` billing toggle
 * https://ui.watermelon.sh/animated-components/changeable-pricing-section
 * Same spring pill as locale EN/BN — List ↔ Photos for the menu catalog.
 */
import { motion } from 'motion/react';

export function MenuPhotosToggle({
  checked,
  onCheckedChange,
  listLabel,
  photosLabel,
  ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  listLabel: string;
  photosLabel: string;
  ariaLabel?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="relative z-0 flex shrink-0 items-center rounded-full bg-cream/10 p-0.5 ring-1 ring-cream/15"
    >
      <motion.div
        aria-hidden
        className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] -z-10 rounded-full bg-terracotta shadow-sm"
        animate={{ x: checked ? '100%' : 0 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.55 }}
      />
      <button
        type="button"
        aria-pressed={!checked}
        onClick={() => onCheckedChange(false)}
        className={`z-10 min-w-[4.5rem] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] transition-colors ${
          !checked ? 'text-cream' : 'text-cream/55 hover:text-cream/80'
        }`}
      >
        {listLabel}
      </button>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onCheckedChange(true)}
        className={`z-10 min-w-[4.5rem] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] transition-colors ${
          checked ? 'text-cream' : 'text-cream/55 hover:text-cream/80'
        }`}
      >
        {photosLabel}
      </button>
    </div>
  );
}
