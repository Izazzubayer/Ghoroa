'use client';

/**
 * Source: Watermelon UI `discrete-tabs`
 * https://ui.watermelon.sh/animated-components/discrete-tabs
 * Brand-adapted for Ghoroa meal-period toggles — forest/terracotta, controlled.
 */
import { useEffect, useState, type FC, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface DiscreteTabItem {
  id: string;
  icon: ReactNode;
  label: string;
}

interface DiscreteTabsProps {
  tabs: DiscreteTabItem[];
  value?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  ariaLabel?: string;
  className?: string;
  /** Insert a vertical rule after this tab id (e.g. "all"). */
  dividerAfter?: string;
}

export const DiscreteTabs: FC<DiscreteTabsProps> = ({
  tabs,
  value,
  defaultTab,
  onTabChange,
  ariaLabel,
  className,
  dividerAfter,
}) => {
  const [activeTab, setActiveTab] = useState<string>(value || defaultTab || tabs[0]?.id);

  useEffect(() => {
    if (value) setActiveTab(value);
  }, [value]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex w-full flex-wrap items-center gap-2', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <span key={tab.id} className="contents">
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabClick(tab.id)}
              className="relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <motion.div
                layout="position"
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="flex items-center"
              >
                <div
                  className={cn(
                    'flex h-11 cursor-pointer items-center gap-2 border px-3 transition-colors',
                    isActive
                      ? 'border-terracotta bg-terracotta text-cream'
                      : 'border-gold-deep/40 bg-forest-deep/40 text-cream/70 hover:border-gold-deep/70 hover:text-cream',
                  )}
                >
                  <span className="flex items-center justify-center [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem]">
                    {tab.icon}
                  </span>

                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
                    {tab.label}
                  </span>
                </div>
              </motion.div>
            </button>

            {dividerAfter === tab.id ? (
              <span
                aria-hidden
                className="mx-1 hidden h-8 w-px shrink-0 bg-gold-deep/35 sm:block"
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

export default DiscreteTabs;
