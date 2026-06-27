'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, celo } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo';

const config = getDefaultConfig({
  appName: 'KryptSect',
  projectId,
  chains: [mainnet, polygon, arbitrum, optimism, base, celo],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: '#f6c343', borderRadius: 'medium' })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
