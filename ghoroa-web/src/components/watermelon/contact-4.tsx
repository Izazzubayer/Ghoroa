'use client';

/**
 * Source: Watermelon UI `contact-4`
 * https://ui.watermelon.sh/block/contact-4
 * Brand-adapted for Ghoroa reservation enquiry — forest/terracotta.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/cms';

const fieldClass =
  'rounded-none border-gold-deep/30 bg-forest/40 px-4 py-3 text-cream placeholder:text-cream/45 focus-visible:border-gold focus-visible:ring-gold/40';

type FormState = {
  name: string;
  email: string;
  phone: string;
  guests: string;
  preferred_date: string;
  preferred_time: string;
  occasion: string;
  message: string;
};

export function Contact4({
  locale,
  eyebrow,
  headline,
  headlineAccent,
  subheadline,
  email,
  phone,
  ctaLabel,
  occasionOptions,
  mapAddress,
  mapLabel,
}: {
  locale: Locale;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  email: string;
  phone: string;
  ctaLabel: string;
  occasionOptions: { value: string; label: string }[];
  mapAddress: string;
  mapLabel?: string;
}) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    guests: '',
    preferred_date: '',
    preferred_time: '',
    occasion: '',
    message: '',
  });
  const [pending, setPending] = useState(false);

  const labels =
    locale === 'bn'
      ? {
          name: 'নাম',
          email: 'ইমেইল',
          phone: 'ফোন',
          guests: 'অতিথি',
          date: 'তারিখ',
          time: 'সময়',
          occasion: 'অনুষ্ঠান',
          message: 'বার্তা',
          emailMeta: 'ইমেইল',
          phoneMeta: 'ফোন',
        }
      : {
          name: 'Full name',
          email: 'Email',
          phone: 'Phone',
          guests: 'Guests',
          date: 'Preferred date',
          time: 'Preferred time',
          occasion: 'Occasion',
          message: 'Message',
          emailMeta: 'Email',
          phoneMeta: 'Phone',
        };

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setPending(true);
    try {
      const note = [
        form.occasion ? `Occasion: ${form.occasion}` : '',
        form.message,
      ]
        .filter(Boolean)
        .join('\n\n');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          guests: form.guests || undefined,
          preferred_date: form.preferred_date || undefined,
          preferred_time: form.preferred_time || undefined,
          message: note || form.message,
          locale,
        }),
      });

      if (res.ok) {
        toast.success(
          locale === 'bn'
            ? 'ধন্যবাদ — আমরা ২৪ ঘণ্টার মধ্যে লিখব।'
            : 'Thanks — we will reply within 24 hours.',
        );
        setForm({
          name: '',
          email: '',
          phone: '',
          guests: '',
          preferred_date: '',
          preferred_time: '',
          occasion: '',
          message: '',
        });
      } else {
        toast.error(
          locale === 'bn'
            ? 'ফর্মটি যাচাই করে আবার চেষ্টা করুন।'
            : 'Please check your form and try again.',
        );
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="reservations" className="bg-dark px-5 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto grid w-full max-w-[82rem] grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
            {eyebrow}
          </p>
          <h2 className="display text-[clamp(2rem,4vw,3.4rem)] font-normal leading-[1.08] text-cream">
            {headline}{' '}
            <span className="block text-gold">{headlineAccent}</span>
          </h2>
          <p className="max-w-md text-[0.95rem] leading-[1.8] text-cream/85">{subheadline}</p>

          <Separator className="my-2 w-16 bg-gold-deep/50" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 border border-gold-deep/30 bg-forest/40 p-2 pr-4 transition-colors hover:border-gold-deep/60"
            >
              <span className="flex size-11 shrink-0 items-center justify-center bg-dark text-gold">
                <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span>
                <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  {labels.emailMeta}
                </span>
                <span className="text-[0.9rem] text-cream">{email}</span>
              </span>
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 border border-gold-deep/30 bg-forest/40 p-2 pr-4 transition-colors hover:border-gold-deep/60"
            >
              <span className="flex size-11 shrink-0 items-center justify-center bg-dark text-gold">
                <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span>
                <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  {labels.phoneMeta}
                </span>
                <span className="text-[0.9rem] text-cream">{phone}</span>
              </span>
            </a>
          </div>

          <div className="mt-10 overflow-hidden border border-gold-deep/35">
            <iframe
              title={mapLabel || 'Ghoroa Mohakhali on Google Maps'}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&z=16&output=embed`}
              className="aspect-4/3 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <p className="border-t border-gold-deep/25 bg-forest/50 px-4 py-3 text-[0.8rem] leading-[1.5] text-cream/80">
              {mapAddress}
            </p>
          </div>
        </div>

        <Card className="rounded-none border border-gold-deep/30 bg-forest/30 py-0 shadow-none">
          <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                  {labels.name}
                </Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={fieldClass}
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                  {labels.phone}
                </Label>
                <Input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={fieldClass}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                {labels.email}
              </Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={fieldClass}
                autoComplete="email"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                  {labels.guests}
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={form.guests}
                  onChange={(e) => set('guests', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                  {labels.date}
                </Label>
                <Input
                  type="date"
                  value={form.preferred_date}
                  onChange={(e) => set('preferred_date', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                  {labels.time}
                </Label>
                <Input
                  type="time"
                  value={form.preferred_time}
                  onChange={(e) => set('preferred_time', e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                {labels.occasion}
              </Label>
              <Select value={form.occasion} onValueChange={(v) => set('occasion', v ?? '')}>
                <SelectTrigger className={cn(fieldClass, 'h-auto w-full')}>
                  <SelectValue
                    placeholder={
                      locale === 'bn' ? 'অনুষ্ঠান বেছে নিন…' : 'Choose an occasion…'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-none border-gold-deep/40 bg-dark text-cream">
                  {occasionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="rounded-none">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">
                {labels.message}
              </Label>
              <Textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                className={fieldClass}
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="cta"
              disabled={pending}
              onClick={handleSubmit}
              className="mt-2 w-full"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Contact4;
