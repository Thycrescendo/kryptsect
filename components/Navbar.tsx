import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, CircleDollarSign, LineChart, Shield, Wallet } from 'lucide-react';
import WalletButton from './WalletButton';

const links = [
  { href: '/markets', label: 'Markets', icon: BarChart3 },
  { href: '/trade', label: 'Trade', icon: LineChart },
  { href: '/futures', label: 'Futures', icon: Shield },
  { href: '/assets', label: 'Assets', icon: Wallet },
  { href: '/earn', label: 'Earn', icon: CircleDollarSign },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-krypt-bg/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.svg" alt="KryptSect" width={38} height={38} />
          <span className="text-xl font-black tracking-tight text-krypt-gold">KryptSect</span>
        </Link>
        <div className="hidden items-center gap-2 lg:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">
              <Icon size={16} />{label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-lg px-4 py-2 text-sm hover:bg-white/10 sm:block">Log in</Link>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
