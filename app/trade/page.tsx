import OrderBook from '@/components/OrderBook';
import TradePanel from '@/components/TradePanel';
import TradingChart from '@/components/TradingChart';
export default function TradePage() { return <main className="grid gap-4 px-4 py-6 lg:grid-cols-[1fr_300px_340px]"><section><div className="mb-4 flex flex-wrap items-end justify-between rounded-2xl border border-white/10 bg-krypt-panel p-4"><div><h1 className="text-2xl font-black">BTC/USDT</h1><p className="text-gray-400">Bitcoin / TetherUS</p></div><div className="flex gap-6 text-sm"><span><b className="text-krypt-gold">69,400.00</b><br/>Last Price</span><span><b className="text-krypt-green">+2.41%</b><br/>24h Change</span><span><b>71,200.00</b><br/>24h High</span></div></div><TradingChart /></section><OrderBook /><TradePanel /></main>; }
