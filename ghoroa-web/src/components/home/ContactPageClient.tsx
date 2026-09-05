'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Mail, MapPin, MessageCircle, Phone, UtensilsCrossed } from 'lucide-react';
import { Eyebrow, GoldButton, Ornament, Reveal } from '@/components/primitives';
import { PatternEdge, PatternMotif } from '@/components/patterns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker1 } from '@/components/watermelon/date-picker-1';
import { Stepper } from '@/components/watermelon/stepper';
import { contactCopy } from '@/lib/contact-copy';
import { localePrefix, type Locale, type LocationItem, type Settings } from '@/lib/cms';

const LUNCH = ['12:00', '12:30', '13:00', '13:30'];
const DINNER = ['19:00', '19:30', '20:00', '20:30', '21:00'];

const field =
  'h-12 w-full rounded-none border-2 border-forest bg-cream px-3 text-ink placeholder:text-muted';

function waHref(settings: Settings) {
  if (settings.order_now?.includes('wa.me')) return settings.order_now;
  const digits = (settings.whatsapp || settings.phone).replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

function mohakhaliAddress(settings: Settings) {
  return settings.address?.toLowerCase().includes('mohakhali')
    ? settings.address
    : 'Ghoroa Hotel and Restaurant, 73 Mohakhali Wireless Gate, Dhaka 1206';
}

function mapsHref(address: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

function TimeSlots({
  label,
  times,
  value,
  onChange,
}: {
  label: string;
  times: string[];
  value: string;
  onChange: (t: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {times.map((t) => {
          const on = value === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? '' : t)}
              className={`font-numeral h-10 min-w-16 border-2 px-3 text-[0.95rem] ${
                on ? 'border-gold bg-gold text-forest' : 'border-forest bg-cream text-ink hover:border-gold'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ContactPageClient({
  locale,
  settings,
  locations,
}: {
  locale: Locale;
  settings: Settings;
  locations: LocationItem[];
}) {
  const copy = contactCopy(locale);
  const prefix = localePrefix(locale);
  const address = mohakhaliAddress(settings);
  const [pending, setPending] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);

  const l =
    locale === 'bn'
      ? {
          name: 'নাম',
          phone: 'ফোন',
          email: 'ইমেইল',
          date: 'তারিখ',
          time: 'সময়',
          guests: 'অতিথি',
          message: 'বার্তা',
          send: 'পাঠান',
        }
      : {
          name: 'Name',
          phone: 'Phone',
          email: 'Email',
          date: 'Date',
          time: 'Time',
          guests: 'Guests',
          message: 'Message',
          send: 'Send',
        };

  const channels = [
    {
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
      label: copy.call,
      value: settings.phone,
      Icon: Phone,
    },
    {
      href: waHref(settings),
      label: copy.whatsapp,
      value: settings.whatsapp || settings.phone,
      Icon: MessageCircle,
      external: true,
    },
    {
      href: `mailto:${settings.email}`,
      label: copy.email,
      value: settings.email,
      Icon: Mail,
    },
    {
      href: settings.order_now,
      label: copy.order,
      value: locale === 'bn' ? 'WhatsApp অর্ডার' : 'WhatsApp order',
      Icon: UtensilsCrossed,
      external: true,
    },
  ];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          guests: String(guests),
          preferred_date: date ? format(date, 'yyyy-MM-dd') : undefined,
          preferred_time: time || undefined,
          message: fd.get('message'),
          locale,
        }),
      });
      if (res.ok) {
        toast.success(
          locale === 'bn'
            ? 'ধন্যবাদ — আমরা ২৪ ঘণ্টার মধ্যে লিখব।'
            : 'Thanks — we will reply within 24 hours.',
        );
        form.reset();
        setDate(undefined);
        setTime('');
        setGuests(2);
      } else {
        toast.error(
          locale === 'bn' ? 'ফর্মটি যাচাই করে আবার চেষ্টা করুন।' : 'Please check the form and try again.',
        );
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="bg-forest">
      <section className="grain relative overflow-hidden bg-forest pt-28 pb-16 lg:pt-32 lg:pb-20">
        <PatternMotif
          name="rosette-2"
          size={88}
          className="pointer-events-none absolute -right-4 top-24 opacity-25 lg:right-12"
        />
        <div className="relative mx-auto max-w-[82rem] px-5 lg:px-10">
          <Reveal>
            <Eyebrow tone="gold">{copy.eyebrow}</Eyebrow>
            <h1 className="display mt-5 max-w-2xl text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1.08] text-cream">
              {copy.title}
            </h1>
            <Ornament tone="gold" className="mt-6" />
            <p className="mt-6 max-w-lg text-[1.05rem] leading-[1.8] text-cream">{copy.lead}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="mt-12 grid gap-px overflow-hidden border border-gold-deep bg-gold-deep sm:grid-cols-2 lg:grid-cols-4">
              {channels.map(({ href, label, value, Icon, external }) => (
                <li key={label} className="bg-forest-deep">
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex h-full flex-col gap-3 px-5 py-6 text-cream transition-colors hover:bg-forest"
                  >
                    <Icon className="h-5 w-5 text-terracotta" strokeWidth={1.6} aria-hidden />
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold">{label}</span>
                    <span className="font-numeral text-[0.95rem] leading-snug">{value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-8 border-t border-gold-deep/40 pt-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <Eyebrow tone="gold">{copy.visitEyebrow}</Eyebrow>
                <h2 className="display mt-4 text-[clamp(1.6rem,3vw,2.2rem)] text-cream">{copy.visitTitle}</h2>
                <dl className="mt-6 space-y-5">
                  <div>
                    <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold">{copy.hours}</dt>
                    <dd className="mt-1 text-[0.95rem] text-cream">{settings.hours}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold">{copy.address}</dt>
                    <dd className="mt-1 text-[0.95rem] leading-[1.6] text-cream">{address}</dd>
                  </div>
                </dl>
                <a
                  href={mapsHref(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-[0.9rem] text-gold hover:underline"
                >
                  <MapPin className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                  {copy.directions}
                </a>

                {locations.length > 0 ? (
                  <div className="mt-10">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold">{copy.locationsTitle}</p>
                    <ul className="mt-4 space-y-4">
                      {locations.map((loc) => (
                        <li key={loc.id} className="text-[0.9rem] leading-[1.6] text-cream">
                          <p className="font-medium">{loc.name}</p>
                          <p>{loc.address}</p>
                          {loc.phone ? (
                            <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="font-numeral text-gold hover:underline">
                              {loc.phone}
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                    <Link href={`${prefix}/locations`} className="mt-4 inline-block text-gold hover:underline">
                      {copy.locationsCta}
                    </Link>
                  </div>
                ) : (
                  <p className="mt-8 text-[0.9rem] text-cream">{copy.locationsEmpty}</p>
                )}
              </div>

              <form onSubmit={onSubmit} className="relative overflow-hidden bg-parchment p-7 text-ink sm:p-9">
                <div className="absolute inset-x-0 top-0">
                  <PatternEdge name="diamond" surface="light" height={18} opacity={0.9} />
                </div>
                <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                  {copy.formEyebrow}
                </p>
                <h2 className="display mt-3 text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.15]">{copy.formTitle}</h2>
                <p className="mt-3 text-[0.95rem] leading-[1.7] text-muted">{copy.formLead}</p>

                <div className="mt-8 grid gap-5">
                  <label className="grid gap-1.5 text-[0.85rem] font-medium text-ink">
                    {l.name}
                    <Input name="name" required autoComplete="name" className={field} />
                  </label>
                  <label className="grid gap-1.5 text-[0.85rem] font-medium text-ink">
                    {l.phone}
                    <Input name="phone" type="tel" required autoComplete="tel" className={field} />
                  </label>
                  <label className="grid gap-1.5 text-[0.85rem] font-medium text-ink">
                    {l.email}
                    <Input name="email" type="email" required autoComplete="email" className={field} />
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-1.5 text-[0.85rem] font-medium text-ink">
                      {l.date}
                      <DatePicker1
                        locale={locale}
                        value={date}
                        onChange={setDate}
                        placeholder={copy.pickDate}
                        className="h-12 border-2 border-forest bg-cream px-3 text-ink"
                      />
                    </div>
                    <div className="grid gap-1.5 text-[0.85rem] font-medium text-ink">
                      {l.guests}
                      <Stepper
                        value={guests}
                        min={1}
                        max={20}
                        onChange={setGuests}
                        decreaseLabel={copy.guestsDec}
                        increaseLabel={copy.guestsInc}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <p className="text-[0.85rem] font-medium text-ink">{l.time}</p>
                    <TimeSlots label={copy.lunch} times={LUNCH} value={time} onChange={setTime} />
                    <TimeSlots label={copy.dinner} times={DINNER} value={time} onChange={setTime} />
                  </div>

                  <label className="grid gap-1.5 text-[0.85rem] font-medium text-ink">
                    {l.message}
                    <Textarea name="message" required rows={5} minLength={10} className={`${field} min-h-32`} />
                  </label>
                  <Button type="submit" disabled={pending} size="cta" className="justify-self-start">
                    {l.send}
                  </Button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest-deep py-12" aria-label={copy.faqCta}>
        <div className="mx-auto flex max-w-[82rem] flex-col items-start gap-4 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="text-[1rem] text-cream">{copy.faqLead}</p>
          <GoldButton href={`${prefix}/faq`}>{copy.faqCta}</GoldButton>
        </div>
      </section>
    </main>
  );
}
