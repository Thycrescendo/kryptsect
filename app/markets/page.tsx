import MarketTable from '@/components/MarketTable';
import StatsCard from '@/components/StatsCard';
import { getMarkets } from '@/lib/data';
export default async function MarketsPage() { const coins = await getMarkets(); return <main className="mx-auto max-w-7xl px-6 py-8"><h1 className="mb-2 text-4xl font-black">Markets</h1><p className="mb-8 text-gray-400">Live crypto markets, volume, price change and trading pairs.</p><div className="mb-8 grid gap-4 md:grid-cols-3"><StatsCard label="Global Market Cap" value="$2.58T" change="+1.8%"/><StatsCard label="BTC Dominance" value="52.7%"/><StatsCard label="Fear & Greed" value="71 / Greed"/></div><MarketTable coins={coins} /></main>; }
