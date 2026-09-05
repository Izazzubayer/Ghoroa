'use client';

// Source: Watermelon UI `card-split-accordian` — Ghoroa forest/gold palette.
import { useId, useState, type FC, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { motion, MotionConfig, useReducedMotion, type Transition } from 'motion/react';

export interface AccordionItemData {
  id: number;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 600,
  damping: 50,
  mass: 1,
};

const RADIUS = 14;

const AccordionItem: FC<{
  item: AccordionItemData;
  setOpenId: (id: number | null) => void;
  index: number;
  total: number;
  openIndex: number;
}> = ({ item, setOpenId, index, total, openIndex }) => {
  const isOpen = index === openIndex;
  const panelId = useId();
  const buttonId = useId();

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isBeforeOpen = index === openIndex - 1;
  const isAfterOpen = index === openIndex + 1;
  const isAlone = (isAfterOpen && isLast) || (isBeforeOpen && isFirst);

  const BORDER = '1px';
  const borderTopWidth = isFirst || isAfterOpen || isOpen ? BORDER : '0px';
  const borderBottomWidth = isLast || isBeforeOpen || isOpen ? BORDER : '0px';

  let tl = 0;
  let tr = 0;
  let bl = 0;
  let br = 0;
  if (isOpen || isAlone) {
    tl = tr = bl = br = RADIUS;
  } else if (isBeforeOpen) {
    bl = br = RADIUS;
  } else if (isAfterOpen) {
    tl = tr = RADIUS;
  } else if (isFirst) {
    tl = tr = RADIUS;
  } else if (isLast) {
    bl = br = RADIUS;
  }

  return (
    <motion.li layout>
      <motion.div
        animate={{
          borderTopLeftRadius: tl,
          borderTopRightRadius: tr,
          borderBottomLeftRadius: bl,
          borderBottomRightRadius: br,
        }}
        className={`overflow-hidden border-solid transition-colors duration-300 ${
          isOpen ? 'border-gold-deep/60 bg-forest-deep/80' : 'border-gold-deep/25 bg-forest-deep/40'
        }`}
        style={{
          borderTopWidth,
          borderBottomWidth,
          borderLeftWidth: BORDER,
          borderRightWidth: BORDER,
          marginBlock: isOpen ? '10px' : '0px',
        }}
      >
        <h3>
          <button
            type="button"
            id={buttonId}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setOpenId(isOpen ? null : item.id)}
            className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span
              className={`display text-[1.05rem] transition-colors duration-300 md:text-[1.2rem] ${
                isOpen ? 'text-gold' : 'text-cream'
              }`}
            >
              {item.title}
            </span>

            <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="shrink-0 text-gold-deep">
              <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </motion.span>
          </button>
        </h3>

        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          inert={!isOpen}
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5 text-[0.85rem] leading-[1.75] text-cream/80 md:text-[0.9rem]">{item.content}</div>
        </motion.div>
      </motion.div>
    </motion.li>
  );
};

export const SplitAccordion: FC<AccordionProps> = ({ items, className = '' }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const openIndex = items.findIndex((item) => item.id === openId);
  const reduced = useReducedMotion();

  return (
    <MotionConfig transition={reduced ? { duration: 0 } : springTransition}>
      <ul className={`w-full ${className}`}>
        {items.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            setOpenId={setOpenId}
            index={index}
            total={items.length}
            openIndex={openIndex}
          />
        ))}
      </ul>
    </MotionConfig>
  );
};
