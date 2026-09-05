import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ghoroa',
  description: 'Bangladeshi heritage restaurant. Menu, locations, and reservations.',
  alternates: { canonical: 'https://ghoroa.com' },
  openGraph: {
    title: 'Ghoroa',
    description: 'Bangladeshi heritage restaurant. Menu, locations, and reservations.',
    url: 'https://ghoroa.com',
    siteName: 'Ghoroa',
    type: 'website',
  },
};

export default function RootPage() {
  return null;
}
