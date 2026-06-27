export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
};

export const fallbackMarkets: MarketCoin[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: '/images/coin-btc.svg', current_price: 69400, market_cap: 1360000000000, total_volume: 42000000000, price_change_percentage_24h: 2.41 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: '/images/coin-eth.svg', current_price: 3580, market_cap: 430000000000, total_volume: 18800000000, price_change_percentage_24h: 1.82 },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: '/images/coin-sol.svg', current_price: 151.3, market_cap: 70000000000, total_volume: 3900000000, price_change_percentage_24h: -0.74 },
  { id: 'bnb', symbol: 'bnb', name: 'BNB', image: '/images/coin-bnb.svg', current_price: 602.1, market_cap: 91000000000, total_volume: 1800000000, price_change_percentage_24h: 0.93 },
  { id: 'celo', symbol: 'celo', name: 'Celo', image: '/images/coin-celo.svg', current_price: 0.72, market_cap: 385000000, total_volume: 11800000, price_change_percentage_24h: 3.67 }
];

export async function getMarkets(): Promise<MarketCoin[]> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false', { next: { revalidate: 30 } });
    if (!res.ok) return fallbackMarkets;
    return res.json();
  } catch {
    return fallbackMarkets;
  }
}

export const orderAsks = [['69,430.20','0.421'],['69,420.10','0.318'],['69,410.55','0.882'],['69,405.11','0.136'],['69,401.88','1.442']];
export const orderBids = [['69,390.40','0.611'],['69,380.00','0.247'],['69,370.80','1.102'],['69,362.22','0.764'],['69,351.55','2.090']];
