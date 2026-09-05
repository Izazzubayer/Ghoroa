'use client';

/**
 * Source: Watermelon UI `card-swipe`
 * https://ui.watermelon.sh/animated-components/card-swipe
 * Brand-adapted for Ghoroa reviews — forest/terracotta, Lucide stars, no theme provider.
 */
import { useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Transition,
} from 'motion/react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReviewCard {
  id: number;
  quote: string;
  name: string;
  meta: string;
  rating?: number;
}

interface CardSwipeProps {
  items: ReviewCard[];
  className?: string;
}

const ITEM_WIDTH = 320;
const GAP = 16;
const CONTAINER_WIDTH = ITEM_WIDTH + GAP;
const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const CARD_HEIGHT = 380;

const SPRING_OPTIONS: Transition = {
  type: 'spring',
  stiffness: 330,
  damping: 30,
};

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="mb-5 flex gap-1 text-terracotta" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className="h-4 w-4"
          strokeWidth={1.5}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

function CarouselCard({
  item,
  index,
  x,
  itemCount,
}: {
  item: ReviewCard;
  index: number;
  x: ReturnType<typeof useMotionValue<number>>;
  itemCount: number;
}) {
  const nextIndex = Math.min(index + 1, itemCount - 1);
  const prevIndex = Math.max(index - 1, 0);

  const range = [
    (-100 * (index + 1) * CONTAINER_WIDTH) / 100,
    (-100 * index * CONTAINER_WIDTH) / 100,
    (-100 * (index - 1) * CONTAINER_WIDTH) / 100,
  ];
  const outputRange = [nextIndex ? 90 : 90, 0, prevIndex ? -90 : -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      style={{
        width: ITEM_WIDTH,
        height: CARD_HEIGHT,
        rotateY,
        flexShrink: 0,
      }}
      transition={SPRING_OPTIONS}
      className="flex cursor-grab flex-col border border-ink/12 bg-[#fbf6ee] p-8 active:cursor-grabbing sm:p-9"
    >
      <Stars rating={item.rating ?? 5} />
      <blockquote className="flex-1 text-[1.05rem] leading-[1.65] text-ink">
        <p>“{item.quote}”</p>
      </blockquote>
      <footer className="mt-6 border-t border-ink/10 pt-4">
        <cite className="not-italic text-[0.95rem] font-semibold text-forest">{item.name}</cite>
        <p className="mt-1 text-[0.75rem] text-muted">{item.meta}</p>
      </footer>
    </motion.div>
  );
}

export function CardSwipe({ items, className }: CardSwipeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center', className)}
        style={{ minHeight: CARD_HEIGHT + 48 }}
        aria-hidden
      />
    );
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const leftConstraint = -((ITEM_WIDTH + GAP) * (items.length - 1));

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className="relative overflow-hidden"
        style={{ width: ITEM_WIDTH, height: CARD_HEIGHT }}
        aria-roledescription="carousel"
        aria-label="Guest reviews"
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: leftConstraint, right: 0 }}
          style={{
            gap: GAP,
            perspective: 1000,
            perspectiveOrigin: currentIndex * ITEM_WIDTH + ITEM_WIDTH / 2,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(currentIndex * CONTAINER_WIDTH) }}
          transition={SPRING_OPTIONS}
        >
          {items.map((item, index) => (
            <CarouselCard
              key={item.id}
              item={item}
              index={index}
              x={x}
              itemCount={items.length}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-5 flex gap-2.5" role="tablist" aria-label="Review slides">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={currentIndex === i}
            aria-label={`Show review ${i + 1}`}
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-200',
              currentIndex === i ? 'bg-terracotta' : 'bg-ink/20 hover:bg-ink/35',
            )}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default CardSwipe;
