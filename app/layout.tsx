import type { Metadata, Viewport } from 'next';
import { Cinzel, Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-cinzel',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yellow Dzambhala — Digital Shrine',
  description:
    'A cinematic digital shrine for contemplation, generosity and devotion, inspired by the monasteries of Ladakh.',
};

export const viewport: Viewport = {
  themeColor: '#120B07',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="bg-obsidian text-ivory">{children}</body>
    </html>
  );
}
