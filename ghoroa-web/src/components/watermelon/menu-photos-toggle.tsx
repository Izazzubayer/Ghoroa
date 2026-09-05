'use client';

/**
 * Quiet List / Photos text switch — same treatment as the EN / বা locale switch.
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
      className="flex shrink-0 items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em]"
    >
      <button
        type="button"
        aria-pressed={!checked}
        aria-current={!checked ? 'true' : undefined}
        onClick={() => onCheckedChange(false)}
        className={
          !checked
            ? 'text-gold'
            : 'text-cream/55 transition-colors hover:text-cream'
        }
      >
        {listLabel}
      </button>
      <span aria-hidden className="text-cream/30">
        /
      </span>
      <button
        type="button"
        aria-pressed={checked}
        aria-current={checked ? 'true' : undefined}
        onClick={() => onCheckedChange(true)}
        className={
          checked
            ? 'text-gold'
            : 'text-cream/55 transition-colors hover:text-cream'
        }
      >
        {photosLabel}
      </button>
    </div>
  );
}
