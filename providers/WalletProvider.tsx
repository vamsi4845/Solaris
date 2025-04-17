'use client'
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { AuthWrapper } from "./AuthWrapper";
export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return <PrivyProvider 
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
  clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ""}
  config={{
  "appearance": {
    "accentColor": "#EF8977",
    "theme": "#FFFFFF",
    "showWalletLoginFirst": true,
    "logo": "https://auth.privy.io/logos/privy-logo.png",
    "walletChainType": "solana-only",
    "walletList": [
      "phantom",
      "solflare",
      "backpack"
      ]
    },
  "loginMethods": [
    "email",
    "wallet",
    "google"
  ],
  "fundingMethodConfig": {
    "moonpay": {
      "useSandbox": true
    }
  },
  "embeddedWallets": {
    "requireUserPasswordOnCreate": false,
    "showWalletUIs": true,
    "ethereum": {
      "createOnLogin": "off"
    },
    "solana": {
      "createOnLogin": "users-without-wallets"
    }
  },
  "mfa": {
    "noPromptOnMfaRequired": false
  },
  "externalWallets": {
    "solana": {
      "connectors":  toSolanaWalletConnectors()
    }
  }

}}
>
  <AuthWrapper>
  {children}
  </AuthWrapper>
</PrivyProvider>;
}