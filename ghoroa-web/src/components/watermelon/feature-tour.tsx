'use client';

/**
 * Source: Watermelon UI `feature-tour` — strip modal chrome, embed as story posters.
 * https://ui.watermelon.sh/animated-components/feature-tour
 */
import { useCallback, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DisplayText } from '@/components/primitives';

export type StoryPoster = {
  id: string;
  year: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  icon: ReactNode;
};

const SPRING: Transition = { type: 'spring', stiffness: 320, damping: 28 };

export function StoryPosterTour({
  steps,
  className = '',
}: {
  steps: StoryPoster[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const step = steps[index];

  const go = useCallback(
    (next: number) => {
      setIndex(((next % steps.length) + steps.length) % steps.length);
    },
    [steps.length],
  );

  if (!step) return null;

  return (
    <div className={cn('relative overflow-hidden border border-gold-deep/35 bg-forest-deep', className)}>
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={step.id}
              src={step.image}
              alt={step.imageAlt}
              initial={reduced ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-t from-dark/70 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-forest-deep/40" />
          <p className="font-numeral absolute bottom-5 left-5 text-4xl text-cream/90 md:text-5xl">
            {step.year}
          </p>
        </div>

        <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-gold-deep/50 text-gold">
                {step.icon}
              </div>
              <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] text-gold">
                <DisplayText text={step.title} />
              </h3>
              <p className="mt-4 max-w-md text-[0.95rem] leading-[1.8] text-cream/85">{step.body}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex gap-2" role="tablist" aria-label="Story chapters">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={s.title}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-2 w-2 transition-colors',
                    i === index ? 'bg-gold' : 'bg-cream/25 hover:bg-cream/45',
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous chapter"
                onClick={() => go(index - 1)}
                className="flex h-10 w-10 items-center justify-center border border-gold-deep/50 text-gold transition-colors hover:bg-gold hover:border-gold hover:text-forest"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Next chapter"
                onClick={() => go(index + 1)}
                className="flex h-10 w-10 items-center justify-center border border-gold-deep/50 text-gold transition-colors hover:bg-gold hover:border-gold hover:text-forest"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div layout transition={SPRING} className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/5" />
    </div>
  );
}
