'use client';

/**
 * Source: Watermelon UI `accordion-1`
 * https://ui.watermelon.sh/components/accordion
 * Brand-adapted for Ghoroa FAQ — forest/terracotta, single-open, props-driven.
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type FaqAccordionItem = {
  value: string;
  title: string;
  content: string;
};

export function FaqAccordion({
  items,
  className = '',
}: {
  items: FaqAccordionItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Accordion
      className={`w-full border-t border-gold-deep/25 ${className}`}
      defaultValue={[items[0].value]}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className="border-gold-deep/25"
        >
          <AccordionTrigger className="display py-4 text-[1.05rem] font-normal text-cream hover:text-gold hover:no-underline md:text-[1.15rem]">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[0.95rem] leading-[1.75] text-cream/85">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default FaqAccordion;
