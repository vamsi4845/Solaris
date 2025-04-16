'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export function useWalletStatus() {
  const { connected, publicKey, connecting, disconnect } = useWallet();
  const router = useRouter();

  const isConnected = useMemo(() => connected && publicKey, [connected, publicKey]);
  
  const redirectToChatIfConnected = useCallback(() => {
    if (isConnected) {
      router.push('/chat');
    }
  }, [isConnected, router]);

  const redirectToHomeIfNotConnected = useCallback(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const connectWallet = useCallback(() => {
    const walletButton = document.querySelector('.wallet-adapter-button') as HTMLButtonElement | null;
    walletButton?.click();
  }, []);

  return {
    isConnected,
    publicKey,
    connecting,
    connectWallet,
    disconnect,
    redirectToChatIfConnected,
    redirectToHomeIfNotConnected
  };
} 