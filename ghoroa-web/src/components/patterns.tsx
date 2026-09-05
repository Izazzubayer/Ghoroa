import { cn } from '@/lib/utils';

/** Folk motifs — black matte in the PNG; use blend="screen" on dark. */
export const motifs = {
  diamond: '/patterns/diamond-motif.png',
  leaf: '/patterns/leaf-spray.png',
  lotus: '/patterns/lotus-arc.png',
  quatrefoil: '/patterns/quatrefoil.png',
  'rosette-1': '/patterns/rosette-flower-1.png',
  'rosette-2': '/patterns/rosette-flower-2.png',
  'rosette-3': '/patterns/rosette-flower-3.png',
  'rosette-4': '/patterns/rosette-flower-4.png',
} as const;

/** Horizontal / vertical bands — tile with bg-repeat. */
export const bands = {
  flower: '/patterns/header-flower-row.png',
  leaf: '/patterns/header-leaf-row.png',
  diamond: '/patterns/header-diamond-row.png',
  vine: '/patterns/vine-border.png',
  scallop: '/patterns/scalloped-border.png',
  rule: '/patterns/rule-strip.png',
  vertical: '/patterns/vertical-border.png',
  tile: '/patterns/tile-grid-pattern.png',
} as const;

export type MotifName = keyof typeof motifs;
export type BandName = keyof typeof bands;

/**
 * Single motif. On dark surfaces `screen` knocks out the baked black.
 * On light, pass blend="normal" and sit it on a dark chip, or use PatternEdge.
 */
export function PatternMotif({
  name,
  className = '',
  size = 56,
  blend = 'screen',
}: {
  name: MotifName;
  className?: string;
  size?: number;
  blend?: 'screen' | 'normal';
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={motifs[name]}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={cn(
        'pointer-events-none select-none object-contain',
        blend === 'screen' && 'mix-blend-screen',
        className,
      )}
      style={{ width: size, height: 'auto' }}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Centered rule under a heading — rule-strip or a compact motif. */
export function PatternRule({
  className = '',
  variant = 'rule',
  surface = 'dark',
}: {
  className?: string;
  variant?: 'rule' | 'lotus' | 'quatrefoil';
  /** Kept for call-site compat; rule uses screen blend on both surfaces. */
  surface?: 'dark' | 'light';
}) {
  if (variant === 'rule') {
    return (
      <span aria-hidden className={cn('block h-7 w-48 max-w-full', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bands.rule}
          alt=""
          className="h-full w-full object-contain object-left mix-blend-screen"
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  }
  return (
    <span aria-hidden className={cn('flex justify-start', className)}>
      <PatternMotif
        name={variant}
        size={44}
        blend={surface === 'light' ? 'normal' : 'screen'}
        className={surface === 'light' ? 'opacity-70' : undefined}
      />
    </span>
  );
}

/**
 * Full-bleed edge band. On parchment, wrap in a dark strip so the black matte reads.
 * `invert` flips for a bottom scallop / mirrored edge.
 */
export function PatternEdge({
  name,
  className = '',
  height = 36,
  surface = 'dark',
  invert = false,
  opacity = 0.9,
}: {
  name: Exclude<BandName, 'tile' | 'vertical' | 'rule'>;
  className?: string;
  height?: number;
  surface?: 'dark' | 'light';
  invert?: boolean;
  opacity?: number;
}) {
  const strip = (
    <div
      aria-hidden
      className={cn(
        'w-full bg-center bg-repeat-x',
        invert && 'rotate-180',
        surface === 'dark' && 'mix-blend-screen',
        className,
      )}
      style={{
        height,
        opacity,
        backgroundImage: `url(${bands[name]})`,
        backgroundSize: `auto ${height}px`,
      }}
    />
  );

  if (surface === 'light') {
    return <div className="w-full bg-forest">{strip}</div>;
  }
  return strip;
}

/** Soft tiled wash — tile at/under native size; these PNGs are low-res, never upscale. */
export function PatternWash({
  className = '',
  opacity = 0.12,
  /** CSS width of one tile. Tile art is 2208px — keep well under that. */
  size = 320,
}: {
  className?: string;
  opacity?: number;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 mix-blend-screen', className)}
      style={{
        opacity,
        backgroundImage: `url(${bands.tile})`,
        backgroundSize: `${size}px auto`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

/** Tall side border for desktop dark sections. Native art is 348px wide — never stretch past that. */
export function PatternSide({
  side = 'left',
  className = '',
  /** Drawn width; keep ≤ native 348. */
  width = 36,
}: {
  side?: 'left' | 'right';
  className?: string;
  width?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute top-0 hidden h-full mix-blend-screen opacity-60 lg:block',
        side === 'left' ? 'left-0' : 'right-0 scale-x-[-1]',
        className,
      )}
      style={{
        width,
        backgroundImage: `url(${bands.vertical})`,
        backgroundSize: `${width}px auto`,
        backgroundRepeat: 'repeat-y',
        backgroundPosition: 'center top',
      }}
    />
  );
}
