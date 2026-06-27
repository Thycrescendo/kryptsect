# KryptSect

A Binance-inspired trading app built with Next.js, TypeScript and TailwindCSS.

## Features

- Dark exchange dashboard UI
- Live crypto market data through CoinGecko with local fallback data
- Wallet connect through RainbowKit + wagmi
- Trading page with candlestick chart
- Order book UI
- Spot and futures order panels
- Markets, assets, earn, login and register pages
- Branded KryptSect SVG images and coin icons

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## WalletConnect

For production wallet connection, create a WalletConnect Cloud project and replace the demo value in `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Notes

This is a frontend MVP/demo. Real exchange features require backend services such as authentication, KYC, custody/non-custodial wallet flows, matching engine, real order execution, risk controls, deposits/withdrawals, WebSocket streams, databases and compliance systems.
