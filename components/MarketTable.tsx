import Image from 'next/image';
import { MarketCoin } from '@/lib/data';

function money(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n < 10 ? 4 : 2 }).format(n); }
function compact(n: number) { return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n); }

export default function MarketTable({ coins }: { coins: MarketCoin[] }) {
  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-krypt-panel">
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase text-gray-400"><tr><th className="p-4">Market</th><th className="p-4">Last Price</th><th className="p-4">24h Change</th><th className="p-4">24h Volume</th><th className="p-4">Market Cap</th><th className="p-4">Action</th></tr></thead>
        <tbody>{coins.map((coin) => <tr key={coin.id} className="border-t border-white/10 hover:bg-white/[0.03]"><td className="flex items-center gap-3 p-4"><Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" unoptimized={coin.image.startsWith('http')} /><div><p className="font-semibold">{coin.symbol.toUpperCase()}/USDT</p><p className="text-xs text-gray-500">{coin.name}</p></div></td><td className="p-4 font-medium">{money(coin.current_price)}</td><td className={coin.price_change_percentage_24h >= 0 ? 'p-4 text-krypt-green' : 'p-4 text-krypt-red'}>{coin.price_change_percentage_24h?.toFixed(2)}%</td><td className="p-4">${compact(coin.total_volume)}</td><td className="p-4">${compact(coin.market_cap)}</td><td className="p-4"><a href="/trade" className="rounded-lg bg-krypt-gold px-4 py-2 font-bold text-black">Trade</a></td></tr>)}</tbody>
      </table>
    </div>
  </div>;
}
