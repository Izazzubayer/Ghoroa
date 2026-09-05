'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * Site-wide smooth scroll — ported from design/prototype-react App.tsx.
 * Mount once in root layout so every route keeps the same scroll feel.
 * Skipped for prefers-reduced-motion (Lenis also respects that by default).
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // autoRaf false — we drive raf ourselves (same as prototype).
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ({ scroll }) => {
      window.dispatchEvent(new CustomEvent('ghoroa:scroll', { detail: { scroll } }));
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // In-page anchors while Lenis owns the scroll position.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      const id = link?.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
    };
    document.addEventListener('click', onClick);

    // Programmatic scroll (menu category tabs, etc.) — Lenis must own it.
    const onScrollTo = (e: Event) => {
      const { id, offset = 72 } = (e as CustomEvent<{ id: string; offset?: number }>).detail;
      const target = document.getElementById(id);
      if (!target) return;
      lenis.scrollTo(target, { offset: -offset });
    };
    window.addEventListener('ghoroa:scrollTo', onScrollTo);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('ghoroa:scrollTo', onScrollTo);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Soft-nav: Lenis keeps the old scroll position while content swaps.
  // Jump back to top when the path changes so Home doesn't feel like a blackout.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = lenisRef.current;
    if (!lenis) return;
    // Scroll to top on soft route change so Home doesn't look stuck/black.
    lenis.scrollTo(0, { immediate: true });
    lenis.resize();
  }, [pathname]);

  return null;
}
