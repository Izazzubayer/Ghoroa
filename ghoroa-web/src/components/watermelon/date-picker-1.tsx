'use client';

/**
 * Source: Watermelon UI `date-picker-1`
 * https://ui.watermelon.sh/components/date-picker
 * Brand-adapted for Ghoroa — forest/terracotta, controlled.
 */
import type { ComponentProps } from 'react';
import { useId, useState } from 'react';
import { bn, enUS } from 'date-fns/locale';
import { startOfToday } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/cms';

type CalendarClassNames = NonNullable<ComponentProps<typeof Calendar>['classNames']>;

const calendarClassNames = {
  today: 'rounded-none bg-gold/15! text-cream data-[selected=true]:bg-gold! data-[selected=true]:text-forest!',
  day: 'rounded-none',
} satisfies CalendarClassNames;

export function DatePicker1({
  id: idProp,
  value,
  onChange,
  placeholder,
  locale = 'en',
  className,
}: {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  locale?: Locale;
  className?: string;
}) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [open, setOpen] = useState(false);
  const dateLocale = locale === 'bn' ? bn : enUS;
  const label = value
    ? value.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        id={id}
        className={cn(
          'flex h-11 w-full min-w-0 items-center justify-between gap-2 overflow-hidden border border-forest/35 bg-forest/40 px-4 text-left text-sm outline-none transition-colors hover:border-forest/60 focus-visible:border-forest focus-visible:outline-none focus-visible:ring-0',
          className,
        )}
      >
        <span className={cn('min-w-0 truncate', !value && 'opacity-70')}>{label}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-current" aria-hidden />
      </PopoverTrigger>
      {open ? (
        <PopoverContent
          className="w-auto overflow-hidden rounded-none border border-forest/40 bg-forest-deep p-0 text-cream shadow-none"
          align="start"
        >
          <Calendar
            mode="single"
            locale={dateLocale}
            selected={value}
            disabled={{ before: startOfToday() }}
            className="rounded-none bg-forest-deep text-cream"
            classNames={calendarClassNames}
            onSelect={(date) => {
              if (!date) return;
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      ) : null}
    </Popover>
  );
}

export default DatePicker1;
