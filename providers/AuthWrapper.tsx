'use client';

import React from 'react';
import LandingPage from '@/components/LandingPage';
import { useSolanaWallets, useWallets } from '@privy-io/react-auth';
import { usePrivy } from '@privy-io/react-auth';

    interface AuthWrapperProps {
      children: React.ReactNode;
    }

    export function AuthWrapper({ children }: AuthWrapperProps) {
      const { ready, authenticated} = usePrivy();
      if (ready && authenticated) {
        return <>{children}</>;
      } else {
        return (
         <LandingPage />
        );
      }
    }