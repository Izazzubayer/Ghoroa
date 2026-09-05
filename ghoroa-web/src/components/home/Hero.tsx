'use client';

import { motion, useReducedMotion } from 'motion/react';
import { GoldButton } from '@/components/primitives';
import { PatternEdge, PatternMotif } from '@/components/patterns';

export function Hero({
  locale,
  settings,
}: {
  locale: 'en' | 'bn';
  settings: { tagline: string };
  menu?: { groups: Record<string, unknown[]>; categories: Record<string, { en: string; bn: string }> };
}) {
  const reduced = useReducedMotion();
  const isBn = locale === 'bn';
  const tag = isBn ? 'বাংলাদেশের ঐতিহ্যবাহী রেস্টুরেন্ট' : 'Bangladeshi heritage restaurant';
  const words = isBn ? ['ঐতিহ্যের স্বাদ।', 'আজকের দিনের খাবার।'] : ['Authentic flavours.', 'Timeless tradition.'];

  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      <motion.img
        src="/images/hero-main.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        initial={reduced ? undefined : { scale: 1.12 }}
        animate={reduced ? undefined : { scale: 1 }}
        transition={{ duration: 14, ease: 'linear' }}
        fetchPriority="high"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(96deg,rgba(6,15,10,0.97)_0%,rgba(6,15,10,0.93)_30%,rgba(6,15,10,0.7)_55%,rgba(6,15,10,0.45)_100%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-forest/25 mix-blend-multiply" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-t from-dark to-transparent" />

      <div className="mx-auto flex min-h-[100svh] max-w-[82rem] flex-col justify-center px-5 pb-24 pt-32 lg:px-10">
        <div className="max-w-2xl">
          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`flex items-center gap-3 text-[0.68rem] font-semibold text-gold-deep ${
              isBn ? 'tracking-normal normal-case' : 'uppercase tracking-[0.28em]'
            }`}
          >
            <PatternMotif name="diamond" size={14} className="shrink-0 opacity-90" />
            {tag}
          </motion.p>

          <h1
            id="hero-title"
            className={`display mt-6 text-[clamp(2.6rem,7vw,5.2rem)] font-normal text-cream ${
              isBn ? 'leading-[1.4]' : 'leading-[0.98]'
            }`}
          >
            {words.map((line, i) => (
              <span
                key={line}
                className={`block ${isBn ? 'overflow-visible py-1' : 'overflow-hidden'}`}
              >
                <motion.span
                  className="block"
                  initial={reduced ? undefined : isBn ? { opacity: 0, y: 16 } : { y: '110%' }}
                  animate={reduced ? undefined : isBn ? { opacity: 1, y: 0 } : { y: 0 }}
                  transition={{ duration: 1, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/patterns/rule-strip.png"
              alt=""
              aria-hidden
              className="mt-8 block h-7 w-52 object-contain object-left mix-blend-screen"
              loading="lazy"
              decoding="async"
            />

            <p className="mt-6 max-w-md text-[0.95rem] leading-[1.75] text-cream/90">
              {settings.tagline}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <GoldButton href="#menu" variant="primary">
                {isBn ? 'মেনু দেখুন' : 'Explore our menu'}
              </GoldButton>
              <GoldButton href="#story" variant="secondary">
                {isBn ? 'আমাদের গল্প' : 'Our story'}
              </GoldButton>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <PatternEdge name="leaf" height={42} opacity={0.75} />
      </div>
    </section>
  );
}
