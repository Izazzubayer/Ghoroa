'use client';

import { ImageIcon, List } from 'lucide-react';

/**
 * Icon List / Photos switch — labels stay on aria for a11y.
 */
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
      className="flex shrink-0 items-center gap-1"
    >
      <button
        type="button"
        aria-label={listLabel}
        aria-pressed={!checked}
        aria-current={!checked ? 'true' : undefined}
        onClick={() => onCheckedChange(false)}
        className={`inline-flex h-8 w-8 items-center justify-center transition-colors ${
          !checked
            ? 'text-gold'
            : 'text-cream/45 hover:text-cream'
        }`}
      >
        <List className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>
      <span aria-hidden className="text-[0.62rem] text-cream/25">
        /
      </span>
      <button
        type="button"
        aria-label={photosLabel}
        aria-pressed={checked}
        aria-current={checked ? 'true' : undefined}
        onClick={() => onCheckedChange(true)}
        className={`inline-flex h-8 w-8 items-center justify-center transition-colors ${
          checked
            ? 'text-gold'
            : 'text-cream/45 hover:text-cream'
        }`}
      >
        <ImageIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
