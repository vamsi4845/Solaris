'use client';

import React from 'react';
import { useWalletStatus } from '@/hooks/useWalletStatus';
import LandingPage from '@/components/LandingPage';


    interface AuthWrapperProps {
      children: React.ReactNode;
    }

    export function AuthWrapper({ children }: AuthWrapperProps) {
      const { isConnected } = useWalletStatus();
        console.log("isConnected", isConnected)
      if (isConnected) {
        return <>{children}</>;
      } else {
        return (
         <LandingPage />
        );
      }
    }