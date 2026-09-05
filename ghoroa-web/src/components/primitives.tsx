'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function Ornament({ className = '', tone = 'gold' }: { className?: string; tone?: 'gold' | 'terracotta' }) {
  const color = tone === 'gold' ? 'text-gold-deep' : 'text-terracotta';
  return (
    <span aria-hidden className={`inline-flex items-center gap-2 ${color} ${className}`}>
      <span className="h-px w-8 bg-current opacity-50" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
        <path d="M4 0l4 4-4 4-4-4z" />
      </svg>
      <span className="h-px w-8 bg-current opacity-50" />
    </span>
  );
}

export function Eyebrow({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'terracotta' }) {
  const color = tone === 'gold' ? 'text-gold-deep' : 'text-terracotta';
  return (
    <p className={`flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${color}`}>
      <svg aria-hidden width="6" height="6" viewBox="0 0 8 8" fill="currentColor">
        <path d="M4 0l4 4-4 4-4-4z" />
      </svg>
      {children}
      <svg aria-hidden width="6" height="6" viewBox="0 0 8 8" fill="currentColor">
        <path d="M4 0l4 4-4 4-4-4z" />
      </svg>
    </p>
  );
}

export function GoldButton({
  href,
  children,
  variant = 'ghost',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: 'ghost' | 'solid';
  className?: string;
}) {
  const base =
    'group inline-flex items-center gap-2.5 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2';
  const styles =
    variant === 'solid'
      ? 'bg-forest text-cream hover:bg-forest-deep'
      : 'border border-gold-deep/70 text-gold hover:bg-gold hover:text-forest';
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
      <svg
        aria-hidden
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M1 5h11M8.5 1.5L12 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
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

export function ArchFrame({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="arch absolute -inset-3 border border-gold-deep/35" aria-hidden />
      <div className="arch relative overflow-hidden border border-gold-deep/60 bg-forest">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="aspect-4/5 w-full object-cover" loading="lazy" />
      </div>
      <svg
        aria-hidden
        className="absolute -top-7 left-1/2 -translate-x-1/2 text-gold-deep"
        width="14"
        height="18"
        viewBox="0 0 14 18"
        fill="currentColor"
      >
        <path d="M7 0l3 5-3 4-3-4z" />
        <rect x="6.4" y="8" width="1.2" height="10" />
      </svg>
    </div>
  );
}
