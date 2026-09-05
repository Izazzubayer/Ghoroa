'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Eyebrow, GoldButton, Ornament, Reveal } from '@/components/primitives';
import { PatternEdge } from '@/components/patterns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker1 } from '@/components/watermelon/date-picker-1';
import { Stepper } from '@/components/watermelon/stepper';
import { contactCopy } from '@/lib/contact-copy';
import { localePrefix, type Locale, type LocationItem, type Settings } from '@/lib/cms';

const channelLabel =
  'font-body text-xs font-medium uppercase tracking-[0.14em] text-muted';
const visitLabel =
  'font-body text-xs font-medium uppercase tracking-[0.14em] text-muted';

/** Cream controls on parchment — forest border on focus, no outline halo. */
const control =
  'font-body border-ink/20 bg-cream text-ink shadow-none placeholder:text-muted outline-none focus-visible:border-forest focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0';

/** Time menu: forest + cream selection (no gold). */
const timeMenu =
  'border border-forest/40 bg-forest-deep text-cream shadow-lg ring-0';
const timeOption =
  'rounded-sm text-cream data-highlighted:bg-cream data-highlighted:text-forest focus:bg-cream focus:text-forest data-selected:bg-cream/20 data-selected:text-cream data-selected:data-highlighted:bg-cream data-selected:data-highlighted:text-forest';

/** Half-hour slots for dining reservations (11:00–22:30), 12-hour labels. */
function timeSlots(locale: Locale) {
  const slots: { value: string; label: string }[] = [];
  for (let mins = 11 * 60; mins <= 22 * 60 + 30; mins += 30) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const label = new Date(2000, 0, 1, h, m).toLocaleTimeString(
      locale === 'bn' ? 'bn-BD' : 'en-US',
      { hour: 'numeric', minute: '2-digit', hour12: true },
    );
    slots.push({ value, label });
  }
  return slots;
}

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

/** Prefer CMS embed URL; otherwise a q= embed for the address. */
function mapsEmbedSrc(address: string, embedUrl?: string) {
  if (embedUrl?.startsWith('http')) return embedUrl;
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;
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
  const mapSrc = mapsEmbedSrc(address, locations[0]?.map_embed);
  const slots = timeSlots(locale);
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
          send: 'Send enquiry',
        };

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
    <main>
      <section className="relative overflow-hidden bg-dark pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
          <Reveal className="max-w-2xl">
            <Eyebrow tone="gold">{copy.eyebrow}</Eyebrow>
            <h1 className="display mt-5 text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1.08] text-cream">
              {copy.title}
            </h1>
            <Ornament tone="gold" className="mt-6" />
            <p className="mt-6 text-[1.05rem] leading-[1.8] text-cream/90">{copy.lead}</p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <PatternEdge name="leaf" height={28} opacity={0.65} />
        </div>
      </section>

      <section
        data-nav-contrast="light"
        className="grain relative bg-parchment py-20 text-ink lg:py-28"
        aria-labelledby="contact-form-title"
      >
        <div className="mx-auto grid max-w-[82rem] gap-16 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10">
          <Reveal>
            <Eyebrow tone="terracotta">{copy.channelsEyebrow}</Eyebrow>
            <h2 className="display mt-4 text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.12]">
              {copy.channelsTitle}
            </h2>
            <ul className="mt-10 space-y-6">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="group flex items-start gap-4"
                >
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} aria-hidden />
                  <span>
                    <span className={channelLabel}>
                      {copy.call}
                    </span>
                    <span className="font-numeral mt-1 block text-lg text-ink transition-colors group-hover:text-forest">
                      {settings.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={waHref(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4"
                >
                  <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} aria-hidden />
                  <span>
                    <span className={channelLabel}>
                      {copy.whatsapp}
                    </span>
                    <span className="font-numeral mt-1 block text-lg text-ink transition-colors group-hover:text-forest">
                      {settings.whatsapp || settings.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="group flex items-start gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} aria-hidden />
                  <span>
                    <span className={channelLabel}>
                      {copy.email}
                    </span>
                    <span className="mt-1 block text-lg text-ink transition-colors group-hover:text-forest">
                      {settings.email}
                    </span>
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-14 border-t border-ink/12 pt-10">
              <Eyebrow tone="terracotta">{copy.visitEyebrow}</Eyebrow>
              <h3 className="display mt-4 text-[1.5rem] text-forest">{copy.visitTitle}</h3>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className={visitLabel}>
                    {copy.hours}
                  </dt>
                  <dd className="mt-1 text-[0.95rem] leading-[1.7] text-muted">{settings.hours}</dd>
                </div>
                <div>
                  <dt className={visitLabel}>
                    {copy.address}
                  </dt>
                  <dd className="mt-1 text-[0.95rem] leading-[1.7] text-muted">{address}</dd>
                </div>
              </dl>
              <a
                href={mapsHref(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-[0.9rem] text-forest underline-offset-4 hover:underline"
              >
                <MapPin className="h-4 w-4 text-forest" strokeWidth={1.6} aria-hidden />
                {copy.directions}
              </a>

              <div className="mt-8 overflow-hidden border border-ink/12">
                <iframe
                  title={locale === 'bn' ? 'ঘরোয়ার মানচিত্র' : 'Ghoroa on the map'}
                  src={mapSrc}
                  className="aspect-4/3 w-full grayscale-[20%] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              {locations.length > 0 ? (
                <div className="mt-10">
                  <p className={visitLabel}>
                    {copy.locationsTitle}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {locations.slice(0, 3).map((loc) => (
                      <li key={loc.id} className="text-[0.9rem] leading-[1.6] text-muted">
                        <p className="font-medium text-forest">{loc.name}</p>
                        <p>{loc.address}</p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${prefix}/locations`}
                    className="mt-4 inline-block text-[0.9rem] text-forest underline-offset-4 hover:underline"
                  >
                    {copy.locationsCta}
                  </Link>
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={onSubmit} aria-labelledby="contact-form-title">
              <Card className="bg-parchment text-ink ring-ink/12 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
                <CardHeader className="border-b border-ink/10">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                    {copy.formEyebrow}
                  </p>
                  <CardTitle
                    id="contact-form-title"
                    className="display mt-1 text-[clamp(1.7rem,3vw,2.3rem)] font-normal leading-[1.15]"
                  >
                    {copy.formTitle}
                  </CardTitle>
                  <CardDescription className="text-[0.95rem] leading-[1.7] text-muted">
                    {copy.formLead}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="contact-name">{l.name}</FieldLabel>
                      <Input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        className={control}
                      />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="contact-phone">{l.phone}</FieldLabel>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          className={control}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="contact-email">{l.email}</FieldLabel>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className={control}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                      <Field>
                        <FieldLabel htmlFor="contact-date">{l.date}</FieldLabel>
                        <DatePicker1
                          id="contact-date"
                          locale={locale}
                          value={date}
                          onChange={setDate}
                          placeholder={copy.pickDate}
                          className={`${control} h-8 rounded-lg px-2.5 text-sm hover:border-forest/50`}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="contact-time">{l.time}</FieldLabel>
                        <Select
                          items={slots}
                          value={time || null}
                          onValueChange={(value) => setTime(value ?? '')}
                        >
                          <SelectTrigger
                            id="contact-time"
                            className={`${control} w-full`}
                          >
                            <SelectValue placeholder={copy.pickTime} />
                          </SelectTrigger>
                          <SelectContent align="start" className={timeMenu}>
                            {slots.map((slot) => (
                              <SelectItem
                                key={slot.value}
                                value={slot.value}
                                className={timeOption}
                              >
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="contact-guests">{l.guests}</FieldLabel>
                        <Stepper
                          id="contact-guests"
                          value={guests}
                          min={1}
                          max={20}
                          onChange={setGuests}
                          decreaseLabel={copy.guestsDec}
                          increaseLabel={copy.guestsInc}
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="contact-message">{l.message}</FieldLabel>
                      <Textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={4}
                        minLength={10}
                        className={`${control} min-h-28`}
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>

                <CardFooter className="justify-start border-ink/10 bg-transparent">
                  <Button type="submit" disabled={pending} size="cta">
                    {pending
                      ? locale === 'bn'
                        ? 'পাঠানো হচ্ছে…'
                        : 'Sending…'
                      : l.send}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="bg-dark py-14" aria-label={copy.faqCta}>
        <div className="mx-auto flex max-w-[82rem] flex-col items-start gap-6 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="max-w-md text-[1rem] leading-[1.7] text-cream/90">{copy.faqLead}</p>
          <GoldButton href={`${prefix}/faq`}>{copy.faqCta}</GoldButton>
        </div>
      </section>
    </main>
  );
}
