'use client';

import type { ReactNode } from 'react';
import { ArrowRight, Circle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Ornament({ className = '', tone = 'gold' }: { className?: string; tone?: 'gold' | 'terracotta' }) {
  const color = tone === 'gold' ? 'text-gold-deep' : 'text-terracotta';
  return (
    <span aria-hidden className={`inline-flex items-center gap-2 ${color} ${className}`}>
      <span className="h-px w-8 bg-current opacity-50" />
      <Circle className="h-1.5 w-1.5" strokeWidth={2.5} />
      <span className="h-px w-8 bg-current opacity-50" />
    </span>
  );
}

export function Eyebrow({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'terracotta' }) {
  const color = tone === 'gold' ? 'text-gold-deep' : 'text-terracotta';
  return (
    <p className={`flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${color}`}>
      <Circle className="h-1.5 w-1.5" strokeWidth={2.5} />
      {children}
      <Circle className="h-1.5 w-1.5" strokeWidth={2.5} />
    </p>
  );
}

export function GoldButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  children: ReactNode;
  /** Watermelon button-3: primary = filled, secondary = outline */
  variant?: 'primary' | 'secondary' | 'ghost' | 'solid';
  className?: string;
}) {
  const mapped =
    variant === 'secondary' || variant === 'ghost'
      ? 'secondary'
      : 'primary'; // primary | solid | default

  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ variant: mapped, size: 'cta' }),
        'group',
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110"
        strokeWidth={1.75}
      />
    </a>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Image inside a Mughal arch — true semicircle dome + double gold hairline. */
export function ArchFrame({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  // aspect 4/5 → perfect semicircle dome; bottom corners stay sharp (0 radius)
  const domeRadius = '50% 50% 0 0 / 40% 40% 0 0';
  // viewBox 100×125 matches aspect 4/5; A 50,50 → true circle under preserveAspectRatio=none
  const inner = 'M 1.2 50 A 48.8 48.8 0 0 1 98.8 50 L 98.8 123.8 L 1.2 123.8 Z';
  const outer = 'M -3.2 50 A 53.2 53.2 0 0 1 103.2 50 L 103.2 128.5 L -3.2 128.5 Z';

  return (
    <div className={`relative p-3 ${className}`}>
      <div
        className="relative aspect-4/5 overflow-hidden bg-forest"
        style={{ borderRadius: domeRadius }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          style={{ borderRadius: domeRadius }}
        />
      </div>

      <svg
        className="pointer-events-none absolute inset-3 overflow-visible"
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={outer}
          fill="none"
          stroke="rgba(197,160,89,0.42)"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="miter"
        />
        <path
          d={inner}
          fill="none"
          stroke="rgba(197,160,89,0.88)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="miter"
        />
      </svg>
    </div>
  );
}
