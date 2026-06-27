import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = { title: 'KryptSect — Crypto Trading Platform', description: 'A Binance-inspired crypto trading app built with Next.js, TypeScript and TailwindCSS.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Providers><Navbar />{children}</Providers></body></html>;
}
