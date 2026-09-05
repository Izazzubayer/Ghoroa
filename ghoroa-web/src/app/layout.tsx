import type { Metadata } from 'next';

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-dark font-body text-cream">{children}</body>
    </html>
  );
}
