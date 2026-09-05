'use client';

/**
 * Source: Watermelon UI `contact-1`
 * https://ui.watermelon.sh/block/contact-1
 * Brand-adapted for Ghoroa — forest/terracotta, Lucide icons.
 */
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ContactMethod = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  external?: boolean;
};

export function Contact1({
  eyebrow,
  title,
  description,
  contactMethods,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  contactMethods: ContactMethod[];
  className?: string;
}) {
  return (
    <section className={cn('w-full bg-forest py-16 text-cream lg:py-20', className)}>
      <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
        <div className="mb-12 max-w-2xl">
          {eyebrow ? (
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="display mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal text-cream">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-[1rem] leading-[1.75] text-cream/85">{description}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => (
            <Card
              key={method.id}
              className="flex h-full flex-col rounded-none border border-gold-deep/30 bg-dark/50 py-0 shadow-none"
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center border border-gold-deep/40 text-gold">
                  {method.icon}
                </div>
                <h3 className="font-body text-[1.05rem] font-medium text-cream">{method.title}</h3>
                <p className="mt-2 flex-1 text-[0.85rem] leading-[1.65] text-cream/70">
                  {method.description}
                </p>
                <a
                  href={method.actionUrl}
                  {...(method.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'cta' }),
                    'mt-6 w-full',
                  )}
                >
                  {method.actionLabel}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact1;
