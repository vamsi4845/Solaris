'use client';
import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, AlphaWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import LandingPage from '@/components/Landing/LandingPage';

import '@solana/wallet-adapter-react-ui/styles.css';
import { QueryProvider } from './QueryProvider';

interface Props {
  children: ReactNode;
}

const WalletProviderInner: FC<Props> = ({ children }) => {
  const { connected } = useWallet();

  if (!connected) {
    return <LandingPage />;
  }

  return <>{children}</>;
};

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new AlphaWalletAdapter(),
    ],
    []
  );

  return (
    <QueryProvider>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletProviderInner>{children}</WalletProviderInner>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
    </QueryProvider>
  );
}; 