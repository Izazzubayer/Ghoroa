'use client';

/**
 * Source: Watermelon UI `stepper`
 * https://ui.watermelon.sh/animated-components/stepper
 * Brand-adapted for Ghoroa — forest/terracotta, squared.
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiMinus, HiPlus } from 'react-icons/hi';

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (val: number) => void;
  decreaseLabel?: string;
  increaseLabel?: string;
}

const digitVariants = {
  initial: (dir: number) => ({
    y: dir > 0 ? 20 : -20,
    opacity: 0,
    scale: 0.5,
    z: 0,
    filter: 'blur(2px)',
  }),
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    z: 10,
    filter: 'blur(0px)',
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -20 : 20,
    opacity: 0,
    scale: 0.5,
    z: 0,
    filter: 'blur(2px)',
  }),
};

export function Stepper({
  value,
  defaultValue = 0,
  min = 0,
  max = 999,
  onChange,
  decreaseLabel = 'Decrease',
  increaseLabel = 'Increase',
}: StepperProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [direction, setDirection] = React.useState(0);

  const current = isControlled ? value! : internal;
  const digits = current.toString().split('');

  const [prevDigits, setPrevDigits] = React.useState<string[]>([]);
  const [prevTicks, setPrevTicks] = React.useState<number[]>([]);

  const len = digits.length;
  const lenDiff = len - prevDigits.length;

  const nextTicks = digits.map((digit, i) => {
    const prevI = i - lenDiff;
    const prevDigit = prevI >= 0 ? prevDigits[prevI] : undefined;
    const prevTick = prevI >= 0 ? prevTicks[prevI] : 0;

    return digit !== prevDigit ? (prevTick ?? 0) + 1 : (prevTick ?? 0);
  });

  if (prevDigits.join('') !== digits.join('')) {
    setPrevTicks(nextTicks);
    setPrevDigits(digits);
  }

  const step = (dir: number) => {
    const next = Math.min(max, Math.max(min, current + dir));
    if (next === current) return;
    setDirection(dir);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="flex w-full">
      <div className="flex h-12 w-full items-center justify-between border-2 border-forest bg-cream px-1">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={() => step(-1)}
          disabled={current <= min}
          aria-label={decreaseLabel}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center bg-forest text-cream disabled:opacity-40"
        >
          <HiMinus className="h-4 w-4" />
        </motion.button>

        <div className="relative flex h-8 min-w-8 items-center justify-center font-numeral text-2xl text-ink">
          {digits.map((digit, index) => (
            <div key={`${index}-${len}`} className="relative h-8 w-4">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                  key={nextTicks[index]}
                  custom={direction}
                  variants={digitVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 16, mass: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center tabular-nums"
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={() => step(1)}
          disabled={current >= max}
          aria-label={increaseLabel}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center bg-terracotta text-cream disabled:opacity-40"
        >
          <HiPlus className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
