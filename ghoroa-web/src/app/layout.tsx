import type { Metadata } from 'next';
import { SmoothScroll } from '@/components/smooth-scroll';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ghoroa',
    template: '%s · Ghoroa',
  },
  description: 'Bangladeshi heritage restaurant. Menu, locations, and reservations.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wdth,wght@92.5,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-dark font-body text-cream">
        <SmoothScroll />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
